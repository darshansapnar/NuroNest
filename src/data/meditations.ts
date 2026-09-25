import { Heart, Leaf, Moon, Sparkles, Sun, type LucideIcon } from "lucide-react";

export type MeditationGuidanceCue = {
  atSeconds: number;
  text: string;
};

export type Meditation = {
  id: string;
  slug: string;
  title: string;
  /** Short approach label shown as a badge, e.g. "Focused Attention". */
  category: string;
  /** Tags matched against the Explore Meditations filter chips. */
  filterTags: string[];
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  durationMinutes: number;
  /** Guided narration track. Null until a licensed audio file is added. */
  audioUrl: string | null;
  /** Optional ambience layer, independent of the guided narration. */
  backgroundAudioUrl: string | null;
  /** Short, plain-language name for the ambience track shown on cards, e.g. "Forest ambience". */
  ambienceLabel: string | null;
  /** Three short, wellness-oriented reasons to try this practice. */
  benefits: string[];
  about: string;
  /** Timed captions shown during the session — also used as the text
   * fallback while no guided-audio file is connected. */
  guidanceCues: MeditationGuidanceCue[];
  difficulty?: string;
  featured?: boolean;
};

export type MeditationIntention = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const meditationIntentions: MeditationIntention[] = [
  { id: "calm-mind", label: "Calm my mind", icon: Leaf },
  { id: "prepare-sleep", label: "Prepare for sleep", icon: Moon },
  { id: "let-go", label: "Let go of overthinking", icon: Sparkles },
  { id: "gratitude", label: "Practice gratitude", icon: Heart },
  { id: "be-present", label: "Just be present", icon: Sun },
];

export const meditationFilters = [
  "All",
  "Calm",
  "Sleep",
  "Focus",
  "Mindfulness",
  "Compassion",
  "Body Awareness",
] as const;

/** Shown on every meditation detail page — the same four steps for every practice. */
export const meditationWhatToExpect = [
  {
    step: "01",
    title: "Settle in",
    description: "Find a comfortable position.",
  },
  {
    step: "02",
    title: "Follow the guidance",
    description: "Listen and gently follow along.",
  },
  {
    step: "03",
    title: "Thoughts may wander",
    description: "Notice when your attention moves away and gently return.",
  },
  {
    step: "04",
    title: "Finish gently",
    description: "Take a moment before returning to your day.",
  },
];

export const meditations: Meditation[] = [
  {
    id: "evening-calm",
    slug: "evening-calm",
    title: "Evening Calm",
    category: "Evening Practice",
    filterTags: ["Sleep", "Calm"],
    shortDescription:
      "A gentle guided practice to help you unwind, release the day, and prepare for a restful night.",
    description:
      "A gentle guided practice to help you unwind, release the day, and prepare for a restful night.",
    image: "/images/meditation/featured.png",
    imageAlt:
      "A person sitting quietly, looking out over misty mountains at sunrise",
    durationMinutes: 10,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/rain-sound.mp3",
    ambienceLabel: "Rain sounds",
    benefits: [
      "Help release the day",
      "Support a restful transition",
      "Prepare your mind for sleep",
    ],
    about:
      "A gentle wind-down practice designed to help you release the day and settle before rest.",
    guidanceCues: [
      { atSeconds: 0, text: "Let the day begin to soften and settle." },
      { atSeconds: 90, text: "Notice where you're holding onto today's thoughts." },
      { atSeconds: 240, text: "With each exhale, let a little more tension release." },
      { atSeconds: 420, text: "Allow your body to feel heavy and supported." },
      { atSeconds: 540, text: "Carry this calm gently into the rest of your evening." },
    ],
    difficulty: "Beginner",
    featured: true,
  },
  {
    id: "mindful-breathing",
    slug: "mindful-breathing",
    title: "Breathe & Reset",
    category: "Focused Attention",
    filterTags: ["Calm", "Focus", "Mindfulness"],
    shortDescription: "Use your breath as a simple anchor for attention.",
    description:
      "A short practice that gently guides your attention back to the breath whenever your mind wanders.",
    image: "/images/meditation/mindful.png",
    imageAlt: "A small bonsai tree and stones resting on a sunlit table",
    durationMinutes: 5,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/breathing-ambient-for-mindfulness.mp3",
    ambienceLabel: "Breathing ambience",
    benefits: [
      "Create a quiet pause",
      "Practice focused attention",
      "Gently return to the present moment",
    ],
    about:
      "A focused-attention practice that uses the breath as a simple anchor for your awareness.",
    guidanceCues: [
      { atSeconds: 0, text: "Notice the natural rhythm of your breath." },
      { atSeconds: 60, text: "Feel the air moving in and out, without changing it." },
      { atSeconds: 150, text: "If your mind wanders, gently guide it back to your breath." },
      { atSeconds: 240, text: "Take one more slow, easy breath before we finish." },
    ],
  },
  {
    id: "body-scan",
    slug: "body-scan",
    title: "Relax Your Body",
    category: "Body Awareness",
    filterTags: ["Body Awareness", "Calm"],
    shortDescription: "Slowly move your attention through the body.",
    description:
      "A guided practice that moves your attention gradually through the body, noticing sensations without needing to change them.",
    image: "/images/meditation/body.png",
    imageAlt: "A hand reaching out through dappled sunlight and green leaves",
    durationMinutes: 10,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/forest-ambience.mp3",
    ambienceLabel: "Forest ambience",
    benefits: [
      "Notice physical sensations",
      "Release areas of tension",
      "Build body awareness",
    ],
    about:
      "A body-awareness practice that guides your attention slowly through the body, noticing sensations without judgment.",
    guidanceCues: [
      { atSeconds: 0, text: "Bring your attention to your feet." },
      { atSeconds: 120, text: "Slowly move your awareness up through your legs." },
      { atSeconds: 300, text: "Notice any tension in your shoulders and let it soften." },
      { atSeconds: 450, text: "Bring awareness to your face and jaw." },
      { atSeconds: 540, text: "Take a moment to notice your whole body at once." },
    ],
  },
  {
    id: "open-awareness",
    slug: "open-awareness",
    title: "Quiet the Mind",
    category: "Open Monitoring",
    filterTags: ["Mindfulness", "Focus"],
    shortDescription: "Notice thoughts and sensations without judgment.",
    description:
      "A gentle practice of resting your attention openly, noticing whatever arises — thoughts, sounds, or sensations — without holding on.",
    image: "/images/meditation/open.png",
    imageAlt: "Birds flying across a glowing sunset sky above the clouds",
    durationMinutes: 10,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/tranquil-stream.mp3",
    ambienceLabel: "Stream ambience",
    benefits: [
      "Practice open, non-judgmental noticing",
      "Create space around thoughts",
      "Support a calmer mind",
    ],
    about:
      "An open-monitoring practice that invites you to notice thoughts, sounds, and sensations as they come and go.",
    guidanceCues: [
      { atSeconds: 0, text: "Let your attention rest gently, without focusing on one thing." },
      { atSeconds: 120, text: "Notice sounds, sensations, or thoughts as they arise." },
      { atSeconds: 300, text: "There's nothing to fix — just notice what's here." },
      { atSeconds: 450, text: "Allow whatever appears to pass by, like clouds in the sky." },
      { atSeconds: 540, text: "Gently widen your awareness once more before we finish." },
    ],
  },
  {
    id: "loving-kindness",
    slug: "loving-kindness",
    title: "Gentle & Kind",
    category: "Compassion",
    filterTags: ["Compassion", "Calm"],
    shortDescription: "Offer warmth and goodwill to yourself and others.",
    description:
      "A compassion practice that guides you through silently offering kind wishes to yourself and the people around you.",
    image: "/images/meditation/loving.png",
    imageAlt: "A white lotus flower blooming on a still pond",
    durationMinutes: 10,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/birds-forest-nature.mp3",
    ambienceLabel: "Forest birds",
    benefits: [
      "Cultivate warmth toward yourself and others",
      "Practice compassion",
      "Create a sense of connection",
    ],
    about:
      "A compassion practice that gently directs warmth and goodwill toward yourself and others.",
    guidanceCues: [
      { atSeconds: 0, text: "Bring to mind someone you care about." },
      { atSeconds: 120, text: "Silently offer them a wish for wellbeing." },
      { atSeconds: 300, text: "Now offer that same wish to yourself." },
      { atSeconds: 450, text: "Extend the feeling outward, to those around you." },
      { atSeconds: 540, text: "Rest in this feeling of warmth for a moment." },
    ],
  },
  {
    id: "peaceful-visualization",
    slug: "peaceful-visualization",
    title: "Peaceful Escape",
    category: "Guided Imagery",
    filterTags: ["Calm", "Sleep"],
    shortDescription: "Picture a calm place to support relaxation.",
    description:
      "A guided-imagery practice that invites you to picture a peaceful place, using the image to support a sense of calm.",
    image: "/images/meditation/peaceful.png",
    imageAlt: "A calm mountain lake surrounded by forest and mist",
    durationMinutes: 10,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/tranquil-flow.mp3",
    ambienceLabel: "Flowing water",
    benefits: [
      "Support relaxation through imagery",
      "Create a mental sense of calm",
      "Take a restorative pause",
    ],
    about:
      "A guided-imagery practice that uses calming mental images to support relaxation.",
    guidanceCues: [
      { atSeconds: 0, text: "Picture a calm, peaceful place — real or imagined." },
      { atSeconds: 120, text: "Notice the colors, light, and textures around you." },
      { atSeconds: 300, text: "Imagine the sounds of this peaceful place." },
      { atSeconds: 450, text: "Let your body settle as you rest here." },
      { atSeconds: 540, text: "Slowly let the image fade, carrying its calm with you." },
    ],
  },
  {
    id: "mantra-meditation",
    slug: "mantra-meditation",
    title: "Mantra & Stillness",
    category: "Concentration",
    filterTags: ["Focus", "Mindfulness"],
    shortDescription: "Repeat a simple word or phrase to steady your mind.",
    description:
      "A concentration practice that uses a soft, repeated word or phrase to help settle a busy mind.",
    image: "/images/meditation/mantra.png",
    imageAlt: "Wooden wind chimes hanging among green sunlit leaves",
    durationMinutes: 5,
    audioUrl: null,
    backgroundAudioUrl: "/audio/ambience/peaceful-mantra-meditation.mp3",
    ambienceLabel: "Meditative ambience",
    benefits: [
      "Support sustained focus",
      "Quiet a busy mind",
      "Practice gentle repetition",
    ],
    about:
      "A concentration practice that uses a simple repeated word or phrase to steady the mind.",
    guidanceCues: [
      { atSeconds: 0, text: "Choose a simple word or phrase to repeat silently." },
      { atSeconds: 60, text: "Let the mantra settle into a gentle rhythm." },
      { atSeconds: 150, text: "If your mind wanders, softly return to the mantra." },
      { atSeconds: 240, text: "Let the repetition become quieter and more effortless." },
    ],
  },
];

export function getMeditationBySlug(slug: string): Meditation | undefined {
  return meditations.find((meditation) => meditation.slug === slug);
}

export const featuredMeditation = meditations.find(
  (meditation) => meditation.featured,
);

export const meditationLibrary = meditations.filter(
  (meditation) => !meditation.featured,
);
