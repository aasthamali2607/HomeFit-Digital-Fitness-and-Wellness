import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useNavigate, Link } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";
import HomeFitLogo from "@/components/HomeFitLogo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HomeFit" },
      {
        name: "description",
        content: "Sign in or create your HomeFit account to start your daily practice.",
      },
      { property: "og:title", content: "Sign in — HomeFit" },
      {
        property: "og:description",
        content: "Sign in or create your HomeFit account to start your daily practice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, onboarding, loading } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(onboarding.completed ? "/dashboard" : "/onboarding", { replace: true });
    }
  }, [loading, isAuthenticated, onboarding.completed, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        await apiClient.auth.register({
          name: name.trim() || email.split("@")[0] || "Friend",
          email,
          password,
        });
        toast.success("Welcome to HomeFit!");
      } else {
        await apiClient.auth.login({ identifier, password });
        toast.success("Welcome back!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="max-w-6xl w-full mx-auto px-5 sm:px-8 h-16 flex items-center">
        <Link to="/" aria-label="HomeFit home">
          <HomeFitLogo className="h-12 w-auto max-w-36" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-sm p-7 animate-fade-in-up">
          <h1 className="font-serif text-3xl text-navy">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup"
              ? "A few details and your practice begins."
              : "Pick up right where you left off."}
          </p>

          <form onSubmit={submit} className="space-y-3 mt-6">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-12 px-4 rounded-2xl border border-border bg-background outline-none focus:border-primary transition"
              />
            )}
            {mode === "signup" ? (
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-12 px-4 rounded-2xl border border-border bg-background outline-none focus:border-primary transition"
              />
            ) : (
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or User ID (e.g. USR000001)"
                className="w-full h-12 px-4 rounded-2xl border border-border bg-background outline-none focus:border-primary transition"
              />
            )}
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full h-12 px-4 rounded-2xl border border-border bg-background outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-muted-foreground">
            {mode === "signup" ? "Already with us?" : "New to HomeFit?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
