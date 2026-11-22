import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";
import HomeFitLogo from "@/components/HomeFitLogo";

const MESSAGES = [
  "Analyzing your goals…",
  "Planning your workouts…",
  "Selecting exercises…",
  "Building your wellness routine…",
  "Preparing your nutrition recommendations…",
  "Personalizing your yoga practice…",
  "Your HomeFit plan is ready! 🎉",
];

export default function PlanGenerator() {
  const navigate = useNavigate();
  const { onboarding, startNewWeek } = useApp();
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);

  // If the user asked to CHANGE MY PLAN, the updated preferences start a new
  // program (7/14/21/30 days) from today. Past days stay untouched in history.
  useEffect(() => {
    if (!done) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("homefit:change-plan") !== "1") return;
    window.localStorage.removeItem("homefit:change-plan");
    void startNewWeek();
  }, [done, startNewWeek]);

  useEffect(() => {
    if (msgIdx < MESSAGES.length - 1) {
      const t = setTimeout(() => setMsgIdx((i) => i + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(t);
    }
  }, [msgIdx]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
         style={{ background: "#F9F8FF" }}>

      {/* Logo */}
      <div className="mb-12">
        <HomeFitLogo className="mx-auto h-28 w-auto max-w-48" />
      </div>

      {!done ? (
        <>
          {/* Animated circles */}
          <div className="relative w-32 h-32 mb-10">
            <div className="absolute inset-0 rounded-full border-4 border-[#EEF1FD]" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#4B5FE8] animate-spin-slow" />
            <div className="absolute inset-4 rounded-full flex items-center justify-center text-4xl">
              🧘‍♀️
            </div>
          </div>

          <h2 className="font-serif text-3xl text-[#111] mb-4">Creating your personalized plan…</h2>
          <p key={msgIdx} className="text-[#6B7280] text-base animate-fade-in min-h-[1.5rem]">
            {MESSAGES[msgIdx]}
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-8">
            {MESSAGES.slice(0, -1).map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= msgIdx ? "w-6 bg-[#4B5FE8]" : "w-1.5 bg-[#E5E7EB]"
                }`} />
            ))}
          </div>
        </>
      ) : (
        <div className="animate-fade-in-up">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 animate-check-pop"
               style={{ background: "linear-gradient(135deg, #4B5FE8, #3B82F6)" }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-4xl text-[#111] mb-4">Your HomeFit plan is ready!</h2>
          <p className="text-[#6B7280] mb-3 text-sm">
            <strong className="text-[#4B5FE8]">{onboarding.programLength ?? 30}-day</strong> personalized programme
            focused on <strong className="text-[#4B5FE8]">{(onboarding.focusAreas ?? ["General Fitness"]).join(", ")}</strong>.
          </p>
          <p className="text-[#6B7280] text-sm mb-10">
            {onboarding.workoutDuration ?? 30} min · {onboarding.workoutFrequency ?? 4} days/week
          </p>
          <button onClick={() => navigate("/plan")}
            className="px-10 py-4 rounded-2xl text-white font-semibold text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
            style={{ background: "linear-gradient(135deg, #4B5FE8, #3B82F6)" }}>
            View My Plan →
          </button>
        </div>
      )}
    </div>
  );
}
