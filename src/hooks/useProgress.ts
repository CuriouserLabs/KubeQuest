import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import {
  deleteField,
  doc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { UserDoc } from "../types";

interface ProgressState {
  /** True while the first snapshot for the current user is loading. */
  loading: boolean;
  /** Fatal read error (progress cannot be shown). */
  loadError: string | null;
  /** Transient write error, surfaced as a toast and auto-cleared. */
  saveError: string | null;
  completedMap: Record<string, true>;
  examDate: string | null;
  /** Millis of the user's first session, used by the pace indicator. */
  startedAtMs: number | null;
  toggleSubStep: (id: string, value: boolean) => void;
  setManySubSteps: (ids: string[], value: boolean) => void;
  setExamDate: (isoDate: string | null) => void;
  resetProgress: () => Promise<void>;
}

function userRef(uid: string): DocumentReference {
  if (!db) throw new Error("Firestore is not configured");
  return doc(db, "users", uid);
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

  const write = useCallback(
    (fields: Record<string, unknown>, failureMessage: string) => {
      if (!user || !db) return;
      updateDoc(userRef(user.uid), {
        ...fields,
        updatedAt: serverTimestamp(),
      }).catch(() => showSaveError(failureMessage));
    },
    [user, showSaveError],
  );

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
    (isoDate: string | null) =>
      write({ examDate: isoDate }, "Saving your exam date failed."),
    [write],
  );

  const resetProgress = useCallback(async () => {
    if (!user || !db) return;
    try {
      await updateDoc(userRef(user.uid), {
        completedIds: {},
        examDate: null,
        updatedAt: serverTimestamp(),
      });
    } catch {
      showSaveError("Resetting your progress failed. Please try again.");
    }
  }, [user, showSaveError]);

  return useMemo(
    () => ({
      loading,
      loadError,
      saveError,
      completedMap: data?.completedIds ?? {},
      examDate: data?.examDate ?? null,
      startedAtMs: data?.createdAt ? data.createdAt.toMillis() : null,
      toggleSubStep,
      setManySubSteps,
      setExamDate,
      resetProgress,
    }),
    [
      loading,
      loadError,
      saveError,
      data,
      toggleSubStep,
      setManySubSteps,
      setExamDate,
      resetProgress,
    ],
  );
}
