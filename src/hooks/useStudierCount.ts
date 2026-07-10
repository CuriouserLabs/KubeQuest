import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Anonymous aggregate counter shown on the landing page.
 * Reads the public stats/global document; exposes no individual data.
 */
export function useStudierCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      doc(db, "stats", "global"),
      (snap) => {
        const value = snap.data()?.studiers;
        setCount(typeof value === "number" ? value : null);
      },
      // The counter is cosmetic; ignore read errors silently.
      () => setCount(null),
    );
  }, []);

  return count;
}
