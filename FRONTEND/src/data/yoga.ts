export type PoseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface YogaPose {
  id: string;
  name: string;
  sanskrit: string;
  level: PoseLevel;
  durationSec: number;
  breathing: string;
  instructions: string[];
  benefits: string[];
  precautions: string[];
  imagePrompt: string;
}

export interface YogaCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  poses: YogaPose[];
}

const TADASANA: YogaPose = {
  id: "tadasana",
  name: "Mountain Pose",
  sanskrit: "Tāḍāsana",
  level: "Beginner",
  durationSec: 30,
  breathing: "Breathe slowly and evenly through the nose, lengthening the spine on each inhale.",
  instructions: [
    "Stand with big toes touching, heels slightly apart, weight evenly spread across both feet.",
    "Engage the thighs and draw the kneecaps upward without locking the knees.",
    "Lengthen the tailbone down while lifting the crown of the head toward the ceiling.",
    "Roll the shoulders back and down, letting the arms rest by the sides with palms facing forward.",
    "Soften the jaw and gaze softly forward at a fixed point.",
  ],
  benefits: [
    "Improves overall posture and body awareness",
    "Strengthens thighs, knees, and ankles",
    "Reduces flat feet by engaging the arches",
    "Calms the mind through steady, grounded breathing",
  ],
  precautions: [
    "Use caution if you have low blood pressure or dizziness",
    "Avoid locking the knees if you have hyperextension issues",
    "Keep feet hip-width apart if balance is compromised",
  ],
  imagePrompt: "A person standing upright on a yoga mat in a neutral standing pose, feet together, arms relaxed at the sides with palms facing forward, spine tall, shoulders level, gaze forward, viewed from the front.",
};

const ADHO_MUKHA_SVANASANA: YogaPose = {
  id: "adho-mukha-svanasana",
  name: "Downward-Facing Dog",
  sanskrit: "Adho Mukha Śvānāsana",
  level: "Beginner",
  durationSec: 45,
  breathing: "Inhale to lengthen the spine, exhale to press the heels toward the mat.",
  instructions: [
    "Start on hands and knees with wrists under shoulders and knees under hips.",
    "Tuck the toes and lift the hips up and back to form an inverted V shape.",
    "Press firmly through the palms and spread the fingers wide.",
    "Draw the heels toward the floor while keeping a slight bend in the knees if needed.",
    "Let the head hang relaxed between the upper arms, gaze toward the navel.",
  ],
  benefits: [
    "Stretches the shoulders, hamstrings, calves, and spine",
    "Strengthens the arms and legs",
    "Improves circulation by gently inverting the body",
    "Relieves stress and mild fatigue",
  ],
  precautions: [
    "Avoid with carpal tunnel syndrome or wrist injury",
    "Modify or avoid with high blood pressure or glaucoma",
    "Use caution with shoulder injuries",
  ],
  imagePrompt: "A person forming an inverted V shape on a yoga mat, hands and feet on the ground shoulder- and hip-width apart, arms and legs straight, hips lifted high, head hanging relaxed between the arms, heels reaching toward the mat, viewed from the side.",
};

const BALASANA: YogaPose = {
  id: "balasana",
  name: "Child's Pose",
  sanskrit: "Bālāsana",
  level: "Beginner",
  durationSec: 60,
  breathing: "Breathe deeply into the back ribs, letting each exhale soften the hips toward the heels.",
  instructions: [
    "Kneel on the mat with big toes touching and knees hip-width or wider apart.",
    "Sit the hips back toward the heels.",
    "Fold forward, walking the hands out in front of you.",
    "Rest the forehead gently on the mat.",
    "Relax the shoulders away from the ears and let the arms rest.",
  ],
  benefits: [
    "Gently stretches the hips, thighs, and lower back",
    "Calms the nervous system and relieves stress",
    "Relieves neck and back tension",
  ],
  precautions: [
    "Avoid with knee injuries unless well-cushioned",
    "Use caution during pregnancy; widen the knees to make room for the belly",
    "Avoid if you have diarrhea or severe knee arthritis",
  ],
  imagePrompt: "A person kneeling on a yoga mat, hips resting back on the heels, torso folded forward over the thighs, arms extended forward on the mat, forehead resting on the ground, viewed from the side.",
};

const BHUJANGASANA: YogaPose = {
  id: "bhujangasana",
  name: "Cobra Pose",
  sanskrit: "Bhujaṅgāsana",
  level: "Beginner",
  durationSec: 30,
  breathing: "Inhale as you lift the chest, exhale to soften the shoulders down away from the ears.",
  instructions: [
    "Lie face down with legs extended, tops of the feet on the mat.",
    "Place the palms under the shoulders, elbows hugging the ribs.",
    "Press the tops of the feet and thighs firmly into the mat.",
    "Inhale and lift the chest off the floor, keeping the lower ribs grounded.",
    "Keep a slight bend in the elbows and shoulders relaxed away from the ears.",
  ],
  benefits: [
    "Strengthens the spine and back muscles",
    "Opens the chest and shoulders",
    "Improves flexibility of the upper and middle back",
  ],
  precautions: [
    "Avoid with recent back or spine surgery",
    "Avoid during pregnancy",
    "Use caution with carpal tunnel syndrome or wrist injury",
  ],
  imagePrompt: "A person lying face down on a yoga mat with legs extended together, upper body lifted off the floor by pressing the palms into the mat, elbows slightly bent close to the ribs, chest open, head lifted with a gentle backward tilt, gaze forward and slightly upward, viewed from the side.",
};

const SAVASANA: YogaPose = {
  id: "savasana",
  name: "Corpse Pose",
  sanskrit: "Śavāsana",
  level: "Beginner",
  durationSec: 90,
  breathing: "Let the breath become slow, natural, and effortless, releasing tension with every exhale.",
  instructions: [
    "Lie flat on the back with legs extended and slightly apart.",
    "Let the feet fall open naturally to the sides.",
    "Rest the arms alongside the body, palms facing up.",
    "Close the eyes and release all effort in the muscles.",
    "Allow the whole body to become heavy and still.",
  ],
  benefits: [
    "Deeply relaxes the nervous system",
    "Lowers heart rate and blood pressure",
    "Integrates the effects of a yoga practice",
  ],
  precautions: [
    "Support the knees with a bolster if lower back is uncomfortable",
    "Turn onto the left side to rest during pregnancy instead of lying flat",
  ],
  imagePrompt: "A person lying flat on their back on a yoga mat, arms resting slightly away from the body with palms facing upward, legs relaxed and slightly apart, eyes closed, body completely still, viewed from above.",
};

const SUKHASANA: YogaPose = {
  id: "sukhasana",
  name: "Easy Pose",
  sanskrit: "Sukhāsana",
  level: "Beginner",
  durationSec: 60,
  breathing: "Breathe smoothly and evenly, feeling the belly rise and fall.",
  instructions: [
    "Sit on the floor or a cushion with legs crossed simply at the shins.",
    "Stack the hips slightly above the knees using a blanket if needed.",
    "Rest the hands on the knees, palms up or down.",
    "Lengthen the spine from the base to the crown of the head.",
    "Relax the shoulders and soften the face.",
  ],
  benefits: [
    "Calms the mind and reduces anxiety",
    "Opens the hips gently",
    "Improves posture and spinal alignment",
  ],
  precautions: [
    "Sit on a cushion if hips are tight to protect the knees",
    "Avoid prolonged sitting with a rounded spine if you have low back issues",
  ],
  imagePrompt: "A person sitting cross-legged on a yoga mat with a tall straight spine, hands resting on the knees, shoulders relaxed, eyes closed, viewed from the front.",
};

const UTTANASANA: YogaPose = {
  id: "uttanasana",
  name: "Standing Forward Bend",
  sanskrit: "Uttānāsana",
  level: "Beginner",
  durationSec: 45,
  breathing: "Exhale as you fold forward, then breathe steadily while releasing the neck.",
  instructions: [
    "Stand with feet hip-width apart.",
    "Hinge at the hips and fold the torso over the legs.",
    "Keep a micro-bend in the knees to protect the lower back.",
    "Let the hands rest on the floor, shins, or blocks.",
    "Let the head and neck hang heavy, releasing tension.",
  ],
  benefits: [
    "Stretches the hamstrings and calves",
    "Relieves tension in the neck and spine",
    "Calms the nervous system",
  ],
  precautions: [
    "Bend the knees generously if you have tight hamstrings or back pain",
    "Avoid with glaucoma or retinal disorders",
    "Come up slowly to avoid dizziness",
  ],
  imagePrompt: "A person standing with feet hip-width apart, torso folded forward from the hips over the legs, hands resting near the feet on the mat, head and neck hanging relaxed, knees softly bent, viewed from the side.",
};

const VRKSASANA: YogaPose = {
  id: "vrksasana",
  name: "Tree Pose",
  sanskrit: "Vṛkṣāsana",
  level: "Beginner",
  durationSec: 30,
  breathing: "Breathe steadily and evenly to help maintain balance.",
  instructions: [
    "Stand tall and shift weight onto the left foot.",
    "Place the sole of the right foot on the inner left calf or thigh, avoiding the knee.",
    "Bring the hands to the heart center or extend them overhead.",
    "Fix the gaze on a steady point in front of you.",
    "Keep the standing leg active and the hips level.",
  ],
  benefits: [
    "Improves balance and concentration",
    "Strengthens the ankles, calves, and thighs",
    "Opens the hips",
  ],
  precautions: [
    "Avoid placing the foot directly on the knee joint",
    "Use a wall for support if balance is unsteady",
    "Use caution with high or low blood pressure",
  ],
  imagePrompt: "A person standing on one leg on a yoga mat, the sole of the other foot pressed against the inner standing thigh with the knee pointing outward, hands pressed together at the chest, gaze fixed forward, viewed from the front.",
};

const TRIKONASANA: YogaPose = {
  id: "trikonasana",
  name: "Triangle Pose",
  sanskrit: "Trikoṇāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Inhale to lengthen the spine, exhale as you extend sideways over the front leg.",
  instructions: [
    "Step the feet wide apart, right foot pointing forward, left foot turned in slightly.",
    "Extend the arms out to shoulder height.",
    "Hinge at the right hip and reach the right hand toward the shin, ankle, or a block.",
    "Extend the left arm straight up toward the ceiling.",
    "Turn the gaze up toward the top hand, keeping the chest open.",
  ],
  benefits: [
    "Stretches the legs, hips, and spine",
    "Strengthens the legs and core",
    "Improves stability and balance",
  ],
  precautions: [
    "Avoid deep neck rotation if you have neck injuries",
    "Use caution with high or low blood pressure",
    "Modify with a block if hamstrings are tight",
  ],
  imagePrompt: "A person standing with feet wide apart on a yoga mat, front knee straight, torso tilted sideways over the front leg with the front hand resting near the shin, the other arm reaching straight up toward the ceiling forming a diagonal line, gaze turned up toward the raised hand, viewed from the front.",
};

const SETU_BANDHASANA: YogaPose = {
  id: "setu-bandhasana",
  name: "Bridge Pose",
  sanskrit: "Setu Bandhāsana",
  level: "Beginner",
  durationSec: 45,
  breathing: "Inhale to lift the hips, exhale to press the feet down and broaden the chest.",
  instructions: [
    "Lie on the back with knees bent, feet flat hip-width apart close to the sitting bones.",
    "Press the feet and arms into the mat and lift the hips upward.",
    "Interlace the fingers under the back or keep the arms extended on the mat.",
    "Keep the knees tracking straight ahead, not splaying outward.",
    "Lift the chest toward the chin without straining the neck.",
  ],
  benefits: [
    "Strengthens the glutes, hamstrings, and lower back",
    "Opens the chest and shoulders",
    "Relieves mild backache and fatigue",
  ],
  precautions: [
    "Avoid with neck injury",
    "Use caution during late pregnancy",
    "Avoid with recent shoulder injury",
  ],
  imagePrompt: "A person lying on their back on a yoga mat with knees bent and feet flat on the floor, hips lifted upward off the mat to form a straight diagonal line from shoulders to knees, arms resting on the mat under the raised hips with fingers interlaced, chin tucked slightly, viewed from the side.",
};

const UTKATASANA: YogaPose = {
  id: "utkatasana",
  name: "Chair Pose",
  sanskrit: "Utkaṭāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Inhale to raise the arms, exhale to sink deeper into the thighs.",
  instructions: [
    "Stand with feet together or hip-width apart.",
    "Bend the knees and sit the hips back as if sitting in a chair.",
    "Raise the arms overhead, palms facing inward.",
    "Keep the weight in the heels and the chest lifted.",
    "Draw the tailbone down while lengthening the lower back.",
  ],
  benefits: [
    "Strengthens the thighs, ankles, and back",
    "Builds heat and stamina",
    "Tones the core and stimulates the abdominal organs",
  ],
  precautions: [
    "Avoid with acute knee injury",
    "Use caution with low blood pressure when raising arms overhead",
    "Avoid deep holds during pregnancy",
  ],
  imagePrompt: "A person standing on a yoga mat with knees bent as if sitting in an invisible chair, hips pushed back, torso leaning slightly forward, arms raised straight overhead with palms facing each other, weight in the heels, viewed from the side.",
};

const PHALAKASANA: YogaPose = {
  id: "phalakasana",
  name: "Plank Pose",
  sanskrit: "Phalakāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Breathe steadily and evenly, avoiding breath holding while engaging the core.",
  instructions: [
    "Start on hands and knees with wrists under shoulders.",
    "Step the feet back one at a time into a straight line from head to heels.",
    "Engage the core and thighs to prevent the hips from sagging or piking.",
    "Press the floor away through the palms, spreading the fingers wide.",
    "Keep the neck neutral by gazing slightly forward of the hands.",
  ],
  benefits: [
    "Strengthens the core, shoulders, and arms",
    "Improves overall stability and posture",
    "Builds endurance",
  ],
  precautions: [
    "Avoid with wrist injuries; use forearms instead",
    "Avoid with acute lower back pain",
    "Use caution during pregnancy; avoid deep core compression",
  ],
  imagePrompt: "A person in a straight-arm plank position on a yoga mat, body forming one straight line from head to heels, hands directly under shoulders, feet hip-width apart, core engaged and hips level with the shoulders, gaze down at the mat, viewed from the side.",
};

const VASISTHASANA: YogaPose = {
  id: "vasisthasana",
  name: "Side Plank Pose",
  sanskrit: "Vasiṣṭhāsana",
  level: "Advanced",
  durationSec: 20,
  breathing: "Breathe evenly, exhaling to stabilize the core as you lift the hips.",
  instructions: [
    "From plank pose, shift weight onto the right hand and the outer edge of the right foot.",
    "Stack the left foot on top of the right, or stagger the feet for more stability.",
    "Lift the hips so the body forms a straight diagonal line.",
    "Extend the left arm straight up toward the ceiling.",
    "Keep the supporting shoulder stacked directly over the wrist.",
  ],
  benefits: [
    "Strengthens the wrists, arms, and obliques",
    "Improves balance and coordination",
    "Tones the core",
  ],
  precautions: [
    "Avoid with wrist or shoulder injury",
    "Use caution with carpal tunnel syndrome",
    "Modify by dropping the bottom knee to the mat if unstable",
  ],
  imagePrompt: "A person balancing on one straight arm and the outer edge of one foot on a yoga mat, body forming a straight diagonal line facing sideways, the other arm reaching straight up toward the ceiling, feet stacked together, gaze up toward the raised hand, viewed from the front.",
};

const CHATURANGA_DANDASANA: YogaPose = {
  id: "chaturanga-dandasana",
  name: "Four-Limbed Staff Pose",
  sanskrit: "Caturaṅga Daṇḍāsana",
  level: "Advanced",
  durationSec: 20,
  breathing: "Exhale as you lower the body slowly and with control.",
  instructions: [
    "Start in plank pose with shoulders stacked over wrists.",
    "Shift the weight slightly forward and bend the elbows straight back, hugging them to the ribs.",
    "Lower the body until the elbows reach a right angle, keeping the body in one straight line.",
    "Keep the core engaged so the hips do not sag or pike.",
    "Hold just above the floor without resting the body down.",
  ],
  benefits: [
    "Builds significant upper body and core strength",
    "Prepares the body for arm balances and inversions",
  ],
  precautions: [
    "Avoid with shoulder or wrist injury",
    "Avoid during pregnancy",
    "Practice with knees down as a modification if strength is limited",
  ],
  imagePrompt: "A person holding a low push-up position on a yoga mat, elbows bent at roughly a right angle and hugged close to the ribs, body in one straight line hovering just above the mat, gaze slightly forward, viewed from the side.",
};

const BAKASANA: YogaPose = {
  id: "bakasana",
  name: "Crow Pose",
  sanskrit: "Bakāsana",
  level: "Advanced",
  durationSec: 20,
  breathing: "Breathe steadily and keep the breath calm to maintain focus and balance.",
  instructions: [
    "Squat down with feet close together and place the hands flat on the mat shoulder-width apart.",
    "Bend the elbows slightly and rest the knees against the upper arms or triceps.",
    "Shift the weight forward onto the hands and lift the feet off the floor.",
    "Round the upper back slightly and gaze slightly forward of the hands.",
    "Draw the heels toward the glutes and engage the core to balance.",
  ],
  benefits: [
    "Strengthens the wrists, arms, and core",
    "Improves balance and focus",
    "Builds confidence for arm balances",
  ],
  precautions: [
    "Avoid with wrist injury or carpal tunnel syndrome",
    "Practice near a cushion or bolster in case of falling forward",
    "Avoid during pregnancy",
  ],
  imagePrompt: "A person balancing on both hands on a yoga mat, knees resting on the backs of the upper arms, feet lifted off the floor and drawn toward the glutes, back rounded slightly, gaze forward and down, viewed from the side.",
};

const NAVASANA: YogaPose = {
  id: "navasana",
  name: "Boat Pose",
  sanskrit: "Nāvāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Breathe steadily through the nose, avoiding breath holding as the core engages.",
  instructions: [
    "Sit on the mat with knees bent and feet flat on the floor.",
    "Lean back slightly and lift the feet off the floor, shins parallel to the ground.",
    "Extend the arms forward at shoulder height, palms facing in.",
    "For more challenge, straighten the legs to a V shape.",
    "Keep the spine long rather than rounding the back.",
  ],
  benefits: [
    "Strengthens the deep core and hip flexors",
    "Improves balance and concentration",
    "Tones the abdominal muscles",
  ],
  precautions: [
    "Avoid with lower back injury",
    "Avoid during pregnancy",
    "Bend the knees to modify if the low back rounds",
  ],
  imagePrompt: "A person sitting on a yoga mat balanced on the sitting bones, torso leaning back slightly, legs lifted and straight forming a V shape with the torso, arms extended forward parallel to the floor, spine long, gaze forward, viewed from the side.",
};

const VIRABHADRASANA_II: YogaPose = {
  id: "virabhadrasana-ii",
  name: "Warrior II",
  sanskrit: "Vīrabhadrāsana II",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Breathe steadily, sinking a little deeper into the front knee with each exhale.",
  instructions: [
    "Step the feet wide apart, turning the right foot out ninety degrees and the left foot in slightly.",
    "Bend the right knee to a right angle, keeping it stacked over the ankle.",
    "Extend the arms out at shoulder height, reaching actively through the fingertips.",
    "Keep the torso upright over the hips, facing the long edge of the mat.",
    "Turn the gaze over the front fingertips.",
  ],
  benefits: [
    "Strengthens the legs, hips, and shoulders",
    "Builds stamina and focus",
    "Opens the hips and chest",
  ],
  precautions: [
    "Avoid with knee injury; keep the bend shallow",
    "Use caution with hip injuries",
    "Avoid overextending the front knee past the ankle",
  ],
  imagePrompt: "A person standing with feet wide apart on a yoga mat, front knee bent to a right angle and back leg straight, arms extended out to the sides at shoulder height, torso upright facing sideways, gaze turned over the front hand, viewed from the front.",
};

const PARSVAKONASANA: YogaPose = {
  id: "utthita-parsvakonasana",
  name: "Extended Side Angle Pose",
  sanskrit: "Utthita Pārśvakoṇāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Inhale to lengthen the spine, exhale to extend further over the front leg.",
  instructions: [
    "Step the feet wide apart with the right foot turned out and left foot turned slightly in.",
    "Bend the right knee to a right angle over the ankle.",
    "Rest the right forearm on the right thigh or right hand on a block outside the foot.",
    "Extend the left arm overhead, creating one long line from the back foot to the fingertips.",
    "Open the chest toward the ceiling.",
  ],
  benefits: [
    "Stretches the hips, groin, and side body",
    "Strengthens the legs",
    "Improves stamina and lateral flexibility",
  ],
  precautions: [
    "Avoid with knee or hip injury",
    "Use caution with neck problems when looking up",
    "Avoid deep binds if shoulders are injured",
  ],
  imagePrompt: "A person standing with feet wide apart on a yoga mat, front knee bent to a right angle, front forearm resting on the front thigh, back leg straight, the other arm extended overhead in line with the back leg forming a diagonal, chest open and gaze up, viewed from the front.",
};



const GARUDASANA: YogaPose = {
  id: "garudasana",
  name: "Eagle Pose",
  sanskrit: "Garuḍāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Breathe smoothly and evenly to help maintain balance and focus.",
  instructions: [
    "Stand tall and bend the knees slightly.",
    "Cross the right thigh over the left and hook the right foot behind the left calf if possible.",
    "Cross the left arm over the right arm and bring the palms to touch or backs of hands together.",
    "Lift the elbows to shoulder height and sink the hips slightly lower.",
    "Fix the gaze on a steady point ahead.",
  ],
  benefits: [
    "Improves balance and concentration",
    "Stretches the shoulders, hips, and upper back",
    "Strengthens the ankles and calves",
  ],
  precautions: [
    "Avoid with knee or ankle injury",
    "Use caution with shoulder injuries when wrapping the arms",
  ],
  imagePrompt: "A person standing on one leg on a yoga mat, the other thigh crossed tightly over it with the foot hooked behind the calf, arms crossed and wrapped in front of the chest with palms touching, hips sunk slightly, gaze forward, viewed from the front.",
};

const APANASANA: YogaPose = {
  id: "apanasana",
  name: "Knees-to-Chest Pose",
  sanskrit: "Apānāsana",
  level: "Beginner",
  durationSec: 45,
  breathing: "Breathe deeply into the belly, releasing the lower back with every exhale.",
  instructions: [
    "Lie on the back and draw both knees toward the chest.",
    "Wrap the arms around the shins or hold behind the thighs.",
    "Gently rock side to side to massage the lower back if comfortable.",
    "Keep the shoulders and head resting on the mat.",
    "Relax the jaw and let the lower back broaden.",
  ],
  benefits: [
    "Relieves gas and mild digestive discomfort",
    "Gently stretches the lower back and hips",
    "Calms the nervous system",
  ],
  precautions: [
    "Avoid deep compression during pregnancy",
    "Use caution with recent abdominal or hip surgery",
    "Avoid with severe knee injury; hold behind the thighs instead",
  ],
  imagePrompt: "A person lying flat on their back on a yoga mat with both knees drawn tightly toward the chest, arms wrapped around the shins, head and shoulders resting on the mat, eyes closed, viewed from the side.",
};

const VIPARITA_KARANI: YogaPose = {
  id: "viparita-karani",
  name: "Legs-Up-the-Wall Pose",
  sanskrit: "Viparīta Karaṇī",
  level: "Beginner",
  durationSec: 90,
  breathing: "Breathe slowly and deeply, letting the exhale last longer than the inhale.",
  instructions: [
    "Sit sideways next to a wall, then swing the legs up the wall as you lower the back to the floor.",
    "Scoot the hips as close to the wall as is comfortable.",
    "Rest the arms out to the sides or on the belly, palms up.",
    "Let the legs relax against the wall with a slight bend in the knees if needed.",
    "Close the eyes and soften the whole body.",
  ],
  benefits: [
    "Relieves tired legs and mild swelling",
    "Calms the nervous system and reduces stress",
    "Gently supports venous return from the legs",
  ],
  precautions: [
    "Avoid with glaucoma or serious eye conditions",
    "Avoid during menstruation if fully inverted feels uncomfortable",
    "Use caution with uncontrolled high blood pressure",
  ],
  imagePrompt: "A person lying on their back on a yoga mat with legs extended straight up a wall, hips close to the wall base, arms resting relaxed at the sides with palms facing up, eyes closed, viewed from the side.",
};

const GOMUKHASANA: YogaPose = {
  id: "gomukhasana",
  name: "Cow Face Pose",
  sanskrit: "Gomukhāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Breathe fully into the back and sides of the ribcage as the shoulders open.",
  instructions: [
    "Sit and stack the right knee directly over the left, feet wide beside the hips.",
    "Reach the right arm up, bend the elbow, and drop the hand behind the back.",
    "Sweep the left arm down and behind the back, bending the elbow to reach up.",
    "Clasp the fingers or use a strap if the hands do not meet.",
    "Lengthen the spine and lift the top elbow gently upward.",
  ],
  benefits: [
    "Stretches the shoulders, triceps, and hips",
    "Improves shoulder mobility",
    "Counteracts rounded posture from sitting",
  ],
  precautions: [
    "Avoid with shoulder injury or frozen shoulder",
    "Avoid with knee injury; sit on a cushion to reduce strain",
    "Use a strap rather than forcing the hands to meet",
  ],
  imagePrompt: "A person sitting on a yoga mat with knees stacked tightly one over the other, one arm bent behind the back reaching up between the shoulder blades and the other arm bent overhead reaching down to clasp the fingers behind the back, spine tall, viewed from the side.",
};

const ARDHA_CHANDRASANA: YogaPose = {
  id: "ardha-chandrasana",
  name: "Half Moon Pose",
  sanskrit: "Ardha Candrāsana",
  level: "Advanced",
  durationSec: 25,
  breathing: "Breathe steadily and evenly, using the exhale to stabilize the standing leg.",
  instructions: [
    "From triangle pose, bend the front knee and place the front hand on the floor or a block about a foot ahead of the front foot.",
    "Shift the weight onto the front hand and standing leg while lifting the back leg parallel to the floor.",
    "Open the hips and chest toward the side, stacking one hip over the other.",
    "Extend the top arm straight up toward the ceiling.",
    "Fix the gaze forward or up toward the top hand for balance.",
  ],
  benefits: [
    "Improves balance and core strength",
    "Strengthens the legs and glutes",
    "Opens the hips and chest",
  ],
  precautions: [
    "Practice near a wall for support if balance is unsteady",
    "Avoid with ankle, knee, or hip injury",
    "Use caution with migraine or low blood pressure",
  ],
  imagePrompt: "A person balancing on one straight leg on a yoga mat, the other leg lifted straight back parallel to the floor, the same-side hand pressing into the mat or a block below the shoulder, the top arm extended straight up toward the ceiling, hips stacked and open to the side, gaze upward, viewed from the front.",
};





const MAKARASANA: YogaPose = {
  id: "makarasana",
  name: "Crocodile Pose",
  sanskrit: "Makarāsana",
  level: "Beginner",
  durationSec: 60,
  breathing: "Breathe slowly, feeling the belly press into the mat with each inhale.",
  instructions: [
    "Lie face down and fold the forearms in front of you, resting one hand on top of the other.",
    "Rest the forehead on the stacked hands or turn the head to one side.",
    "Let the legs extend behind you, feet relaxed and turned out.",
    "Allow the belly and chest to relax fully into the mat.",
    "Close the eyes and breathe naturally.",
  ],
  benefits: [
    "Deeply relaxes the back and nervous system",
    "Relieves lower back tension",
    "Encourages diaphragmatic breathing",
  ],
  precautions: [
    "Avoid lying flat on the belly during pregnancy",
    "Turn the head periodically to avoid neck strain",
  ],
  imagePrompt: "A person lying face down on a yoga mat with forearms folded and stacked in front of the head, forehead resting on the hands, legs extended straight back and relaxed, eyes closed, viewed from the side.",
};

const SUPTA_VIRASANA: YogaPose = {
  id: "supta-virasana",
  name: "Reclined Hero Pose",
  sanskrit: "Supta Vīrāsana",
  level: "Advanced",
  durationSec: 45,
  breathing: "Breathe deeply into the chest and ribs as they open toward the ceiling.",
  instructions: [
    "Kneel with knees together and feet slightly wider than the hips, sitting between the heels.",
    "Walk the hands back behind you and slowly lower the torso to the floor or a bolster.",
    "Rest the arms overhead or alongside the body.",
    "Keep the knees together and pressing gently toward the floor.",
    "Come out slowly by pressing into the hands and lifting the torso.",
  ],
  benefits: [
    "Stretches the thighs, ankles, and hip flexors",
    "Opens the chest and abdomen",
    "Improves digestion",
  ],
  precautions: [
    "Avoid with knee injury or recent knee surgery",
    "Use a bolster for support if the lower back cannot rest flat",
    "Avoid with lower back injury",
  ],
  imagePrompt: "A person reclining backward on a yoga mat with knees bent underneath and feet beside the hips, torso lowered onto a bolster or the floor with the chest open, arms resting overhead, knees together, viewed from the side.",
};

const MARJARYASANA_BITILASANA: YogaPose = {
  id: "marjaryasana-bitilasana",
  name: "Cat-Cow Pose",
  sanskrit: "Mārjāryāsana-Bitilāsana",
  level: "Beginner",
  durationSec: 45,
  breathing: "Inhale into Cow Pose, arching the back; exhale into Cat Pose, rounding the spine.",
  instructions: [
    "Start on hands and knees with wrists under shoulders and knees under hips.",
    "Inhale, drop the belly, lift the chest and tailbone for Cow Pose.",
    "Exhale, round the spine toward the ceiling, tucking the chin and tailbone for Cat Pose.",
    "Move slowly between the two shapes, syncing breath with movement.",
    "Keep the wrists stacked under the shoulders throughout.",
  ],
  benefits: [
    "Increases spinal flexibility and mobility",
    "Relieves tension in the neck, shoulders, and back",
    "Warms up the spine for further practice",
  ],
  precautions: [
    "Avoid with wrist injury; move onto forearms if needed",
    "Move gently with neck injuries, keeping the neck in line with the spine",
    "Use caution during pregnancy with deep belly drops",
  ],
  imagePrompt: "A person on hands and knees on a yoga mat shown transitioning between two shapes: one with the belly dropped, chest and tailbone lifted and back arched (Cow), and the other with the spine rounded upward and chin tucked toward the chest (Cat), wrists under shoulders and knees under hips, viewed from the side.",
};

const SUPTA_MATSYENDRASANA: YogaPose = {
  id: "supta-matsyendrasana",
  name: "Supine Spinal Twist",
  sanskrit: "Supta Matsyendrāsana",
  level: "Beginner",
  durationSec: 45,
  breathing: "Inhale to lengthen the spine, exhale to deepen gently into the twist.",
  instructions: [
    "Lie on the back and draw the right knee into the chest.",
    "Guide the right knee across the body to the left with the left hand.",
    "Extend the right arm out to the side at shoulder height, palm facing down.",
    "Turn the head to look toward the right hand.",
    "Keep both shoulders grounded on the mat.",
  ],
  benefits: [
    "Gently stretches the spine and lower back",
    "Releases tension in the hips and outer thighs",
    "Aids digestion",
  ],
  precautions: [
    "Avoid with recent spinal surgery",
    "Use caution during pregnancy; keep twists open rather than closed",
    "Avoid forcing the shoulder to stay flat if it causes pain",
  ],
  imagePrompt: "A person lying flat on their back on a yoga mat with one knee bent and drawn across the body to rest on the floor to the opposite side, the same-side arm extended out at shoulder height with palm down, head turned to look toward that hand, opposite leg extended straight, viewed from above.",
};

const ARDHA_MATSYENDRASANA: YogaPose = {
  id: "ardha-matsyendrasana",
  name: "Half Lord of the Fishes Pose",
  sanskrit: "Ardha Matsyendrāsana",
  level: "Intermediate",
  durationSec: 30,
  breathing: "Inhale to lengthen the spine, exhale to rotate deeper into the twist.",
  instructions: [
    "Sit with legs extended, then bend the right knee and place the right foot outside the left thigh.",
    "Bend the left knee, tucking the left foot near the right hip or extending it.",
    "Place the right hand on the floor behind you and the left elbow outside the right knee.",
    "Lengthen the spine on an inhale, then rotate the torso to the right on the exhale.",
    "Turn the gaze over the back shoulder.",
  ],
  benefits: [
    "Increases spinal mobility",
    "Stretches the hips, shoulders, and neck",
    "Stimulates digestion",
  ],
  precautions: [
    "Avoid with spinal disc injury without guidance",
    "Use caution during pregnancy; favor open twists instead",
    "Avoid forcing the twist if there is knee pain",
  ],
  imagePrompt: "A person sitting on a yoga mat with one leg bent and foot planted outside the opposite thigh and the other leg bent underneath, torso rotated toward the raised knee with the opposite elbow hooked outside it and the other hand planted on the floor behind for support, gaze turned over the back shoulder, viewed from the front.",
};

export const YOGA_CATEGORIES: YogaCategory[] = [
  {
    id: "general",
    name: "General",
    tagline: "A well-rounded foundation for every body.",
    description: "Classic, versatile poses that build strength, flexibility, and body awareness for practitioners of any level.",
    poses: [
      TADASANA,
      ADHO_MUKHA_SVANASANA,
      UTTANASANA,
      VRKSASANA,
      TRIKONASANA,
      BALASANA,
      BHUJANGASANA,
      SUKHASANA,
      SETU_BANDHASANA,
      SAVASANA,
    ],
  },
  {
    id: "back-care",
    name: "Back Care",
    tagline: "Nurture a strong, supple spine.",
    description: "Gentle strengthening and stretching poses designed to relieve back tension and support spinal health.",
    poses: [
      BHUJANGASANA,
      SETU_BANDHASANA,
      MARJARYASANA_BITILASANA,
      {
        id: "salabhasana",
        name: "Locust Pose",
        sanskrit: "Śalabhāsana",
        level: "Intermediate",
        durationSec: 25,
        breathing: "Inhale to lift the chest and legs, exhale to keep the lift steady without straining.",
        instructions: [
          "Lie face down with arms alongside the body, palms facing down.",
          "Rest the forehead or chin gently on the mat.",
          "Inhale and lift the chest, arms, and legs off the floor simultaneously.",
          "Reach actively through the fingertips and toes.",
          "Keep the neck long, gazing slightly forward and down.",
        ],
        benefits: [
          "Strengthens the entire back body and glutes",
          "Improves posture",
          "Stimulates digestion",
        ],
        precautions: [
          "Avoid with recent back or spine injury",
          "Avoid during pregnancy",
          "Keep the lift small if there is any lower back discomfort",
        ],
        imagePrompt: "A person lying face down on a yoga mat with arms alongside the body and both legs, chest, and arms lifted simultaneously off the floor, palms facing down and reaching back, gaze slightly forward and down, viewed from the side.",
      },
      SUPTA_MATSYENDRASANA,
      ARDHA_MATSYENDRASANA,
      {
        id: "dhanurasana",
        name: "Bow Pose",
        sanskrit: "Dhanurāsana",
        level: "Intermediate",
        durationSec: 25,
        breathing: "Inhale to lift the chest and thighs, breathing fully into the front of the body.",
        instructions: [
          "Lie face down and bend the knees, reaching back to hold the outer ankles.",
          "Inhale and kick the feet back into the hands, lifting the thighs and chest off the mat.",
          "Draw the shoulder blades toward each other to open the chest.",
          "Keep the knees hip-width apart rather than splaying wide.",
          "Gaze forward and keep the neck long.",
        ],
        benefits: [
          "Strengthens the back and opens the shoulders",
          "Stretches the front of the body including hip flexors and abdomen",
          "Improves posture",
        ],
        precautions: [
          "Avoid with back or neck injury",
          "Avoid during pregnancy or with high or low blood pressure",
          "Avoid with recent abdominal surgery",
        ],
        imagePrompt: "A person lying face down on a yoga mat, knees bent with hands reaching back to grasp the outer ankles, chest and thighs lifted off the floor so the body curves into a bow shape, gaze forward, viewed from the side.",
      },
      BALASANA,
      APANASANA,
    ],
  },
  {
    id: "core",
    name: "Core",
    tagline: "Build strength from the center out.",
    description: "Targeted poses that engage the abdominal and stabilizing muscles for a strong, functional core.",
    poses: [
      NAVASANA,
      PHALAKASANA,
      VASISTHASANA,
      CHATURANGA_DANDASANA,
      BAKASANA,
      {
        id: "dandasana",
        name: "Staff Pose",
        sanskrit: "Daṇḍāsana",
        level: "Beginner",
        durationSec: 30,
        breathing: "Breathe steadily, lengthening the spine on each inhale.",
        instructions: [
          "Sit with legs extended straight in front of you, feet flexed.",
          "Place the hands on the floor beside the hips, fingers pointing forward.",
          "Press through the heels and engage the thighs.",
          "Lengthen the spine upward from the base to the crown of the head.",
          "Roll the shoulders back and open the chest.",
        ],
        benefits: [
          "Strengthens the core and back muscles",
          "Improves posture and seated alignment",
          "Stretches the hamstrings and calves",
        ],
        precautions: [
          "Sit on a folded blanket if the hamstrings are tight and the back rounds",
          "Use caution with lower back injury",
        ],
        imagePrompt: "A person sitting upright on a yoga mat with both legs extended straight forward and feet flexed, hands pressing into the mat beside the hips, spine tall and chest open, gaze forward, viewed from the side.",
      },
      UTKATASANA,
      TADASANA,
      ADHO_MUKHA_SVANASANA,
    ],
  },
  {
    id: "arms",
    name: "Arms",
    tagline: "Build upper-body strength and stability.",
    description: "Poses that target the wrists, arms, and shoulders to develop functional strength and control.",
    poses: [
      VASISTHASANA,
      CHATURANGA_DANDASANA,
      BAKASANA,
      {
        id: "pincha-mayurasana",
        name: "Forearm Stand",
        sanskrit: "Pīñcha Mayūrāsana",
        level: "Advanced",
        durationSec: 20,
        breathing: "Breathe steadily and calmly to maintain balance while inverted.",
        instructions: [
          "Place the forearms on the mat shoulder-width apart, elbows under the shoulders.",
          "Walk the feet toward the elbows, lifting the hips high.",
          "Kick one leg up at a time, or hop lightly to bring the legs overhead.",
          "Engage the core and squeeze the legs together, reaching them toward the ceiling.",
          "Keep the gaze forward between the hands for stability.",
        ],
        benefits: [
          "Builds significant shoulder and core strength",
          "Improves balance and focus",
          "Increases confidence with inversions",
        ],
        precautions: [
          "Avoid with shoulder, neck, or wrist injury",
          "Avoid with uncontrolled high blood pressure or glaucoma",
          "Practice near a wall and under supervision when learning",
        ],
        imagePrompt: "A person balancing upside down on both forearms on a yoga mat, elbows shoulder-width apart, legs extended straight up toward the ceiling and pressed together, core engaged, gaze forward between the hands, viewed from the side.",
      },
      {
        id: "purvottanasana",
        name: "Upward Plank Pose",
        sanskrit: "Pūrvottānāsana",
        level: "Intermediate",
        durationSec: 25,
        breathing: "Inhale to lift the hips, breathing fully into the open chest.",
        instructions: [
          "Sit with legs extended and hands on the floor behind the hips, fingers pointing forward.",
          "Press into the hands and feet to lift the hips up toward the ceiling.",
          "Straighten the arms and legs, or keep a bend in the knees if needed.",
          "Let the head tilt gently back, or keep it neutral if the neck is sensitive.",
          "Engage the glutes and thighs to support the lift.",
        ],
        benefits: [
          "Strengthens the arms, wrists, and shoulders",
          "Stretches the chest and front of the shoulders",
          "Improves posture",
        ],
        precautions: [
          "Avoid with wrist or shoulder injury",
          "Use caution with neck injury; keep the head neutral",
          "Avoid with recent hip or shoulder surgery",
        ],
        imagePrompt: "A person sitting on a yoga mat with hands planted behind the hips and fingers pointing forward, hips lifted high so the body forms a straight incline from shoulders to feet, legs extended and feet flat on the mat, head tilted gently back, viewed from the side.",
      },
      GOMUKHASANA,
      GARUDASANA,
      ADHO_MUKHA_SVANASANA,
      {
        id: "ardha-pincha-mayurasana",
        name: "Dolphin Pose",
        sanskrit: "Ardha Pīñcha Mayūrāsana",
        level: "Intermediate",
        durationSec: 30,
        breathing: "Breathe steadily, pressing the forearms down with each exhale.",
        instructions: [
          "Start on the forearms and knees, elbows shoulder-width apart.",
          "Tuck the toes and lift the hips up and back, straightening the legs as much as comfortable.",
          "Press the forearms firmly into the mat to lift through the upper back.",
          "Let the head hang relaxed between the upper arms.",
          "Walk the feet closer to deepen the shoulder stretch.",
        ],
        benefits: [
          "Builds shoulder and core strength for forearm balances",
          "Stretches the hamstrings and calves",
          "Relieves mild tension headaches",
        ],
        precautions: [
          "Avoid with shoulder or neck injury",
          "Use caution with high blood pressure or glaucoma",
        ],
        imagePrompt: "A person forming an inverted V shape on a yoga mat while balanced on both forearms, elbows shoulder-width apart, hips lifted high, legs straight, head hanging relaxed between the upper arms, viewed from the side.",
      },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    tagline: "Strengthen and lengthen from hips to heels.",
    description: "Standing and lunging poses that build lower-body strength, stability, and flexibility.",
    poses: [
      VIRABHADRASANA_II,
      {
        id: "virabhadrasana-i",
        name: "Warrior I",
        sanskrit: "Vīrabhadrāsana I",
        level: "Intermediate",
        durationSec: 30,
        breathing: "Inhale to lengthen the spine, exhale to sink deeper into the front knee.",
        instructions: [
          "Step the left foot back, angling the toes slightly out, and bend the right knee to a right angle.",
          "Square the hips and torso toward the front of the mat.",
          "Raise both arms overhead, palms facing each other or touching.",
          "Press firmly through the outer edge of the back foot.",
          "Lift the chest and gaze slightly upward.",
        ],
        benefits: [
          "Strengthens the legs, glutes, and shoulders",
          "Opens the chest, hips, and hip flexors",
          "Builds focus and stamina",
        ],
        precautions: [
          "Avoid with knee or hip injury",
          "Use caution with high blood pressure when raising the arms overhead",
          "Avoid overextending the front knee past the ankle",
        ],
        imagePrompt: "A person in a deep lunge on a yoga mat with the front knee bent at a right angle and the back leg straight with the back heel grounded, hips and chest squared forward, both arms extended straight overhead with palms facing each other, gaze slightly upward, viewed from the side.",
      },
      {
        id: "virabhadrasana-iii",
        name: "Warrior III",
        sanskrit: "Vīrabhadrāsana III",
        level: "Advanced",
        durationSec: 20,
        breathing: "Breathe steadily and evenly to help stabilize the standing leg.",
        instructions: [
          "From a standing position, hinge forward at the hips while lifting the back leg parallel to the floor.",
          "Extend the arms forward alongside the ears, or keep them at the hips for balance.",
          "Keep the standing leg strong with a micro-bend in the knee.",
          "Align the hips so both hip points face the floor.",
          "Fix the gaze on a steady point on the floor ahead.",
        ],
        benefits: [
          "Improves balance and core strength",
          "Strengthens the standing leg and glutes",
          "Enhances focus and coordination",
        ],
        precautions: [
          "Avoid with hamstring or hip injury",
          "Practice near a wall if balance is unsteady",
          "Avoid with uncontrolled low blood pressure",
        ],
        imagePrompt: "A person balancing on one straight leg on a yoga mat, torso and the other leg extended parallel to the floor to form a T shape, arms reaching straight forward alongside the ears, gaze down at a fixed point on the mat, viewed from the side.",
      },
      UTKATASANA,
      {
        id: "anjaneyasana",
        name: "Low Lunge",
        sanskrit: "Añjaneyāsana",
        level: "Beginner",
        durationSec: 30,
        breathing: "Inhale to lengthen the spine, exhale to sink deeper into the hip crease.",
        instructions: [
          "Step the right foot forward between the hands, bending the knee to a right angle.",
          "Lower the back knee to the mat, untucking the toes.",
          "Raise the torso and lift the arms overhead, or keep hands on the front thigh.",
          "Sink the hips forward and down to deepen the stretch in the back hip flexor.",
          "Keep the front knee tracking over the ankle.",
        ],
        benefits: [
          "Stretches the hip flexors and quadriceps",
          "Strengthens the legs and glutes",
          "Improves hip mobility",
        ],
        precautions: [
          "Pad the back knee if kneeling is uncomfortable",
          "Avoid with knee injury",
          "Use caution during pregnancy with deep hip openers",
        ],
        imagePrompt: "A person in a deep lunge on a yoga mat with the front knee bent at a right angle and the back knee resting on the mat with the back leg extended behind, torso upright with arms raised overhead, hips sinking forward, viewed from the side.",
      },
      {
        id: "parsvottanasana",
        name: "Pyramid Pose",
        sanskrit: "Pārśvottānāsana",
        level: "Intermediate",
        durationSec: 30,
        breathing: "Exhale as you fold forward over the front leg, breathing steadily in the hold.",
        instructions: [
          "Step the left foot back about a leg's length, keeping both feet grounded and hips square.",
          "Rest the hands on the hips or bring them behind the back in reverse prayer.",
          "Hinge forward from the hips, folding over the front leg.",
          "Keep the spine long rather than rounding to reach the floor.",
          "Rest the hands on the shin, a block, or the floor.",
        ],
        benefits: [
          "Stretches the hamstrings and calves",
          "Improves hip flexibility and balance",
          "Calms the mind",
        ],
        precautions: [
          "Bend the front knee slightly if the hamstrings are very tight",
          "Avoid with lower back injury",
          "Avoid reverse prayer hands with shoulder injury",
        ],
        imagePrompt: "A person standing on a yoga mat with the front leg straight and back foot planted a stride's length behind, torso folded forward over the straight front leg with hands resting on a block or the shin, hips level and square, viewed from the side.",
      },
      {
        id: "utkata-konasana",
        name: "Goddess Pose",
        sanskrit: "Utkaṭa Koṇāsana",
        level: "Intermediate",
        durationSec: 30,
        breathing: "Breathe steadily, sinking a little lower into the squat with each exhale.",
        instructions: [
          "Step the feet wide apart, turning the toes out at roughly forty-five degrees.",
          "Bend the knees, tracking them over the toes, and lower the hips to knee height.",
          "Raise the arms out to the sides and bend the elbows to ninety degrees, palms facing forward.",
          "Keep the spine upright and the tailbone drawing down.",
          "Press evenly through both feet.",
        ],
        benefits: [
          "Strengthens the inner thighs, glutes, and calves",
          "Opens the hips",
          "Builds lower-body endurance",
        ],
        precautions: [
          "Avoid with knee injury; keep the squat shallow",
          "Use caution during late pregnancy",
        ],
        imagePrompt: "A person standing on a yoga mat with feet wide apart and toes turned out, knees bent deeply and tracking over the toes in a wide squat, arms raised to the sides with elbows bent at right angles and palms facing forward, spine upright, viewed from the front.",
      },
      VRKSASANA,
    ],
  },
  {
    id: "flexibility",
    name: "Flexibility",
    tagline: "Lengthen, open, and release.",
    description: "Deep stretching poses that improve range of motion in the hips, hamstrings, and spine.",
    poses: [
      {
        id: "paschimottanasana",
        name: "Seated Forward Bend",
        sanskrit: "Paścimottānāsana",
        level: "Intermediate",
        durationSec: 45,
        breathing: "Inhale to lengthen the spine, exhale to fold further over the legs.",
        instructions: [
          "Sit with legs extended straight in front of you, feet flexed.",
          "Inhale and lengthen the spine upward.",
          "Exhale and hinge forward from the hips, reaching toward the feet.",
          "Hold the shins, ankles, or feet, keeping the spine as long as possible.",
          "Relax the neck and let the head hang if the fold is comfortable.",
        ],
        benefits: [
          "Stretches the hamstrings and lower back",
          "Calms the nervous system",
          "Improves digestion",
        ],
        precautions: [
          "Bend the knees if the hamstrings are tight to protect the lower back",
          "Avoid with slipped disc or acute lower back injury",
          "Avoid during pregnancy in the deep fold",
        ],
        imagePrompt: "A person sitting on a yoga mat with both legs extended straight forward and feet flexed, torso folded forward over the legs with hands reaching to hold the feet or shins, spine long, head relaxed, viewed from the side.",
      },
      {
        id: "janu-sirsasana",
        name: "Head-to-Knee Forward Bend",
        sanskrit: "Jānu Śīrṣāsana",
        level: "Intermediate",
        durationSec: 40,
        breathing: "Inhale to lengthen the spine, exhale to fold forward over the extended leg.",
        instructions: [
          "Sit with the right leg extended and bend the left knee, placing the left foot against the inner right thigh.",
          "Square the hips toward the extended leg.",
          "Inhale and lengthen the spine, exhale and fold forward over the right leg.",
          "Hold the shin, ankle, or foot of the extended leg.",
          "Keep the extended knee soft rather than locked.",
        ],
        benefits: [
          "Stretches the hamstrings, groin, and spine",
          "Calms the mind",
          "Improves hip flexibility",
        ],
        precautions: [
          "Avoid with knee injury on the bent leg",
          "Avoid with slipped disc or acute lower back injury",
        ],
        imagePrompt: "A person sitting on a yoga mat with one leg extended straight and the other knee bent with the sole of that foot resting against the inner thigh of the straight leg, torso folded forward over the extended leg with hands reaching toward the foot, viewed from the side.",
      },
      ARDHA_CHANDRASANA,
      PARSVAKONASANA,
      {
        id: "parivrtta-trikonasana",
        name: "Revolved Triangle Pose",
        sanskrit: "Parivṛtta Trikoṇāsana",
        level: "Advanced",
        durationSec: 25,
        breathing: "Inhale to lengthen the spine, exhale to rotate deeper into the twist.",
        instructions: [
          "Step the feet about a leg's length apart, right foot forward and left foot turned in slightly.",
          "Square the hips toward the front foot.",
          "Hinge forward and place the left hand on the floor or a block outside or inside the right foot.",
          "Rotate the torso to the right, extending the right arm up toward the ceiling.",
          "Turn the gaze up toward the top hand if the neck allows.",
        ],
        benefits: [
          "Improves spinal rotation and balance",
          "Stretches the hamstrings and hips",
          "Stimulates digestion",
        ],
        precautions: [
          "Avoid with lower back or spinal disc injury",
          "Avoid with uncontrolled high or low blood pressure",
          "Use a block under the hand to reduce strain",
        ],
        imagePrompt: "A person standing with feet a leg's length apart on a yoga mat, torso hinged forward and rotated so one hand presses into the floor or a block near the front foot while the other arm extends straight up toward the ceiling, gaze turned upward, viewed from the front.",
      },
      {
        id: "prasarita-padottanasana",
        name: "Wide-Legged Forward Bend",
        sanskrit: "Prasārita Pādottānāsana",
        level: "Intermediate",
        durationSec: 40,
        breathing: "Exhale as you fold forward, breathing steadily as the head releases toward the floor.",
        instructions: [
          "Step the feet wide apart, toes turned slightly in.",
          "Place the hands on the hips and lengthen the spine forward.",
          "Hinge at the hips and fold forward, bringing the hands or crown of the head toward the floor.",
          "Keep the legs active and the weight balanced evenly on both feet.",
          "Let the neck relax completely.",
        ],
        benefits: [
          "Stretches the hamstrings and inner thighs",
          "Calms the nervous system",
          "Relieves mild fatigue",
        ],
        precautions: [
          "Avoid with lower back injury",
          "Come up slowly to avoid dizziness",
          "Avoid with glaucoma or retinal conditions",
        ],
        imagePrompt: "A person standing with feet wide apart on a yoga mat, torso folded forward from the hips with the crown of the head reaching toward the floor between the feet, hands placed on the mat beneath the shoulders, legs straight and active, viewed from the side.",
      },
      {
        id: "eka-pada-rajakapotasana",
        name: "Pigeon Pose",
        sanskrit: "Eka Pāda Rājakapotāsana",
        level: "Intermediate",
        durationSec: 45,
        breathing: "Breathe slowly and deeply, releasing the hip with every exhale.",
        instructions: [
          "From a tabletop position, bring the right knee forward behind the right wrist, angling the shin.",
          "Extend the left leg straight back, keeping the hips squared.",
          "Walk the hands forward and lower the torso over the front leg, or stay upright.",
          "Rest the forehead on the hands or a block.",
          "Keep the back leg extending straight behind the hip.",
        ],
        benefits: [
          "Deeply stretches the hip rotators and flexors",
          "Relieves tension stored in the hips",
          "Improves hip mobility for other poses",
        ],
        precautions: [
          "Avoid with knee or sacroiliac joint injury",
          "Support the hips with a cushion if they do not reach the floor",
          "Avoid during pregnancy if it strains the pelvis",
        ],
        imagePrompt: "A person on a yoga mat with the front leg bent and shin angled across the mat in front of the hips, the back leg extended straight behind, torso upright or folded forward over the front shin with forehead resting on stacked hands, viewed from the side.",
      },
      {
        id: "uttana-shishosana",
        name: "Extended Puppy Pose",
        sanskrit: "Uttāna Śiśōsana",
        level: "Beginner",
        durationSec: 40,
        breathing: "Breathe deeply, letting the chest melt closer to the mat with each exhale.",
        instructions: [
          "Start on hands and knees with knees under hips.",
          "Walk the hands forward while keeping the hips stacked over the knees.",
          "Lower the chest and forehead toward the mat.",
          "Keep the arms active, pressing the palms into the floor.",
          "Let the hips lift slightly away from the heels to lengthen the spine.",
        ],
        benefits: [
          "Stretches the shoulders and spine",
          "Opens the chest",
          "Calms the mind",
        ],
        precautions: [
          "Avoid with shoulder injury",
          "Avoid with knee injury; pad the knees well",
        ],
        imagePrompt: "A person kneeling on a yoga mat with hips stacked over the knees, arms extended forward on the mat, chest and forehead lowered toward the floor, back gently arched, viewed from the side.",
      },
      {
        id: "baddha-konasana",
        name: "Bound Angle Pose",
        sanskrit: "Baddha Koṇāsana",
        level: "Beginner",
        durationSec: 45,
        breathing: "Breathe steadily, softening the hips with each exhale.",
        instructions: [
          "Sit with the soles of the feet pressed together, knees falling open to the sides.",
          "Hold the feet or ankles with the hands.",
          "Lengthen the spine upward on an inhale.",
          "Fold forward slightly from the hips if comfortable, keeping the back long.",
          "Support the knees with blocks if they do not reach the floor.",
        ],
        benefits: [
          "Opens the hips and inner thighs",
          "Improves circulation in the pelvic area",
          "Calms the mind",
        ],
        precautions: [
          "Avoid forcing the knees down with a groin injury",
          "Sit on a cushion if the hips are very tight",
        ],
        imagePrompt: "A person sitting on a yoga mat with the soles of the feet pressed together and knees dropped open to the sides, hands holding the feet, spine tall and slightly leaning forward, viewed from the front.",
      },
    ],
  },
  {
    id: "relaxation",
    name: "Relaxation",
    tagline: "Unwind the body and quiet the mind.",
    description: "Restorative poses that soothe the nervous system and encourage deep rest.",
    poses: [
      SAVASANA,
      BALASANA,
      VIPARITA_KARANI,
      MAKARASANA,
      SUPTA_VIRASANA,
      APANASANA,
    ],
  },
  {
    id: "mind",
    name: "Mind",
    tagline: "Cultivate stillness, focus, and inner calm.",
    description: "Grounding and balancing poses that support meditation, mental clarity, and emotional steadiness.",
    poses: [
      SUKHASANA,
      {
        id: "padmasana",
        name: "Lotus Pose",
        sanskrit: "Padmāsana",
        level: "Advanced",
        durationSec: 60,
        breathing: "Breathe slowly and evenly, allowing the mind to settle with each breath.",
        instructions: [
          "Sit with legs extended, then bend the right knee and place the right foot on the left thigh.",
          "Bend the left knee and place the left foot on the right thigh, soles facing upward.",
          "Rest the hands on the knees in a mudra of choice.",
          "Lengthen the spine from the base to the crown of the head.",
          "Relax the shoulders and soften the gaze or close the eyes.",
        ],
        benefits: [
          "Deepens focus and meditation",
          "Opens the hips",
          "Encourages a stable, grounded seat",
        ],
        precautions: [
          "Avoid with knee or ankle injury",
          "Never force the feet into position; use a simpler cross-legged seat instead",
          "Avoid during pregnancy if uncomfortable",
        ],
        imagePrompt: "A person sitting on a yoga mat in a full cross-legged position with each foot resting on top of the opposite thigh, soles turned upward, hands resting on the knees, spine tall, eyes closed, viewed from the front.",
      },
      SAVASANA,
      {
        id: "simhasana",
        name: "Lion Pose",
        sanskrit: "Siṃhāsana",
        level: "Beginner",
        durationSec: 20,
        breathing: "Inhale deeply through the nose, then exhale forcefully through the mouth with the tongue extended.",
        instructions: [
          "Kneel and sit back on the heels, or cross the ankles beneath you.",
          "Place the hands on the knees, spreading the fingers wide.",
          "Inhale deeply through the nose.",
          "Open the mouth wide, stick out the tongue, and exhale forcefully making a strong 'ha' sound.",
          "Repeat several rounds, releasing tension in the face and throat.",
        ],
        benefits: [
          "Releases tension in the face, jaw, and throat",
          "Relieves stress",
          "Stimulates the voice and breath",
        ],
        precautions: [
          "Avoid with recent facial or jaw surgery",
          "Use caution with knee injury when kneeling",
        ],
        imagePrompt: "A person kneeling on a yoga mat sitting back on the heels, hands pressed on the knees with fingers spread wide, mouth open wide with tongue extended toward the chin, eyes wide open and gazing upward, viewed from the front.",
      },
      {
        id: "virasana",
        name: "Hero Pose",
        sanskrit: "Vīrāsana",
        level: "Beginner",
        durationSec: 60,
        breathing: "Breathe steadily and evenly, lengthening the spine on each inhale.",
        instructions: [
          "Kneel with knees together and feet slightly wider than the hips.",
          "Sit back between the heels onto the floor or a block.",
          "Rest the hands on the thighs, palms down.",
          "Lengthen the spine and lift the chest.",
          "Relax the shoulders away from the ears.",
        ],
        benefits: [
          "Stretches the thighs and ankles",
          "Improves posture",
          "Encourages calm, steady breathing",
        ],
        precautions: [
          "Avoid with knee injury; sit on a block for support",
          "Avoid with ankle injury",
        ],
        imagePrompt: "A person kneeling on a yoga mat with knees together and feet spread wider than the hips, hips lowered to sit on the floor or a block between the heels, hands resting on the thighs, spine tall, viewed from the side.",
      },
      {
        id: "salamba-sirsasana",
        name: "Headstand",
        sanskrit: "Śālamba Śīrṣāsana",
        level: "Advanced",
        durationSec: 30,
        breathing: "Breathe slowly and steadily, avoiding breath holding while inverted.",
        instructions: [
          "Interlace the fingers and place the forearms on the mat, cradling the back of the head in the hands.",
          "Lift the hips and walk the feet toward the elbows.",
          "Press the forearms down and lift the shoulders away from the ears.",
          "Engage the core and slowly float the legs up, one at a time or together.",
          "Stack the hips over the shoulders and legs over the hips, breathing steadily.",
        ],
        benefits: [
          "Builds core, shoulder, and neck strength",
          "Improves focus and balance",
          "Encourages a calm inward focus",
        ],
        precautions: [
          "Avoid with neck injury, high blood pressure, or glaucoma",
          "Avoid during pregnancy or menstruation",
          "Learn only with qualified supervision and a wall for support",
        ],
        imagePrompt: "A person balancing upside down on a yoga mat, forearms on the ground with fingers interlaced cradling the back of the head, legs extended straight up toward the ceiling and pressed together, torso vertical and aligned over the head, viewed from the side.",
      },
      {
        id: "natarajasana",
        name: "Lord of the Dance Pose",
        sanskrit: "Naṭarājāsana",
        level: "Advanced",
        durationSec: 20,
        breathing: "Breathe steadily and calmly to support balance while opening the chest.",
        instructions: [
          "Stand tall and shift the weight onto the left leg.",
          "Bend the right knee and reach back with the right hand to hold the inside of the right foot or ankle.",
          "Extend the left arm forward for balance.",
          "Press the foot into the hand and kick back and up, lifting the chest and the leg.",
          "Fix the gaze on a steady point ahead.",
        ],
        benefits: [
          "Improves balance and concentration",
          "Stretches the shoulders, chest, thighs, and hip flexors",
          "Strengthens the standing leg",
        ],
        precautions: [
          "Avoid with shoulder, back, or ankle injury",
          "Practice near a wall for support if balance is unsteady",
        ],
        imagePrompt: "A person standing on one leg on a yoga mat, the other leg bent and lifted behind with the same-side hand holding the foot, the leg kicking up and back so the chest lifts and opens, the opposite arm reaching forward for balance, gaze forward, viewed from the side.",
      },
      GARUDASANA,
      VRKSASANA,
    ],
  },
  {
    id: "weight",
    name: "Weight",
    tagline: "Build heat, strength, and metabolic energy.",
    description: "Dynamic, strength-building poses that raise the heart rate and engage large muscle groups.",
    poses: [
      UTKATASANA,
      VIRABHADRASANA_II,
      NAVASANA,
      PHALAKASANA,
      CHATURANGA_DANDASANA,
      TRIKONASANA,
      {
        id: "ustrasana",
        name: "Camel Pose",
        sanskrit: "Uṣṭrāsana",
        level: "Intermediate",
        durationSec: 25,
        breathing: "Inhale to lift and open the chest, exhale to keep the lower back long rather than compressed.",
        instructions: [
          "Kneel with knees hip-width apart, hips stacked over the knees.",
          "Place the hands on the lower back with fingers pointing down for support.",
          "Engage the thighs and lift the chest, arching back gently.",
          "If comfortable, reach the hands back to rest on the heels.",
          "Keep the neck long, letting the head follow the line of the spine.",
        ],
        benefits: [
          "Opens the chest, shoulders, and hip flexors",
          "Strengthens the back muscles",
          "Improves posture",
        ],
        precautions: [
          "Avoid with lower back or neck injury",
          "Avoid with high or low blood pressure",
          "Pad the knees if kneeling is uncomfortable",
        ],
        imagePrompt: "A person kneeling upright on a yoga mat with hips stacked over the knees, torso arched backward with the chest lifted and open, hands reaching back to rest on the heels, head tilted back gently in line with the spine, viewed from the side.",
      },
      {
        id: "parighasana",
        name: "Gate Pose",
        sanskrit: "Parighāsana",
        level: "Intermediate",
        durationSec: 25,
        breathing: "Inhale to lengthen the spine, exhale to extend further into the side stretch.",
        instructions: [
          "Kneel and extend the right leg straight out to the side, foot flat on the mat.",
          "Keep the left knee under the left hip.",
          "Extend the left arm up and reach over toward the right side.",
          "Rest the right hand on the right shin or the floor.",
          "Rotate the chest slightly upward to avoid collapsing forward.",
        ],
        benefits: [
          "Stretches the side body and intercostal muscles",
          "Strengthens the core obliques",
          "Improves lateral flexibility",
        ],
        precautions: [
          "Pad the kneeling knee if sensitive",
          "Avoid with hip or knee injury on the extended leg",
        ],
        imagePrompt: "A person kneeling on a yoga mat with one leg extended straight out to the side and foot flat on the floor, torso leaning sideways over the extended leg with one arm reaching overhead and the other hand resting on the extended shin, viewed from the front.",
      },
    ],
  },
  {
    id: "posture",
    name: "Posture",
    tagline: "Stand tall, open the chest, align the spine.",
    description: "Poses that counteract slouching and build the strength and awareness needed for good alignment.",
    poses: [
      TADASANA,
      {
        id: "vajrasana",
        name: "Thunderbolt Pose",
        sanskrit: "Vajrāsana",
        level: "Beginner",
        durationSec: 60,
        breathing: "Breathe slowly and evenly, keeping the spine tall with each inhale.",
        instructions: [
          "Kneel on the mat with the tops of the feet flat on the floor.",
          "Sit back so the hips rest on the heels.",
          "Rest the hands on the thighs, palms down.",
          "Lengthen the spine from the hips to the crown of the head.",
          "Relax the shoulders down and back.",
        ],
        benefits: [
          "Improves posture and spinal alignment",
          "Aids digestion when practiced after meals",
          "Strengthens the pelvic floor and thighs",
        ],
        precautions: [
          "Avoid with knee or ankle injury",
          "Sit on a cushion between the heels if there is knee discomfort",
        ],
        imagePrompt: "A person kneeling upright on a yoga mat with the tops of the feet flat on the floor and hips resting on the heels, hands resting on the thighs, spine tall and shoulders relaxed, viewed from the side.",
      },
      GARUDASANA,
      GOMUKHASANA,
      SETU_BANDHASANA,
      ARDHA_CHANDRASANA,
      VASISTHASANA,
      PHALAKASANA,
      BHUJANGASANA,
    ],
  },
  {
    id: "sleep",
    name: "Sleep",
    tagline: "Wind down for deep, restful sleep.",
    description: "Slow, soothing poses that signal the nervous system to relax in preparation for sleep.",
    poses: [
      SAVASANA,
      VIPARITA_KARANI,
      BALASANA,
      APANASANA,
      MAKARASANA,
      SUPTA_MATSYENDRASANA,
    ],
  },
  {
    id: "morning",
    name: "Morning",
    tagline: "Wake up the body and greet the day.",
    description: "An energizing sequence of poses that gently mobilize the spine and build warmth to start the day.",
    poses: [
      TADASANA,
      ADHO_MUKHA_SVANASANA,
      {
        id: "urdhva-mukha-svanasana",
        name: "Upward-Facing Dog",
        sanskrit: "Ūrdhva Mukha Śvānāsana",
        level: "Intermediate",
        durationSec: 25,
        breathing: "Inhale as you lift the chest and thighs off the mat, keeping the breath open and full.",
        instructions: [
          "Lie face down with hands beside the lower ribs, fingers spread wide.",
          "Press into the hands and straighten the arms, lifting the chest and thighs off the mat.",
          "Keep the tops of the feet pressing into the floor, legs engaged.",
          "Draw the shoulders down away from the ears and open the chest.",
          "Keep the gaze forward or slightly upward without crunching the neck.",
        ],
        benefits: [
          "Strengthens the arms, wrists, and spine",
          "Opens the chest and shoulders",
          "Improves posture",
        ],
        precautions: [
          "Avoid with wrist, lower back, or shoulder injury",
          "Avoid during pregnancy",
          "Avoid with carpal tunnel syndrome",
        ],
        imagePrompt: "A person lying face down on a yoga mat with arms straight and hands planted under the shoulders, chest and thighs lifted off the floor, only the tops of the feet and palms touching the mat, chest open and gaze forward, viewed from the side.",
      },
      UTTANASANA,
      BHUJANGASANA,
      CHATURANGA_DANDASANA,
      MARJARYASANA_BITILASANA,
      TRIKONASANA,
      VRKSASANA,
    ],
  },
];

export const ALL_POSES: YogaPose[] = Array.from(
  new Map(YOGA_CATEGORIES.flatMap((c) => c.poses).map((p) => [p.id, p])).values()
);

export function findPose(id: string): YogaPose | undefined {
  return ALL_POSES.find((p) => p.id === id);
}

export function findCategory(id: string): YogaCategory | undefined {
  return YOGA_CATEGORIES.find((c) => c.id === id);
}
