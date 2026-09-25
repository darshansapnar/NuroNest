import {
  BookOpen,
  Brain,
  ClipboardCheck,
  Flower2,
  Home,
  Leaf,
  LayoutDashboard,
  MessageCircle,
  Moon,
  NotebookPen,
  Sun,
  Trees,
  User,
  Wind,
  type LucideIcon,
  Music2,
} from "lucide-react";

export type RelaxationNeed = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type SidebarNavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type RelaxationCategory = {
  slug: "breathing" | "meditation" | "sleep" | "sounds" | "music";
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
};

export type RelaxationTrack = {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  imageAlt: string;
};

export type ContinueRelaxationItem = RelaxationTrack & {
  minutesRemainingLabel: string;
  progressPercent: number;
};

export type FavoriteTrack = RelaxationTrack;

export type QuickReset = RelaxationTrack;

export type RecommendedTrack = RelaxationTrack;

/**
 * Temporary, local frontend data. Every dataset here is shaped so a future
 * API/database layer (activity history, favorites, recommendations) can
 * replace it without changing the components that consume it.
 */

export const relaxationSidebarLinks: SidebarNavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Talk to AI", href: "/ai-companion", icon: MessageCircle },
  { label: "Assessment", href: "/assessment", icon: ClipboardCheck },
  { label: "Relaxation Hub", href: "/relaxation", icon: Leaf },
  { label: "Wellness Resources", href: "/resources", icon: BookOpen },
  { label: "Find Professional", href: "/professional", icon: User },
  { label: "Journal", href: "/journal", icon: NotebookPen },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export const relaxationNeeds: RelaxationNeed[] = [
  { id: "relieve-stress", label: "Relieve Stress", icon: Leaf },
  { id: "better-sleep", label: "Better Sleep", icon: Moon },
  { id: "calm-down", label: "Calm Down", icon: Flower2 },
  { id: "clear-mind", label: "Clear My Mind", icon: Brain },
  { id: "feel-positive", label: "Feel Positive", icon: Sun },
];

export const relaxationCategories: RelaxationCategory[] = [
  {
    slug: "breathing",
    title: "Breathing Exercises",
    description: "Simple breathing techniques to help calm your mind.",
    href: "/relaxation/breathing",
    image: "/images/relaxation-hub/breathing.png",
    imageAlt: "Soft watercolor illustration of green leaves and branches",
    icon: Wind,
  },
  {
    slug: "meditation",
    title: "Meditation",
    description: "Guided practices for stress, anxiety, sleep, and gratitude.",
    href: "/relaxation/meditation",
    image: "/images/relaxation-hub/meditation.png",
    imageAlt: "Balanced stones beside a calm lake at sunset",
    icon: Flower2,
  },
  {
    slug: "sleep",
    title: "Sleep Support",
    description: "Peaceful sounds and practices to help you wind down.",
    href: "/relaxation/sleep",
    image: "/images/relaxation-hub/sleep-support.png",
    imageAlt: "A crescent moon over a quiet lake at night",
    icon: Moon,
  },
  {
    slug: "sounds",
    title: "Relaxing Sounds",
    description: "Nature sounds to create a peaceful environment.",
    href: "/relaxation/sounds",
    image: "/images/relaxation-hub/relaxation-sounds.png",
    imageAlt: "A gentle waterfall flowing through a sunlit forest",
    icon: Trees,
  },
  {
    slug: "music",
    title: "Instrumental Music",
    description: "Calming instrumental music for relaxation and focus.",
    href: "/relaxation/music",
    image: "/images/relaxation-hub/instrumental.png",
    imageAlt: "An acoustic guitar resting on a porch at sunrise",
    icon: Music2,
  },
];

export const continueRelaxationItem: ContinueRelaxationItem = {
  id: "continue-rain-forest",
  title: "Rain + Forest",
  category: "Relaxing Sounds",
  duration: "20 min",
  image: "/images/relaxation-hub/relaxation-sounds.png",
  imageAlt: "Rain falling over a misty forest stream",
  minutesRemainingLabel: "12 min remaining",
  progressPercent: 40,
};

export const favoriteTracks: FavoriteTrack[] = [
  {
    id: "favorite-evening-wind-down",
    title: "Evening Wind Down",
    category: "Meditation",
    duration: "10 min",
    image: "/images/relaxation-hub/meditation.png",
    imageAlt: "Balanced stones beside a calm lake at sunset",
  },
  {
    id: "favorite-rain-ocean",
    title: "Rain + Ocean",
    category: "Relaxing Sounds",
    duration: "30 min",
    image: "/images/relaxation-hub/relaxation-sounds.png",
    imageAlt: "A gentle waterfall flowing through a sunlit forest",
  },
  {
    id: "favorite-deep-breathing",
    title: "Deep Breathing",
    category: "Breathing",
    duration: "5 min",
    image: "/images/relaxation-hub/breathing.png",
    imageAlt: "Soft watercolor illustration of green leaves and branches",
  },
];

export const quickResets: QuickReset[] = [
  {
    id: "quick-2-minute-breathing",
    title: "2-Minute Breathing",
    category: "Breathing",
    duration: "2 min",
    image: "/images/relaxation-hub/breathing.png",
    imageAlt: "Soft watercolor illustration of green leaves and branches",
  },
  {
    id: "quick-mindful-pause",
    title: "Mindful Pause",
    category: "Meditation",
    duration: "3 min",
    image: "/images/relaxation-hub/meditation.png",
    imageAlt: "Balanced stones beside a calm lake at sunset",
  },
  {
    id: "quick-body-relaxation",
    title: "Body Relaxation",
    category: "Guided Audio",
    duration: "5 min",
    image: "/images/relaxation-hub/meditation.png",
    imageAlt: "Balanced stones beside a calm lake at sunset",
  },
  {
    id: "quick-calming-rain",
    title: "Calming Rain",
    category: "Sounds",
    duration: "10 min",
    image: "/images/relaxation-hub/relaxation-sounds.png",
    imageAlt: "A gentle waterfall flowing through a sunlit forest",
  },
];

export const recommendedTracks: RecommendedTrack[] = [
  {
    id: "recommended-forest-rain",
    title: "Forest + Rain",
    category: "Soundscape",
    duration: "20 min",
    image: "/images/relaxation-hub/relaxation-sounds.png",
    imageAlt: "A gentle waterfall flowing through a sunlit forest",
  },
  {
    id: "recommended-gratitude-meditation",
    title: "Gratitude Meditation",
    category: "Meditation",
    duration: "10 min",
    image: "/images/relaxation-hub/meditation.png",
    imageAlt: "Balanced stones beside a calm lake at sunset",
  },
  {
    id: "recommended-lofi-focus",
    title: "Lo-fi Focus",
    category: "Instrumental",
    duration: "30 min",
    image: "/images/relaxation-hub/instrumental.png",
    imageAlt: "An acoustic guitar resting on a porch at sunrise",
  },
  {
    id: "recommended-morning-calm",
    title: "Morning Calm",
    category: "Meditation",
    duration: "15 min",
    image: "/images/relaxation-hub/meditation.png",
    imageAlt: "Balanced stones beside a calm lake at sunset",
  },
];
