import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";
import HorizontalRuler from "@/components/HorizontalRuler";
import VerticalWheelPicker from "@/components/VerticalWheelPicker";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StepProps {
  next: () => void;
  back: () => void;
}

// ─── Shared Sub-components ───────────────────────────────────────────────────

function StepHeader({ step, total, title, num }: { step: number; total: number; title: string; num: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <span className="font-bold text-[#4B5FE8] text-sm">{num}</span>
        <span className="font-semibold text-[#111] text-sm">{title}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%`, background: "#4B5FE8" }}
        />
      </div>
    </div>
  );
}

function BackArrow({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="absolute left-4 top-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
      <svg className="w-5 h-5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

function NextButton({ onClick, disabled = false, label = "Next" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 rounded-[50px] text-white font-semibold text-base transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: disabled ? "#ccc" : "#000" }}>
      {label}
    </button>
  );
}

function SelectCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
        selected
          ? "border-[#4B5FE8] bg-[#EEF1FD] text-[#4B5FE8]"
          : "border-[#E5E7EB] bg-white text-[#111] hover:border-[#4B5FE8]/40"
      }`}>
      <span className="font-medium text-sm">{children}</span>
      {selected && (
        <span className="animate-check-pop shrink-0 w-5 h-5 rounded-full bg-[#4B5FE8] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

const MOTIVATIONS = [
  "Feel healthier", "Lose weight", "Build strength", "Improve flexibility",
  "Reduce stress", "Improve confidence", "Build a healthy routine", "Improve overall wellness",
];

function Step1({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [sel, setSel] = useState<string[]>(onboarding.motivations ?? []);
  const toggle = (v: string) => setSel((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
  const handleNext = () => { updateOnboarding({ motivations: sel }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-2 animate-fade-in-up">What motivates you to become fitter?</h2>
      <p className="text-[#6B7280] text-sm mb-6 animate-fade-in-up delay-100">Select all that apply.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 animate-fade-in-up delay-200">
        {MOTIVATIONS.map((m) => <SelectCard key={m} selected={sel.includes(m)} onClick={() => toggle(m)}>{m}</SelectCard>)}
      </div>
      <NextButton onClick={handleNext} disabled={sel.length === 0} />
    </>
  );
}

const GOALS = [
  { label: "Weight Loss", icon: "⚡" }, { label: "Healthy Weight Gain", icon: "🌱" },
  { label: "Muscle Building", icon: "💪" }, { label: "Strength", icon: "🏋️" },
  { label: "Flexibility", icon: "🧘" }, { label: "General Fitness", icon: "🏃" },
  { label: "Stress Relief", icon: "🌊" }, { label: "Better Lifestyle", icon: "✨" },
];

function Step2({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [sel, setSel] = useState(onboarding.goal ?? "");
  const handleNext = () => { updateOnboarding({ goal: sel }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-2 animate-fade-in-up">What is your main goal?</h2>
      <p className="text-[#6B7280] text-sm mb-6 animate-fade-in-up delay-100">Choose one that best describes your focus.</p>
      <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-in-up delay-200">
        {GOALS.map(({ label, icon }) => (
          <button key={label} onClick={() => setSel(label)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              sel === label ? "border-[#4B5FE8] bg-[#EEF1FD]" : "border-[#E5E7EB] bg-white hover:border-[#4B5FE8]/40"
            }`}>
            <span className="text-2xl block mb-1">{icon}</span>
            <span className={`text-sm font-medium ${sel === label ? "text-[#4B5FE8]" : "text-[#111]"}`}>{label}</span>
          </button>
        ))}
      </div>
      <NextButton onClick={handleNext} disabled={!sel} />
    </>
  );
}

const FOCUS_AREAS = [
  { label: "Yoga – General Yoga", desc: "Build flexibility, balance, strength and mind-body awareness.", icon: "🧘‍♀️", safety: false },
  { label: "Back Care", desc: "Gentle practices to support back strength, mobility and comfort.", icon: "🩵", safety: false },
  { label: "Strong Core", desc: "Strengthen your core for stability, balance and better movement.", icon: "🎯", safety: false },
  { label: "Strong Arms", desc: "Build strength and endurance in your arms and upper body.", icon: "💪", safety: false },
  { label: "Strong Legs", desc: "Strengthen your legs and improve lower-body stability.", icon: "🦵", safety: false },
  { label: "Flexibility", desc: "Improve flexibility, range of motion and overall mobility.", icon: "🌀", safety: false },
  { label: "Relaxation", desc: "Release tension and create a calm, relaxed state of mind.", icon: "🌿", safety: false },
  { label: "Mind & Focus", desc: "Improve mental clarity, concentration and mindful awareness.", icon: "🧠", safety: false },
  { label: "Weight Management", desc: "Support healthy weight goals through movement and mindful habits.", icon: "⚖️", safety: false },
  { label: "Better Posture", desc: "Improve posture, alignment and body awareness.", icon: "🧍‍♀️", safety: false },
  { label: "Better Sleep", desc: "Relax your body and mind with practices that support better sleep.", icon: "😴", safety: false },
  { label: "Morning Yoga", desc: "Start your day with gentle movement, energy and mindfulness.", icon: "🌅", safety: false },
];

function Step3({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [sel, setSel] = useState<string[]>(onboarding.focusAreas ?? []);
  const toggle = (v: string) => setSel((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
  const handleNext = () => { updateOnboarding({ focusAreas: sel }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-2 animate-fade-in-up">What would you like to focus on?</h2>
      <p className="text-[#6B7280] text-sm mb-6 animate-fade-in-up delay-100">Select all areas you want to explore.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 animate-fade-in-up delay-200">
        {FOCUS_AREAS.map(({ label, desc, icon, safety }) => {
          const active = sel.includes(label);
          return (
            <button key={label} onClick={() => toggle(label)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                active ? "border-[#4B5FE8] bg-[#EEF1FD]" : "border-[#E5E7EB] bg-white hover:border-[#4B5FE8]/40"
              }`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className={`text-sm font-semibold ${active ? "text-[#4B5FE8]" : "text-[#111]"}`}>{label}</span>
                </div>
                {active && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#4B5FE8] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B7280] leading-snug">{desc}</p>
              {safety && (
                <p className="mt-2 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-lg leading-snug">
                  ⚠️ Should be performed only with appropriate medical/professional guidance.
                </p>
              )}
            </button>
          );
        })}
      </div>
      <NextButton onClick={handleNext} disabled={sel.length === 0} />
    </>
  );
}

function Step4Age({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();

  const [age, setAge] = useState<number>(onboarding.age ?? 28);

  const handleNext = () => {
    updateOnboarding({ age });
    next();
  };

  return (
    <>
      <h2 className="font-serif text-[clamp(2.2rem,8vw,3.5rem)] leading-tight text-[#111] mb-2 animate-fade-in-up">
        What&apos;s your age?
      </h2>

      <p className="text-[#6B7280] text-base mb-12 animate-fade-in-up delay-100 max-w-xs">
        It&apos;ll help us personalize your plan to better suit your age group.
      </p>

      <div className="flex justify-center mb-12 animate-fade-in-up delay-200">
        <VerticalWheelPicker
          value={age}
          onChange={(value: number) => setAge(value)}
          min={16}
          max={80}
          suffix="years old"
        />
      </div>

      <NextButton onClick={handleNext} />
    </>
  );
}
function Step5Height({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  // Stored internally as cm
  const [heightCm, setHeightCm] = useState(onboarding.height ?? 165);

  const displayValue = unit === "cm" ? heightCm : heightCm / 30.48;
  const displayFormatted = unit === "cm"
    ? `${Math.round(heightCm)} cm`
    : `${(heightCm / 30.48).toFixed(1)} ft`;

  const handleChange = (v: number) => {
    if (unit === "cm") setHeightCm(Math.round(v));
    else setHeightCm(parseFloat((v * 30.48).toFixed(1)));
  };

  const rulerProps = unit === "cm"
    ? { min: 100, max: 250, step: 1, majorEvery: 10, pxPerStep: 12 }
    : { min: 3, max: 8, step: 0.1, majorEvery: 1, pxPerStep: 40 };

  const handleNext = () => { updateOnboarding({ height: heightCm }); next(); };

  return (
    <>
      <h2 className="font-serif text-[clamp(2.2rem,8vw,3.5rem)] leading-tight text-[#111] mb-2 animate-fade-in-up">
        What&apos;s your height?
      </h2>
      <p className="text-[#6B7280] text-base mb-8 animate-fade-in-up delay-100">
        Drag the ruler or scroll to select.
      </p>

      {/* Unit toggle */}
      <div className="flex justify-center mb-8 animate-fade-in-up delay-100">
        <div className="inline-flex rounded-full p-1 gap-1 border border-[#DCEEFF] bg-white">
          {(["cm", "ft"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                unit === u ? "bg-[#4B5FE8] text-white shadow-sm" : "text-[#4B5FE8]"
              }`}>
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Big display value */}
      <div className="text-center mb-10 animate-fade-in-up delay-200">
        <span className="font-serif text-[5rem] leading-none text-[#111]">
          {unit === "cm" ? Math.round(heightCm) : (heightCm / 30.48).toFixed(1)}
        </span>
        <span className="text-2xl text-[#6B7280] ml-2">{unit}</span>
      </div>

      {/* Ruler */}
      <div className="mb-10 animate-fade-in-up delay-300">
        <HorizontalRuler
          value={unit === "cm" ? heightCm : heightCm / 30.48}
          onChange={handleChange}
          {...rulerProps}
        />
      </div>

      <NextButton onClick={handleNext} />
    </>
  );
}

function bmi(weightKg: number, heightCm: number) {
  const h = heightCm / 100;
  return h > 0 ? (weightKg / (h * h)).toFixed(1) : "—";
}

function bmiLabel(b: number) {
  if (b < 18.5) return "Underweight";
  if (b < 25) return "Healthy weight";
  if (b < 30) return "Overweight";
  return "Obese";
}

function bmiMotivation(b: number) {
  if (b < 18.5) return "Let's build strength and nourish your body well.";
  if (b < 25) return "You're in a great range — let's keep it up!";
  if (b < 30) return "You're on the right track. Let's build momentum!";
  return "Every step counts. Let's start this journey together.";
}

function Step6Weight({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [weightKg, setWeightKg] = useState(onboarding.weight ?? 62);

  const displayWeight = unit === "kg" ? weightKg : weightKg * 2.20462;

  const handleChange = (v: number) => {
    if (unit === "kg") setWeightKg(parseFloat(v.toFixed(1)));
    else setWeightKg(parseFloat((v / 2.20462).toFixed(1)));
  };

  const rulerProps = unit === "kg"
    ? { min: 20, max: 200, step: 0.1, majorEvery: 10, pxPerStep: 8 }
    : { min: 44, max: 441, step: 0.2, majorEvery: 20, pxPerStep: 4 };

  const bmiVal = parseFloat(bmi(weightKg, onboarding.height ?? 165));
  const handleNext = () => { updateOnboarding({ weight: weightKg }); next(); };

  return (
    <>
      <h2 className="font-serif text-[clamp(2.2rem,8vw,3.5rem)] leading-tight text-[#111] mb-2 animate-fade-in-up">
        What&apos;s your weight?
      </h2>
      <p className="text-[#6B7280] text-base mb-8 animate-fade-in-up delay-100">
        Used to calculate your BMI and personalize your plan.
      </p>

      {/* Unit toggle */}
      <div className="flex justify-center mb-8 animate-fade-in-up delay-100">
        <div className="inline-flex rounded-full p-1 gap-1 border border-[#DCEEFF] bg-white">
          {(["kg", "lbs"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                unit === u ? "bg-[#4B5FE8] text-white shadow-sm" : "text-[#4B5FE8]"
              }`}>
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Big value */}
      <div className="text-center mb-10 animate-fade-in-up delay-200">
        <span className="font-serif text-[5rem] leading-none text-[#111]">
          {displayWeight.toFixed(1)}
        </span>
        <span className="text-2xl text-[#6B7280] ml-2">{unit}</span>
      </div>

      {/* Ruler */}
      <div className="mb-8 animate-fade-in-up delay-300">
        <HorizontalRuler
          value={unit === "kg" ? weightKg : weightKg * 2.20462}
          onChange={handleChange}
          {...rulerProps}
        />
      </div>

      {/* BMI Card */}
      <div className="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] animate-fade-in-up delay-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280] mb-0.5">Your BMI</p>
            <p className="text-2xl font-bold text-[#4B5FE8]">
              {bmiVal} <span className="text-sm font-medium text-[#6B7280]">— {bmiLabel(bmiVal)}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
               style={{ background: "#EEF1FD" }}>📊</div>
        </div>
        <p className="mt-2 text-xs text-[#6B7280]">{bmiMotivation(bmiVal)}</p>
      </div>

      <NextButton onClick={handleNext} />
    </>
  );
}

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
const BODY_TYPES = [
  { label: "Slim", desc: "Lean build, naturally low body fat." },
  { label: "Average", desc: "Balanced build, moderate frame." },
  { label: "Athletic", desc: "Muscular, active build." },
  { label: "Curvy", desc: "Soft, fuller figure." },
  { label: "Muscular", desc: "Strong, defined physique." },
  { label: "Other", desc: "Unique to me." },
];

function Step7Body({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [gender, setGender] = useState(onboarding.gender ?? "");
  const [bodyType, setBodyType] = useState(onboarding.bodyType ?? "");
  const handleNext = () => { updateOnboarding({ gender, bodyType }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-6 animate-fade-in-up">About your body</h2>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-100">Gender</p>
      <div className="grid grid-cols-2 gap-3 mb-7 animate-fade-in-up delay-100">
        {GENDERS.map((g) => (
          <SelectCard key={g} selected={gender === g} onClick={() => setGender(g)}>{g}</SelectCard>
        ))}
      </div>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-200">Body Type</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 animate-fade-in-up delay-200">
        {BODY_TYPES.map(({ label, desc }) => (
          <button key={label} onClick={() => setBodyType(label)}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
              bodyType === label ? "border-[#4B5FE8] bg-[#EEF1FD]" : "border-[#E5E7EB] bg-white hover:border-[#4B5FE8]/40"
            }`}>
            <p className={`text-sm font-semibold ${bodyType === label ? "text-[#4B5FE8]" : "text-[#111]"}`}>{label}</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      <NextButton onClick={handleNext} disabled={!gender || !bodyType} />
    </>
  );
}

const FITNESS_LEVELS = [
  { label: "Beginner", desc: "New to exercise or returning after a break." },
  { label: "Intermediate", desc: "Exercise regularly with some experience." },
];
const LOCATIONS = [
  { label: "Home", icon: "🏠" }, { label: "Outdoor", icon: "🌳" },
  { label: "Garden", icon: "🌻" }, { label: "Mixed", icon: "🔄" },
];

function Step8FitnessLevel({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [level, setLevel] = useState(onboarding.fitnessLevel ?? "");
  const [loc, setLoc] = useState(onboarding.workoutLocation ?? "");
  const handleNext = () => { updateOnboarding({ fitnessLevel: level, workoutLocation: loc }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-6 animate-fade-in-up">Your fitness experience</h2>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-100">Current Fitness Level</p>
      <div className="space-y-3 mb-7 animate-fade-in-up delay-100">
        {FITNESS_LEVELS.map(({ label, desc }) => (
          <button key={label} onClick={() => setLevel(label)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
              level === label ? "border-[#4B5FE8] bg-[#EEF1FD]" : "border-[#E5E7EB] bg-white hover:border-[#4B5FE8]/40"
            }`}>
            <div>
              <p className={`font-semibold text-sm ${level === label ? "text-[#4B5FE8]" : "text-[#111]"}`}>{label}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
            </div>
            {level === label && (
              <span className="w-5 h-5 rounded-full bg-[#4B5FE8] flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-200">Where do you usually work out?</p>
      <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-in-up delay-200">
        {LOCATIONS.map(({ label, icon }) => (
          <button key={label} onClick={() => setLoc(label)}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              loc === label ? "border-[#4B5FE8] bg-[#EEF1FD]" : "border-[#E5E7EB] bg-white hover:border-[#4B5FE8]/40"
            }`}>
            <span className="text-2xl block mb-1">{icon}</span>
            <p className={`text-sm font-medium ${loc === label ? "text-[#4B5FE8]" : "text-[#111]"}`}>{label}</p>
          </button>
        ))}
      </div>

      <NextButton onClick={handleNext} disabled={!level || !loc} />
    </>
  );
}

const HEALTH_CONDITIONS = [
  "Back pain", "Knee pain", "Shoulder injury", "Hip issues",
  "Heart condition", "High blood pressure", "Asthma", "Diabetes",
  "Recent surgery", "Arthritis", "Pregnancy", "None of the above",
];

function Step9Health({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [sel, setSel] = useState<string[]>(onboarding.healthConditions ?? []);
  const toggle = (v: string) => {
    if (v === "None of the above") { setSel(["None of the above"]); return; }
    setSel((s) => {
      const without = s.filter((x) => x !== "None of the above");
      return without.includes(v) ? without.filter((x) => x !== v) : [...without, v];
    });
  };
  const handleNext = () => { updateOnboarding({ healthConditions: sel }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-2 animate-fade-in-up">Health & Safety</h2>
      <p className="text-[#6B7280] text-sm mb-6 animate-fade-in-up delay-100">
        This helps us keep your plan safe. Select any that apply.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up delay-200">
        {HEALTH_CONDITIONS.map((c) => (
          <SelectCard key={c} selected={sel.includes(c)} onClick={() => toggle(c)}>{c}</SelectCard>
        ))}
      </div>
      <div className="p-4 rounded-2xl bg-[#F2F8FF] border border-[#DCEEFF] mb-8 animate-fade-in-up delay-300">
        <p className="text-xs text-[#6B7280] leading-relaxed">
          <strong className="text-[#4B5FE8]">⚕ Disclaimer:</strong> HomeFit provides general fitness and wellness guidance and is not a substitute for professional medical advice. Please consult your doctor before starting any new exercise programme.
        </p>
      </div>
      <NextButton onClick={handleNext} disabled={sel.length === 0} />
    </>
  );
}

const DURATIONS = [10, 15, 20, 30, 45, 60];
const FREQUENCIES = [2, 3, 4, 5, 6, 7];
const EQUIPMENT_OPTIONS = ["No equipment", "Yoga mat", "Dumbbells", "Resistance bands", "Full home gym"];
const ACTIVITY_LEVELS = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"];

function Step10Lifestyle({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [activity, setActivity] = useState(onboarding.activityLevel ?? "");
  const [duration, setDuration] = useState(onboarding.workoutDuration ?? 30);
  const [freq, setFreq] = useState(onboarding.workoutFrequency ?? 4);
  const [equipment, setEquipment] = useState<string[]>(onboarding.equipment ?? []);
  const toggleEquip = (v: string) => setEquipment((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
  const handleNext = () => { updateOnboarding({ activityLevel: activity, workoutDuration: duration, workoutFrequency: freq, equipment }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-6 animate-fade-in-up">Workout Preferences</h2>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-100">Activity Level</p>
      <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up delay-100">
        {ACTIVITY_LEVELS.map((a) => (
          <SelectCard key={a} selected={activity === a} onClick={() => setActivity(a)}>{a}</SelectCard>
        ))}
      </div>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-200">Preferred Workout Duration</p>
      <div className="grid grid-cols-3 gap-2 mb-6 animate-fade-in-up delay-200">
        {DURATIONS.map((d) => (
          <button key={d} onClick={() => setDuration(d)}
            className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              duration === d ? "border-[#4B5FE8] bg-[#EEF1FD] text-[#4B5FE8]" : "border-[#E5E7EB] bg-white text-[#111]"
            }`}>
            {d} min
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-300">Workout Frequency</p>
      <div className="grid grid-cols-3 gap-2 mb-6 animate-fade-in-up delay-300">
        {FREQUENCIES.map((f) => (
          <button key={f} onClick={() => setFreq(f)}
            className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              freq === f ? "border-[#4B5FE8] bg-[#EEF1FD] text-[#4B5FE8]" : "border-[#E5E7EB] bg-white text-[#111]"
            }`}>
            {f === 7 ? "Every day" : `${f}×/week`}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-[#102A43] mb-3 animate-fade-in-up delay-400">Available Equipment</p>
      <div className="space-y-2 mb-8 animate-fade-in-up delay-400">
        {EQUIPMENT_OPTIONS.map((e) => (
          <SelectCard key={e} selected={equipment.includes(e)} onClick={() => toggleEquip(e)}>{e}</SelectCard>
        ))}
      </div>

      <NextButton onClick={handleNext} disabled={!activity || !equipment.length} />
    </>
  );
}

const PROGRAM_LENGTHS = [
  { days: 7, title: "Quick Start", desc: "Build momentum fast." },
  { days: 14, title: "Two-Week Reset", desc: "Form solid habits." },
  { days: 21, title: "21-Day Challenge", desc: "Transform your routine." },
  { days: 30, title: "Build Your Routine", desc: "A full month of growth." },
];

function Step11Program({ next, back }: StepProps) {
  const { onboarding, updateOnboarding } = useApp();
  const [len, setLen] = useState(onboarding.programLength ?? 30);
  const handleNext = () => { updateOnboarding({ programLength: len, completed: true }); next(); };
  return (
    <>
      <h2 className="font-serif text-3xl text-[#111] mb-2 animate-fade-in-up">How long would you like your program?</h2>
      <p className="text-[#6B7280] text-sm mb-8 animate-fade-in-up delay-100">Your dedicated HomeFit journey.</p>
      <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in-up delay-200">
        {PROGRAM_LENGTHS.map(({ days, title, desc }) => (
          <button key={days} onClick={() => setLen(days)}
            className={`p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 ${
              len === days ? "border-[#4B5FE8] bg-[#EEF1FD]" : "border-[#E5E7EB] bg-white"
            }`}>
            <p className={`text-3xl font-bold mb-1 ${len === days ? "text-[#4B5FE8]" : "text-[#111]"}`}>{days}</p>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${len === days ? "text-[#4B5FE8]" : "text-[#6B7280]"}`}>Days</p>
            <p className={`text-sm font-semibold ${len === days ? "text-[#4B5FE8]" : "text-[#111]"}`}>{title}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>
      <NextButton onClick={handleNext} label="Create My Plan →" />
    </>
  );
}

// ─── TOTAL STEPS ─────────────────────────────────────────────────────────────

const STEPS = [
  { num: "01", title: "Motivation", component: Step1 },
  { num: "02", title: "Goal", component: Step2 },
  { num: "03", title: "Focus Area", component: Step3 },
  { num: "04", title: "About You", component: Step4Age },
  { num: "04", title: "About You", component: Step5Height },
  { num: "04", title: "About You", component: Step6Weight },
  { num: "04", title: "About You", component: Step7Body },
  { num: "05", title: "Experience", component: Step8FitnessLevel },
  { num: "06", title: "Health", component: Step9Health },
  { num: "07", title: "Preferences", component: Step10Lifestyle },
  { num: "08", title: "Program", component: Step11Program },
];

// ─── Main Onboarding Component ───────────────────────────────────────────────

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const total = STEPS.length;

  const next = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else navigate("/plan-generator");
  };
  const back = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigate("/");
  };

  const { num, title, component: StepComponent } = STEPS[step]!;

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#F9F8FF" }}>
      <div className="w-full max-w-xl px-6 pt-16 pb-12 relative">
        <BackArrow onClick={back} />
        <StepHeader step={step} total={total} title={title} num={num} />
        <div key={step} className="animate-fade-in-up">
          <StepComponent next={next} back={back} />
        </div>
      </div>
    </div>
  );
}
