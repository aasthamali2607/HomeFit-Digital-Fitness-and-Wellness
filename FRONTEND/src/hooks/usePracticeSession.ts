import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * The single countdown/pause/resume/auto-advance engine shared by the
 * Yoga Abhyas practice screen and the Exercise Practice screen, so the
 * timer logic only lives in one place.
 *
 * Yoga uses this with `restSec` left at 0, which keeps its behavior
 * byte-for-byte identical to before this was extracted: every
 * completed/skipped item goes straight to the next one, no rest phase.
 *
 * Exercise Practice passes a `restSec > 0`, which adds a "resting"
 * phase between items that this hook manages the same way it manages
 * the active countdown.
 */

export interface SessionItem {
  durationSec: number;
  /** false = timed but not counted as a completed activity (e.g. rest breaks). */
  countable?: boolean;
}

export type SessionPhase = "active" | "resting";

interface UsePracticeSessionOptions<T extends SessionItem> {
  items: T[];
  /** Seconds of rest inserted after each item completes naturally or is
   * advanced past with "Next". 0 (default) disables the rest phase
   * entirely, matching the original Yoga Abhyas behavior. */
  restSec?: number;
  storageKey?: string;
  /** finishedAll is false when the user ends the session early. */
  onComplete: (completedCount: number, elapsedSec: number, finishedAll: boolean) => void | Promise<void>;
}

export interface PracticeSession<T> {
  index: number;
  current: T;
  total: number;
  phase: SessionPhase;
  remaining: number;
  running: boolean;
  elapsed: number;
  completedCount: number;
  done: boolean;
  progressPct: number;
  toggleRunning: () => void;
  /** Advances to the next item, optionally going through a rest phase
   * first (used by the auto-timer and by "Next" in flows without an
   * explicit rest step, e.g. Yoga). */
  next: (countCurrent: boolean) => void;
  /** Jumps straight to the next item's active phase, bypassing any
   * rest — used by an explicit "Next" action in flows that also offer
   * a separate rest step, e.g. Exercise Practice. */
  skipToNext: (countCurrent: boolean) => void;
  /** Ends the current rest phase immediately and starts the next item. */
  skipRest: () => void;
  /** Manually enters the rest phase right now, without waiting for the
   * active timer to reach zero (does not count the item as completed). */
  takeRestNow: () => void;
  adjustRemaining: (deltaSec: number) => void;
  previous: () => void;
  finish: () => void;
}

export function usePracticeSession<T extends SessionItem>({
  items,
  restSec = 0,
  storageKey,
  onComplete,
}: UsePracticeSessionOptions<T>): PracticeSession<T> {
  const itemSignature = useMemo(() => items.map((item) => item.durationSec).join("|"), [items]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>("active");
  const [remaining, setRemaining] = useState(items[0]?.durationSec ?? 0);
  const [running, setRunning] = useState(items.length > 0);
  const [elapsed, setElapsed] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [done, setDone] = useState(false);
  const saved = useRef(false);
  const restored = useRef(!storageKey);
  const [ready, setReady] = useState(!storageKey);

  const fallbackCurrent = { durationSec: 0 } as T;
  const current = items[index] ?? items[0] ?? fallbackCurrent;

  useEffect(() => {
    saved.current = false;
    restored.current = false;
    setReady(false);

    if (items.length === 0) {
      setIndex(0);
      setPhase("active");
      setRemaining(0);
      setRunning(false);
      setElapsed(0);
      setCompletedCount(0);
      setDone(false);
      restored.current = true;
      setReady(true);
      return;
    }

    if (storageKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(storageKey);
        const parsed = raw ? (JSON.parse(raw) as Partial<{
          signature: string;
          index: number;
          phase: SessionPhase;
          remaining: number;
          running: boolean;
          elapsed: number;
          completedCount: number;
          done: boolean;
        }>) : null;

        if (
          parsed?.signature === itemSignature &&
          typeof parsed.index === "number" &&
          parsed.index >= 0 &&
          parsed.index < items.length &&
          (parsed.phase === "active" || parsed.phase === "resting")
        ) {
          setIndex(parsed.index);
          setPhase(parsed.phase);
          setRemaining(Math.max(0, Math.round(parsed.remaining ?? items[parsed.index]?.durationSec ?? 0)));
          setRunning(Boolean(parsed.running));
          setElapsed(Math.max(0, Math.round(parsed.elapsed ?? 0)));
          setCompletedCount(Math.max(0, Math.round(parsed.completedCount ?? 0)));
          setDone(Boolean(parsed.done));
          restored.current = true;
          setReady(true);
          return;
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setIndex(0);
    setPhase("active");
    setRemaining(items[0]?.durationSec ?? 0);
    setRunning(true);
    setElapsed(0);
    setCompletedCount(0);
    setDone(false);
    restored.current = true;
    setReady(true);
  }, [itemSignature, items, storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined" || !restored.current || !ready) return;
    if (done) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        signature: itemSignature,
        index,
        phase,
        remaining,
        running,
        elapsed,
        completedCount,
        done,
      }),
    );
  }, [completedCount, done, elapsed, index, itemSignature, phase, ready, remaining, running, storageKey]);

  const finishSession = useCallback(
    (count: number, seconds: number, finishedAll = true) => {
      if (saved.current) return;
      saved.current = true;
      setDone(true);
      setRunning(false);
      void onComplete(count, seconds, finishedAll);
    },
    [onComplete],
  );

  const enterItem = useCallback(
    (i: number) => {
      const item = items[i];
      if (!item) return;
      setIndex(i);
      setPhase("active");
      setRemaining(item.durationSec);
    },
    [items],
  );

  const advanceOrFinish = useCallback(
    (nextIndex: number, countForFinish: number, seconds: number) => {
      if (nextIndex >= items.length) {
        finishSession(countForFinish, seconds);
      } else {
        enterItem(nextIndex);
      }
    },
    [items.length, finishSession, enterItem],
  );

  const next = useCallback(
    (countCurrent: boolean) => {
      const counts = countCurrent && phase === "active" && current.countable !== false;
      const newCount = counts ? completedCount + 1 : completedCount;
      if (counts) setCompletedCount(newCount);
      if (phase === "active" && restSec > 0 && index + 1 < items.length) {
        setPhase("resting");
        setRemaining(restSec);
        return;
      }
      advanceOrFinish(index + 1, newCount, elapsed);
    },
    [completedCount, phase, restSec, index, items.length, advanceOrFinish, elapsed, current],
  );

  const skipToNext = useCallback(
    (countCurrent: boolean) => {
      // Only count the item if it hasn't already been counted (i.e. we
      // are still in its active phase — resting means it was already
      // counted on the way in).
      const shouldCount = countCurrent && phase === "active" && current.countable !== false;
      const newCount = shouldCount ? completedCount + 1 : completedCount;
      if (shouldCount) setCompletedCount(newCount);
      advanceOrFinish(index + 1, newCount, elapsed);
    },
    [completedCount, phase, index, advanceOrFinish, elapsed, current],
  );

  const skipRest = useCallback(() => {
    if (phase !== "resting") return;
    advanceOrFinish(index + 1, completedCount, elapsed);
  }, [phase, index, advanceOrFinish, completedCount, elapsed]);

  const takeRestNow = useCallback(() => {
    if (phase !== "active" || restSec <= 0) return;
    setPhase("resting");
    setRemaining(restSec);
  }, [phase, restSec]);

  const adjustRemaining = useCallback((deltaSec: number) => {
    setRemaining((seconds) => Math.max(5, seconds + deltaSec));
  }, []);

  const previous = useCallback(() => {
    if (index === 0) return;
    enterItem(index - 1);
  }, [index, enterItem]);

  const toggleRunning = useCallback(() => setRunning((r) => !r), []);

  const finish = useCallback(
    () => finishSession(completedCount, elapsed, false),
    [finishSession, completedCount, elapsed],
  );

  // Tick every second while running.
  useEffect(() => {
    if (!running || done || items.length === 0) return;
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
      setRemaining((r) => r - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running, done, items.length]);

  // Auto-advance when the countdown reaches zero.
  useEffect(() => {
    if (remaining > 0 || done) return;
    if (phase === "resting") {
      advanceOrFinish(index + 1, completedCount, elapsed);
    } else {
      next(true);
    }
    // Only the countdown reaching zero (or completion) should trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, done]);

  const progressPct = items.length > 0 ? ((index + 1) / items.length) * 100 : 0;

  return {
    index,
    current,
    total: items.length,
    phase,
    remaining,
    running,
    elapsed,
    completedCount,
    done,
    progressPct,
    toggleRunning,
    next,
    skipToNext,
    skipRest,
    takeRestNow,
    adjustRemaining,
    previous,
    finish,
  };
}
