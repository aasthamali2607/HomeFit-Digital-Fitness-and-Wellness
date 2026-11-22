import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import GeneratedImage from "@/components/GeneratedImage";
import { useNavigate } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";
import { exercisesForCategory, type Exercise } from "@/data/exercises";
import { todayISO } from "@/lib/fitness";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { dateForPlanDay } from "@/lib/plan-weeks";
import { fitSessionToDuration } from "@/lib/session-fit";

const REST_SEC = 10;

export const Route = createFileRoute("/_authenticated/exercise-practice")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    source: search["source"] === "plan" ? ("plan" as const) : ("free" as const),
    day: (() => {
      const raw = search["day"];
      const value = typeof raw === "string" ? Number.parseInt(raw, 10) : typeof raw === "number" ? raw : undefined;
      return value && value >= 1 && value <= 7 ? value : undefined;
    })(),
  }),
  head: () => ({
    meta: [
      { title: "Exercise Workout — HomeFit" },
      { name: "description", content: "A guided, timed exercise workout with rest between moves." },
      { property: "og:title", content: "Exercise Workout — HomeFit" },
      {
        property: "og:description",
        content: "A guided, timed exercise workout with rest between moves.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExercisePracticePage,
});

function formatClock(totalSec: number) {
  const s = Math.max(totalSec, 0);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function ExercisePracticePage() {
  const search = useSearch({ from: "/_authenticated/exercise-practice" });
  const navigate = useNavigate();
  const { onboarding, logWorkout, currentWeek } = useApp();

  const categoryLabel =
    search.category && search.category !== "All" ? search.category : "Full Body";
  const source = search.source;
  const planDay = search.day;
  const loggedPlanDay = source === "plan" && planDay ? planDay : null;

  // A future planned day can never be started before its real calendar date.
  const lockedFuture =
    source === "plan" &&
    !!loggedPlanDay &&
    !!currentWeek &&
    dateForPlanDay(currentWeek, loggedPlanDay) > todayISO();
  useEffect(() => {
    if (lockedFuture) navigate("/plan", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedFuture]);

  // Same sizing rule Yoga Abhyas uses, so a session length feels
  // consistent across both practice types.
  const targetMin =
    (source === "plan" ? currentWeek?.prefs.workoutDuration : undefined) ??
    onboarding.workoutDuration ??
    30;

  // Fills the selected duration exactly (including the rest between moves).
  const items = useMemo<Exercise[]>(
    () => fitSessionToDuration([], exercisesForCategory(search.category), [], targetMin, REST_SEC),
    [search.category, targetMin],
  );

  const session = usePracticeSession<Exercise>({
    items,
    restSec: REST_SEC,
    storageKey: `homefit:exercise:${search.category ?? "all"}:${source}:${loggedPlanDay ?? "free"}`,
    onComplete: async (exercisesDone, seconds, finishedAll) => {
      try {
        await logWorkout({
          date: todayISO(),
          duration: Math.max(1, Math.round(seconds / 60)),
          name: `${categoryLabel} Workout`,
          kind: "exercise",
          categoryId: search.category ?? null,
          posesCompleted: exercisesDone,
          source,
          planDay: loggedPlanDay,
          isCompleted: finishedAll,
        });
      } catch {
        toast.error("We couldn't save this workout. Please check your connection.");
      }
    },
  });

  const {
    current,
    index,
    total,
    phase,
    remaining,
    running,
    done,
    completedCount,
    elapsed,
    progressPct,
  } = session;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">No exercises found for this focus yet.</p>
          <button
            onClick={() => navigate("/exercises")}
            className="mt-6 h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold"
          >
            Back to exercises
          </button>
        </div>
      </Layout>
    );
  }

  if (done) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in-up">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Workout Completed!
          </p>
          <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-4xl mt-4">
            🎉
          </div>
          <h1 className="font-serif text-3xl text-navy mt-6">
            {completedCount} Exercise{completedCount === 1 ? "" : "s"} Completed
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Practice Time
              </p>
              <p className="font-serif text-2xl text-navy mt-1">
                {Math.max(1, Math.round(elapsed / 60))} min
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Date</p>
              <p className="font-serif text-lg text-navy mt-1">
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/exercises")}
              className="h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
            >
              Done
            </button>
            <button
              onClick={() => navigate("/progress")}
              className="h-12 rounded-2xl border border-border bg-card font-semibold"
            >
              See my progress
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (phase === "resting") {
    const nextItem = items[index + 1];
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in-up">
          <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold text-xs">
            Rest
          </span>
          <div className="font-serif text-7xl text-primary tabular-nums mt-6">
            {formatClock(remaining)}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => session.adjustRemaining(-15)}
              className="h-9 w-9 rounded-full border border-border bg-card font-semibold text-muted-foreground"
              aria-label="Reduce rest timer by 15 seconds"
            >
              −
            </button>
            <button
              onClick={() => session.adjustRemaining(15)}
              className="h-9 w-9 rounded-full border border-border bg-card font-semibold text-muted-foreground"
              aria-label="Add 15 seconds to rest timer"
            >
              +
            </button>
          </div>
          <p className="text-muted-foreground mt-3">
            {nextItem ? `Get ready for ${nextItem.name}.` : "Get ready for the next exercise."}
          </p>
          <button
            onClick={() => session.skipRest()}
            className="mt-8 h-12 px-6 rounded-2xl border border-border bg-card font-medium"
          >
            Skip Rest →
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between text-sm">
          <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold text-xs">
            {current.category}
          </span>
          <span className="text-muted-foreground">
            Exercise {index + 1} of {total}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-muted mt-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPct)}% Complete</p>

        <div className="bg-card rounded-3xl border border-border shadow-sm mt-4 overflow-hidden">
          <GeneratedImage
            contentKey={`exercise:${current.id}`}
            alt={`${current.name} exercise`}
            className="mx-auto h-[clamp(14rem,42vh,28rem)] w-full"
            rounded="rounded-none"
            fit="contain"
          />
          <div className="p-6 text-center">
            <h1 className="font-serif text-2xl text-navy">{current.name}</h1>
            <p className="text-sm text-muted-foreground">{current.muscle}</p>

            <div className="my-6">
              <div className="font-serif text-6xl text-primary tabular-nums">
                {formatClock(remaining)}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={() => session.adjustRemaining(-15)}
                  className="h-9 w-9 rounded-full border border-border bg-card font-semibold text-muted-foreground"
                  aria-label="Reduce timer by 15 seconds"
                >
                  −
                </button>
                <button
                  onClick={() => session.adjustRemaining(15)}
                  className="h-9 w-9 rounded-full border border-border bg-card font-semibold text-muted-foreground"
                  aria-label="Add 15 seconds"
                >
                  +
                </button>
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">
                {running ? "In progress" : "Paused"}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">{current.cue}</p>
            <div className="mt-4 rounded-2xl bg-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-navy">Breathe</p>
              <p className="text-sm text-muted-foreground mt-1">{current.breathing}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-5">
          <button
            onClick={() => session.previous()}
            disabled={index === 0}
            className="h-12 rounded-2xl border border-border bg-card font-medium disabled:opacity-40 text-sm"
          >
            ← Prev
          </button>
          <button
            onClick={session.toggleRunning}
            className="h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => session.takeRestNow()}
            className="h-12 rounded-2xl border border-border bg-card font-medium text-sm"
          >
            Rest
          </button>
          <button
            onClick={() => session.skipToNext(true)}
            className="h-12 rounded-2xl border border-border bg-card font-medium text-sm"
          >
            Next →
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => session.skipToNext(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip this exercise
          </button>
          <button
            onClick={() => session.finish()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            End workout
          </button>
        </div>
      </div>
    </Layout>
  );
}
