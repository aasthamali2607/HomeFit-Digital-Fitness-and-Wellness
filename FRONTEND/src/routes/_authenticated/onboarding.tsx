import { createFileRoute } from "@tanstack/react-router";
import Onboarding from "@/pages/Onboarding";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your practice — HomeFit" },
      { name: "description", content: "Tell us about your body, goals and schedule so HomeFit can shape your plan." },
      { property: "og:title", content: "Set up your practice — HomeFit" },
      { property: "og:description", content: "Tell us about your body, goals and schedule so HomeFit can shape your plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});
