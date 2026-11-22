import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import HomeFitLogo from "@/components/HomeFitLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HomeFit — Your Calm Daily Wellness Practice" },
      {
        name: "description",
        content:
          "Guided yoga, honest streaks, nourishing recipes and wellness guides. Build a home routine that actually lasts.",
      },
      { property: "og:title", content: "HomeFit — Your Calm Daily Wellness Practice" },
      {
        property: "og:description",
        content:
          "Guided yoga, honest streaks, nourishing recipes and wellness guides. Build a home routine that actually lasts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const HIGHLIGHTS = [
  { icon: "🧘", title: "Guided Yoga Abhyas", text: "Warm-up, focused practice and cool-down — timed and guided." },
  { icon: "🔥", title: "Honest Streaks", text: "Real consecutive days. No sample data, no shortcuts." },
  { icon: "🥗", title: "Nourishing Recipes", text: "Drinks to dinner, vegetarian and non-vegetarian." },
  { icon: "📖", title: "Knowledge Hub", text: "Foundational guides and books worth your time." },
];

function Splash() {
  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <HomeFitLogo className="h-12 w-auto max-w-36" />
        <Link
          to="/auth"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8">
        <section className="py-14 sm:py-24 text-center animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide">
            Yoga · Nutrition · Mindful progress
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-navy mt-6 leading-tight">
            A calmer, stronger you —
            <br className="hidden sm:block" /> practised at home.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            HomeFit builds one honest daily practice: guided yoga, real streaks you actually
            earned, food that nourishes, and knowledge that keeps you going.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth"
              className="px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition"
            >
              Start your journey
            </Link>
            <Link
              to="/auth"
              className="px-7 py-3.5 rounded-2xl bg-card border border-border text-foreground font-semibold hover:border-primary transition"
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className={`bg-card rounded-2xl p-5 border border-border shadow-sm animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-xl">
                {h.icon}
              </div>
              <h2 className="mt-4 font-semibold text-foreground">{h.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
