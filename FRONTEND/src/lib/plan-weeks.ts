/**
 * Plan weeks — the calendar is the source of truth.
 *
 * A "plan week" is a 7-day block with a REAL start date (the local calendar
 * date on which it was created) plus a snapshot of the preferences used to
 * generate it. The current plan day is derived from the stored start date and
 * the real local date only — never from refreshes, logins or completions.
 *
 * Weeks are persisted inside the onboarding JSON blob (`planWeeks`), so they
 * survive refresh, logout/login and browser restarts without any schema change.
 */
import type { OnboardingData, WorkoutLog } from "@/lib/app-context";
import { addDays, daysBetween, todayISO } from "@/lib/fitness";
import { generateSevenDayPlan, type PlannedDay } from "@/lib/personalized-plan";

export interface PlanPrefs {
  goal?: string;
  focusAreas?: string[];
  fitnessLevel?: string;
  workoutDuration?: number;
  workoutFrequency?: number;
  equipment?: string[];
}

export interface PlanWeek {
  weekNumber: number; // unique across all history
  startDate: string; // YYYY-MM-DD, local
  prefs: PlanPrefs;
  /** Program fields. Weeks saved before programs existed lack them and are
   * treated as a standalone 7-day program. */
  programNumber?: number;
  programLength?: number; // 7 | 14 | 21 | 30
  programWeek?: number; // 1-based week inside the program
  dayOffset?: number; // program day number of this week's Day 1, minus 1
  dayCount?: number; // days in this week (1..7)
}

export const PROGRAM_LENGTHS = [7, 14, 21, 30] as const;

export function normalizeProgramLength(value: number | undefined): number {
  return (PROGRAM_LENGTHS as readonly number[]).includes(value ?? 0) ? (value as number) : 30;
}

export const weekDayCount = (w: PlanWeek) => w.dayCount ?? 7;
export const weekDayOffset = (w: PlanWeek) => w.dayOffset ?? 0;
export const programLengthOf = (w: PlanWeek) => w.programLength ?? weekDayCount(w);
export const programWeekOf = (w: PlanWeek) => w.programWeek ?? 1;
export const programTotalWeeks = (w: PlanWeek) => Math.ceil(programLengthOf(w) / 7);
/** Program-wide day number (e.g. Day 9 of 14) for a day inside a week. */
export const programDayNumber = (w: PlanWeek, day: number) => weekDayOffset(w) + day;

/**
 * Every week of a program, with fixed calendar dates. Weeks unlock purely by
 * date; no week is ever created past the program length.
 * 7 → [7] · 14 → [7,7] · 21 → [7,7,7] · 30 → [7,7,7,7,2]
 */
export function buildProgramWeeks(
  firstWeekNumber: number,
  programNumber: number,
  startDate: string,
  length: number,
  prefs: PlanPrefs,
): PlanWeek[] {
  const total = normalizeProgramLength(length);
  const weeks: PlanWeek[] = [];
  for (let offset = 0, i = 0; offset < total; offset += 7, i += 1) {
    weeks.push({
      weekNumber: firstWeekNumber + i,
      startDate: addDays(startDate, offset),
      prefs,
      programNumber,
      programLength: total,
      programWeek: i + 1,
      dayOffset: offset,
      dayCount: Math.min(7, total - offset),
    });
  }
  return weeks;
}

/** All weeks belonging to the same program as `week`. */
export function programWeeksFor(weeks: PlanWeek[], week: PlanWeek): PlanWeek[] {
  if (week.programNumber == null) return [week];
  return sortedWeeks(weeks).filter((w) => w.programNumber === week.programNumber);
}

export function programEndDate(weeks: PlanWeek[], week: PlanWeek): string {
  const list = programWeeksFor(weeks, week);
  return weekEndDate(list[list.length - 1] ?? week);
}

/**
 * Starts a new program on `startDate` (today). Weeks that have not started yet
 * are removed and a running week is cut at yesterday, so history up to today
 * is kept exactly as lived and programs never overlap.
 */
export function startProgram(
  existing: PlanWeek[] | undefined,
  length: number,
  prefs: PlanPrefs,
  startDate = todayISO(),
): PlanWeek[] {
  const kept: PlanWeek[] = [];
  for (const w of sortedWeeks(existing)) {
    if (weekEndDate(w) < startDate) kept.push(w);
    else if (w.startDate < startDate) kept.push({ ...w, dayCount: daysBetween(w.startDate, startDate) });
  }
  const lastWeek = kept[kept.length - 1]?.weekNumber ?? 0;
  const lastProgram = Math.max(0, ...kept.map((w) => w.programNumber ?? 0));
  return [...kept, ...buildProgramWeeks(lastWeek + 1, lastProgram + 1, startDate, length, prefs)];
}

export type DayStatus = "completed" | "today" | "planned" | "rest" | "missed" | "locked";

export const DAY_STATUS_LABEL: Record<DayStatus, string> = {
  completed: "Completed",
  today: "Today",
  planned: "Planned",
  rest: "Rest / Recovery",
  missed: "Missed",
  locked: "Locked",
};

export const DAY_STATUS_ICON: Record<DayStatus, string> = {
  completed: "✓",
  today: "●",
  planned: "●",
  rest: "🌿",
  missed: "✕",
  locked: "🔒",
};

export function prefsFromOnboarding(onboarding: Partial<OnboardingData>): PlanPrefs {
  return {
    goal: onboarding.goal ?? "",
    focusAreas: onboarding.focusAreas ?? [],
    fitnessLevel: onboarding.fitnessLevel ?? "",
    workoutDuration: onboarding.workoutDuration ?? 30,
    workoutFrequency: onboarding.workoutFrequency ?? 4,
    equipment: onboarding.equipment ?? [],
  };
}

export function sortedWeeks(weeks: PlanWeek[] | undefined): PlanWeek[] {
  return [...(weeks ?? [])].sort((a, b) => a.weekNumber - b.weekNumber);
}

/** The week that contains today, otherwise the most recent one. */
export function activeWeek(weeks: PlanWeek[] | undefined, today = todayISO()): PlanWeek | null {
  const list = sortedWeeks(weeks);
  if (list.length === 0) return null;
  const containing = list.find((w) => today >= w.startDate && today <= weekEndDate(w));
  return containing ?? list[list.length - 1] ?? null;
}

export function weekEndDate(week: PlanWeek): string {
  return addDays(week.startDate, weekDayCount(week) - 1);
}

export function dateForPlanDay(week: PlanWeek, day: number): string {
  return addDays(week.startDate, day - 1);
}

/** 1..dayCount while the week is running; larger once over; <1 before it starts. */
export function planDayNumber(week: PlanWeek, today = todayISO()): number {
  return daysBetween(week.startDate, today) + 1;
}

export function currentPlanDay(week: PlanWeek, today = todayISO()): number | null {
  const n = planDayNumber(week, today);
  return n >= 1 && n <= weekDayCount(week) ? n : null;
}

export function planDaysForWeek(week: PlanWeek): PlannedDay[] {
  return generateSevenDayPlan(week.prefs as Partial<OnboardingData>).slice(0, weekDayCount(week));
}

function isPlanLog(log: WorkoutLog) {
  return (log.source ?? "plan") === "plan";
}

/**
 * A planned day counts as COMPLETED only when a genuinely completed planned
 * session was recorded ON that day's own calendar date. Free library practice
 * (source = "free") can never complete a planned day, and a later retry is
 * stored as its own session without rewriting history.
 */
export function completedSessionsForDay(week: PlanWeek, day: PlannedDay, logs: WorkoutLog[]) {
  const date = dateForPlanDay(week, day.day);
  return logs.filter(
    (log) =>
      isPlanLog(log) &&
      log.isCompleted !== false &&
      log.date === date &&
      (log.planDay ?? day.day) === day.day,
  );
}

export function isDayCompleted(week: PlanWeek, day: PlannedDay, logs: WorkoutLog[]) {
  return completedSessionsForDay(week, day, logs).length > 0;
}

export function dayStatus(
  week: PlanWeek,
  day: PlannedDay,
  logs: WorkoutLog[],
  today = todayISO(),
): DayStatus {
  const date = dateForPlanDay(week, day.day);
  if (!day.isMain) return "rest";
  if (isDayCompleted(week, day, logs)) return "completed";
  if (date > today) return "locked";
  if (date === today) return "today";
  return "missed";
}

/** Future planned days can never be started early. */
export function canStartDay(week: PlanWeek, day: PlannedDay, today = todayISO()) {
  return day.isMain && dateForPlanDay(week, day.day) <= today;
}

export interface WeekStats {
  week: PlanWeek;
  days: PlannedDay[];
  statuses: DayStatus[];
  plannedSessions: number;
  completedSessions: number;
  completedDays: number;
  missedDays: number;
  restDays: number;
  lockedDays: number;
  yogaSessions: number;
  exerciseSessions: number;
  exercisesCompleted: number;
  totalMinutes: number;
  freeYoga: number;
  freeExercise: number;
  isComplete: boolean;
  isFinished: boolean; // every main day is decided (completed or missed)
  startDate: string;
  endDate: string;
}

export function weekStats(week: PlanWeek, logs: WorkoutLog[], today = todayISO()): WeekStats {
  const days = planDaysForWeek(week);
  const statuses = days.map((day) => dayStatus(week, day, logs, today));
  const mainDays = days.filter((day) => day.isMain);
  const start = week.startDate;
  const end = weekEndDate(week);

  const planSessions = mainDays.flatMap((day) => completedSessionsForDay(week, day, logs));
  const inRange = (log: WorkoutLog) => log.date >= start && log.date <= end;
  const freeLogs = logs.filter((log) => (log.source ?? "plan") === "free" && inRange(log));

  return {
    week,
    days,
    statuses,
    plannedSessions: mainDays.length,
    completedSessions: planSessions.length,
    completedDays: statuses.filter((s) => s === "completed").length,
    missedDays: statuses.filter((s) => s === "missed").length,
    restDays: statuses.filter((s) => s === "rest").length,
    lockedDays: statuses.filter((s) => s === "locked").length,
    yogaSessions: planSessions.filter((log) => log.kind === "yoga").length,
    exerciseSessions: planSessions.filter((log) => log.kind === "exercise").length,
    exercisesCompleted: planSessions.reduce((sum, log) => sum + (log.posesCompleted ?? 0), 0),
    totalMinutes: planSessions.reduce((sum, log) => sum + log.duration, 0),
    freeYoga: freeLogs.filter((log) => log.kind === "yoga").length,
    freeExercise: freeLogs.filter((log) => log.kind !== "yoga").length,
    isComplete: mainDays.length > 0 && statuses.filter((s) => s === "completed").length === mainDays.length,
    isFinished: statuses.every((s) => s !== "today" && s !== "locked"),
    startDate: start,
    endDate: end,
  };
}

/** Next week starts the day after the current week ends — or today if later. */
export function nextWeekStartDate(weeks: PlanWeek[] | undefined, today = todayISO()): string {
  const list = sortedWeeks(weeks);
  const last = list[list.length - 1];
  if (!last) return today;
  const afterLast = addDays(weekEndDate(last), 1);
  return afterLast > today ? afterLast : today;
}

export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

export function weekRangeLabel(week: PlanWeek): string {
  return `${formatShortDate(week.startDate)} – ${formatShortDate(weekEndDate(week))}`;
}

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function weekdayFor(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAY_SHORT[new Date(y!, (m ?? 1) - 1, d ?? 1).getDay()] ?? "";
}

export interface ProgramStats {
  length: number;
  totalWeeks: number;
  plannedSessions: number;
  completedSessions: number;
  completedDays: number;
  missedDays: number;
  restDays: number;
  lockedDays: number;
  totalMinutes: number;
  isComplete: boolean;
  isOver: boolean;
  endDate: string;
}

/** Progress across the WHOLE program (rest days never count as sessions). */
export function programStats(
  weeks: PlanWeek[],
  week: PlanWeek,
  logs: WorkoutLog[],
  today = todayISO(),
): ProgramStats {
  const list = programWeeksFor(weeks, week).map((w) => weekStats(w, logs, today));
  const total = (k: keyof WeekStats) => list.reduce((s, w) => s + (w[k] as number), 0);
  const plannedSessions = total("plannedSessions");
  const completedDays = total("completedDays");
  const endDate = programEndDate(weeks, week);
  return {
    length: programLengthOf(week),
    totalWeeks: programTotalWeeks(week),
    plannedSessions,
    completedSessions: total("completedSessions"),
    completedDays,
    missedDays: total("missedDays"),
    restDays: total("restDays"),
    lockedDays: total("lockedDays"),
    totalMinutes: total("totalMinutes"),
    isComplete: plannedSessions > 0 && completedDays === plannedSessions,
    isOver: today > endDate,
    endDate,
  };
}
