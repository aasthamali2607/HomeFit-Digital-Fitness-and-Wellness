import { createFileRoute } from "@tanstack/react-router";
import Exercises from "@/pages/Exercises";

export const Route = createFileRoute("/_authenticated/exercises")({
  head: () => ({
    meta: [
      { title: "Exercise Library — HomeFit" },
      { name: "description", content: "Browse home-friendly exercises with clear guidance for every level." },
      { property: "og:title", content: "Exercise Library — HomeFit" },
      { property: "og:description", content: "Browse home-friendly exercises with clear guidance for every level." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Exercises,
});
