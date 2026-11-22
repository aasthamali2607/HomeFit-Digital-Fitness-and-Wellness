import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { apiClient } from "@/lib/api-client";
import { useApp } from "@/lib/app-context";
import { formatLongDate, todayISO, toISODate } from "@/lib/fitness";
import {
  currentPlanDay,
  programDayNumber,
  programLengthOf,
  programTotalWeeks,
  programWeekOf,
  weekStats,
} from "@/lib/plan-weeks";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress — HomeFit" },
      {
        name: "description",
        content: "Real streaks, a real calendar, and your own motivation notes — nothing invented.",
      },
      { property: "og:title", content: "Your Progress — HomeFit" },
      {
        property: "og:description",
        content: "Real streaks, a real calendar, and your own motivation notes — nothing invented.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProgressPage,
});

interface Note {
  id: string;
  note_date: string;
  title: string;
  body: string;
  mood: string | null;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MOODS = ["🌱 Calm", "🔥 Strong", "😌 Light", "😮‍💨 Tired", "💛 Grateful"];

function ProgressPage() {
  const { workoutLogs, streak, bestStreak, session, currentWeek } = useApp();
  const uid = session?.user?.id;

  const [notes, setNotes] = useState<Note[]>([]);
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    if (!uid) return;
    try {
      const { notes: rows } = await apiClient.notes.list();
      setNotes(rows);
    } catch {
      toast.error("Couldn't load your notes.");
    }
  }, [uid]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const logDates = useMemo(() => new Set(workoutLogs.map((l) => l.date)), [workoutLogs]);
  const noteDates = useMemo(() => new Set(notes.map((n) => n.note_date)), [notes]);

  const totals = useMemo(
    () => ({
      sessions: workoutLogs.filter((log) => log.kind === "exercise").length,
      minutes: workoutLogs.reduce((s, l) => s + l.duration, 0),
      calories: workoutLogs.reduce((s, l) => s + l.calories, 0),
    }),
    [workoutLogs],
  );

  const planStats = useMemo(
    () => (currentWeek ? weekStats(currentWeek, workoutLogs) : null),
    [currentWeek, workoutLogs],
  );
  const freeLogs = useMemo(
    () => workoutLogs.filter((log) => (log.source ?? "plan") === "free"),
    [workoutLogs],
  );
  const freeYoga = freeLogs.filter((log) => log.kind === "yoga").length;
  const freeExercise = freeLogs.length - freeYoga;
  const posesCompleted = workoutLogs
    .filter((log) => log.kind === "yoga")
    .reduce((sum, log) => sum + (log.posesCompleted ?? 0), 0);
  const exercisesCompleted = workoutLogs
    .filter((log) => log.kind !== "yoga")
    .reduce((sum, log) => sum + (log.posesCompleted ?? 0), 0);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();


  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl text-navy">Your Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Every number here comes from a session you actually practised.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <Stat label="Current streak" value={`${streak}d`} accent />
          <Stat label="Best streak" value={`${bestStreak}d`} />
          <Stat label="Exercise sessions" value={String(totals.sessions)} />
          <Stat label="Minutes" value={String(totals.minutes)} />
        </div>

        {planStats && (
          <div className="mt-6 rounded-3xl bg-card border border-border p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">
                Plan — week {programWeekOf(planStats.week)} of {programTotalWeeks(planStats.week)}
              </h2>
              <span className="text-xs text-muted-foreground">
                {currentPlanDay(planStats.week)
                  ? `Day ${programDayNumber(planStats.week, currentPlanDay(planStats.week)!)} of ${programLengthOf(planStats.week)}`
                  : "Week finished"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <Stat
                label="Planned sessions done"
                value={`${planStats.completedSessions}/${planStats.plannedSessions}`}
              />
              <Stat label="Planned days completed" value={String(planStats.completedDays)} />
              <Stat label="Missed days" value={String(planStats.missedDays)} />
              <Stat label="Rest / recovery days" value={String(planStats.restDays)} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <Stat label="Free yoga practices" value={String(freeYoga)} />
              <Stat label="Free exercise practices" value={String(freeExercise)} />
              <Stat label="Yoga poses" value={String(posesCompleted)} />
              <Stat label="Individual exercises" value={String(exercisesCompleted)} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Free library practice is tracked on its own and never completes a planned day.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground">
            Total energy burned: {totals.calories} kcal
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="w-9 h-9 rounded-full bg-muted text-muted-foreground"
              aria-label="Previous month"
            >
              ‹
            </button>
            <h2 className="font-semibold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="w-9 h-9 rounded-full bg-muted text-muted-foreground"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-4 text-center text-[11px] text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={`${d}${i}`}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const iso = toISODate(new Date(year, month, i + 1));
              const practised = logDates.has(iso);
              const noted = noteDates.has(iso);
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(iso)}
                  className={`aspect-square rounded-xl text-sm flex flex-col items-center justify-center transition ${
                    practised
                      ? "bg-primary text-primary-foreground font-semibold"
                      : iso === today
                        ? "bg-secondary text-secondary-foreground font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {i + 1}
                  {noted && <span className="text-[8px] leading-none mt-0.5">✎</span>}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Tap any day to see what you did and write a motivation note.
          </p>
        </div>
      </div>

      {selected && (
        <DayModal
          date={selected}
          uid={uid}
          notes={notes.filter((n) => n.note_date === selected)}
          logs={workoutLogs.filter((l) => l.date === selected)}
          onClose={() => setSelected(null)}
          onChanged={loadNotes}
        />
      )}
    </Layout>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        accent ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border"
      }`}
    >
      <p className="font-serif text-2xl">{value}</p>
      <p className={`text-xs mt-0.5 ${accent ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
    </div>
  );
}

function DayModal({
  date,
  uid,
  notes,
  logs,
  onClose,
  onChanged,
}: {
  date: string;
  uid: string | undefined;
  notes: Note[];
  logs: { name: string; duration: number; calories: number; source?: "plan" | "free"; planDay?: number | null }[];
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState(MOODS[0]!);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEditing(null);
    setTitle("");
    setBody("");
    setMood(MOODS[0]!);
  };

  const save = async () => {
    if (!uid || !body.trim()) {
      toast.error("Write a few words first.");
      return;
    }
    setBusy(true);
    const payload = { title: title.trim(), body: body.trim(), mood };
    try {
      if (editing) {
        await apiClient.notes.update(editing, payload);
      } else {
        await apiClient.notes.create({ ...payload, date });
      }
    } catch {
      setBusy(false);
      toast.error("Couldn't save your note.");
      return;
    }
    setBusy(false);
    toast.success(editing ? "Note updated" : "Note saved");
    reset();
    await onChanged();
  };

  const remove = async (id: string) => {
    try {
      await apiClient.notes.remove(id);
    } catch {
      toast.error("Couldn't delete that note.");
      return;
    }
    toast.success("Note deleted");
    if (editing === id) reset();
    await onChanged();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl text-navy">{formatLongDate(date)}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted text-muted-foreground shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wide text-navy mt-6">Practice</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">No session logged on this day.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {logs.map((l, i) => (
              <li key={i} className="rounded-2xl bg-muted p-3">
                <p className="text-sm font-medium text-foreground">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.duration} min · {l.calories} kcal · {l.source === "plan" ? `Plan day ${l.planDay ?? ""}` : "Free practice"}
                </p>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-xs font-bold uppercase tracking-wide text-navy mt-6">
          Motivation notes
        </h3>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">Nothing written yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-2xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {n.title && <p className="text-sm font-semibold text-foreground">{n.title}</p>}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
                    {n.mood && <p className="text-xs text-primary mt-1">{n.mood}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditing(n.id);
                        setTitle(n.title);
                        setBody(n.body);
                        setMood(n.mood ?? MOODS[0]!);
                      }}
                      className="px-2 py-1 rounded-lg bg-muted text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void remove(n.id)}
                      className="px-2 py-1 rounded-lg bg-muted text-xs text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full h-11 px-4 rounded-2xl border border-border bg-background outline-none focus:border-primary"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="How did today feel? What keeps you going?"
            className="w-full p-4 rounded-2xl border border-border bg-background outline-none focus:border-primary resize-none"
          />
          <div className="flex gap-1.5 flex-wrap">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  mood === m
                    ? "bg-secondary text-secondary-foreground border-transparent"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => void save()}
              disabled={busy}
              className="flex-1 h-11 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-60"
            >
              {editing ? "Update note" : "Save note"}
            </button>
            {editing && (
              <button onClick={reset} className="px-5 h-11 rounded-2xl border border-border">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
