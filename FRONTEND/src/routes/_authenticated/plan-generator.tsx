import { createFileRoute } from "@tanstack/react-router";
import PlanGenerator from "@/pages/PlanGenerator";

export const Route = createFileRoute("/_authenticated/plan-generator")({
  head: () => ({
    meta: [
      { title: "Building your plan — HomeFit" },
      { name: "description", content: "HomeFit is shaping a practice plan around your goals and schedule." },
      { property: "og:title", content: "Building your plan — HomeFit" },
      { property: "og:description", content: "HomeFit is shaping a practice plan around your goals and schedule." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlanGenerator,
});
