import type { OnboardingData, WorkoutLog } from "@/lib/app-context";
import { COOLDOWN_STEPS, WARMUP_STEPS } from "@/data/practice";
import { EXERCISES } from "@/data/exercises";
import { YOGA_CATEGORIES, type YogaCategory, type YogaPose } from "@/data/yoga";

export type PlanKind = "yoga" | "exercise" | "recovery";

export interface PlannedDay {
  day: number;
  title: string;
  kind: PlanKind;
  focus: string;
  support: string;
  categoryId: string;
  categoryLabel: string;
  difficulty: "Beginner" | "Intermediate";
  durationMin: number;
  activityCount: number;
  isMain: boolean;
  href: string;
  phases: string[];
}

const FOCUS_RULES: Record<
  string,
  { category: string; exercise: string; support: string[]; title: string; iconFocus: string }
> = {
  "Back Care": {
    category: "back-care",
    exercise: "Flexibility",
    support: ["Better Posture", "Strong Core", "Flexibility"],
    title: "Back Care Practice",
    iconFocus: "Back Care",
  },
  "Strong Arms": {
    category: "arms",
    exercise: "Upper Body",
    support: ["Better Posture", "Back Care"],
    title: "Arm Strength Practice",
    iconFocus: "Strong Arms",
  },
  "Strong Legs": {
    category: "legs",
    exercise: "Lower Body",
    support: ["Flexibility", "Back Care"],
    title: "Leg Strength Practice",
    iconFocus: "Strong Legs",
  },
  "Strong Core": {
    category: "core",
    exercise: "Core",
    support: ["Better Posture", "Back Care"],
    title: "Core Stability Practice",
    iconFocus: "Strong Core",
  },
  Flexibility: {
    category: "flexibility",
    exercise: "Flexibility",
    support: ["Back Care", "Better Posture"],
    title: "Flexibility Practice",
    iconFocus: "Flexibility",
  },
  "Better Posture": {
    category: "posture",
    exercise: "Core",
    support: ["Back Care", "Strong Core"],
    title: "Posture Practice",
    iconFocus: "Better Posture",
  },
  "Weight Management": {
    category: "weight",
    exercise: "Cardio",
    support: ["Strong Core", "Strong Legs"],
    title: "Weight Management Practice",
    iconFocus: "Weight Management",
  },
  Relaxation: {
    category: "relaxation",
    exercise: "Flexibility",
    support: ["Better Sleep", "Mind & Focus"],
    title: "Relaxation Practice",
    iconFocus: "Relaxation",
  },
  "Mind & Focus": {
    category: "mind",
    exercise: "Core",
    support: ["Relaxation", "Better Posture"],
    title: "Mind & Focus Practice",
    iconFocus: "Mind & Focus",
  },
  "Better Sleep": {
    category: "sleep",
    exercise: "Flexibility",
    support: ["Relaxation", "Back Care"],
    title: "Better Sleep Practice",
    iconFocus: "Better Sleep",
  },
  "General Yoga": {
    category: "general",
    exercise: "Full Body",
    support: ["Flexibility", "Strong Core"],
    title: "General Yoga Practice",
    iconFocus: "General Yoga",
  },
};

const CATEGORY_TO_FOCUS: Record<string, string> = {
  "back-care": "Back Care",
  arms: "Strong Arms",
  legs: "Strong Legs",
  core: "Strong Core",
  flexibility: "Flexibility",
  posture: "Better Posture",
  weight: "Weight Management",
  relaxation: "Relaxation",
  mind: "Mind & Focus",
  sleep: "Better Sleep",
  general: "General Yoga",
};

function normalizeFocus(onboarding: Partial<OnboardingData>) {
  const focus = onboarding.focusAreas?.find((item) => FOCUS_RULES[item]);
  if (focus) return focus;
  const goal = onboarding.goal;
  if (goal && FOCUS_RULES[goal]) return goal;
  return "General Yoga";
}

export function normalizeDifficulty(level: string | undefined): "Beginner" | "Intermediate" {
  return level === "Intermediate" ? "Intermediate" : "Beginner";
}

export function selectedFrequency(value: number | undefined) {
  return Math.max(2, Math.min(7, Math.round(value ?? 4)));
}

export function selectedDuration(value: number | undefined) {
  const allowed = [10, 15, 20, 30, 45, 60];
  return allowed.includes(value ?? 0) ? (value as number) : 30;
}

export function mainDaysForFrequency(frequency: number) {
  if (frequency >= 7) return [1, 2, 3, 4, 5, 6, 7];
  const days = new Set<number>();
  for (let i = 0; i < frequency; i += 1) {
    days.add(Math.floor((i * 7) / frequency) + 1);
  }
  let cursor = 1;
  while (days.size < frequency && cursor <= 7) {
    days.add(cursor);
    cursor += 1;
  }
  return Array.from(days).sort((a, b) => a - b);
}

export function plannedLogs(logs: WorkoutLog[]) {
  return logs.filter((log) => (log.source ?? "plan") === "plan");
}

export function completedPlanDays(logs: WorkoutLog[]) {
  return new Set(plannedLogs(logs).map((log) => log.planDay).filter((day): day is number => typeof day === "number"));
}

export function planSummary(onboarding: Partial<OnboardingData>, logs: WorkoutLog[]) {
  const days = generateSevenDayPlan(onboarding);
  const mainDays = days.filter((day) => day.isMain);
  const completed = completedPlanDays(logs);
  return {
    days,
    mainDays,
    completed,
    completedCount: mainDays.filter((day) => completed.has(day.day)).length,
  };
}

function focusRule(focus: string) {
  const fallback = FOCUS_RULES["General Yoga"];
  const rule = FOCUS_RULES[focus] ?? fallback;
  if (!rule) throw new Error("Personalized plan focus rules are missing.");
  return rule;
}

function firstYogaCategory() {
  const category = YOGA_CATEGORIES[0];
  if (!category) throw new Error("Yoga library is empty.");
  return category;
}

function categoryById(id: string) {
  return YOGA_CATEGORIES.find((category) => category.id === id) ?? firstYogaCategory();
}

export function focusForYogaCategory(id: string) {
  return CATEGORY_TO_FOCUS[id] ?? "General Yoga";
}

function posesForLevel(category: YogaCategory | undefined, difficulty: "Beginner" | "Intermediate") {
  return (category?.poses ?? []).filter((pose) => pose.level === difficulty);
}

function exercisesForLevel(category: string, difficulty: "Beginner" | "Intermediate", equipment: string[]) {
  return EXERCISES.filter((exercise) => {
    const matchesCategory = category === "Full Body" || exercise.category === category;
    const matchesLevel = exercise.level === difficulty;
    const required = [] as string[];
    const hasEquipment = required.every((item) => equipment.includes(item));
    return matchesCategory && matchesLevel && hasEquipment;
  });
}

function countMainActivities(durationMin: number, warmupSec: number, cooldownSec: number, unitSec: number) {
  const targetSec = durationMin * 60;
  const mainSec = Math.max(unitSec * 2, targetSec - warmupSec - cooldownSec);
  return Math.max(1, Math.min(10, Math.round(mainSec / unitSec)));
}

function totalSeconds(items: Array<{ durationSec: number }>) {
  return items.reduce((sum, item) => sum + item.durationSec, 0);
}

function pickYogaPlan(
  primary: string,
  difficulty: "Beginner" | "Intermediate",
  durationMin: number,
  slot: number,
) {
  const rule = focusRule(primary);
  const category = categoryById(rule.category);
  const supportCategories = rule.support
    .map((focus) => categoryById(focusRule(focus).category));
  const primaryPoses = posesForLevel(category, difficulty);
  const supportPoses = supportCategories.flatMap((item) => posesForLevel(item, difficulty));
  const fallbackPoses = YOGA_CATEGORIES.flatMap((item) => posesForLevel(item, difficulty));
  const ordered = [...primaryPoses, ...supportPoses, ...fallbackPoses];
  const warmup = totalSeconds(WARMUP_STEPS.slice(0, 3));
  const cooldown = totalSeconds(COOLDOWN_STEPS.slice(0, 2));
  const activityCount = Math.min(
    ordered.length || 1,
    countMainActivities(durationMin, warmup, cooldown, ordered[0]?.durationSec ?? 45),
  );
  const title = slot % 2 === 0 ? `${category?.name ?? primary} Flow` : rule.title;
  return {
    kind: "yoga" as const,
    title,
    categoryId: category?.id ?? "general",
    categoryLabel: category?.name ?? primary,
    activityCount,
  };
}

function pickExercisePlan(
  primary: string,
  difficulty: "Beginner" | "Intermediate",
  durationMin: number,
  equipment: string[],
) {
  const rule = focusRule(primary);
  const primaryExercises = exercisesForLevel(rule.exercise, difficulty, equipment);
  const fallbackExercises = EXERCISES.filter((exercise) => exercise.level === difficulty);
  const ordered = [...primaryExercises, ...fallbackExercises];
  const activityCount = Math.min(
    ordered.length || 1,
    countMainActivities(durationMin, 120, 120, ordered[0]?.durationSec ?? 60),
  );
  return {
    kind: "exercise" as const,
    title: `${primary} Workout`,
    categoryId: rule.exercise,
    categoryLabel: rule.exercise,
    activityCount,
  };
}

export function generateSevenDayPlan(onboarding: Partial<OnboardingData>): PlannedDay[] {
  const durationMin = selectedDuration(onboarding.workoutDuration);
  const frequency = selectedFrequency(onboarding.workoutFrequency);
  const mainDays = new Set(mainDaysForFrequency(frequency));
  const difficulty = normalizeDifficulty(onboarding.fitnessLevel);
  const primary = normalizeFocus(onboarding);
  const equipment = onboarding.equipment?.includes("No equipment") ? [] : (onboarding.equipment ?? []);
  let slot = 0;

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    if (!mainDays.has(day)) {
      return {
        day,
        title: "Rest / Recovery",
        kind: "recovery",
        focus: "Recovery",
        support: "Gentle breathing, mobility, or a walk if it feels good.",
        categoryId: "recovery",
        categoryLabel: "Recovery",
        difficulty,
        durationMin: 0,
        activityCount: 0,
        isMain: false,
        href: "/plan",
        phases: ["Recovery day"],
      };
    }

    slot += 1;
    const useExercise = slot % 3 === 0 && primary !== "Relaxation" && primary !== "Better Sleep";
    const picked = useExercise
      ? pickExercisePlan(primary, difficulty, durationMin, equipment)
      : pickYogaPlan(primary, difficulty, durationMin, slot);
    const source = `source=plan&day=${day}`;
    const href =
      picked.kind === "yoga"
        ? `/practice?category=${encodeURIComponent(picked.categoryId)}&${source}`
        : `/exercise-practice?category=${encodeURIComponent(picked.categoryId)}&${source}`;

    return {
      day,
      title: picked.title,
      kind: picked.kind,
      focus: primary,
      support: focusRule(primary).support.join(" + "),
      categoryId: picked.categoryId,
      categoryLabel: picked.categoryLabel,
      difficulty,
      durationMin,
      activityCount: picked.activityCount,
      isMain: true,
      href,
      phases: ["Warm-up", "Main workout", "Cool-down"],
    };
  });
}