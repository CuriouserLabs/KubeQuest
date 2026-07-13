import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import {
  deleteField,
  doc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { TrackData, TrackId, UserDoc } from "../types";

interface ProgressState {
  /** True while the first snapshot for the current user is loading. */
  loading: boolean;
  /** Fatal read error (progress cannot be shown). */
  loadError: string | null;
  /** Transient write error, surfaced as a toast and auto-cleared. */
  saveError: string | null;
  /** Completed sub-step ids across ALL tracks (ids are globally unique). */
  completedMap: Record<string, true>;
  /** Target exam date per track. */
  examDates: Record<TrackId, string | null>;
  /** Millis of the user's first session, used by the pace indicator. */
  startedAtMs: number | null;
  toggleSubStep: (id: string, value: boolean) => void;
  setManySubSteps: (ids: string[], value: boolean) => void;
  setExamDate: (trackId: TrackId, isoDate: string | null) => void;
  /** Clears completed items and the exam date for ONE track only. */
  resetTrackProgress: (track: TrackData) => Promise<void>;
}

function userRef(uid: string): DocumentReference {
  if (!db) throw new Error("Firestore is not configured");
  return doc(db, "users", uid);
}

/**
 * The legacy top-level `examDate` field predates tracks and holds the CKA
 * date; `examDates.cka` wins when set (hasOwnProperty, so an explicit null —
 * a cleared date — is respected and does not fall back to the legacy value).
 */
function examDatesFromDoc(data: UserDoc | null): Record<TrackId, string | null> {
  const dates = data?.examDates ?? {};
  return {
    cka: "cka" in dates ? (dates.cka ?? null) : (data?.examDate ?? null),
    ckad: dates.ckad ?? null,
  };
}

/**
 * Per-user progress synced with the users/{uid} Firestore document.
 *
 * Writes go straight to Firestore; the Firestore SDK's latency compensation
 * makes onSnapshot fire immediately with the pending write, so checkboxes
 * feel instant (optimistic) while the server write completes in the
 * background. Write failures surface as a transient toast.
 */
export function useProgress(user: User | null): ProgressState {
  const [data, setData] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const creatingRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaveError = useCallback((message: string) => {
    setSaveError(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setSaveError(null), 5000);
  }, []);

  useEffect(() => {
    setData(null);
    setLoadError(null);
    if (!user || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    creatingRef.current = false;
    const ref = userRef(user.uid);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData(snap.data() as UserDoc);
          setLoading(false);
          return;
        }
        // First ever sign-in on this account: create the user document and
        // bump the anonymous "people studying" counter exactly once.
        if (creatingRef.current) return;
        creatingRef.current = true;
        const initial: Omit<UserDoc, "createdAt" | "updatedAt"> = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          completedIds: {},
          examDate: null,
          examDates: {},
        };
        setDoc(ref, {
          ...initial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).catch(() => {
          setLoadError("Could not create your progress record. Please reload.");
          setLoading(false);
        });
        if (db) {
          setDoc(doc(db, "stats", "global"), { studiers: increment(1) }, { merge: true })
            // Best effort — the counter is cosmetic, never block the user on it.
            .catch(() => undefined);
        }
      },
      () => {
        setLoadError("Could not load your progress. Check your connection and reload.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  const setManySubSteps = useCallback(
    (ids: string[], value: boolean) => {
      if (!user || !db || ids.length === 0) return;
      // setDoc+merge (not updateDoc) so map keys containing "-" need no
      // FieldPath escaping; deleteField() removes keys when unchecking.
      const completedIds = Object.fromEntries(
        ids.map((id) => [id, value ? true : deleteField()]),
      );
      setDoc(
        userRef(user.uid),
        { completedIds, updatedAt: serverTimestamp() },
        { merge: true },
      ).catch(() => showSaveError("Saving your progress failed. Your last change may not have stuck."));
    },
    [user, showSaveError],
  );

  const toggleSubStep = useCallback(
    (id: string, value: boolean) => setManySubSteps([id], value),
    [setManySubSteps],
  );

  const setExamDate = useCallback(
    (trackId: TrackId, isoDate: string | null) => {
      if (!user || !db) return;
      setDoc(
        userRef(user.uid),
        {
          examDates: { [trackId]: isoDate },
          // Keep the legacy CKA field in sync for older clients.
          ...(trackId === "cka" ? { examDate: isoDate } : {}),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ).catch(() => showSaveError("Saving your exam date failed."));
    },
    [user, showSaveError],
  );

  const resetTrackProgress = useCallback(
    async (track: TrackData) => {
      if (!user || !db) return;
      const completedIds = Object.fromEntries(
        track.allSubSteps.map((s) => [s.id, deleteField()]),
      );
      try {
        await setDoc(
          userRef(user.uid),
          {
            completedIds,
            examDates: { [track.id]: null },
            ...(track.id === "cka" ? { examDate: null } : {}),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch {
        showSaveError("Resetting your progress failed. Please try again.");
      }
    },
    [user, showSaveError],
  );

  return useMemo(
    () => ({
      loading,
      loadError,
      saveError,
      completedMap: data?.completedIds ?? {},
      examDates: examDatesFromDoc(data),
      startedAtMs: data?.createdAt ? data.createdAt.toMillis() : null,
      toggleSubStep,
      setManySubSteps,
      setExamDate,
      resetTrackProgress,
    }),
    [
      loading,
      loadError,
      saveError,
      data,
      toggleSubStep,
      setManySubSteps,
      setExamDate,
      resetTrackProgress,
    ],
  );
}
