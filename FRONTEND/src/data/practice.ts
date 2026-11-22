export interface PracticeStep {
  id: string;
  name: string;
  sanskrit?: string;
  durationSec: number;
  cue: string;
  breathing: string;
  imagePrompt?: string;
  /** Optional step-by-step instructions (falls back to `cue`). */
  instructions?: string[];
  /** Optional image key override, e.g. reuse an existing pose picture. */
  imageKey?: string;
}

export const WARMUP_STEPS: PracticeStep[] = [
  {
    id: "warmup-neck-rolls",
    name: "Neck Rolls",
    durationSec: 30,
    cue: "Slowly drop the chin to the chest and roll the head in a gentle circle, then reverse direction.",
    breathing: "Breathe smoothly and evenly, relaxing the shoulders away from the ears.",
    imagePrompt: "A person seated cross-legged on a yoga mat gently tilting the head to one side in a slow neck roll, shoulders relaxed, eyes closed, viewed from the front.",
  },
  {
    id: "warmup-shoulder-rolls",
    name: "Shoulder Rolls",
    durationSec: 30,
    cue: "Lift the shoulders up toward the ears, roll them back and down in a circular motion.",
    breathing: "Inhale as the shoulders lift, exhale as they roll back and down.",
    imagePrompt: "A person seated on a yoga mat with shoulders lifted up toward the ears mid-roll, arms relaxed at the sides, viewed from the front.",
  },
  {
    id: "warmup-wrist-circles",
    name: "Wrist Circles",
    durationSec: 20,
    cue: "Extend the arms forward and rotate the wrists in slow circles, then reverse direction.",
    breathing: "Breathe naturally and steadily throughout the movement.",
    imagePrompt: "A person seated on a yoga mat with arms extended forward and wrists rotating in a circular motion, fingers relaxed, viewed from the front.",
  },
  {
    id: "warmup-elbow-circles",
    name: "Elbow Circles",
    durationSec: 20,
    cue: "Place fingertips on the shoulders and rotate the elbows in large circles.",
    breathing: "Breathe evenly, coordinating breath with the rhythm of the circles.",
    imagePrompt: "A person seated on a yoga mat with fingertips resting on the shoulders and elbows circling outward, viewed from the front.",
  },
  {
    id: "warmup-hip-circles",
    name: "Hip Circles",
    durationSec: 30,
    cue: "Stand with hands on the hips and draw slow, wide circles with the hips in one direction, then reverse.",
    breathing: "Breathe steadily and naturally as the hips circle.",
    imagePrompt: "A person standing on a yoga mat with hands on the hips, hips shifted to one side mid-circular movement, knees soft, viewed from the front.",
  },
  {
    id: "warmup-knee-circles",
    name: "Knee Circles",
    durationSec: 20,
    cue: "Stand with feet together, place hands on the knees, and gently rotate the knees in a circle.",
    breathing: "Breathe smoothly, keeping the movement slow and controlled.",
    imagePrompt: "A person standing on a yoga mat with feet together and knees slightly bent, hands resting on the knees, knees rotating in a gentle circle, viewed from the side.",
  },
  {
    id: "warmup-ankle-rotations",
    name: "Ankle Rotations",
    durationSec: 20,
    cue: "Lift one foot slightly off the floor and rotate the ankle in circles, then switch feet.",
    breathing: "Breathe naturally while balancing on the standing leg.",
    imagePrompt: "A person standing on one leg on a yoga mat with the other foot lifted slightly off the floor, ankle rotating in a circle, arms out for balance, viewed from the side.",
  },
  {
    id: "warmup-cat-cow",
    name: "Spinal Cat-Cow",
    durationSec: 40,
    cue: "On hands and knees, arch the back and lift the chest for Cow, then round the spine for Cat.",
    breathing: "Inhale into Cow, arching the spine; exhale into Cat, rounding the spine.",
    imagePrompt: "A person on hands and knees on a yoga mat with the spine arched and chest lifted in Cow pose, transitioning toward a rounded spine in Cat pose, viewed from the side.",
  },
  {
    id: "warmup-side-bends",
    name: "Standing Side Bends",
    durationSec: 30,
    cue: "Reach both arms overhead and lean gently to one side, then the other.",
    breathing: "Inhale to lengthen the spine, exhale to lean into the stretch.",
    imagePrompt: "A person standing on a yoga mat with both arms extended overhead, torso leaning gently to one side in a side bend, viewed from the front.",
  },
  {
    id: "warmup-gentle-twists",
    name: "Gentle Standing Twists",
    durationSec: 30,
    cue: "Stand tall and gently rotate the torso from side to side, letting the arms swing loosely.",
    breathing: "Breathe naturally, exhaling as you rotate into each twist.",
    imagePrompt: "A person standing on a yoga mat with arms relaxed and torso rotated to one side in a gentle twist, feet planted, viewed from the front.",
  },
];

export const COOLDOWN_STEPS: PracticeStep[] = [
  {
    id: "cooldown-supine-twist",
    name: "Supine Twist",
    sanskrit: "Supta Matsyendrāsana",
    durationSec: 45,
    cue: "Lying on the back, drop both knees to one side while keeping the shoulders grounded.",
    breathing: "Inhale to lengthen the spine, exhale to settle deeper into the twist.",
    imagePrompt: "A person lying on their back on a yoga mat with both knees dropped to one side and arms extended out at shoulder height, head turned in the opposite direction of the knees, viewed from above.",
  },
  {
    id: "cooldown-legs-up",
    name: "Legs-Up-the-Wall",
    sanskrit: "Viparīta Karaṇī",
    durationSec: 90,
    cue: "Rest the legs straight up against a wall with the hips close to the base.",
    breathing: "Breathe slowly and deeply, letting the exhale last longer than the inhale.",
    imagePrompt: "A person lying on their back on a yoga mat with legs extended straight up a wall, arms resting relaxed at the sides, eyes closed, viewed from the side.",
  },
  {
    id: "cooldown-childs-pose",
    name: "Child's Pose",
    sanskrit: "Bālāsana",
    durationSec: 60,
    cue: "Sit the hips back to the heels and fold forward with arms extended or resting alongside the body.",
    breathing: "Breathe deeply into the back ribs, softening the hips with each exhale.",
    imagePrompt: "A person kneeling on a yoga mat with hips resting back on the heels, torso folded forward over the thighs, arms extended forward on the mat, forehead resting on the ground, viewed from the side.",
  },
  {
    id: "cooldown-savasana",
    name: "Corpse Pose",
    sanskrit: "Śavāsana",
    durationSec: 120,
    cue: "Lie flat on the back with arms and legs relaxed, releasing all effort in the body.",
    breathing: "Let the breath become slow, natural, and effortless.",
    imagePrompt: "A person lying flat on their back on a yoga mat with arms resting slightly away from the body and palms facing up, legs relaxed and slightly apart, eyes closed, viewed from above.",
  },
  {
    id: "cooldown-belly-breathing",
    name: "Deep Belly Breathing",
    durationSec: 60,
    cue: "Rest one or both hands on the belly and feel it rise and fall with each breath.",
    breathing: "Inhale slowly through the nose, feeling the belly expand; exhale fully, feeling it fall.",
    imagePrompt: "A person lying on their back on a yoga mat with both hands resting gently on the belly, eyes closed, body relaxed and still, viewed from above.",
  },
];

/**
 * Breathing exercises (Pranayama). They are practiced in a seated position, so
 * they reuse the existing seated-pose pictures instead of new images.
 */
export const PRANAYAMA_STEPS: PracticeStep[] = [
  {
    id: "pranayama-sama-vritti",
    name: "Equal Breathing",
    sanskrit: "Sama Vṛtti",
    durationSec: 90,
    cue: "Sit tall and make each inhale and exhale the same length.",
    instructions: [
      "Sit comfortably with the spine tall and hands resting on the knees.",
      "Inhale through the nose for a count of four.",
      "Exhale through the nose for a count of four.",
      "Keep the breath smooth and even, without strain.",
    ],
    breathing: "Inhale 4 counts, exhale 4 counts, through the nose.",
    imageKey: "pose:sukhasana",
  },
  {
    id: "pranayama-nadi-shodhana",
    name: "Alternate Nostril Breathing",
    sanskrit: "Nāḍī Śodhana",
    durationSec: 150,
    cue: "Breathe in through one nostril and out through the other, switching sides.",
    instructions: [
      "Sit tall and rest the left hand on the left knee.",
      "Close the right nostril with the right thumb and inhale through the left.",
      "Close the left nostril with the ring finger, release the thumb and exhale through the right.",
      "Inhale through the right, switch, and exhale through the left. That is one round.",
    ],
    breathing: "Slow, quiet breaths; never force or hold the breath.",
    imageKey: "pose:padmasana",
  },
  {
    id: "pranayama-bhramari",
    name: "Humming Bee Breath",
    sanskrit: "Bhrāmarī",
    durationSec: 90,
    cue: "Exhale with a soft, steady humming sound to calm the mind.",
    instructions: [
      "Sit tall and close the eyes.",
      "Gently close the ears with the thumbs or index fingers.",
      "Inhale deeply through the nose.",
      "Exhale slowly while making a low humming sound like a bee.",
    ],
    breathing: "Long inhale through the nose, longer humming exhale.",
    imageKey: "pose:vajrasana",
  },
  {
    id: "pranayama-ujjayi",
    name: "Ocean Breath",
    sanskrit: "Ujjāyī",
    durationSec: 90,
    cue: "Slightly narrow the throat so the breath makes a soft ocean sound.",
    instructions: [
      "Sit comfortably with a long spine.",
      "Breathe in and out through the nose.",
      "Gently constrict the back of the throat to create a soft whispering sound.",
      "Keep the inhale and exhale long and steady.",
    ],
    breathing: "Slow nasal breaths with a soft sound in the throat.",
    imageKey: "pose:sukhasana",
  },
  {
    id: "pranayama-anulom-deep",
    name: "Three-Part Breath",
    sanskrit: "Dīrgha Prāṇāyāma",
    durationSec: 90,
    cue: "Fill the belly, ribs and chest in turn, then empty in reverse.",
    instructions: [
      "Sit tall or lie down comfortably.",
      "Inhale into the belly, then the ribs, then the upper chest.",
      "Exhale from the chest, then the ribs, then the belly.",
      "Keep the breath slow and continuous.",
    ],
    breathing: "One long inhale in three parts, one long exhale in three parts.",
    imageKey: "pose:padmasana",
  },
];
