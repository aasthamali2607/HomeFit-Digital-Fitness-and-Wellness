export type ExerciseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Exercise {
  id: string;
  name: string;
  category: string;
  level: ExerciseLevel;
  durationSec: number;
  muscle: string;
  icon: string;
  cue: string;
  breathing: string;
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const RAW: Omit<Exercise, "id">[] = [
  {
    name: "Downward Dog",
    category: "Flexibility",
    level: "Beginner",
    durationSec: 60,
    muscle: "Full Body",
    icon: "🐕",
    cue: "Press the palms firmly into the floor and lift the hips up and back, forming an inverted V shape.",
    breathing: "Breathe slowly and evenly, letting the heels sink toward the mat with each exhale.",
  },
  {
    name: "Plank Hold",
    category: "Core",
    level: "Beginner",
    durationSec: 30,
    muscle: "Core",
    icon: "💪",
    cue: "Keep the body in one straight line from head to heels, core braced, shoulders over wrists.",
    breathing: "Breathe steadily — don't hold your breath. Keep the ribs pulled in.",
  },
  {
    name: "Squat",
    category: "Lower Body",
    level: "Beginner",
    durationSec: 60,
    muscle: "Legs & Glutes",
    icon: "🦵",
    cue: "Sit the hips back and down as if lowering into a chair, chest up, knees tracking over the toes.",
    breathing: "Inhale on the way down, exhale as you drive back up.",
  },
  {
    name: "Push-up",
    category: "Upper Body",
    level: "Beginner",
    durationSec: 60,
    muscle: "Chest & Arms",
    icon: "🏋️",
    cue: "Lower the chest toward the floor with elbows at about 45°, then press back up to full extension.",
    breathing: "Inhale as you lower, exhale as you push up.",
  },
  {
    name: "Mountain Climbers",
    category: "Cardio",
    level: "Intermediate",
    durationSec: 30,
    muscle: "Full Body",
    icon: "⛰️",
    cue: "From a plank position, drive the knees toward the chest in a quick alternating run.",
    breathing: "Keep breathing quick and rhythmic, matching the pace of your legs.",
  },
  {
    name: "Warrior I",
    category: "Flexibility",
    level: "Beginner",
    durationSec: 60,
    muscle: "Hips & Legs",
    icon: "🧘‍♀️",
    cue: "Step one foot back, square the hips forward, and reach both arms overhead.",
    breathing: "Breathe deeply, lengthening the spine on each inhale.",
  },
  {
    name: "Burpee",
    category: "Full Body",
    level: "Intermediate",
    durationSec: 60,
    muscle: "Full Body",
    icon: "🔥",
    cue: "Drop into a squat, kick back to a plank, then explode back up into a jump.",
    breathing: "Exhale on the jump, inhale as you reset.",
  },
  {
    name: "Bridge",
    category: "Lower Body",
    level: "Beginner",
    durationSec: 45,
    muscle: "Glutes & Back",
    icon: "🌉",
    cue: "Lying on your back, press through the heels and lift the hips toward the ceiling.",
    breathing: "Exhale as you lift, inhale as you lower back down with control.",
  },
  {
    name: "Tricep Dip",
    category: "Upper Body",
    level: "Beginner",
    durationSec: 60,
    muscle: "Arms",
    icon: "💪",
    cue: "Hands on a sturdy edge, lower the body by bending the elbows straight back, then press up.",
    breathing: "Inhale on the way down, exhale as you press up.",
  },
  {
    name: "Dead Bug",
    category: "Core",
    level: "Beginner",
    durationSec: 60,
    muscle: "Core & Stability",
    icon: "🐞",
    cue: "Lying on your back, extend opposite arm and leg slowly while keeping the low back pressed down.",
    breathing: "Exhale as you extend, inhale as you return to center.",
  },
  {
    name: "Jumping Jacks",
    category: "Cardio",
    level: "Beginner",
    durationSec: 120,
    muscle: "Full Body",
    icon: "⚡",
    cue: "Jump the feet out while raising the arms overhead, then jump back to start.",
    breathing: "Keep breathing light and continuous throughout.",
  },
  {
    name: "Cat-Cow",
    category: "Flexibility",
    level: "Beginner",
    durationSec: 120,
    muscle: "Spine",
    icon: "🐱",
    cue: "On hands and knees, alternate between arching and rounding the spine slowly.",
    breathing: "Inhale as you arch (cow), exhale as you round (cat).",
  },
];

export const EXERCISES: Exercise[] = RAW.map((e) => ({ id: slug(e.name), ...e }));

export const EXERCISE_CATEGORIES = [
  "All",
  ...Array.from(new Set(EXERCISES.map((e) => e.category))),
];

export function findExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function exercisesForCategory(category: string | undefined): Exercise[] {
  if (!category || category === "All") return EXERCISES;
  return EXERCISES.filter((e) => e.category === category);
}
