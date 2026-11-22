import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Link } from "@/lib/router-compat";
import GeneratedImage from "@/components/GeneratedImage";
import { findCategory, type YogaPose } from "@/data/yoga";

export const Route = createFileRoute("/_authenticated/yoga/$category")({
  loader: ({ params }) => {
    const category = findCategory(params.category);
    if (!category) throw notFound();
    return { name: category.name, tagline: category.tagline };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} Yoga — HomeFit` : "Yoga — HomeFit" },
      { name: "description", content: loaderData?.tagline ?? "A focused set of yoga poses." },
      { property: "og:title", content: loaderData ? `${loaderData.name} Yoga — HomeFit` : "Yoga — HomeFit" },
      { property: "og:description", content: loaderData?.tagline ?? "A focused set of yoga poses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CategoryPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center" role="alert">
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl text-navy">That focus doesn't exist</h1>
        <Link to="/yoga" className="text-primary mt-3 inline-block hover:underline">
          Back to the yoga library
        </Link>
      </div>
    </Layout>
  ),
});

function CategoryPage() {
  const { category: categoryId } = Route.useParams();
  const category = findCategory(categoryId)!;
  const [open, setOpen] = useState<YogaPose | null>(null);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/yoga" className="text-sm text-primary hover:underline">
          ← All focuses
        </Link>
        <h1 className="font-serif text-3xl text-navy mt-3">{category.name}</h1>
        <p className="text-primary text-sm mt-1">{category.tagline}</p>
        <p className="text-muted-foreground text-sm mt-2 max-w-2xl">{category.description}</p>

        <Link
          to={`/practice?category=${category.id}`}
          className="inline-block mt-5 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition"
        >
          Start {category.name} Abhyas →
        </Link>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {category.poses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => setOpen(pose)}
              className="text-left bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <GeneratedImage
                contentKey={`pose:${pose.id}`}
                alt={`${pose.name} (${pose.sanskrit}) yoga pose`}
                className="w-full aspect-[4/3] mx-auto"
                rounded="rounded-none"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{pose.name}</h3>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-semibold">
                    {pose.level}
                  </span>
                </div>
                <p className="text-xs italic text-muted-foreground mt-0.5">{pose.sanskrit}</p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{pose.benefits[0]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && <PoseModal pose={open} onClose={() => setOpen(null)} />}
    </Layout>
  );
}

function PoseModal({ pose, onClose }: { pose: YogaPose; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <GeneratedImage
          contentKey={`pose:${pose.id}`}
          alt={`${pose.name} (${pose.sanskrit}) yoga pose`}
          className="w-full aspect-[16/10] mx-auto"
          rounded="rounded-none"
        />
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl text-navy">{pose.name}</h2>
              <p className="text-sm italic text-muted-foreground">{pose.sanskrit}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted text-muted-foreground shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium">
              {pose.level}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-medium">
              Hold {Math.round(pose.durationSec / 5) * 5}s
            </span>
          </div>

          <Section title="Breathing">
            <p className="text-sm text-muted-foreground">{pose.breathing}</p>
          </Section>
          <Section title="How to practise">
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
              {pose.instructions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Section>
          <Section title="Benefits">
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              {pose.benefits.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title="Precautions">
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              {pose.precautions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-bold uppercase tracking-wide text-navy mb-2">{title}</h3>
      {children}
    </div>
  );
}
