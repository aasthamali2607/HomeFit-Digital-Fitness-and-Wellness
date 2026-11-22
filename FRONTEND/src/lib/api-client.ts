// Thin fetch wrapper around the HomeFit backend REST API
// (backend/, Express + MySQL). Replaces the previous Supabase client.
//
// The auth token is a JWT issued by POST /api/auth/login or
// /api/auth/register. It is kept in localStorage so the session
// survives a page refresh, and attached to every request as
// `Authorization: Bearer <token>`.

const API_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:5000";

const TOKEN_KEY = "homefit_token";

// Fired on window whenever the signed-in state changes (login,
// register, logout, or a token that turned out to be invalid) so the
// root route can invalidate the router / query cache — the same role
// Supabase's onAuthStateChange used to play.
export const AUTH_CHANGE_EVENT = "homefit:auth-change";

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, init);

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // no JSON body (e.g. 204) — fine
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      // The token is missing/expired/invalid — clear it and let the
      // rest of the app react to being signed out.
      setToken(null);
      dispatchAuthChange();
    }
    const message =
      (json as { message?: string } | null)?.message || `Request failed (${res.status})`;
    throw new ApiRequestError(res.status, message);
  }

  return json as T;
}

export interface PublicUser {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "user" | "admin";
}

export interface WorkoutLogRow {
  id: string;
  log_date: string;
  name: string;
  kind: string;
  category_id: string | null;
  duration_min: number;
  calories: number;
  poses_completed: number;
  source: "plan" | "free";
  plan_day: number | null;
  is_completed: boolean;
}

export interface GoalRow {
  id: string;
  title: string;
  description: string;
  target_days: number;
  start_date: string;
  archived: boolean;
}

export interface GoalCheckinRow {
  goal_id: string;
  check_date: string;
}

export interface NoteRow {
  id: string;
  note_date: string;
  title: string;
  body: string;
  mood: string | null;
}

export interface ContentOverrideRow {
  id: string;
  kind: string;
  slug: string;
  payload: Record<string, unknown>;
  hidden: boolean;
}

export const apiClient = {
  getToken,

  auth: {
    async register(input: { name: string; email: string; password: string }) {
      const data = await request<{ token: string; user: PublicUser }>("/api/auth/register", {
        method: "POST",
        body: input,
        auth: false,
      });
      setToken(data.token);
      dispatchAuthChange();
      return data.user;
    },
    async login(input: { identifier: string; password: string }) {
      const data = await request<{ token: string; user: PublicUser }>("/api/auth/login", {
        method: "POST",
        body: input,
        auth: false,
      });
      setToken(data.token);
      dispatchAuthChange();
      return data.user;
    },
    async logout() {
      try {
        await request("/api/auth/logout", { method: "POST" });
      } finally {
        setToken(null);
        dispatchAuthChange();
      }
    },
    async me(): Promise<PublicUser | null> {
      if (!getToken()) return null;
      try {
        const data = await request<{ user: PublicUser }>("/api/auth/me");
        return data.user;
      } catch {
        return null;
      }
    },
  },

  profile: {
    update: (name: string) =>
      request<{ user: PublicUser }>("/api/user/profile", { method: "PUT", body: { name } }),
  },

  onboarding: {
    get: () =>
      request<{ data: Record<string, unknown>; completed: boolean }>("/api/user/onboarding"),
    save: (data: Record<string, unknown>, completed: boolean) =>
      request("/api/user/onboarding", { method: "PUT", body: { data, completed } }),
  },

  workouts: {
    list: () => request<{ logs: WorkoutLogRow[] }>("/api/user/workouts"),
    create: (input: {
      date: string;
      name: string;
      duration: number;
      calories: number;
      kind?: string;
      categoryId?: string | null;
      posesCompleted?: number;
      source?: "plan" | "free";
      planDay?: number | null;
      isCompleted?: boolean;
    }) => request<{ id: string }>("/api/user/workouts", { method: "POST", body: input }),
  },

  goals: {
    list: () => request<{ goals: GoalRow[]; checkins: GoalCheckinRow[] }>("/api/user/goals"),
    create: (input: {
      title: string;
      description: string;
      targetDays: number;
      startDate: string;
    }) => request<{ id: string }>("/api/user/goals", { method: "POST", body: input }),
    remove: (id: string) => request(`/api/user/goals/${id}`, { method: "DELETE" }),
    checkin: (goalId: string, date: string) =>
      request(`/api/user/goals/${goalId}/checkins`, { method: "POST", body: { date } }),
    uncheckin: (goalId: string, date: string) =>
      request(`/api/user/goals/${goalId}/checkins?date=${encodeURIComponent(date)}`, {
        method: "DELETE",
      }),
  },

  notes: {
    list: () => request<{ notes: NoteRow[] }>("/api/user/notes"),
    create: (input: { date: string; title: string; body: string; mood?: string | null }) =>
      request<{ id: string }>("/api/user/notes", { method: "POST", body: input }),
    update: (id: string, input: { title: string; body: string; mood?: string | null }) =>
      request(`/api/user/notes/${id}`, { method: "PUT", body: input }),
    remove: (id: string) => request(`/api/user/notes/${id}`, { method: "DELETE" }),
  },

  admin: {
    stats: () =>
      request<{ metrics: { members: number; sessions: number; minutes: number; goals: number } }>(
        "/api/admin/stats",
      ),
    listContent: () => request<{ overrides: ContentOverrideRow[] }>("/api/admin/content"),
    upsertContent: (input: {
      kind: string;
      slug: string;
      payload: Record<string, unknown>;
      hidden: boolean;
    }) => request("/api/admin/content", { method: "PUT", body: input }),
    removeContent: (id: string) => request(`/api/admin/content/${id}`, { method: "DELETE" }),
  },
};
