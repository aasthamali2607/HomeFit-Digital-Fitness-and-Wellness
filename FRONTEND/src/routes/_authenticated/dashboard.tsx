import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — HomeFit" },
      { name: "description", content: "Today's practice, your streak and this week's progress at a glance." },
      { property: "og:title", content: "Your Dashboard — HomeFit" },
      { property: "og:description", content: "Today's practice, your streak and this week's progress at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});
