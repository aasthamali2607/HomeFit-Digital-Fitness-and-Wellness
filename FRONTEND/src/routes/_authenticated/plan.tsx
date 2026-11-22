import { createFileRoute } from "@tanstack/react-router";
import Plan from "@/pages/Plan";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({
    meta: [
      { title: "My Plan — HomeFit" },
      { name: "description", content: "Your personalised weekly practice plan, built around your goals." },
      { property: "og:title", content: "My Plan — HomeFit" },
      { property: "og:description", content: "Your personalised weekly practice plan, built around your goals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Plan,
});
