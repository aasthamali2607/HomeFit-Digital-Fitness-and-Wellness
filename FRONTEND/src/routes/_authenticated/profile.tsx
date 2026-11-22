import { createFileRoute } from "@tanstack/react-router";
import Profile from "@/pages/Profile";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — HomeFit" },
      { name: "description", content: "Your details, preferences and practice settings." },
      { property: "og:title", content: "Your Profile — HomeFit" },
      { property: "og:description", content: "Your details, preferences and practice settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Profile,
});
