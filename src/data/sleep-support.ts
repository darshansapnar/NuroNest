import {
  AudioLines,
  BedDouble,
  Brain,
  Clock3,
  CloudLightning,
  CloudRain,
  Droplets,
  Headphones,
  LayoutGrid,
  Leaf,
  Moon,
  MoonStar,
  Music2,
  Smartphone,
  Thermometer,
  Trees,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";

export type SleepChip = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type SleepExperience = {
  id: string;
  title: string;
  description: string;
  tagLabel: string;
  tagIcon: LucideIcon;
  icon: LucideIcon;
  gradientClassName: string;
  /** Local, licensed audio file — see AUDIO_LICENSES.md for provenance. */
  audioUrl: string;
};

export type WindDownTip = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Temporary, local frontend data for the Sleep Support experience. Shaped so
 * a future audio/content API can replace it without changing the components
 * that consume it.
 */

export const sleepChips: SleepChip[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "wind-down", label: "Wind down", icon: Leaf },
  { id: "quiet-mind", label: "Quiet my mind", icon: Brain },
  { id: "fall-asleep", label: "Fall asleep", icon: Moon },
  { id: "stay-asleep", label: "Stay asleep", icon: BedDouble },
];

/**
 * Which Sleep Experiences show under each intent chip. These are simple
 * user-intent groupings (what someone says they want tonight), not medical
 * recommendations — no entry here implies a sound treats insomnia, anxiety,
 * or any other condition. An experience can, and does, appear under more
 * than one intent. The "all" chip isn't listed — selecting it (or nothing)
 * shows every Sleep Experience.
 */
export const sleepIntentExperienceIds: Record<string, string[]> = {
  "wind-down": [
    "sleep-meditation",
    "gentle-rain",
    "night-forest",
    "gentle-wind",
    "night-rain-forest",
    "peaceful-water-stream",
  ],
  "quiet-mind": [
    "sleep-meditation",
    "brown-noise",
    "pink-noise",
    "gentle-rain",
    "gentle-wind",
    "quiet-night-ambience",
  ],
  "fall-asleep": [
    "sleep-meditation",
    "ocean-waves",
    "brown-noise",
    "pink-noise",
    "soft-white-noise",
    "peaceful-water-stream",
  ],
  "stay-asleep": [
    "brown-noise",
    "pink-noise",
    "soft-white-noise",
    "gentle-rain",
    "night-forest",
    "night-rain-forest",
    "quiet-night-ambience",
  ],
};

export const sleepExperiences: SleepExperience[] = [
  {
    id: "sleep-meditation",
    title: "Sleep Meditation",
    description: "Gentle guidance",
    tagLabel: "Ambient",
    tagIcon: Headphones,
    icon: Moon,
    gradientClassName: "from-[#1b2340] via-[#232c4d] to-[#3a2f52]",
    audioUrl: "/audio/sleep/sleep-meditation.mp3",
  },
  {
    id: "gentle-rain",
    title: "Gentle Rain",
    description: "Soothing rain sounds",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: CloudRain,
    gradientClassName: "from-[#132a26] via-[#1c3b34] to-[#254a3f]",
    audioUrl: "/audio/sleep/gentle-rain.mp3",
  },
  {
    id: "ocean-waves",
    title: "Ocean Waves",
    description: "Rhythmic and calming",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: Waves,
    gradientClassName: "from-[#0f2438] via-[#163650] to-[#1f4864]",
    audioUrl: "/audio/sleep/ocean-waves.mp3",
  },
  {
    id: "night-forest",
    title: "Night Forest",
    description: "Peaceful night ambience",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: Trees,
    gradientClassName: "from-[#10201b] via-[#182f26] to-[#1f3b2e]",
    audioUrl: "/audio/sleep/night-forest.mp3",
  },
  {
    id: "brown-noise",
    title: "Brown Noise",
    description: "Deep, steady tones",
    tagLabel: "Ambient",
    tagIcon: AudioLines,
    icon: AudioLines,
    gradientClassName: "from-[#3a2416] via-[#5a3620] to-[#7a4a26]",
    audioUrl: "/audio/sleep/brown-noise.mp3",
  },
  {
    id: "pink-noise",
    title: "Pink Noise",
    description: "Balanced and smooth",
    tagLabel: "Ambient",
    tagIcon: AudioLines,
    icon: AudioLines,
    gradientClassName: "from-[#392a42] via-[#4d3657] to-[#6b4a67]",
    audioUrl: "/audio/sleep/pink-noise.mp3",
  },
  {
    id: "soft-white-noise",
    title: "Soft White Noise",
    description: "Steady, even hiss",
    tagLabel: "Ambient",
    tagIcon: AudioLines,
    icon: AudioLines,
    gradientClassName: "from-[#2a2d33] via-[#383c44] to-[#4a4f59]",
    audioUrl: "/audio/sleep/soft-white-noise.mp3",
  },
  {
    id: "gentle-wind",
    title: "Gentle Wind",
    description: "Airy outdoor breeze",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: Wind,
    gradientClassName: "from-[#1e2a30] via-[#2b3d45] to-[#3a5560]",
    audioUrl: "/audio/sleep/gentle-wind.mp3",
  },
  {
    id: "rain-and-thunder",
    title: "Rain & Distant Thunder",
    description: "Stormy and soothing",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: CloudLightning,
    gradientClassName: "from-[#151c30] via-[#202a45] to-[#2c3a5e]",
    audioUrl: "/audio/sleep/rain-and-thunder.mp3",
  },
  {
    id: "night-rain-forest",
    title: "Night Rain Forest",
    description: "Rainfall through trees",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: CloudRain,
    gradientClassName: "from-[#12241f] via-[#1a3530] to-[#234943]",
    audioUrl: "/audio/sleep/night-rain-forest.mp3",
  },
  {
    id: "quiet-night-ambience",
    title: "Quiet Night Ambience",
    description: "Crickets and stillness",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: MoonStar,
    gradientClassName: "from-[#141a2e] via-[#1e2740] to-[#2a3555]",
    audioUrl: "/audio/sleep/quiet-night-ambience.mp3",
  },
  {
    id: "peaceful-water-stream",
    title: "Peaceful Water Stream",
    description: "Flowing water sounds",
    tagLabel: "Nature",
    tagIcon: Music2,
    icon: Droplets,
    gradientClassName: "from-[#0e2a2e] via-[#154047] to-[#1c565f]",
    audioUrl: "/audio/sleep/peaceful-water-stream.mp3",
  },
];

export const windDownTips: WindDownTip[] = [
  {
    id: "consistent-schedule",
    title: "Keep a consistent sleep schedule",
    description: "Go to bed and wake up at the same time each day.",
    icon: Clock3,
  },
  {
    id: "quiet-time",
    title: "Give yourself quiet time",
    description: "Spend a few minutes unwinding before bed.",
    icon: Moon,
  },
  {
    id: "comfortable-room",
    title: "Keep your room comfortable",
    description: "A cool, dark and quiet room can support better sleep.",
    icon: Thermometer,
  },
  {
    id: "reduce-screens",
    title: "Reduce bright screens",
    description: "Try to limit screens and bright light before bedtime.",
    icon: Smartphone,
  },
];
