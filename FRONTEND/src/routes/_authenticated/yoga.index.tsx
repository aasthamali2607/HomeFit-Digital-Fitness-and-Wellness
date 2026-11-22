import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/Layout";
import { Link } from "@/lib/router-compat";
import { YOGA_CATEGORIES } from "@/data/yoga";

export const Route = createFileRoute("/_authenticated/yoga/")({
  head: () => ({
    meta: [
      { title: "Yoga Library — HomeFit" },
      { name: "description", content: "Twelve focused yoga categories with verified poses, Sanskrit names, benefits and precautions." },
      { property: "og:title", content: "Yoga Library — HomeFit" },
      { property: "og:description", content: "Twelve focused yoga categories with verified poses, Sanskrit names, benefits and precautions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: YogaIndex,
});

const ICONS: Record<string, string> = {
  general: "🧘",
  "back-care": "🦴",
  core: "🎯",
  arms: "💪",
  legs: "🦵",
  flexibility: "🤸",
  relaxation: "🌊",
  mind: "🧠",
  weight: "🔥",
  posture: "📏",
  sleep: "🌙",
  morning: "🌅",
};

function YogaIndex() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div
          className="rounded-3xl p-7 sm:p-9 mb-8 text-primary-foreground animate-fade-in-up"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl">Yoga & Mindfulness</h1>
          <p className="text-sm sm:text-base opacity-90 mt-2 max-w-lg">
            Move better, breathe deeper, feel calmer. Choose a focus, then start a guided
            three-stage Abhyas whenever you're ready.
          </p>
          <Link
            to="/practice"
            className="inline-block mt-5 px-6 py-3 rounded-2xl bg-card text-primary font-semibold shadow-sm hover:opacity-90 transition"
          >
            Start Today's Yoga Abhyas →
          </Link>
        </div>

        <h2 className="font-serif text-2xl text-navy mb-4">Choose your focus</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {YOGA_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/yoga/${cat.id}`}
              className={`bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up delay-${Math.min((i % 6) + 1, 6) * 100}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl">
                {ICONS[cat.id] ?? "🧘"}
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{cat.name}</h3>
              <p className="text-xs text-primary mt-0.5">{cat.tagline}</p>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
              <span className="inline-block mt-3 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium">
                {cat.poses.length} poses
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
