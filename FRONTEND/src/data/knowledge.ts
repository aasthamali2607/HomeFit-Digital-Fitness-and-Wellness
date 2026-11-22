export interface GuideSection {
  heading: string;
  body: string[]; // 2-4 paragraphs
}

export interface Guide {
  id: string; // kebab slug
  title: string;
  subtitle: string;
  readMin: number;
  icon: "sleep" | "breath" | "nutrition" | "movement" | "mind" | "recovery" | "habit";
  sections: GuideSection[]; // 4-6 sections
  takeaways: string[]; // 4-6 crisp action points
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  about: string; // 2-3 sentences
  whyRead: string; // 1-2 sentences tying it to a home fitness / wellness journey
  topics: string[]; // 3-5 tags
}

export const GUIDES: Guide[] = [
  {
    id: "sleep-and-recovery",
    title: "Sleep and Recovery: The Foundation You Can't Skip",
    subtitle: "Why sleep is the single highest-leverage habit for energy, mood, and physical progress.",
    readMin: 7,
    icon: "sleep",
    sections: [
      {
        heading: "Sleep Is Not Downtime — It's Active Repair",
        body: [
          "It's tempting to think of sleep as the hours when nothing happens, a passive pause between one productive day and the next. In reality, sleep is one of the most metabolically active periods of your day. While you rest, your brain clears metabolic waste through the glymphatic system, your muscles rebuild micro-torn fibers from training, and your endocrine system releases the growth hormone pulses that drive tissue repair. Skimping on sleep doesn't just leave you tired; it actively interrupts these repair processes before they finish.",
          "This matters enormously for anyone pursuing fitness or wellness goals. You don't get stronger during a workout — you get stronger during recovery from that workout, and the majority of that recovery happens during deep sleep. Cut your sleep short and you're essentially ending the workout's payoff early, no matter how hard you trained.",
        ],
      },
      {
        heading: "The Two Systems That Govern Your Sleep",
        body: [
          "Two biological processes decide when you feel sleepy and when you feel alert. The first is your circadian rhythm, an internal clock roughly 24 hours long that is calibrated primarily by light exposure to your eyes. The second is sleep pressure, a chemical buildup (largely adenosine) that accumulates the longer you've been awake and is only cleared by sleep itself.",
          "Modern life disrupts both. Artificial light late at night confuses your circadian clock into thinking it's still daytime, delaying melatonin release. Caffeine, meanwhile, works by blocking adenosine receptors — it doesn't remove sleep pressure, it just masks it, which is why a late-afternoon coffee can quietly sabotage a 10pm bedtime even if you don't feel wired.",
          "Understanding these two systems gives you real leverage: manage light exposure to keep your clock on schedule, and manage stimulant timing to let sleep pressure do its job unobstructed.",
        ],
      },
      {
        heading: "Building a Wind-Down Routine That Actually Works",
        body: [
          "Consistency is the most underrated sleep intervention. Going to bed and waking up within the same 30-60 minute window every day, including weekends, trains your circadian rhythm far more effectively than any supplement. Irregular sleep timing has been linked in research to worse metabolic and cardiovascular outcomes even when total sleep duration stays the same.",
          "A genuinely useful wind-down routine starts 45-60 minutes before your target bedtime. Dim household lights, move screens away or switch to night mode, and choose a low-stimulation activity — reading, gentle stretching, journaling. Body temperature also plays a role: a warm shower an hour before bed causes a rebound cooling effect afterward that helps trigger sleep onset.",
          "Keep the bedroom itself cool, dark, and quiet. Somewhere between 60-67°F (15-19°C) is the commonly cited sweet spot for most people, since core body temperature needs to drop slightly to initiate and maintain deep sleep.",
        ],
      },
      {
        heading: "When Training Hard Meets Sleeping Poorly",
        body: [
          "If you're following a structured home fitness routine, sleep debt shows up in specific, measurable ways: slower reaction time, reduced grip strength, higher perceived exertion for the same workload, and a greater likelihood of reaching for high-sugar snacks the next day because sleep loss disrupts hunger-regulating hormones like leptin and ghrelin.",
          "On nights when a full night's sleep isn't possible, prioritize a short 20-minute nap before 3pm rather than sleeping in dramatically late, which can shift your clock and make the next night worse. And on days following poor sleep, consider dialing training intensity down rather than pushing through — your nervous system's capacity to recruit muscle fibers safely is measurably reduced when you're sleep-deprived.",
        ],
      },
    ],
    takeaways: [
      "Keep a consistent sleep and wake time, even on weekends.",
      "Get bright light exposure within the first hour of waking to anchor your circadian rhythm.",
      "Stop caffeine at least 8-10 hours before bedtime.",
      "Cool your bedroom to roughly 60-67°F (15-19°C) for deeper sleep.",
      "Start a screen-free wind-down routine 45-60 minutes before bed.",
      "Treat poor sleep as a signal to scale training intensity down, not push through.",
    ],
  },
  {
    id: "breathwork-and-pranayama",
    title: "Breathwork and Pranayama: The Remote Control for Your Nervous System",
    subtitle: "How conscious breathing techniques, ancient and modern, shift you between stress and calm on demand.",
    readMin: 6,
    icon: "breath",
    sections: [
      {
        heading: "Breathing Is the One Autonomic Function You Can Consciously Control",
        body: [
          "Most of what your autonomic nervous system does — heart rate, digestion, hormone release — happens entirely outside your conscious awareness. Breathing is the notable exception: it runs automatically, but you can also take the wheel at any moment. This dual nature makes breath a uniquely accessible lever for influencing the rest of your nervous system's state.",
          "Slow, controlled exhalations activate the vagus nerve and shift your body toward parasympathetic ('rest and digest') dominance, lowering heart rate and blood pressure. Fast, forceful breathing does the opposite, priming a more sympathetic, alert state. Neither is inherently better — the skill is knowing which tool fits which moment.",
        ],
      },
      {
        heading: "Pranayama's Ancient Toolkit",
        body: [
          "Pranayama, the yogic science of breath regulation, developed a sophisticated set of techniques long before modern physiology could explain why they worked. Nadi shodhana (alternate nostril breathing) is used to balance and calm the mind before meditation or sleep. Kapalabhati (skull-shining breath), a rapid, forceful exhale-focused technique, is traditionally used to energize and clear mental fog. Ujjayi breath, a slightly constricted 'ocean sound' breath, is often paired with yoga asana practice to maintain steady focus and pacing.",
          "These aren't mystical claims requiring faith — modern research on heart rate variability and vagal tone offers plausible mechanisms for many of the calming effects long described in yogic texts, even as some traditional claims remain outside what science currently measures.",
        ],
      },
      {
        heading: "Three Practical Techniques to Start With",
        body: [
          "Box breathing (4-4-4-4): inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Used by military and medical professionals for rapid calm under pressure — excellent before a stressful meeting or a tough workout set.",
          "Physiological sigh: a double inhale through the nose (a full breath followed by a second short top-up inhale) followed by a long, slow exhale through the mouth. Research from Stanford has shown this is one of the fastest ways to reduce acute stress and lower arousal in real time, often within one or two repetitions.",
          "4-7-8 breathing: inhale for 4 counts, hold for 7, exhale slowly for 8. The extended exhale relative to inhale strongly favors parasympathetic activation, making this a popular pre-sleep technique.",
        ],
      },
      {
        heading: "Weaving Breath Into a Training Routine",
        body: [
          "Breath isn't only for calming down — it's also a performance tool. Exhaling on the exertion phase of a lift (the concentric phase) helps stabilize the core via intra-abdominal pressure and prevents unwanted breath-holding that can spike blood pressure. During steady cardio, nasal breathing at a controlled pace can help you stay in an aerobic, fat-utilizing zone rather than drifting into an anaerobic, harder-to-sustain effort.",
          "Bookending a workout with a few minutes of slow breathing — box breathing before to focus, and slower diaphragmatic breathing after to downshift — helps transition your nervous system cleanly into and out of an exercise session, which in turn supports better recovery afterward.",
        ],
      },
    ],
    takeaways: [
      "Use the physiological sigh (double inhale, long exhale) for fast, in-the-moment stress relief.",
      "Practice box breathing (4-4-4-4) before high-pressure or high-intensity moments.",
      "Try 4-7-8 breathing as part of your pre-sleep wind-down.",
      "Exhale during the hardest phase of a lift to stabilize your core.",
      "Use nasal breathing during easy cardio to stay in a sustainable aerobic zone.",
      "Bookend workouts with a few minutes of slow breathing to ease in and out of exertion.",
    ],
  },
  {
    id: "nutrition-fundamentals-and-portioning",
    title: "Nutrition Fundamentals: Building a Plate That Actually Supports Your Goals",
    subtitle: "Cutting through diet noise with the durable basics of energy balance, macronutrients, and portion awareness.",
    readMin: 7,
    icon: "nutrition",
    sections: [
      {
        heading: "Start With Energy Balance, Not the Latest Trend",
        body: [
          "Beneath every diet trend — keto, intermittent fasting, plant-based, carnivore — sits the same underlying physics: weight change is governed by the relationship between energy consumed and energy expended over time. This doesn't mean all calories are nutritionally equal, but it does mean that no amount of clever food timing or ingredient selection substitutes for that basic balance when the goal is weight management.",
          "Where diets differ meaningfully is in how sustainable they are for a given person, how they affect hunger and satiety, and whether they support muscle retention during weight loss. The 'best' approach is less about superior biochemistry and more about which pattern of eating you can actually stick with for months, not days.",
        ],
      },
      {
        heading: "The Macronutrients, Explained Simply",
        body: [
          "Protein is the building block of muscle, skin, hormones, and enzymes, and it's also the most satiating macronutrient — meaning it keeps you full longer per calorie. For anyone doing regular resistance training, adequate protein (commonly cited guidance ranges roughly 0.7-1g per pound of bodyweight, adjusted for individual goals) is essential for muscle repair and growth.",
          "Carbohydrates are your body's preferred quick-access fuel, particularly for higher-intensity exercise. Choosing minimally processed sources — oats, fruit, potatoes, legumes, whole grains — brings along fiber and micronutrients that refined carbohydrates strip away.",
          "Fats are essential for hormone production, vitamin absorption, and cell membrane health. A mix of sources — olive oil, nuts, seeds, fatty fish, avocado — covers the range of fatty acids your body needs, including the omega-3s that many diets under-supply.",
        ],
      },
      {
        heading: "Portioning Without a Food Scale",
        body: [
          "You don't need to weigh every gram of food to eat sensibly. A widely used hand-based guide: a palm-sized portion of protein, a fist-sized portion of vegetables, a cupped-hand portion of carbohydrates, and a thumb-sized portion of fats, adjusted up or down based on your body size and activity level. This scales naturally to different hand sizes and different people's energy needs.",
          "Another simple, durable framework is filling half your plate with vegetables and fruit, a quarter with protein, and a quarter with whole-grain or starchy carbohydrates — a pattern echoed by several national dietary guidelines because it naturally moderates calorie density while ensuring nutrient adequacy.",
          "Eating slowly and stopping at roughly 80% fullness (a practice inspired by the Okinawan principle of hara hachi bu) allows your body's satiety signals — which typically take about 15-20 minutes to register — time to catch up with your actual intake.",
        ],
      },
      {
        heading: "Hydration and the Overlooked Basics",
        body: [
          "Mild dehydration is frequently mistaken for hunger or fatigue. A practical baseline is roughly half your body weight in ounces of water per day, adjusted upward for exercise, heat, or high sweat rates. Urine that's pale straw-colored is a reasonably reliable everyday indicator of adequate hydration.",
          "Whole, minimally processed foods tend to naturally support better portion control because they're higher in fiber and water content, both of which increase satiety per calorie compared to ultra-processed alternatives. This doesn't require perfection — it simply means letting whole foods form the majority of your plate, most of the time.",
        ],
      },
    ],
    takeaways: [
      "Focus on sustainable energy balance over any specific diet trend.",
      "Prioritize protein at each meal to support satiety and muscle repair.",
      "Use the hand-portion method: palm of protein, fist of vegetables, cupped hand of carbs, thumb of fats.",
      "Fill half your plate with vegetables and fruit as a simple default.",
      "Eat slowly and aim to stop around 80% fullness.",
      "Drink roughly half your body weight in ounces of water daily, more with exercise.",
    ],
  },
  {
    id: "movement-mobility-and-consistency",
    title: "Movement, Mobility, and Consistency: Training for the Long Game",
    subtitle: "Why the best exercise program is the one your joints and your calendar can both sustain.",
    readMin: 6,
    icon: "movement",
    sections: [
      {
        heading: "Consistency Beats Intensity Almost Every Time",
        body: [
          "A moderate workout done four times a week for a year will outperform an intense workout done twice before burnout or injury ends the streak. Physiological adaptation — strength gains, cardiovascular improvement, fat loss — is a function of accumulated, repeated stimulus over time, not any single heroic session. This is why sustainable programming, one you can realistically fit around work, sleep, and life, consistently beats the most 'optimal' plan on paper that nobody actually finishes.",
          "A useful mental shift: judge a workout plan not by how hard it is on paper, but by the probability you'll still be doing some version of it in six months.",
        ],
      },
      {
        heading: "Mobility Is the Insurance Policy for Strength",
        body: [
          "Strength training builds capacity, but mobility — the ability to move a joint through its full, controlled range of motion — determines how safely and effectively you can access that strength. Tight hips limit squat depth and shift load onto the lower back; a stiff thoracic spine limits overhead reach and shoulder health; limited ankle mobility changes how force transfers through the whole lower body during walking, running, and jumping.",
          "Unlike static stretching alone, dynamic mobility work — controlled articular rotations, world's greatest stretch, deep squat holds — combines flexibility with active control, better preparing joints for the loads they'll experience during actual training.",
          "Ten minutes of targeted mobility work, three to four times a week, focused on your personal tight spots (commonly hips, ankles, thoracic spine, and shoulders for people who sit most of the day) tends to produce noticeably more day-to-day movement quality than occasional long stretching sessions.",
        ],
      },
      {
        heading: "The Minimum Effective Dose for a Home Routine",
        body: [
          "You don't need an elaborate program to see real results. A well-rounded home routine covering the fundamental movement patterns — squat, hinge, push, pull, carry, and rotation — two to four times per week, alongside daily incidental movement like walking, covers the overwhelming majority of what most people need for strength, joint health, and metabolic function.",
          "Progressive overload — gradually increasing reps, sets, resistance, or range of motion over time — is what turns repeated movement into an adaptation. Without some form of progression, the body has little reason to keep improving once it has adapted to a given stimulus.",
        ],
      },
      {
        heading: "Listening to Your Body Without Using It as an Excuse",
        body: [
          "There's a meaningful difference between the normal discomfort of effort and pain that signals something is wrong. General fatigue, mild muscle burn, and a harder-than-usual set are expected parts of training. Sharp, localized, or joint-level pain, or symptoms that worsen rather than ease as you warm up, warrant backing off and, if persistent, seeking professional input.",
          "Building this discernment takes time, but a reasonable starting heuristic is the 'two-day rule': if soreness or discomfort from a session hasn't meaningfully eased within 48 hours, treat it as a signal to adjust volume or technique rather than push through again.",
        ],
      },
    ],
    takeaways: [
      "Choose the workout plan you'll realistically repeat for months, not the hardest one on paper.",
      "Cover squat, hinge, push, pull, carry, and rotation patterns across your week.",
      "Spend 10 minutes several times a week on dynamic mobility for your tightest joints.",
      "Apply progressive overload gradually to keep driving adaptation.",
      "Distinguish normal training fatigue from sharp or worsening pain.",
      "Use the 48-hour rule: unresolved discomfort after two days means adjust, not repeat.",
    ],
  },
  {
    id: "stress-nervous-system-and-mindfulness",
    title: "Stress, the Nervous System, and Mindfulness: Working With Your Wiring",
    subtitle: "Understanding fight-or-flight, the vagus nerve, and how mindfulness practically rewires your stress response.",
    readMin: 7,
    icon: "mind",
    sections: [
      {
        heading: "Stress Isn't the Enemy — Unresolved Stress Is",
        body: [
          "The stress response evolved as a short-term survival tool: a surge of cortisol and adrenaline sharpens focus, mobilizes energy, and prepares muscles for action. In brief bursts, this system is adaptive and even useful — it's part of what makes a workout feel productive or a deadline feel motivating. The trouble isn't stress itself, but stress that never gets a chance to resolve, leaving the body in a low-grade activated state for weeks or months.",
          "Chronically elevated cortisol has been associated with disrupted sleep, impaired immune function, increased abdominal fat storage, and reduced capacity for muscle recovery — meaning unmanaged stress can directly undercut fitness progress even when training and nutrition are otherwise on point.",
        ],
      },
      {
        heading: "The Vagus Nerve: Your Built-In Off Switch",
        body: [
          "The vagus nerve is the primary channel of the parasympathetic nervous system, running from the brainstem down through the neck, chest, and abdomen, influencing heart rate, digestion, and inflammation along the way. Higher vagal tone — often estimated through heart rate variability — is associated with better stress resilience, faster recovery from exertion, and improved emotional regulation.",
          "Several accessible practices reliably stimulate vagal activity: slow diaphragmatic breathing with long exhales, cold exposure (like a brief cold shower), humming or singing, and gentle massage of the neck or ear. None of these require special equipment, which makes vagal tone one of the more practical levers available for everyday stress management.",
        ],
      },
      {
        heading: "What Mindfulness Actually Does in the Brain",
        body: [
          "Mindfulness — paying deliberate, non-judgmental attention to the present moment — isn't about emptying the mind or achieving permanent calm. Neuroimaging studies on regular meditators have shown measurable changes including reduced amygdala reactivity (the brain's threat-detection center) and strengthened connectivity in prefrontal regions associated with emotional regulation.",
          "Importantly, these changes tend to build with consistent practice rather than appearing after a single session, similar to how physical training builds strength over weeks rather than one workout. A realistic expectation is gradual improvement in your ability to notice a stress reaction as it arises, before it fully takes over, rather than a dramatic overnight shift in temperament.",
        ],
      },
      {
        heading: "Bringing Mindfulness Into an Ordinary Day",
        body: [
          "Formal seated meditation is valuable, but it isn't the only entry point. Mindful movement — paying close attention to breath and sensation during a walk, a stretch session, or a warm-up — offers many of the same present-moment benefits for people who find stillness difficult at first. Even short, informal check-ins (pausing to notice three physical sensations before starting a task) build the same attentional muscle in smaller doses.",
          "A practical starting target is five to ten minutes daily rather than a rare, long session — frequency matters more than duration for building the underlying skill, much like brief daily stretching outperforms an occasional long one for mobility.",
        ],
      },
    ],
    takeaways: [
      "Recognize acute stress as adaptive; the goal is resolving it, not eliminating it.",
      "Use slow exhale-focused breathing or brief cold exposure to stimulate vagal tone.",
      "Expect mindfulness benefits to build gradually with consistent practice.",
      "Try mindful movement (walking, stretching) if seated meditation feels difficult.",
      "Aim for 5-10 minutes of daily practice rather than infrequent long sessions.",
      "Watch for chronic stress signs (poor sleep, stalled recovery) as a cue to intervene early.",
    ],
  },
  {
    id: "muscle-recovery-soreness-and-rest-days",
    title: "Muscle Recovery, Soreness, and Rest Days: Where the Real Gains Happen",
    subtitle: "What delayed onset muscle soreness actually is, and how to structure rest so it works for you.",
    readMin: 6,
    icon: "recovery",
    sections: [
      {
        heading: "What Soreness Actually Is (and Isn't)",
        body: [
          "Delayed onset muscle soreness (DOMS), the stiffness that typically peaks 24-72 hours after unfamiliar or intense exercise, results from microscopic damage to muscle fibers and the inflammatory repair process that follows, not from lactic acid buildup as commonly believed — lactic acid clears from muscles within about an hour of exercise ending. DOMS is more pronounced after eccentric-heavy movements (the lowering phase of a lift, downhill running) and tends to diminish as your body adapts to a given exercise, a phenomenon called the repeated bout effect.",
          "Soreness is a reasonable, if imperfect, signal that your muscles experienced a new stimulus, but it is not a reliable measure of workout quality. Plenty of highly effective sessions produce minimal soreness, especially once your body has adapted to a movement pattern.",
        ],
      },
      {
        heading: "Why Rest Days Are Productive, Not Lazy",
        body: [
          "Muscle protein synthesis — the process of repairing and building muscle tissue — remains elevated for roughly 24-48 hours after resistance training, meaning the actual growth largely happens after the workout ends, provided you allow that window to complete. Training the same muscle group again before this process finishes can blunt the very adaptation you're training for.",
          "This is why well-designed programs rotate muscle groups or intensity across the week rather than maximally taxing everything daily. Rest days aren't a pause in progress — they're the part of the process where progress is actually consolidated.",
        ],
      },
      {
        heading: "Active Recovery vs. Complete Rest",
        body: [
          "Complete rest has its place, particularly after very high-intensity or novel training blocks, but low-intensity active recovery — an easy walk, light cycling, gentle yoga — often accelerates recovery better than total inactivity by increasing blood flow to affected tissues without adding additional damage. This improved circulation helps deliver nutrients and clear metabolic byproducts more efficiently than sitting still.",
          "A useful rule of thumb: if an activity leaves you feeling noticeably better afterward and doesn't add meaningful new fatigue, it likely qualifies as good active recovery. If it leaves you more depleted, it's simply another workout in disguise.",
        ],
      },
      {
        heading: "Tools That Help (and Ones That Are Overhyped)",
        body: [
          "Sleep, adequate protein intake, and hydration remain the highest-impact recovery tools by a wide margin — no recovery gadget outperforms the basics. Beyond that, foam rolling and massage have modest evidence for temporarily reducing perceived soreness and improving range of motion, largely through neurological effects on tissue tolerance rather than dramatic physical changes to the muscle itself.",
          "Cold water immersion can reduce short-term soreness but may blunt some long-term strength and hypertrophy adaptations if used too frequently right after strength training, making it more suited to competition recovery than routine training days. Heat, by contrast — a warm bath or sauna — supports relaxation and blood flow with fewer trade-offs for a general home fitness routine.",
        ],
      },
    ],
    takeaways: [
      "Understand that DOMS comes from microscopic muscle damage and repair, not lactic acid.",
      "Give a trained muscle group roughly 24-48 hours before working it hard again.",
      "Favor light active recovery (walking, easy cycling) over total inactivity on rest days.",
      "Prioritize sleep, protein, and hydration over recovery gadgets.",
      "Use foam rolling or massage for modest short-term relief, not as a magic fix.",
      "Save ice baths for occasional use rather than routine post-strength-training recovery.",
    ],
  },
  {
    id: "habit-formation-and-lasting-motivation",
    title: "Habit Formation and Motivation That Lasts",
    subtitle: "Why relying on motivation fails, and how to design habits that survive the days you don't feel like it.",
    readMin: 7,
    icon: "habit",
    sections: [
      {
        heading: "Motivation Is a Poor Foundation to Build On",
        body: [
          "Motivation is, by nature, a feeling — and feelings fluctuate with sleep, stress, weather, and mood in ways largely outside your control. Anyone who has skipped a planned workout on a low-motivation day knows this instability firsthand. Building a fitness or wellness routine that depends on consistently feeling motivated is building on an unreliable foundation.",
          "Habits, by contrast, are behaviors that have become largely automatic through repetition, requiring progressively less conscious willpower to execute. The goal of good habit design isn't to generate more motivation — it's to reduce how much motivation a behavior requires in the first place.",
        ],
      },
      {
        heading: "The Habit Loop: Cue, Craving, Response, Reward",
        body: [
          "Behavioral research describes habits as a loop with four components: a cue that triggers the behavior, a craving that provides motivation, a response (the behavior itself), and a reward that reinforces the loop for next time. Understanding this loop lets you deliberately engineer habits rather than hoping willpower carries you through indefinitely.",
          "For a new habit, make the cue obvious (laying out workout clothes the night before), make the craving attractive (pairing the habit with something you enjoy, like a favorite podcast only during workouts), make the response easy (starting with a version so small it's hard to skip), and make the reward satisfying (tracking progress visibly, so completion itself feels good).",
        ],
      },
      {
        heading: "Start Absurdly Small",
        body: [
          "One of the most consistently effective strategies for building a lasting exercise habit is to deliberately undersize the initial commitment — a five-minute walk instead of a planned 45-minute run, one set instead of a full workout. This feels almost too easy, which is precisely the point: the barrier to starting becomes negligible, and starting is the hardest part of any habit. Once you're moving, continuing often happens naturally.",
          "This approach, sometimes called the two-minute rule, deliberately optimizes for consistency over intensity in the early stages of habit formation, on the premise that a habit performed at low intensity for months beats an ambitious routine abandoned after two weeks.",
        ],
      },
      {
        heading: "Identity Change Outlasts Willpower",
        body: [
          "Long-term behavior change tends to stick best when it's tied to identity rather than outcome — shifting from 'I'm trying to work out more' to 'I'm someone who trains consistently.' Each time you complete a session, however small, you cast a vote for that identity, and over time the accumulated evidence makes the behavior feel less like effort and more like simply who you are.",
          "This is also why tracking small wins matters more than it might seem: a visible streak or log isn't just record-keeping, it's ongoing evidence supporting the identity you're building, which reduces the psychological friction of continuing on hard days.",
        ],
      },
      {
        heading: "Designing for the Days You Don't Want To",
        body: [
          "Every sustainable routine needs a plan for low-motivation days, because they will happen regardless of how well-designed the habit is. A practical approach is defining in advance a 'minimum viable version' of the habit — if a full workout isn't happening, what's the smallest version that still counts? Ten minutes of movement, one set of an exercise, or even just putting on workout clothes can preserve the streak and the identity without demanding full effort.",
          "This flexibility isn't a compromise on standards — it's what makes the habit resilient enough to survive real life, which is ultimately the only kind of habit that produces long-term results.",
        ],
      },
    ],
    takeaways: [
      "Design habits so they require less willpower over time, rather than relying on motivation.",
      "Use the cue-craving-response-reward loop to deliberately build new habits.",
      "Start with a version of the habit small enough to feel almost too easy.",
      "Frame consistency as evidence for the identity you want to build.",
      "Define a minimum viable version of your habit for low-motivation days.",
      "Track small wins visibly to reinforce progress and identity.",
    ],
  },
];

export const BOOKS: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    about:
      "A practical framework for building good habits and breaking bad ones, built around the idea that small, consistent changes compound into remarkable results over time. Clear introduces concepts like the habit loop, habit stacking, and the two-minute rule as tools for behavior design.",
    whyRead:
      "For anyone trying to make a home fitness routine stick, this book offers the clearest, most actionable framework available for designing exercise and wellness habits that survive low-motivation days.",
    topics: ["habits", "behavior change", "motivation", "productivity"],
  },
  {
    id: "why-we-sleep",
    title: "Why We Sleep",
    author: "Matthew Walker",
    year: 2017,
    about:
      "A comprehensive, research-driven exploration of sleep science, covering everything from the stages of sleep to the consequences of chronic sleep deprivation on memory, immunity, and mental health. Walker, a sleep researcher, translates decades of lab findings into accessible, sometimes startling, everyday implications.",
    whyRead:
      "Understanding the biology behind sleep makes it far easier to prioritize recovery as seriously as training itself, turning an abstract 'get more sleep' recommendation into genuine motivation.",
    topics: ["sleep", "recovery", "neuroscience", "health"],
  },
  {
    id: "breath",
    title: "Breath: The New Science of a Lost Art",
    author: "James Nestor",
    year: 2020,
    about:
      "Part science journalism and part personal experiment, this book traces how modern humans have largely forgotten how to breathe well, and what reclaiming ancient and modern breathing techniques can do for physical and mental health. Nestor blends historical breathing practices with contemporary respiratory research.",
    whyRead:
      "It offers an engaging, well-researched entry point into breathwork for readers who want to understand the 'why' behind techniques like nasal breathing and slow exhalation before practicing them.",
    topics: ["breathwork", "pranayama", "nervous system", "respiratory health"],
  },
  {
    id: "light-on-yoga",
    title: "Light on Yoga",
    author: "B.K.S. Iyengar",
    year: 1966,
    about:
      "A foundational, meticulously detailed reference on yoga asana and pranayama, widely credited with helping introduce structured yoga practice to the Western world. Iyengar presents postures with careful attention to alignment, sequencing, and the philosophy underpinning the practice.",
    whyRead:
      "For anyone building mobility, breathwork, or mindfulness into a home routine, this remains one of the most authoritative and enduring references on how yoga postures and breath practices actually work together.",
    topics: ["yoga", "mobility", "pranayama", "mindfulness"],
  },
  {
    id: "the-body-keeps-the-score",
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    year: 2014,
    about:
      "A landmark exploration of how trauma and chronic stress become physically embedded in the body and nervous system, and how movement, breath, and body-based therapies can support healing alongside traditional talk therapy. Van der Kolk draws on decades of clinical research and case studies.",
    whyRead:
      "It provides essential context for why physical practices like movement, breathwork, and mindfulness aren't just 'nice to have' but are directly tied to nervous system regulation and long-term stress resilience.",
    topics: ["stress", "trauma", "nervous system", "mind-body connection"],
  },
];

export function findGuide(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id);
}
