import { useState } from "react";
import Layout from "@/components/Layout";
import { Link } from "@/lib/router-compat";
import { EXERCISE_CATEGORIES, EXERCISES } from "@/data/exercises";

const CATEGORIES = EXERCISE_CATEGORIES;

const DIFF_COLORS: Record<string, string> = {
  Beginner: "bg-[#F0FDF4] text-[#10B981]",
  Intermediate: "bg-[#FFF7ED] text-[#F97316]",
  Advanced: "bg-[#FEF3F2] text-[#EF4444]",
};

export default function Exercises() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = EXERCISES.filter((e) => {
    const matchCat = cat === "All" || e.category === cat;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-4xl text-[#111] mb-1">Exercise Library</h1>
        <p className="text-[#6B7280] text-sm mb-6">Discover exercises tailored to your goals.</p>

        {/* Start workout */}
        <Link
          to={`/exercise-practice?category=${encodeURIComponent(cat)}`}
          className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-md active:scale-95"
          style={{ background: "linear-gradient(135deg, #4B5FE8, #3B82F6)" }}
        >
          <span>Start Workout</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#4B5FE8] focus:ring-2 focus:ring-[#EEF1FD] transition-colors"
            placeholder="Search exercises…"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat === c
                  ? "bg-[#4B5FE8] text-white shadow-sm"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#4B5FE8]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl p-4 border border-[#F0F0F5] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-[#F9F8FF] overflow-hidden">
                    <img
                      src={`/images/fitness/exercises/${ex.id}.webp`}
                      alt={`${ex.name} exercise`}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${DIFF_COLORS[ex.level]}`}
                  >
                    {ex.level}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-[#111] mb-0.5">{ex.name}</h3>
                <p className="text-xs text-[#6B7280] mb-3">{ex.muscle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#F9F8FF] text-[10px] font-medium text-[#6B7280]">
                      {ex.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#F9F8FF] text-[10px] font-medium text-[#6B7280]">
                      {ex.durationSec >= 60
                        ? `${Math.round(ex.durationSec / 60)} min`
                        : `${ex.durationSec} sec`}
                    </span>
                  </div>
                  <Link
                    to={`/exercise-practice?category=${encodeURIComponent(ex.category)}`}
                    className="text-xs text-[#4B5FE8] font-medium hover:underline"
                  >
                    Start →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-[#6B7280] text-sm">No exercises found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
