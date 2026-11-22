export const MILESTONES = [3, 7, 14, 21, 30];

/** Local (not UTC) YYYY-MM-DD for a date. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y!, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + n);
  return toISODate(dt);
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay!, (am ?? 1) - 1, ad ?? 1);
  const db = Date.UTC(by!, (bm ?? 1) - 1, bd ?? 1);
  return Math.round((db - da) / 86400000);
}

/** Sunday of the calendar week that contains `iso` (local dates only). */
export function startOfWeekISO(iso = todayISO()): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y!, (m ?? 1) - 1, d ?? 1);
  return addDays(iso, -dt.getDay());
}

/** The 7 local dates (Sun→Sat) of the calendar week containing `iso`. */
export function weekDates(iso = todayISO()): string[] {
  const start = startOfWeekISO(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Short weekday name for a local YYYY-MM-DD date. */
export function weekdayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAY_LABELS[new Date(y!, (m ?? 1) - 1, d ?? 1).getDay()] ?? "";
}

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Real consecutive-day streak with same-day de-duplication.
 * Counts back from today; if today has no session yet, the streak is still
 * alive when yesterday has one.
 */
export function currentStreak(dates: string[], today = todayISO()): number {
  const unique = new Set(dates);
  if (unique.size === 0) return 0;
  let cursor = unique.has(today) ? today : addDays(today, -1);
  if (!unique.has(cursor)) return 0;
  let streak = 0;
  while (unique.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(dates: string[]): number {
  const sorted = Array.from(new Set(dates)).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
    prev = d;
    if (run > best) best = run;
  }
  return best;
}

export function nextMilestone(streak: number): number | null {
  return MILESTONES.find((m) => m > streak) ?? null;
}

export function reachedMilestone(streak: number): number | null {
  return MILESTONES.includes(streak) ? streak : null;
}

/** MET-based calorie burn from real session duration and body weight. */
export function caloriesFor(minutes: number, weightKg = 62, met = 3.0): number {
  if (minutes <= 0) return 0;
  return Math.round(((met * 3.5 * weightKg) / 200) * minutes);
}

export function bmi(weightKg: number, heightCm: number): number {
  if (!heightCm) return 0;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}
