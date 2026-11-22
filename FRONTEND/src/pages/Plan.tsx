import { useMemo, useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import Layout from "@/components/Layout";
import Celebration from "@/components/Celebration";
import { useApp } from "@/lib/app-context";
import { formatLongDate, todayISO } from "@/lib/fitness";
import { type PlannedDay } from "@/lib/personalized-plan";
import {
  canStartDay,
  completedSessionsForDay,
  currentPlanDay,
  dateForPlanDay,
  dayStatus,
  programDayNumber,
  programStats,
  programTotalWeeks,
  programWeekOf,
  weekdayFor,
  weekRangeLabel,
  weekStats,
  type DayStatus,
  type PlanWeek,
  type WeekStats,
} from "@/lib/plan-weeks";

const KIND_ICON: Record<PlannedDay["kind"], string> = {
  yoga: "🧘‍♀️",
  exercise: "💪",
  recovery: "🌿",
};

const STATUS_STYLE: Record<DayStatus, { chip: string; circle: string; icon: string; label: string }> = {
  completed: {
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    circle: "bg-emerald-500 text-white",
    icon: "✓",
    label: "Completed",
  },
  today: {
    chip: "bg-[#EEF1FD] text-[#4B5FE8] border-[#C7D0FA]",
    circle: "bg-[#4B5FE8] text-white",
    icon: "●",
    label: "Today",
  },
  planned: {
    chip: "bg-muted text-muted-foreground border-border",
    circle: "bg-muted text-muted-foreground",
    icon: "●",
    label: "Planned",
  },
  rest: {
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    circle: "bg-sky-100 text-sky-700",
    icon: "🌿",
    label: "Rest / Recovery",
  },
  missed: {
    chip: "bg-red-50 text-red-600 border-red-200",
    circle: "bg-red-500 text-white",
    icon: "✕",
    label: "Missed",
  },
  locked: {
    chip: "bg-muted text-muted-foreground border-border",
    circle: "bg-muted text-muted-foreground",
    icon: "🔒",
    label: "Locked",
  },
};

function StatusChip({ status }: { status: DayStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${s.chip}`}>
      {s.icon} {s.label.toUpperCase()}
    </span>
  );
}

function DayRow({
  week,
  day,
  status,
  today,
  onView,
}: {
  week: PlanWeek;
  day: PlannedDay;
  status: DayStatus;
  today: string;
  onView: () => void;
}) {
  const date = dateForPlanDay(week, day.day);
  const style = STATUS_STYLE[status];
  const startable = canStartDay(week, day, today);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 transition-all sm:gap-4 ${
        status === "today"
          ? "border-[#4B5FE8] bg-[#F7F8FF] shadow-sm"
          : status === "missed"
            ? "border-red-200 bg-red-50/40"
            : "border-border bg-card"
      } ${status === "locked" ? "opacity-70" : ""}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.circle}`}
      >
        {status === "completed" ? "✓" : status === "missed" ? "✕" : programDayNumber(week, day.day)}
      </div>
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-xl sm:flex">
        {KIND_ICON[day.kind]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            Day {programDayNumber(week, day.day)} · {day.title}
          </p>
          <StatusChip status={status} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {weekdayFor(date)} {date.slice(8)}/{date.slice(5, 7)} ·{" "}
          {day.isMain ? `${day.durationMin} min · ${day.difficulty} · ${day.categoryLabel}` : day.support}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {!day.isMain ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Rest</span>
        ) : status === "locked" ? (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            🔒 Locked
          </span>
        ) : status === "today" ? (
          <Link
            to={day.href}
            className="rounded-full bg-[#4B5FE8] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3B4ED0]"
          >
            Start
          </Link>
        ) : status === "missed" ? (
          <Link
            to={day.href}
            className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600"
          >
            Try again
          </Link>
        ) : null}
        {startable && (
          <button
            onClick={onView}
            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-muted-foreground underline-offset-2 hover:underline"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryGrid({ stats, streak }: { stats: WeekStats; streak: number }) {
  const items = [
    { label: "Planned sessions completed", value: `${stats.completedSessions}/${stats.plannedSessions}` },
    { label: "Completed planned days", value: String(stats.completedDays) },
    { label: "Missed planned days", value: String(stats.missedDays) },
    { label: "Rest / recovery days", value: String(stats.restDays) },
    { label: "Yoga sessions from the plan", value: String(stats.yogaSessions) },
    { label: "Exercises completed in plan", value: String(stats.exercisesCompleted) },
    { label: "Total practice time", value: `${stats.totalMinutes} min` },
    { label: "Current streak", value: `${streak} d` },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border bg-card p-3">
          <p className="text-lg font-bold text-foreground">{item.value}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar({ stats }: { stats: WeekStats }) {
  return (
    <div className="mt-4 grid grid-cols-7 gap-1.5">
      {stats.days.map((day, i) => {
        const status = stats.statuses[i] ?? "planned";
        const s = STATUS_STYLE[status];
        return (
          <div
            key={day.day}
            className={`flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2 text-center ${s.chip}`}
            title={`Day ${programDayNumber(stats.week, day.day)} — ${s.label}`}
          >
            <span className="text-[10px] font-medium opacity-70">D{programDayNumber(stats.week, day.day)}</span>
            <span className="text-sm leading-none">{s.icon}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Plan() {
  const { onboarding, workoutLogs, planWeeks, currentWeek, startNewWeek, streak } = useApp();
  const navigate = useNavigate();
  const today = todayISO();
  const [selected, setSelected] = useState<PlannedDay | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(
    () => (currentWeek ? weekStats(currentWeek, workoutLogs, today) : null),
    [currentWeek, workoutLogs, today],
  );
  const history = useMemo(
    () => planWeeks.map((week) => weekStats(week, workoutLogs, today)),
    [planWeeks, workoutLogs, today],
  );

  const focus = onboarding.focusAreas?.[0] ?? onboarding.goal ?? "General Yoga";

  if (!currentWeek || !stats) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-serif text-3xl text-navy">No plan yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your plan — today becomes Day 1.
          </p>
          <button
            onClick={() => {
              setBusy(true);
              void startNewWeek().finally(() => setBusy(false));
            }}
            disabled={busy}
            className="mt-6 h-12 rounded-2xl bg-[#4B5FE8] px-8 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create my plan
          </button>
        </div>
      </Layout>
    );
  }

  const dayNumber = currentPlanDay(currentWeek, today);
  const todaysDay = dayNumber ? stats.days[dayNumber - 1] : undefined;
  // Progress covers the whole selected program (7/14/21/30 days).
  const program = programStats(planWeeks, currentWeek, workoutLogs, today);
  const pct = program.plannedSessions
    ? Math.round((program.completedDays / program.plannedSessions) * 100)
    : 0;
  const weekOver = today > stats.endDate;

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#4B5FE8]">
            Week {programWeekOf(currentWeek)} of {programTotalWeeks(currentWeek)} · {weekRangeLabel(currentWeek)}
          </p>
          <h1 className="font-serif text-4xl text-navy">My HomeFit Plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {focus} · {program.length}-day program · {program.plannedSessions} planned sessions ·{" "}
            {dayNumber
              ? `Day ${programDayNumber(currentWeek, dayNumber)} of ${program.length} — ${formatLongDate(today)}`
              : program.isOver
                ? "This program has ended"
                : "This week has ended"}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Planned progress</p>
              <p className="text-3xl font-bold text-foreground">
                {program.completedDays}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  of {program.plannedSessions} sessions
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {program.missedDays} missed · {program.restDays} rest · {program.lockedDays} still locked
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <span className="text-xs font-bold text-primary">{pct}%</span>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[#4B5FE8] transition-all" style={{ width: `${pct}%` }} />
          </div>
          <MiniCalendar stats={stats} />
          {todaysDay?.isMain && stats.statuses[todaysDay.day - 1] === "today" && (
            <Link
              to={todaysDay.href}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#4B5FE8] px-5 text-sm font-semibold text-white hover:bg-[#3B4ED0]"
            >
              Start today’s practice
            </Link>
          )}
        </div>

        {/* Plan complete celebration */}
        {program.isComplete && (
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#C7D0FA] bg-white p-6 text-center shadow-sm">
            <Celebration />
            <div className="relative">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF1FD] text-2xl">
                ✓
              </div>
              <h2 className="font-serif text-3xl text-navy">🎉 You Did It!</h2>
              <p className="mt-1 text-sm font-medium text-foreground">Your plan is complete.</p>
              <p className="text-sm text-muted-foreground">
                Take a moment to be proud of your progress.
              </p>
              <p className="mt-3 text-sm text-[#4B5FE8]">
                ✨ Perfect! You completed all your planned sessions in this program.
              </p>
            </div>
          </div>
        )}

        {/* Week in motion summary */}
        {(stats.isComplete || stats.isFinished || weekOver) && (
          <div className="mb-6 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-serif text-2xl text-navy">Your Week in Motion</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Celebrate what you completed, learn from what you missed, and keep moving forward.
            </p>
            {!stats.isComplete && (
              <p className="mt-2 text-sm text-[#4B5FE8]">
                You still made progress this week. Your next week is a fresh start.
              </p>
            )}
            <div className="mt-4">
              <SummaryGrid stats={stats} streak={streak} />
            </div>
            <MiniCalendar stats={stats} />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Free library practice is tracked separately ({stats.freeYoga} yoga · {stats.freeExercise}{" "}
              exercise this week) and never counts as a planned session.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Next weeks open automatically by date. A new program is only
              offered once the current one has ended, and starts the day it
              is pressed. */}
          {program.isOver && (
          <button
            onClick={() => {
              setBusy(true);
              void startNewWeek()
                .then(() => setSelected(null))
                .finally(() => setBusy(false));
            }}
            disabled={busy}
            className="h-11 rounded-2xl bg-[#4B5FE8] px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            Start a new program
          </button>
          )}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.setItem("homefit:change-plan", "1");
              }
              navigate("/onboarding");
            }}
            className="h-11 rounded-2xl border border-border bg-card px-5 text-sm font-semibold text-foreground"
          >
            Change my plan
          </button>
        </div>

        {/* Preferences */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            `${currentWeek.prefs.workoutDuration ?? 30} min/session`,
            `${currentWeek.prefs.workoutFrequency ?? 4}x/week`,
            currentWeek.prefs.fitnessLevel === "Advanced"
              ? "Intermediate"
              : currentWeek.prefs.fitnessLevel || "Beginner",
            ...(currentWeek.prefs.equipment ?? ["Yoga mat"]).slice(0, 2),
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Days */}
        <div className="space-y-3">
          {stats.days.map((day, i) => (
            <DayRow
              key={day.day}
              week={currentWeek}
              day={day}
              status={stats.statuses[i] ?? "planned"}
              today={today}
              onView={() => setSelected(day)}
            />
          ))}
        </div>

        {/* Week history */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-2xl text-navy">Week history</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every week you have practised is kept exactly as it happened.
            </p>
            <div className="mt-3 space-y-2">
              {[...history].reverse().map((w) => (
                <div
                  key={w.week.weekNumber}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Week {programWeekOf(w.week)}{" "}
                      {w.isComplete ? (
                        <span className="text-emerald-600">✓ COMPLETED</span>
                      ) : w.week.weekNumber === currentWeek.weekNumber ? (
                        <span className="text-[#4B5FE8]">· CURRENT PLAN</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{weekRangeLabel(w.week)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {w.completedDays} completed · <span className="text-red-600">{w.missedDays} missed</span>{" "}
                    · {w.restDays} rest · {w.totalMinutes} min
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DayDetail
          week={currentWeek}
          day={selected}
          status={dayStatus(currentWeek, selected, workoutLogs, today)}
          sessions={completedSessionsForDay(currentWeek, selected, workoutLogs)}
          onClose={() => setSelected(null)}
        />
      )}
    </Layout>
  );
}

function DayDetail({
  week,
  day,
  status,
  sessions,
  onClose,
}: {
  week: PlanWeek;
  day: PlannedDay;
  status: DayStatus;
  sessions: { name: string; duration: number; calories: number }[];
  onClose: () => void;
}) {
  const date = dateForPlanDay(week, day.day);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-card p-6 sm:max-w-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-navy">
              Day {day.day} · {day.title}
            </h2>
            <p className="text-xs text-muted-foreground">{formatLongDate(date)}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 shrink-0 rounded-full bg-muted text-muted-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <StatusChip status={status} />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {day.isMain
            ? `${day.durationMin} min · ${day.difficulty} · ${day.categoryLabel} · ${day.activityCount} activities`
            : day.support}
        </p>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-navy">Sessions on this day</h3>
        {sessions.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No planned session was completed on this date. Viewing a day never records a completion.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {sessions.map((s, i) => (
              <li key={i} className="rounded-2xl bg-muted p-3">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.duration} min · {s.calories} kcal
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
