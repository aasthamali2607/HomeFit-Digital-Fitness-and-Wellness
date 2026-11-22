import { useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "@/components/Layout";
import GeneratedImage from "@/components/GeneratedImage";
import { useApp } from "@/lib/app-context";
import { todayISO, weekDates, weekdayLabel } from "@/lib/fitness";
import { planSummary } from "@/lib/personalized-plan";
import { programDayNumber, programLengthOf, currentPlanDay, planDaysForWeek } from "@/lib/plan-weeks";
import { exercisesForCategory } from "@/data/exercises";
import { findCategory } from "@/data/yoga";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface PlanMove {
  id: string;
  key: string;
  name: string;
  sub: string;
  detail: string;
  meta: string;
}

function StatCard({ icon, label, value, sub, color = "#4B5FE8" }: {
  icon: string; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#F0F0F5] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg">{icon}</span>
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
      <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#111] leading-none">{value}</p>
      {sub && <p className="text-[11px] text-[#6B7280] mt-1">{sub}</p>}
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-[#F0F0F5] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-[#6B7280]">{label}</span>
    </Link>
  );
}

const RECOMMENDATIONS = [
  { icon: "🧘‍♀️", title: "Morning Yoga", subtitle: "15 min · Beginner", tag: "Yoga", color: "#EEF1FD" },
  { icon: "🔥", title: "Core Blast", subtitle: "20 min · Intermediate", tag: "Core", color: "#FEF3F2" },
  { icon: "🥗", title: "High-Protein Breakfast", subtitle: "420 kcal · 32g protein", tag: "Nutrition", color: "#F0FDF4" },
  { icon: "🌊", title: "Stress Relief Session", subtitle: "10 min · All levels", tag: "Meditation", color: "#F0F9FF" },
];

export default function Dashboard() {
  const { user, onboarding, workoutLogs, currentWeek, streak, bestStreak, updateOnboarding } = useApp();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const today = todayISO();
  const [preview, setPreview] = useState<PlanMove | null>(null);

  // Real, user-specific activity: one calendar date counts once, no matter
  // how many sessions were completed that day.
  const activeDates = useMemo(
    () => new Set(workoutLogs.filter((l) => l.isCompleted !== false).map((l) => l.date)),
    [workoutLogs],
  );
  const hasAnyActivity = activeDates.size > 0;

  const weekRow = useMemo(
    () =>
      weekDates(today).map((date) => ({
        date,
        label: weekdayLabel(date),
        dayNum: Number(date.slice(8, 10)),
        isToday: date === today,
        isFuture: date > today,
        done: activeDates.has(date),
      })),
    [today, activeDates],
  );
  const weekWorkouts = weekRow.filter((d) => d.done).length;

  const totalCals = workoutLogs.reduce((s, l) => s + l.calories, 0);
  const totalMins = workoutLogs.reduce((s, l) => s + l.duration, 0);
  const summary = planSummary(onboarding, workoutLogs);
  const planLogs = workoutLogs.filter((log) => (log.source ?? "plan") === "plan");
  // The plan day comes from the stored plan start date and the real calendar
  // date — never from how many sessions have been completed.
  const calendarDays = currentWeek ? planDaysForWeek(currentWeek) : summary.days;
  const calendarDayNumber = currentWeek ? currentPlanDay(currentWeek) : null;
  const todayPlan =
    (calendarDayNumber ? calendarDays[calendarDayNumber - 1] : undefined) ??
    calendarDays.find((day) => day.isMain) ??
    calendarDays[0]!;
  const programDay = currentWeek
    ? programDayNumber(currentWeek, calendarDayNumber ?? todayPlan.day)
    : (calendarDayNumber ?? todayPlan.day);
  const totalDays = currentWeek ? programLengthOf(currentWeek) : calendarDays.length;

  // The moves shown here are the ones the user's own assigned plan generates
  // for today — never a random selection.
  const todayMoves = useMemo<PlanMove[]>(() => {
    if (!todayPlan.isMain) return [];
    const limit = Math.max(1, todayPlan.activityCount);
    if (todayPlan.kind === "yoga") {
      const cat = findCategory(todayPlan.categoryId);
      return (cat?.poses ?? []).slice(0, limit).map((p) => ({
        id: p.id,
        key: `pose:${p.id}`,
        name: p.name,
        sub: p.sanskrit,
        detail: p.instructions[0] ?? p.breathing,
        meta: `${p.durationSec}s · ${p.level}`,
      }));
    }
    return exercisesForCategory(todayPlan.categoryId).slice(0, limit).map((e) => ({
      id: e.id,
      key: `exercise:${e.id}`,
      name: e.name,
      sub: e.muscle,
      detail: e.cue,
      meta: `${e.durationSec}s · ${e.level}`,
    }));
  }, [todayPlan]);

  const playlist = onboarding.playlist ?? [];
  const togglePlaylist = (id: string) => {
    const next = playlist.includes(id) ? playlist.filter((x) => x !== id) : [...playlist, id];
    void updateOnboarding({ playlist: next });
  };

  const todayAssigned = todayPlan.activityCount;
  const todayCompleted = workoutLogs
    .filter((log) => log.date === today && log.kind === todayPlan.kind && (log.source ?? "plan") === "plan")
    .reduce((sum, log) => sum + (log.posesCompleted ?? 0), 0);
  const todayFocusPct = todayAssigned > 0
    ? Math.min(100, Math.round((todayCompleted / todayAssigned) * 100))
    : 0;
  const yogaLogs = planLogs.filter((log) => log.kind === "yoga");
  const exerciseSessions = planLogs.filter((log) => log.kind === "exercise").length;
  const yogaActivitiesAssigned = summary.mainDays
    .filter((day) => day.kind === "yoga")
    .reduce((sum, day) => sum + day.activityCount, 0);
  const yogaActivitiesCompleted = yogaLogs.reduce((sum, log) => sum + (log.posesCompleted ?? 0), 0);
  const yogaPlanPct = yogaActivitiesAssigned > 0
    ? Math.min(100, Math.round((yogaActivitiesCompleted / yogaActivitiesAssigned) * 100))
    : 0;
  const safeDifficulty = onboarding.fitnessLevel === "Advanced" ? "Intermediate" : onboarding.fitnessLevel ?? "Beginner";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero greeting */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1593811167565-4672e6c8ce4c?w=1200&h=400&fit=crop&auto=format"
            alt="Yoga mat"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(105deg, rgba(16,42,67,0.88) 0%, rgba(75,95,232,0.65) 100%)" }} />
          <div className="relative z-10 p-7 sm:p-10">
            <p className="text-[#DCEEFF] text-sm font-medium mb-2 uppercase tracking-wide">
              {greeting()}, {firstName} 👋
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-white mb-3 leading-snug">
              Ready to move, breathe<br className="hidden sm:block" /> and feel better today?
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {[`${onboarding.workoutDuration ?? 30} min`, safeDifficulty, `${todayAssigned} activities`].map((v) => (
                <span key={v} className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium">{v}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to={todayPlan.isMain ? todayPlan.href : "/plan"}
                className="px-6 py-3 rounded-xl text-white font-semibold text-sm bg-[#4B5FE8] hover:bg-[#3B4ED0] transition-colors shadow-sm">
                Start Today's Workout
              </Link>
              <Link to="/plan"
                className="px-6 py-3 rounded-xl text-white font-semibold text-sm bg-white/15 hover:bg-white/25 transition-colors">
                View Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard
            icon="🔥"
            label="Streak"
            value={hasAnyActivity ? `${streak} Days` : "0 Days"}
            sub={hasAnyActivity ? `Best: ${bestStreak} days` : "Start your first session today"}
            color="#F97316"
          />
          <StatCard icon="📅" label="This Week" value={`${weekWorkouts}/${onboarding.workoutFrequency ?? 4}`} sub="days active" color="#4B5FE8" />
          <StatCard icon="🧘" label="Yoga Plan" value={`${yogaPlanPct}%`} sub="yoga activities only" color="#8B5CF6" />
          <StatCard icon="⏱️" label="Total Time" value={`${totalMins}m`} sub="all time" color="#06B6D4" />
          <StatCard icon="🔥" label="Calories" value={totalCals.toLocaleString()} sub="burned" color="#EF4444" />
          
        </div>

        {/* This week */}
        <div className="bg-white rounded-3xl border border-[#F0F0F5] shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#4B5FE8] uppercase tracking-wide mb-1">This Week</p>
              <h3 className="font-serif text-2xl text-[#111]">Your Week in Motion</h3>
            </div>
            <span className="text-xs text-[#6B7280]">
              {weekWorkouts} active {weekWorkouts === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekRow.map((d) => (
              <div
                key={d.date}
                className={`rounded-2xl py-3 text-center border transition-all ${
                  d.done
                    ? "bg-[#EEF1FD] border-[#4B5FE8]"
                    : d.isToday
                      ? "bg-white border-[#4B5FE8]"
                      : "bg-[#F9F8FF] border-[#F0F0F5]"
                } ${d.isFuture ? "opacity-50" : ""}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">{d.label}</p>
                <p className="text-sm font-bold text-[#111] mt-0.5">{d.dayNum}</p>
                <p className="text-sm mt-1">{d.done ? "✓" : d.isToday ? "●" : "·"}</p>
              </div>
            ))}
          </div>
          {!hasAnyActivity && (
            <p className="text-xs text-[#6B7280] mt-4">Start your first session today</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Today's workout card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#F0F0F5] shadow-sm overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-[#4B5FE8] uppercase tracking-wide mb-1">Today's Focus</p>
                  <h3 className="font-serif text-2xl text-[#111]">{todayPlan.title}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                     style={{ background: "#EEF1FD" }}>🧘‍♀️</div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { l: "Day", v: `${programDay}/${totalDays}` },
                  { l: "Duration", v: `${onboarding.workoutDuration ?? 30} min` },
                  { l: "Difficulty", v: safeDifficulty },
                  { l: "Activities", v: `${todayAssigned} moves` },
                ].map(({ l, v }) => (
                  <div key={l} className="px-3 py-2 rounded-xl bg-[#F9F8FF] border border-[#EEEEF5]">
                    <p className="text-[10px] text-[#6B7280] font-medium uppercase">{l}</p>
                    <p className="text-sm font-semibold text-[#111] mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-[#6B7280] mb-1.5">
                  <span>Today's Completion</span>
                  <span>{todayFocusPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#F0F0F5]">
                  <div className="h-full rounded-full transition-all"
                       style={{ width: `${todayFocusPct}%`, background: "linear-gradient(90deg, #4B5FE8, #3B82F6)" }} />
                </div>
              </div>

              <Link to={todayPlan.isMain ? todayPlan.href : "/plan"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-md active:scale-95"
                style={{ background: "linear-gradient(135deg, #4B5FE8, #3B82F6)" }}>
                <span>{todayPlan.isMain ? "Start Workout" : "View Plan"}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>

          {/* Quick access */}
          <div>
            <h3 className="font-semibold text-[#111] text-sm mb-3 px-1">Quick Access</h3>
            <div className="grid grid-cols-3 gap-2">
              <QuickLink to="/yoga" icon="🧘‍♀️" label="Yoga" />
              <QuickLink to="/exercises" icon="💪" label="Workout" />
              <QuickLink to="/nutrition" icon="🥗" label="Nutrition" />
              <QuickLink to="/progress" icon="📈" label="Progress" />
              <QuickLink to="/exercises" icon="📚" label="Exercises" />
              <QuickLink to="/knowledge" icon="🌿" label="Wellness" />
            </div>
          </div>
        </div>

        {/* Exercise plan */}
        <div className="bg-white rounded-3xl border border-[#F0F0F5] shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#4B5FE8] uppercase tracking-wide mb-1">Exercise Plan</p>
              <h3 className="font-serif text-2xl text-[#111]">{todayPlan.categoryLabel}</h3>
            </div>
            {todayPlan.isMain && (
              <Link to={todayPlan.href}
                className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#4B5FE8] hover:bg-[#3B4ED0] transition-colors">
                Start
              </Link>
            )}
          </div>

          {todayMoves.length === 0 ? (
            <p className="text-sm text-[#6B7280]">
              Today is a rest / recovery day. Your next planned session is waiting in your plan.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {todayMoves.map((move) => (
                <div key={move.key} className="rounded-2xl border border-[#F0F0F5] p-3 flex gap-3 items-center">
                  <GeneratedImage contentKey={move.key} alt={move.name} className="w-14 h-14 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#111] truncate">{move.name}</p>
                    <p className="text-[11px] text-[#6B7280] truncate">{move.sub}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => setPreview(move)}
                        className="text-[11px] font-medium text-[#4B5FE8] hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => togglePlaylist(move.key)}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                          playlist.includes(move.key)
                            ? "bg-[#EEF1FD] border-[#4B5FE8] text-[#4B5FE8]"
                            : "border-[#E5E7EB] text-[#6B7280] hover:border-[#4B5FE8]"
                        }`}
                      >
                        {playlist.includes(move.key) ? "Added ✓" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {playlist.length > 0 && (
            <p className="text-xs text-[#6B7280] mt-4">
              {playlist.length} {playlist.length === 1 ? "move" : "moves"} saved to your workout list.
            </p>
          )}
        </div>

        {/* Recommended for you */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl text-[#111]">Recommended For You</h3>
            <span className="text-xs text-[#4B5FE8] font-medium">
              Based on: {(onboarding.focusAreas ?? ["General Fitness"]).slice(0, 2).join(", ")}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECOMMENDATIONS.map(({ icon, title, subtitle, tag, color }) => (
              <div key={title}
                className="bg-white rounded-2xl p-4 border border-[#F0F0F5] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                     style={{ background: color }}>{icon}</div>
                <p className="font-semibold text-sm text-[#111] mb-0.5">{title}</p>
                <p className="text-xs text-[#6B7280] mb-2">{subtitle}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: color, color: "#4B5FE8" }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation quote */}
        <div className="mt-8 p-6 rounded-3xl text-center"
             style={{ background: "linear-gradient(135deg, #EEF1FD, #DCEEFF)" }}>
          <p className="font-serif text-xl text-[#102A43] italic mb-2">
            "Your body deserves consistency, not perfection."
          </p>
          <p className="text-xs text-[#6B7280]">— HomeFit Philosophy</p>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <GeneratedImage contentKey={preview.key} alt={preview.name} className="w-full h-56" rounded="rounded-none" fit="contain" />
            <div className="p-5">
              <h4 className="font-serif text-xl text-[#111]">{preview.name}</h4>
              <p className="text-xs text-[#6B7280] mb-2">{preview.sub} · {preview.meta}</p>
              <p className="text-sm text-[#6B7280]">{preview.detail}</p>
              <div className="flex gap-2 mt-5">
                {todayPlan.isMain && (
                  <Link to={todayPlan.href} className="flex-1 text-center px-4 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#4B5FE8]">
                    Start session
                  </Link>
                )}
                <button
                  onClick={() => setPreview(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] font-semibold text-sm text-[#6B7280]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
