import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { RECIPE_IMAGES } from "@/assets/nutrition";
import { MEAL_CATEGORIES, RECIPES, type Diet, type MealCategoryId, type Recipe } from "@/data/nutrition";

export const Route = createFileRoute("/_authenticated/nutrition")({
  head: () => ({
    meta: [
      { title: "Nutrition & Recipes — HomeFit" },
      { name: "description", content: "Drinks, breakfast, lunch, evening cravings and dinner — vegetarian and non-vegetarian recipes for your practice." },
      { property: "og:title", content: "Nutrition & Recipes — HomeFit" },
      { property: "og:description", content: "Drinks, breakfast, lunch, evening cravings and dinner — vegetarian and non-vegetarian recipes for your practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NutritionPage,
});

function NutritionPage() {
  const [category, setCategory] = useState<MealCategoryId>("drinks");
  const [diet, setDiet] = useState<Diet | "all">("all");
  const [open, setOpen] = useState<Recipe | null>(null);

  const active = MEAL_CATEGORIES.find((c) => c.id === category);
  const recipes = useMemo(
    () => RECIPES.filter((r) => r.category === category && (diet === "all" || r.diet === diet)),
    [category, diet],
  );

  if (!active) return null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl text-navy">Nutrition</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Food that supports your practice — simple, nourishing, and made at home.
        </p>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-6 pb-1">
          {MEAL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-sm font-medium border transition ${
                c.id === category
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card text-muted-foreground border-border hover:border-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-4">
          <p className="text-sm font-semibold text-navy">{active.tagline}</p>
          <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
        </div>

        <div className="flex items-center gap-2 mt-5">
          {(["all", "veg", "nonveg"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiet(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                d === diet
                  ? "bg-secondary text-secondary-foreground border-transparent"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              {d === "all" ? "All" : d === "veg" ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{recipes.length} recipes</span>
        </div>

        {recipes.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No recipes in this filter yet — try another diet option.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {recipes.map((r) => (
              <button
                key={r.id}
                onClick={() => setOpen(r)}
                className="text-left bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                 <img
                   src={RECIPE_IMAGES[r.id]}
                  alt={`${r.name} recipe`}
                   loading="lazy"
                   width={1024}
                   height={768}
                   className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{r.name}</h3>
                    <span className="text-sm shrink-0">{r.diet === "veg" ? "🟢" : "🔴"}</span>
                  </div>
                  <p className="text-xs text-primary mt-0.5">{r.tagline}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {r.prepMin + r.cookMin} min · {r.calories} kcal · {r.protein}g protein
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {open && <RecipeModal recipe={open} onClose={() => setOpen(null)} />}
    </Layout>
  );
}

function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={RECIPE_IMAGES[recipe.id]}
          alt={`${recipe.name} recipe`}
          width={1024}
          height={768}
          className="h-52 w-full object-cover"
        />
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl text-navy">{recipe.name}</h2>
              <p className="text-sm text-primary">{recipe.tagline}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted text-muted-foreground shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-5 text-center">
            {[
              { label: "kcal", value: recipe.calories },
              { label: "protein", value: `${recipe.protein}g` },
              { label: "carbs", value: `${recipe.carbs}g` },
              { label: "fat", value: `${recipe.fat}g` },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-muted py-2.5">
                <p className="font-semibold text-foreground text-sm">{m.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Prep {recipe.prepMin} min · Cook {recipe.cookMin} min · Serves {recipe.servings} ·{" "}
            {recipe.diet === "veg" ? "Vegetarian" : "Non-Vegetarian"}
          </p>

          <Block title="Ingredients">
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              {recipe.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Block>
          <Block title="Method">
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
              {recipe.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Block>
          <Block title="Tips">
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              {recipe.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Block>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-bold uppercase tracking-wide text-navy mb-2">{title}</h3>
      {children}
    </div>
  );
}
