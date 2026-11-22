/**
 * Builds a varied, professionally structured Yoga Abhyas session whose total
 * length matches the selected duration EXACTLY (e.g. 45 min = 2700 s).
 *
 * Instead of repeating the same poses in rounds, the session is split into
 * five stages, each with its own share of the time:
 *   Warm-up → Main Poses → Pranayama → Stretching → Relaxation
 * Short rest breaks are placed between main poses and between stages.
 * Every pose appears at most once. Long sessions get longer, realistic holds
 * and extra poses from the existing HomeFit pose library — never duplicates.
 */
import { ALL_POSES, findPose, type YogaCategory, type YogaPose } from "@/data/yoga";
import { COOLDOWN_STEPS, PRANAYAMA_STEPS, WARMUP_STEPS, type PracticeStep } from "@/data/practice";

export type YogaStage =
  | "Warm-up"
  | "Main Poses"
  | "Pranayama"
  | "Stretching"
  | "Relaxation"
  | "Rest";

export interface YogaSessionItem {
  stage: YogaStage;
  key: string;
  name: string;
  sanskrit?: string | undefined;
  durationSec: number;
  cue: string;
  instructions: string[];
  breathing: string;
  imageKey: string;
  /** Rest breaks are timed but are not counted as completed activities. */
  countable: boolean;
}

/** Share of the session each stage receives (sums to 1). */
export const STAGE_SHARES = {
  warmup: 0.12,
  main: 0.48,
  pranayama: 0.13,
  stretching: 0.12,
  relaxation: 0.15,
} as const;

const REST_SEC = 15;
/** A rest break after every N main poses. */
const REST_EVERY = 3;

/** Stretch-type poses from the existing library used in the Stretching stage. */
const STRETCH_POSE_IDS = [
  "janu-sirsasana",
  "paschimottanasana",
  "baddha-konasana",
  "gomukhasana",
  "supta-matsyendrasana",
  "apanasana",
  "parsvottanasana",
  "uttanasana",
];

/** Cool-down steps that are the same pose as a library pose (avoid duplicates). */
const COOLDOWN_POSE_EQUIV: Record<string, string> = {
  "cooldown-childs-pose": "balasana",
  "cooldown-savasana": "savasana",
  "cooldown-legs-up": "viparita-karani",
  "cooldown-supine-twist": "supta-matsyendrasana",
};

const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function stepItem(step: PracticeStep, stage: YogaStage, durationSec: number): YogaSessionItem {
  return {
    stage,
    key: step.id,
    name: step.name,
    sanskrit: step.sanskrit,
    durationSec,
    cue: step.cue,
    instructions: step.instructions ?? [step.cue],
    breathing: step.breathing,
    imageKey: step.imageKey ?? `practice:${step.id}`,
    countable: true,
  };
}

function poseItem(pose: YogaPose, stage: YogaStage, durationSec: number): YogaSessionItem {
  return {
    stage,
    key: pose.id,
    name: pose.name,
    sanskrit: pose.sanskrit,
    durationSec,
    cue: pose.instructions[0] ?? "",
    instructions: pose.instructions,
    breathing: pose.breathing,
    imageKey: `pose:${pose.id}`,
    countable: true,
  };
}

function restItem(n: number, sec: number, nextName?: string): YogaSessionItem {
  return {
    stage: "Rest",
    key: `rest-${n}`,
    name: "Rest & Reset",
    durationSec: sec,
    cue: nextName ? `Relax and get ready for ${nextName}.` : "Relax and let your breath settle.",
    instructions: [
      "Come to a comfortable position.",
      "Shake out the arms and legs gently.",
      "Sip water if you need to.",
    ],
    breathing: "Breathe naturally through the nose and let the heart rate settle.",
    imageKey: "",
    countable: false,
  };
}

interface Candidate {
  base: number;
  make: (sec: number) => YogaSessionItem;
}

/**
 * Picks unique candidates in order until the budget is used. If candidates run
 * out first, the remaining time is spread across the chosen items as longer
 * holds (still capped), never by repeating an item.
 */
function fillStage(
  cands: Candidate[],
  budget: number,
  minSec: number,
  maxSec: number,
  restBetween = 0,
): { items: YogaSessionItem[]; used: number } {
  const picked: { c: Candidate; sec: number }[] = [];
  let used = 0;
  for (const c of cands) {
    const restCost = restBetween > 0 && picked.length > 0 && picked.length % REST_EVERY === 0 ? restBetween : 0;
    if (used + restCost + minSec > budget) break;
    const sec = Math.min(round5(clamp(c.base, minSec, maxSec)), budget - used - restCost);
    picked.push({ c, sec });
    used += sec + restCost;
  }
  // Stretch holds to use leftover time (up to maxSec each).
  let left = budget - used;
  while (left >= 5 && picked.some((p) => p.sec < maxSec)) {
    for (const p of picked) {
      if (left < 5) break;
      if (p.sec < maxSec) {
        const add = Math.min(5, maxSec - p.sec, left);
        p.sec += add;
        left -= add;
        used += add;
      }
    }
  }
  const items: YogaSessionItem[] = [];
  picked.forEach((p, i) => {
    if (restBetween > 0 && i > 0 && i % REST_EVERY === 0) {
      items.push(restItem(i, restBetween, p.c.make(p.sec).name));
    }
    items.push(p.c.make(p.sec));
  });
  return { items, used };
}

function levelRank(level: YogaPose["level"]) {
  return level === "Beginner" ? 0 : level === "Intermediate" ? 1 : 2;
}

export function buildYogaSession(category: YogaCategory, targetMin: number): YogaSessionItem[] {
  const target = Math.max(1, Math.round(targetMin)) * 60;
  const long = target >= 30 * 60;
  const usedPoseIds = new Set<string>(["savasana"]); // Savasana always closes the session.

  // ---------- Warm-up ----------
  const warmBudget = Math.round(target * STAGE_SHARES.warmup);
  const warm = fillStage(
    WARMUP_STEPS.map((s) => ({ base: s.durationSec, make: (sec) => stepItem(s, "Warm-up", sec) })),
    warmBudget,
    20,
    long ? 60 : 45,
  );

  // ---------- Main poses: category first, then unique library poses ----------
  const maxLevel = Math.max(...category.poses.map((p) => levelRank(p.level)), 0);
  const categoryPoses = category.poses.filter((p) => p.id !== "savasana");
  const stretchIds = new Set(STRETCH_POSE_IDS);
  const extraPoses = ALL_POSES.filter(
    (p) =>
      !categoryPoses.some((c) => c.id === p.id) &&
      p.id !== "savasana" &&
      !stretchIds.has(p.id) &&
      !Object.values(COOLDOWN_POSE_EQUIV).includes(p.id) &&
      levelRank(p.level) <= Math.min(maxLevel, 1),
  );
  const mainBudget = Math.round(target * STAGE_SHARES.main);
  const mainPool = [...categoryPoses, ...extraPoses];
  const main = fillStage(
    mainPool.map((p) => ({
      base: long ? p.durationSec * 1.5 : p.durationSec,
      make: (sec) => poseItem(p, "Main Poses", sec),
    })),
    mainBudget,
    25,
    long ? 90 : 60,
    REST_SEC,
  );
  main.items.forEach((i) => i.stage === "Main Poses" && usedPoseIds.add(i.key));

  // ---------- Pranayama ----------
  const pranBudget = Math.round(target * STAGE_SHARES.pranayama);
  const pran = fillStage(
    PRANAYAMA_STEPS.map((s) => ({ base: s.durationSec, make: (sec) => stepItem(s, "Pranayama", sec) })),
    pranBudget,
    40,
    long ? 240 : 120,
  );

  // ---------- Stretching ----------
  const stretchPoses = STRETCH_POSE_IDS.map((id) => findPose(id)).filter(
    (p): p is YogaPose => !!p && !usedPoseIds.has(p.id),
  );
  const stretchBudget = Math.round(target * STAGE_SHARES.stretching);
  const stretch = fillStage(
    stretchPoses.map((p) => ({ base: Math.max(45, p.durationSec), make: (sec) => poseItem(p, "Stretching", sec) })),
    stretchBudget,
    30,
    long ? 120 : 75,
  );
  stretch.items.forEach((i) => usedPoseIds.add(i.key));

  // ---------- Relaxation (Savasana always last and absorbs the remainder) ----------
  const relaxSteps = COOLDOWN_STEPS.filter(
    (s) => s.id !== "cooldown-savasana" && !usedPoseIds.has(COOLDOWN_POSE_EQUIV[s.id] ?? ""),
  );
  const savasanaStep = COOLDOWN_STEPS.find((s) => s.id === "cooldown-savasana")!;
  const stageRests = 2; // before Pranayama and before Relaxation
  const relaxBudget =
    target - warm.used - main.used - pran.used - stretch.used - stageRests * REST_SEC;
  const savasanaMin = clamp(round5(relaxBudget * 0.4), 30, 600);
  const relax = fillStage(
    relaxSteps.map((s) => ({ base: s.durationSec, make: (sec) => stepItem(s, "Relaxation", sec) })),
    Math.max(0, relaxBudget - savasanaMin),
    30,
    long ? 180 : 90,
  );

  const items: YogaSessionItem[] = [
    ...warm.items,
    ...main.items,
    restItem(900, REST_SEC, "breathing practice"),
    ...pran.items,
    ...stretch.items,
    restItem(901, REST_SEC, "relaxation"),
    ...relax.items,
  ];
  const sumSoFar = items.reduce((s, i) => s + i.durationSec, 0);
  items.push(stepItem(savasanaStep, "Relaxation", Math.max(30, target - sumSoFar)));

  // Safety net for very short sessions: trim from the longest items so the
  // total is still exact.
  let over = items.reduce((s, i) => s + i.durationSec, 0) - target;
  while (over > 0) {
    const longest = items.reduce((a, b) => (b.durationSec > a.durationSec ? b : a));
    const cut = Math.min(over, longest.durationSec - 15);
    if (cut <= 0) break;
    longest.durationSec -= cut;
    over -= cut;
  }
  return items;
}

export function yogaSessionSeconds(items: { durationSec: number }[]) {
  return items.reduce((s, i) => s + i.durationSec, 0);
}
