import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { apiClient } from "@/lib/api-client";
import { useApp } from "@/lib/app-context";
import { todayISO } from "@/lib/fitness";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Your Future Self — HomeFit" },
      {
        name: "description",
        content:
          "Set a 30-day goal, check in each day you show up, and watch the person you're becoming.",
      },
      { property: "og:title", content: "Your Future Self — HomeFit" },
      {
        property: "og:description",
        content:
          "Set a 30-day goal, check in each day you show up, and watch the person you're becoming.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GoalsPage,
});

interface Goal {
  id: string;
  title: string;
  description: string;
  target_days: number;
  start_date: string;
  archived: boolean;
}

function GoalsPage() {
  const { session } = useApp();
  const uid = session?.user?.id;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkins, setCheckins] = useState<Record<string, string[]>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDays, setTargetDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const today = todayISO();

  const load = useCallback(async () => {
    if (!uid) return;
    try {
      const { goals: g, checkins: c } = await apiClient.goals.list();
      setGoals(g);
      const map: Record<string, string[]> = {};
      for (const row of c) {
        (map[row.goal_id] ??= []).push(row.check_date);
      }
      setCheckins(map);
    } catch {
      toast.error("Couldn't load your goals.");
    }
  }, [uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    if (!uid || !title.trim()) {
      toast.error("Give your goal a name first.");
      return;
    }
    setBusy(true);
    try {
      await apiClient.goals.create({
        title: title.trim(),
        description: description.trim(),
        targetDays,
        startDate: today,
      });
    } catch {
      setBusy(false);
      toast.error("Couldn't create that goal.");
      return;
    }
    setBusy(false);
    setTitle("");
    setDescription("");
    toast.success("Goal created — day one starts now.");
    await load();
  };

  const toggleToday = async (goal: Goal) => {
    if (!uid) return;
    const done = (checkins[goal.id] ?? []).includes(today);
    try {
      if (done) {
        await apiClient.goals.uncheckin(goal.id, today);
      } else {
        await apiClient.goals.checkin(goal.id, today);
      }
    } catch {
      toast.error("Couldn't update today's check-in.");
      return;
    }
    await load();
  };

  const remove = async (id: string) => {
    try {
      await apiClient.goals.remove(id);
    } catch {
      toast.error("Couldn't delete that goal.");
      return;
    }
    toast.success("Goal removed");
    await load();
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl text-navy">Your Future Self</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Small promises, kept daily. Choose one and check in each day you keep it.
        </p>

        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <h2 className="font-semibold text-foreground">Set a new goal</h2>
          <div className="mt-3 space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Practise yoga every morning"
              className="w-full h-11 px-4 rounded-2xl border border-border bg-background outline-none focus:border-primary"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Why does this matter to you?"
              className="w-full p-4 rounded-2xl border border-border bg-background outline-none focus:border-primary resize-none"
            />
            <div className="flex items-center gap-2">
              {[21, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetDays(d)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                    targetDays === d
                      ? "bg-secondary text-secondary-foreground border-transparent"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {d} days
                </button>
              ))}
              <button
                onClick={() => void create()}
                disabled={busy}
                className="ml-auto px-5 h-10 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60"
              >
                Create goal
              </button>
            </div>
          </div>
        </div>

        {goals.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No goals yet. The first one is always the hardest to write — and the easiest to start.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {goals.map((g) => {
              const days = checkins[g.id] ?? [];
              const doneToday = days.includes(today);
              const pct = Math.min(100, Math.round((days.length / g.target_days) * 100));
              return (
                <article key={g.id} className="rounded-3xl bg-card border border-border p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{g.title}</h3>
                      {g.description && (
                        <p className="text-sm text-muted-foreground mt-1">{g.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => void remove(g.id)}
                      className="text-xs text-destructive shrink-0"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <span>
                      {days.length} of {g.target_days} days
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-10 gap-1 mt-4">
                    {Array.from({ length: g.target_days }).map((_, i) => (
                      <span
                        key={i}
                        className={`aspect-square rounded-md ${
                          i < days.length ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => void toggleToday(g)}
                    className={`w-full h-11 rounded-2xl font-semibold mt-4 ${
                      doneToday
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {doneToday ? "✓ Checked in today — undo" : "Check in for today"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
