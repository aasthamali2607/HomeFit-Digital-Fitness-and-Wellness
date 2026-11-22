import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import GeneratedImage from "@/components/GeneratedImage";
import { useNavigate } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";
import { findCategory, YOGA_CATEGORIES } from "@/data/yoga";
import { todayISO } from "@/lib/fitness";
import { buildYogaSession, type YogaSessionItem } from "@/lib/yoga-session";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { dateForPlanDay } from "@/lib/plan-weeks";

export const Route = createFileRoute("/_authenticated/practice")({
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
      { title: "Today's Yoga Abhyas — HomeFit" },
      {
        name: "description",
        content: "A guided yoga session: warm-up, main poses, pranayama, stretching and relaxation.",
      },
      { property: "og:title", content: "Today's Yoga Abhyas — HomeFit" },
      {
        property: "og:description",
        content: "A guided yoga session: warm-up, main poses, pranayama, stretching and relaxation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PracticePage,
});

type Item = YogaSessionItem;

function PracticePage() {
  const search = useSearch({ from: "/_authenticated/practice" });
  const navigate = useNavigate();
  const { onboarding, logWorkout, currentWeek } = useApp();

  const category = useMemo(
    () => findCategory(search.category ?? "") ?? YOGA_CATEGORIES[0]!,
    [search.category],
  );
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

  // Planned sessions use the duration saved with that plan week; free
  // practice uses the user's current preference.
  const targetMin =
    (source === "plan" ? currentWeek?.prefs.workoutDuration : undefined) ??
    onboarding.workoutDuration ??
    30;

  // Five stages (warm-up, main poses, pranayama, stretching, relaxation) with
  // short rests; every pose appears once and the total equals targetMin.
  const items = useMemo<Item[]>(() => buildYogaSession(category, targetMin), [category, targetMin]);

  // restSec is left at 0 (the default) so this keeps the exact same
  // behavior it always had: no rest phase, every step flows straight
  // into the next. See src/hooks/usePracticeSession.ts.
  const session = usePracticeSession<Item>({
    items,
    storageKey: `homefit:yoga:${category.id}:${source}:${loggedPlanDay ?? "free"}`,
    onComplete: async (posesDone, seconds, finishedAll) => {
      try {
        await logWorkout({
          date: todayISO(),
          duration: Math.max(1, Math.round(seconds / 60)),
          name: `${category.name} Yoga Abhyas`,
          kind: "yoga",
          categoryId: category.id,
          posesCompleted: posesDone,
          source,
          planDay: loggedPlanDay,
          isCompleted: finishedAll,
        });
      } catch {
        toast.error("We couldn't save this session. Please check your connection.");
      }
    },
  });

  const { current, index, total, remaining, running, done, completedCount, elapsed, progressPct } =
    session;


  if (done) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-4xl">
            🙏
          </div>
          <h1 className="font-serif text-3xl text-navy mt-6">Practice complete</h1>
          <p className="text-muted-foreground mt-2">
            {completedCount} activities · {Math.max(1, Math.round(elapsed / 60))} minutes of{" "}
            {category.name}.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/progress")}
              className="h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
            >
              See my progress
            </button>
            <button
              onClick={() => navigate("/yoga")}
              className="h-12 rounded-2xl border border-border bg-card font-semibold"
            >
              Back to yoga
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const stageTheme =
    current.stage === "Warm-up"
      ? "bg-practice-warm"
      : current.stage === "Main Poses"
        ? "bg-background"
        : "bg-practice-cool";
  const nextItem = items[index + 1];
  const fmt = (sec: number) =>
    sec >= 60 ? `${Math.floor(sec / 60)} min${sec % 60 ? ` ${sec % 60}s` : ""}` : `${sec}s`;

  return (
    <Layout>
      <div className={`min-h-[calc(100vh-4rem)] transition-colors duration-700 ${stageTheme}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between text-sm">
          <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold text-xs">
            {current.stage}
          </span>
          <span className="text-muted-foreground">
            Step {index + 1} of {total}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-muted mt-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-sm mt-5 overflow-hidden">
          {current.stage === "Rest" ? (
            <div className="mx-auto h-[clamp(10rem,30vh,18rem)] w-full bg-muted flex flex-col items-center justify-center text-center px-6">
              <span className="text-4xl" aria-hidden="true">🌿</span>
              <p className="font-serif text-xl text-navy mt-3">Short rest</p>
              {nextItem && (
                <p className="text-sm text-muted-foreground mt-1">Up next: {nextItem.name}</p>
              )}
            </div>
          ) : (
            <GeneratedImage
              key={current.imageKey + index}
              contentKey={current.imageKey}
              alt={`${current.name} practice step`}
              className="mx-auto h-[clamp(14rem,42vh,28rem)] w-full"
              rounded="rounded-none"
              fit="contain"
            />
          )}
          <div className="p-6 text-center">
            <h1 className="font-serif text-2xl text-navy">{current.name}</h1>
            {current.sanskrit && (
              <p className="text-sm italic text-muted-foreground">{current.sanskrit}</p>
            )}

            <div className="my-6">
              <div className="font-serif text-6xl text-primary tabular-nums">
                {String(Math.floor(Math.max(remaining, 0) / 60)).padStart(2, "0")}:
                {String(Math.max(remaining, 0) % 60).padStart(2, "0")}
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
                {running ? "In practice" : "Paused"}
              </p>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {current.stage === "Rest" ? "Rest" : "Duration"} · {fmt(current.durationSec)}
            </p>
            <ol className="mt-3 text-left text-sm text-muted-foreground list-decimal pl-5 space-y-1">
              {current.instructions.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
            <div className="mt-4 rounded-2xl bg-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-navy">Breathe</p>
              <p className="text-sm text-muted-foreground mt-1">{current.breathing}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <button
            onClick={() => session.previous()}
            disabled={index === 0}
            className="h-12 rounded-2xl border border-border bg-card font-medium disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            onClick={session.toggleRunning}
            className="h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => session.next(true)}
            className="h-12 rounded-2xl border border-border bg-card font-medium"
          >
            Next →
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => session.next(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {current.stage === "Rest" ? "Skip rest" : "Skip this step"}
          </button>
          <button
            onClick={() => session.finish()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            End practice
          </button>
        </div>
      </div>
      </div>
    </Layout>
  );
}
