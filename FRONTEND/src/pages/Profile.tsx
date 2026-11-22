import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import Layout from "@/components/Layout";
import { useApp } from "@/lib/app-context";

export default function Profile() {
  const { user, onboarding, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"info" | "fitness">("info");

  const handleLogout = () => { logout(); navigate("/"); };

  const bmi = onboarding.height && onboarding.weight
    ? (onboarding.weight / ((onboarding.height / 100) ** 2)).toFixed(1)
    : "—";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg"
               style={{ background: "linear-gradient(135deg, #4B5FE8, #3B82F6)" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-serif text-3xl text-[#111] mb-0.5">{user?.name}</h1>
          <p className="text-[#6B7280] text-sm">{user?.email}</p>
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#EEF1FD] text-[#4B5FE8] border border-[#DCEEFF]">
              {onboarding.goal ?? "General Fitness"}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#10B981] border border-[#D1FAE5]">
              {onboarding.fitnessLevel ?? "Beginner"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] mb-6">
          {([
            { key: "info", label: "Personal Info" },
            { key: "fitness", label: "Fitness" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
                tab === key ? "text-[#111]" : "text-[#888]"
              }`}>
              {label}
              {tab === key && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] w-16 rounded-full bg-[#4B5FE8]" />}
            </button>
          ))}
        </div>

        {/* Personal Info */}
        {tab === "info" && (
          <div className="space-y-4">
            {[
              { label: "Full Name", value: user?.name ?? "—" },
              { label: "Email", value: user?.email ?? "—" },
              { label: "Age", value: onboarding.age ? `${onboarding.age} years` : "—" },
              { label: "Gender", value: onboarding.gender ?? "—" },
              { label: "Height", value: onboarding.height ? `${Math.round(onboarding.height)} cm` : "—" },
              { label: "Weight", value: onboarding.weight ? `${onboarding.weight} kg` : "—" },
              { label: "BMI", value: bmi },
              { label: "Body Type", value: onboarding.bodyType ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl px-4 py-3.5 border border-[#F0F0F5] shadow-sm flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">{label}</span>
                <span className="text-sm font-medium text-[#111]">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Fitness */}
        {tab === "fitness" && (
          <div className="space-y-4">
            {[
              { label: "Fitness Goal", value: onboarding.goal ?? "—" },
              { label: "Focus Areas", value: (onboarding.focusAreas ?? []).join(", ") || "—" },
              { label: "Fitness Level", value: onboarding.fitnessLevel ?? "—" },
              { label: "Activity Level", value: onboarding.activityLevel ?? "—" },
              { label: "Workout Duration", value: onboarding.workoutDuration ? `${onboarding.workoutDuration} min` : "—" },
              { label: "Workout Frequency", value: onboarding.workoutFrequency ? `${onboarding.workoutFrequency}x/week` : "—" },
              { label: "Equipment", value: (onboarding.equipment ?? []).join(", ") || "—" },
              { label: "Program Length", value: onboarding.programLength ? `${onboarding.programLength} days` : "—" },
              { label: "Workout Location", value: onboarding.workoutLocation ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl px-4 py-3.5 border border-[#F0F0F5] shadow-sm flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">{label}</span>
                <span className="text-sm font-medium text-[#111] text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleLogout}
          className="mt-6 w-full py-4 rounded-xl bg-[#FEF3F2] border border-[#FEE2E2] text-[#EF4444] text-sm font-semibold hover:bg-[#FEE2E2] transition-colors">
          Log Out
        </button>
      </div>
    </Layout>
  );
}
