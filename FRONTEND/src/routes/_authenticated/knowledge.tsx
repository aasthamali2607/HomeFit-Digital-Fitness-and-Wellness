import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Layout from "@/components/Layout";
import { BOOK_IMAGES } from "@/assets/books";
import { Link } from "@/lib/router-compat";
import { BOOKS, GUIDES, type Guide } from "@/data/knowledge";

export const Route = createFileRoute("/_authenticated/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Hub — HomeFit" },
      { name: "description", content: "Seven foundational wellness guides and five books worth reading for a lasting home practice." },
      { property: "og:title", content: "Knowledge Hub — HomeFit" },
      { property: "og:description", content: "Seven foundational wellness guides and five books worth reading for a lasting home practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KnowledgePage,
});

const ICONS: Record<Guide["icon"], string> = {
  sleep: "🌙",
  breath: "🌬️",
  nutrition: "🥗",
  movement: "🏃",
  mind: "🧠",
  recovery: "🛌",
  habit: "🔁",
};

function KnowledgePage() {
  const [open, setOpen] = useState<Guide | null>(null);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl text-navy">Knowledge Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">
          The why behind the practice — read a little, apply a lot.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {GUIDES.map((g) => (
            <button
              key={g.id}
              onClick={() => setOpen(g)}
              className="text-left bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl">
                {ICONS[g.icon]}
              </div>
              <h2 className="mt-4 font-semibold text-foreground">{g.title}</h2>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{g.subtitle}</p>
              <span className="inline-block mt-3 text-[11px] font-medium text-primary">
                {g.readMin} min read →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-card border border-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl text-navy">Your Future Self</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Set a 30-day goal and tick off each day you show up.
              </p>
            </div>
            <Link
              to="/goals"
              className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              Open goal tracker
            </Link>
          </div>
        </div>

        <h2 className="font-serif text-2xl text-navy mt-12 mb-4">Books we recommend</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BOOKS.map((b) => (
            <article key={b.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <img
                src={BOOK_IMAGES[b.id]}
                alt={`${b.title} book cover`}
                loading="lazy"
                width={1024}
                height={768}
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {b.author} · {b.year}
                </p>
                <p className="text-sm text-muted-foreground mt-3">{b.about}</p>
                <p className="text-sm text-navy mt-3">
                  <span className="font-semibold">Why read it: </span>
                  {b.whyRead}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {b.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && <GuideModal guide={open} onClose={() => setOpen(null)} />}
    </Layout>
  );
}

function GuideModal({ guide, onClose }: { guide: Guide; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl text-navy">{guide.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{guide.subtitle}</p>
            <p className="text-xs text-primary mt-1">{guide.readMin} min read</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted text-muted-foreground shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {guide.sections.map((s) => (
          <section key={s.heading} className="mt-7">
            <h3 className="font-semibold text-lg text-navy">{s.heading}</h3>
            {s.body.map((p) => (
              <p key={p} className="text-sm text-muted-foreground leading-relaxed mt-2">
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-8 rounded-2xl bg-muted p-5">
          <h3 className="text-xs font-bold uppercase tracking-wide text-navy">Takeaways</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm text-muted-foreground">
            {guide.takeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
