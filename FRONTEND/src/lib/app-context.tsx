import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { apiClient, AUTH_CHANGE_EVENT, type PublicUser } from "@/lib/api-client";
import { caloriesFor, currentStreak, longestStreak, todayISO } from "@/lib/fitness";
import {
  activeWeek,
  normalizeProgramLength,
  prefsFromOnboarding,
  sortedWeeks,
  startProgram,
  type PlanPrefs,
  type PlanWeek,
} from "@/lib/plan-weeks";


export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Kept shaped like { user: { id, email } } so the rest of the app
// (which previously read `session?.user?.id` from Supabase) needs no
// further changes. `id` here is the permanent User ID (USR000001…).
export interface AppSession {
  user: { id: string; email: string };
}

export interface OnboardingData {
  motivations: string[];
  goal: string;
  focusAreas: string[];
  age: number;
  gender: string;
  height: number;
  weight: number;
  bodyType: string;
  fitnessLevel: string;
  workoutLocation: string;
  healthConditions: string[];
  activityLevel: string;
  stressLevel: string;
  workoutDuration: number;
  workoutFrequency: number;
  equipment: string[];
  programLength: number;
  planWeeks: PlanWeek[];
  /** Exercises the user added to their own workout list (persisted per user). */
  playlist: string[];
  completed: boolean;
}


export interface WorkoutLog {
  id?: string;
  date: string;
  duration: number;
  calories: number;
  name: string;
  kind?: string;
  categoryId?: string | null;
  posesCompleted?: number;
  source?: "plan" | "free";
  planDay?: number | null;
  isCompleted?: boolean;
}

export const DEFAULT_ONBOARDING: Partial<OnboardingData> = {
  motivations: [],
  focusAreas: [],
  healthConditions: [],
  equipment: ["Yoga mat"],
  age: 28,
  height: 165,
  weight: 62,
  gender: "",
  bodyType: "",
  fitnessLevel: "",
  goal: "",
  workoutLocation: "",
  activityLevel: "",
  stressLevel: "",
  workoutDuration: 30,
  workoutFrequency: 4,
  programLength: 30,
  planWeeks: [],
  playlist: [],
  completed: false,
};

interface AppContextType {
  loading: boolean;
  session: AppSession | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onboarding: Partial<OnboardingData>;
  workoutLogs: WorkoutLog[];
  streak: number;
  bestStreak: number;
  /** Every plan week ever created (grouped into 7/14/21/30-day programs), oldest first. Never overwritten. */
  planWeeks: PlanWeek[];
  /** The week containing today, or the latest one if today is past its end. */
  currentWeek: PlanWeek | null;
  startNewWeek: (prefs?: PlanPrefs) => Promise<void>;
  logout: () => Promise<void>;
  updateOnboarding: (data: Partial<OnboardingData>) => Promise<void>;
  logWorkout: (log: Omit<WorkoutLog, "calories"> & { calories?: number }) => Promise<void>;
  refresh: () => Promise<void>;

}

const AppContext = createContext<AppContextType | null>(null);

function toSession(u: PublicUser | null): AppSession | null {
  if (!u) return null;
  return { user: { id: u.user_id, email: u.email } };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [onboarding, setOnboarding] = useState<Partial<OnboardingData>>(DEFAULT_ONBOARDING);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  const loadAll = useCallback(async (publicUser: PublicUser) => {
    const [onboardingRes, logsRes] = await Promise.all([
      apiClient.onboarding.get(),
      apiClient.workouts.list(),
    ]);

    setUser({
      id: publicUser.user_id,
      name: publicUser.name,
      email: publicUser.email,
    });
    setIsAdmin(publicUser.role === "admin");
    setOnboarding({
      ...DEFAULT_ONBOARDING,
      ...((onboardingRes.data as Partial<OnboardingData>) ?? {}),
      completed: onboardingRes.completed ?? false,
    });
    setWorkoutLogs(
      logsRes.logs.map((l) => ({
        id: l.id,
        date: l.log_date,
        duration: l.duration_min,
        calories: l.calories,
        name: l.name,
        kind: l.kind,
        categoryId: l.category_id,
        posesCompleted: l.poses_completed,
        source: l.source,
        planDay: l.plan_day,
        isCompleted: Boolean(l.is_completed),
      })),
    );
  }, []);

  const bootstrap = useCallback(async () => {
    const publicUser = await apiClient.auth.me();
    setSession(toSession(publicUser));
    if (publicUser) {
      await loadAll(publicUser);
    } else {
      setUser(null);
      setIsAdmin(false);
      setOnboarding(DEFAULT_ONBOARDING);
      setWorkoutLogs([]);
    }
  }, [loadAll]);

  useEffect(() => {
    let active = true;

    const onAuthChange = () => {
      if (!active) return;
      setLoading(true);
      bootstrap().finally(() => {
        if (active) setLoading(false);
      });
    };

    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);

    bootstrap().finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    };
  }, [bootstrap]);

  const refresh = useCallback(async () => {
    const publicUser = await apiClient.auth.me();
    if (publicUser) await loadAll(publicUser);
  }, [loadAll]);

  const updateOnboarding = useCallback(
    async (data: Partial<OnboardingData>) => {
      setOnboarding((prev) => {
        const next = { ...prev, ...data };
        if (session?.user?.id) {
          const { completed, ...rest } = next;
          void apiClient.onboarding.save(rest, completed ?? false);
        }
        return next;
      });
    },
    [session],
  );

  const logWorkout = useCallback(
    async (log: Omit<WorkoutLog, "calories"> & { calories?: number }) => {
      if (!session?.user?.id) return;
      const calories = log.calories ?? caloriesFor(log.duration, onboarding.weight ?? 62);
      const { id } = await apiClient.workouts.create({
        date: log.date,
        name: log.name,
        kind: log.kind ?? "yoga",
        categoryId: log.categoryId ?? null,
        duration: log.duration,
        calories,
        posesCompleted: log.posesCompleted ?? 0,
        source: log.source ?? "free",
        planDay: log.planDay ?? null,
        isCompleted: log.isCompleted ?? true,
      });
      setWorkoutLogs((prev) => [{ ...log, calories, id }, ...prev]);
    },
    [session, onboarding.weight],
  );

  const logout = useCallback(async () => {
    await apiClient.auth.logout();
    setUser(null);
    setSession(null);
  }, []);

  const planWeeks = useMemo(() => sortedWeeks(onboarding.planWeeks), [onboarding.planWeeks]);
  const currentWeek = useMemo(() => activeWeek(planWeeks), [planWeeks]);

  /**
   * Starts a new program (all its weeks, dated from today). Previous weeks are never overwritten or
   * deleted — they stay in history exactly as they were lived.
   */
  const startNewWeek = useCallback(
    async (prefs?: PlanPrefs) => {
      // Creates the WHOLE program (7/14/21/30 days) starting today.
      await updateOnboarding({
        planWeeks: startProgram(
          onboarding.planWeeks,
          normalizeProgramLength(onboarding.programLength),
          prefs ?? prefsFromOnboarding(onboarding),
        ),
      });
    },
    [onboarding, updateOnboarding],
  );

  // Week 1 is created once, on the real local date the plan first exists.
  // It is never recreated on refresh, login/logout or workout completion.
  const seeding = useRef(false);
  useEffect(() => {
    if (loading || !session?.user?.id) return;
    if (!onboarding.completed) return;
    if ((onboarding.planWeeks ?? []).length > 0) return;
    if (seeding.current) return;
    seeding.current = true;
    void updateOnboarding({
      planWeeks: startProgram(
        [],
        normalizeProgramLength(onboarding.programLength),
        prefsFromOnboarding(onboarding),
      ),
    });
  }, [loading, session, onboarding, updateOnboarding]);

  const dates = useMemo(() => workoutLogs.map((l) => l.date), [workoutLogs]);

  const value = useMemo<AppContextType>(
    () => ({
      loading,
      session,
      user,
      isAuthenticated: !!session?.user,
      isAdmin,
      onboarding,
      workoutLogs,
      streak: currentStreak(dates, todayISO()),
      bestStreak: longestStreak(dates),
      planWeeks,
      currentWeek,
      startNewWeek,
      logout,
      updateOnboarding,
      logWorkout,
      refresh,
    }),
    [
      loading,
      session,
      user,
      isAdmin,
      onboarding,
      workoutLogs,
      dates,
      planWeeks,
      currentWeek,
      startNewWeek,
      logout,
      updateOnboarding,
      logWorkout,
      refresh,
    ],
  );


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
