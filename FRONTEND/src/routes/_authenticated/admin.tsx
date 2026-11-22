import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { apiClient } from "@/lib/api-client";
import { useApp } from "@/lib/app-context";
import { YOGA_CATEGORIES, ALL_POSES } from "@/data/yoga";
import { RECIPES } from "@/data/nutrition";
import { GUIDES, BOOKS } from "@/data/knowledge";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — HomeFit" },
      {
        name: "description",
        content: "Internal dashboard for HomeFit content and community metrics.",
      },
      { property: "og:title", content: "Admin — HomeFit" },
      {
        property: "og:description",
        content: "Internal dashboard for HomeFit content and community metrics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Kind = "pose" | "recipe" | "guide" | "book";

interface Override {
  id: string;
  kind: string;
  slug: string;
  payload: Record<string, unknown>;
  hidden: boolean;
}

const CATALOG: Record<Kind, { id: string; label: string }[]> = {
  pose: ALL_POSES.map((p) => ({ id: p.id, label: `${p.name} (${p.sanskrit})` })),
  recipe: RECIPES.map((r) => ({ id: r.id, label: r.name })),
  guide: GUIDES.map((g) => ({ id: g.id, label: g.title })),
  book: BOOKS.map((b) => ({ id: b.id, label: `${b.title} — ${b.author}` })),
};

function AdminPage() {
  const { isAdmin, loading } = useApp();
  const [metrics, setMetrics] = useState({ members: 0, sessions: 0, minutes: 0, goals: 0 });
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [kind, setKind] = useState<Kind>("pose");
  const [slug, setSlug] = useState(CATALOG.pose[0]?.id ?? "");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [hidden, setHidden] = useState(false);

  const load = useCallback(async () => {
    try {
      const [statsRes, contentRes] = await Promise.all([
        apiClient.admin.stats(),
        apiClient.admin.listContent(),
      ]);
      setMetrics(statsRes.metrics);
      setOverrides(contentRes.overrides as Override[]);
    } catch {
      toast.error("Couldn't load admin data.");
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-muted-foreground">
          Loading…
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-2xl text-navy">Team access only</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This area is reserved for the HomeFit team. If that should be you, ask an existing admin
            to grant you access.
          </p>
        </div>
      </Layout>
    );
  }

  const save = async () => {
    if (!slug) return;
    const payload: Record<string, unknown> = {};
    if (name.trim()) payload["name"] = name.trim();
    if (note.trim()) payload["note"] = note.trim();
    try {
      await apiClient.admin.upsertContent({ kind, slug, payload, hidden });
    } catch {
      toast.error("Couldn't save that change.");
      return;
    }
    toast.success("Content updated");
    setName("");
    setNote("");
    setHidden(false);
    await load();
  };

  const remove = async (id: string) => {
    try {
      await apiClient.admin.removeContent(id);
    } catch {
      toast.error("Couldn't remove that change.");
      return;
    }
    toast.success("Change removed");
    await load();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl text-navy">Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">Community health and content control.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Members", value: metrics.members },
            { label: "Sessions", value: metrics.sessions },
            { label: "Minutes practised", value: metrics.minutes },
            { label: "Active goals", value: metrics.goals },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-card border border-border p-4">
              <p className="font-serif text-2xl text-navy">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <h2 className="font-semibold text-foreground">Content library</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
            <Count label="Yoga categories" value={YOGA_CATEGORIES.length} />
            <Count label="Poses" value={ALL_POSES.length} />
            <Count label="Recipes" value={RECIPES.length} />
            <Count label="Guides & books" value={GUIDES.length + BOOKS.length} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <h2 className="font-semibold text-foreground">Edit or hide an item</h2>
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            <select
              value={kind}
              onChange={(e) => {
                const k = e.target.value as Kind;
                setKind(k);
                setSlug(CATALOG[k][0]?.id ?? "");
              }}
              className="h-11 px-3 rounded-2xl border border-border bg-background"
            >
              <option value="pose">Yoga pose</option>
              <option value="recipe">Recipe</option>
              <option value="guide">Guide</option>
              <option value="book">Book</option>
            </select>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-11 px-3 rounded-2xl border border-border bg-background"
            >
              {CATALOG[kind].map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Replacement title (optional)"
            className="w-full h-11 px-4 mt-2 rounded-2xl border border-border bg-background"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Internal note (optional)"
            className="w-full p-4 mt-2 rounded-2xl border border-border bg-background resize-none"
          />
          <label className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
            Hide this item from members
          </label>
          <button
            onClick={() => void save()}
            className="mt-3 px-5 h-11 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Save change
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <h2 className="font-semibold text-foreground">Saved changes</h2>
          {overrides.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">No content changes yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {overrides.map((o) => (
                <li
                  key={o.id}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-muted p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {o.kind} · {o.slug} {o.hidden && "· hidden"}
                    </p>
                    <p className="text-xs text-muted-foreground">{JSON.stringify(o.payload)}</p>
                  </div>
                  <button
                    onClick={() => void remove(o.id)}
                    className="text-xs text-destructive shrink-0"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <p className="font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
