/**
 * Module 4: Nuro End-of-Conversation Recommendation Engine.
 *
 * Deterministic, application-controlled recommendation layer that suggests
 * 0–3 relevant next steps when a conversation reaches a natural conclusion,
 * or when the user explicitly asks for next steps / recommendations.
 *
 * AVAILABILITY: Wellness Assessment, Relaxation Hub, and Wellness Resources
 * are planned features whose routes don't exist yet — only "Talk to a
 * Professional" (/professional) is live today. Recommendation *definitions*
 * for the planned features are kept below (topic mapping, priority, copy)
 * so the topic/intent classification stays extensible: adding a route later
 * is a one-line `available: true` flip, not a rewrite. `toAvailable()` is
 * the single place that filters definitions down to what's actually
 * shippable right now. A topic whose entire recommendation pool is
 * currently unavailable naturally resolves to an empty list — the
 * conversation gets a plain closing with no recommendation cards, never a
 * dead link.
 *
 * CRITICAL SAFETY RULE:
 * If the conversation safety state is HIGH, IMMEDIATE, or SAFETY_FOLLOW_UP,
 * normal wellness recommendations (Assessment, Relaxation, Resources) are
 * strictly suppressed in favor of professional care / crisis support.
 */

import type { ChatMessage } from "@/lib/ai/provider";
import type { ConversationSafetyState } from "@/lib/ai/safety-state";

export type RecommendationType =
  | "ASSESSMENT"
  | "RELAXATION"
  | "RESOURCES"
  | "PROFESSIONAL"
  | "CRISIS_SUPPORT";

export interface NuroRecommendation {
  type: RecommendationType;
  title: string;
  description: string;
  route: string;
  priority: number;
}

export type ClosingIntent =
  | "EXPLICIT_ASK"
  | "THANKS_CLOSING"
  | "BYE_CLOSING"
  | "NATURAL_CONCLUSION"
  | "NONE";

export type WellnessTopic =
  | "EXPLICIT_PROFESSIONAL"
  | "EXPLICIT_RELAXATION"
  | "STRESS"
  | "SLEEP"
  | "ANXIETY"
  | "LOW_MOOD"
  | "GENERAL_WELLBEING"
  | "OFF_TOPIC";

// --- Recommendation Definitions ---
// `available: false` means the route doesn't exist in the app yet. Flip it
// to `true` the day the corresponding page ships — no other change needed
// here or in `generateRecommendations`.

interface RecommendationDefinition extends NuroRecommendation {
  available: boolean;
}

export const RECOMMENDATION_ASSESSMENT: RecommendationDefinition = {
  type: "ASSESSMENT",
  title: "Take a Wellness Assessment",
  description: "Check in on your mental wellbeing with a short screening tool.",
  route: "/assessment",
  priority: 1,
  available: false,
};

export const RECOMMENDATION_RELAXATION: RecommendationDefinition = {
  type: "RELAXATION",
  title: "Explore Relaxation Hub",
  description: "Try guided breathing exercises, ambient soundscapes, or meditation.",
  route: "/relaxation",
  priority: 1,
  available: false,
};

export const RECOMMENDATION_RESOURCES: RecommendationDefinition = {
  type: "RESOURCES",
  title: "Browse Wellness Resources",
  description: "Read helpful articles, coping guides, and wellness tips.",
  route: "/resources",
  priority: 2,
  available: false,
};

export const RECOMMENDATION_PROFESSIONAL: RecommendationDefinition = {
  type: "PROFESSIONAL",
  title: "Talk to a Professional",
  description:
    "If this has been difficult to manage for a while, talking with a mental-health professional could be helpful.",
  route: "/professional",
  priority: 3,
  available: true,
};

export const RECOMMENDATION_CRISIS_SUPPORT: RecommendationDefinition = {
  type: "CRISIS_SUPPORT",
  title: "Contact Professional & Crisis Helplines",
  description:
    "Free, 24/7 confidential support is available anytime through Tele-MANAS (14416) or emergency services.",
  route: "/crisis",
  priority: 1,
  available: false,
};

/**
 * Filters recommendation definitions down to the ones whose route actually
 * exists today, and strips the internal `available` flag from the public
 * shape returned to callers.
 */
function toAvailable(definitions: RecommendationDefinition[]): NuroRecommendation[] {
  return definitions
    .filter((definition) => definition.available)
    .map(({ type, title, description, route, priority }) => ({
      type,
      title,
      description,
      route,
      priority,
    }));
}

// --- Pattern Matching Helpers ---

const EXPLICIT_ASK_PATTERNS: RegExp[] = [
  /\bwhat\s+(should|can)\s+i\s+(do|try)\s+next\b/i,
  /\bwhat\s+do\s+you\s+recommend\b/i,
  /\bwhere\s+should\s+i\s+go\s+from\s+here\b/i,
  /\bany\s+suggestions\s+for\s+what\s+to\s+do\b/i,
  /\bwhat\s+are\s+my\s+next\s+steps\b/i,
  /\b(where\s+can\s+i\s+find|looking\s+for|recommend\s+a|how\s+to\s+find)\b/i,
];

const BYE_PATTERNS: RegExp[] = [
  /^\s*(bye|goodbye|see\s+ya|talk\s+to\s+you\s+later|have\s+a\s+good\s+day|cya)[.!\s]*$/i,
];

const THANKS_PATTERNS: RegExp[] = [
  /\b(thanks|thank\s+you|that'?s\s+helpful|that\s+helps|i\s+understand|okay\s+got\s+it|i\s+think\s+that'?s\s+enough|that'?s\s+all)\b/i,
];

const CONCLUSION_FEELING_PATTERNS: RegExp[] = [
  /\b(i'?m\s+|i\s+)?feel(ing)?\s+(better|a\s+bit\s+better|much\s+better|good|okay)\b/i,
  /\bthat\s+(eased|relieved|helped)\s+my\b/i,
  /\bfeeling\s+more\s+(calm|relaxed)\b/i,
];

// Topic patterns.
//
// These deliberately do NOT reuse safety-detection.ts's risk-tier regexes
// (e.g. its "anxiety"/"stress" signals), even though the words overlap.
// The two modules classify for different purposes with different accuracy
// requirements — safety-detection's patterns are tuned for risk-severity
// recall and get adjusted for that reason alone. Sharing regexes would
// silently couple a wellness-topic UX heuristic to future safety-tuning
// changes (and vice versa), which is a worse outcome than the few
// duplicated lines below.
const EXPLICIT_PROFESSIONAL_PATTERNS: RegExp[] = [
  /\b(doctor|therapist|psychiatrist|counselor|professional\s+help|see\s+someone)\b/i,
  /\bfind\s+a\s+(therapist|doctor|counselor)\b/i,
];

const EXPLICIT_RELAXATION_PATTERNS: RegExp[] = [
  /\b(breathing\s+exercise|breathwork|meditation|relaxing\s+sound|white\s+noise|soundscape|guided\s+audio)\b/i,
  /\bwant\s+to\s+relax\b/i,
];

const SLEEP_PATTERNS: RegExp[] = [
  /\b(sleep|insomnia|can'?t\s+sleep|sleepless|falling\s+asleep|nighttime|tired)\b/i,
];

const ANXIETY_PATTERNS: RegExp[] = [
  /\b(anxi(ety|ous)|panic|nervous|worried|racing\s+thoughts)\b/i,
];

const STRESS_PATTERNS: RegExp[] = [
  /\b(stress(ed)?|overwhelmed|burnout|burnt\s+out|pressure)\b/i,
];

const LOW_MOOD_PATTERNS: RegExp[] = [
  /\b(depress(ed|ion)|feeling\s+low|sad(ness)?|gloomy|empty|lonely)\b/i,
];

// Off-topic or non-wellness query (e.g. coding, trivia, weather)
const OFF_TOPIC_PATTERN =
  /c\+\+|javascript|python|coding|programming|weather|recipe|math|history|movie/i;

// --- Core Analyzers ---

export function detectClosingIntent(message: string): ClosingIntent {
  const trimmed = message.trim();

  if (EXPLICIT_ASK_PATTERNS.some((p) => p.test(trimmed))) {
    return "EXPLICIT_ASK";
  }

  if (BYE_PATTERNS.some((p) => p.test(trimmed))) {
    return "BYE_CLOSING";
  }

  if (THANKS_PATTERNS.some((p) => p.test(trimmed))) {
    return "THANKS_CLOSING";
  }

  if (CONCLUSION_FEELING_PATTERNS.some((p) => p.test(trimmed))) {
    return "NATURAL_CONCLUSION";
  }

  return "NONE";
}

export function detectConversationTopic(
  message: string,
  history: ChatMessage[],
): WellnessTopic {
  // Check full text of incoming message and recent user messages in history
  const combinedText = [
    ...history.filter((m) => m.role === "user").map((m) => m.content),
    message,
  ].join(" ");

  if (EXPLICIT_PROFESSIONAL_PATTERNS.some((p) => p.test(combinedText))) {
    return "EXPLICIT_PROFESSIONAL";
  }

  if (EXPLICIT_RELAXATION_PATTERNS.some((p) => p.test(combinedText))) {
    return "EXPLICIT_RELAXATION";
  }

  if (SLEEP_PATTERNS.some((p) => p.test(combinedText))) {
    return "SLEEP";
  }

  if (ANXIETY_PATTERNS.some((p) => p.test(combinedText))) {
    return "ANXIETY";
  }

  if (STRESS_PATTERNS.some((p) => p.test(combinedText))) {
    return "STRESS";
  }

  if (LOW_MOOD_PATTERNS.some((p) => p.test(combinedText))) {
    return "LOW_MOOD";
  }

  if (OFF_TOPIC_PATTERN.test(combinedText)) {
    return "OFF_TOPIC";
  }

  return "GENERAL_WELLBEING";
}

export interface GenerateRecommendationsParams {
  message: string;
  history: ChatMessage[];
  safetyState?: ConversationSafetyState;
}

/**
 * Main recommendation entry point. Returns 0 to 3 structured recommendation
 * objects, drawn only from what's actually available in the app today.
 */
export function generateRecommendations(
  params: GenerateRecommendationsParams,
): NuroRecommendation[] {
  const { message, history, safetyState = "NORMAL" } = params;

  // 1. CRITICAL SAFETY RULE: Active HIGH / IMMEDIATE / SAFETY_FOLLOW_UP states
  // suppress normal wellness recommendations in favor of professional/crisis care.
  if (
    safetyState === "HIGH" ||
    safetyState === "IMMEDIATE" ||
    safetyState === "SAFETY_FOLLOW_UP"
  ) {
    return toAvailable([RECOMMENDATION_CRISIS_SUPPORT, RECOMMENDATION_PROFESSIONAL]);
  }

  // 2. Early / short conversation without closing intent -> NO recommendations
  const closingIntent = detectClosingIntent(message);

  if (closingIntent === "BYE_CLOSING" || closingIntent === "NONE") {
    return [];
  }

  const topic = detectConversationTopic(message, history);

  if (topic === "OFF_TOPIC") {
    return [];
  }

  // 3. Topic & Intent Mapping Matrix

  // Explicit user requests
  if (topic === "EXPLICIT_PROFESSIONAL") {
    return toAvailable([RECOMMENDATION_PROFESSIONAL, RECOMMENDATION_ASSESSMENT]);
  }

  if (topic === "EXPLICIT_RELAXATION") {
    return toAvailable([RECOMMENDATION_RELAXATION, RECOMMENDATION_RESOURCES]);
  }

  // Topic specific mappings
  let pool: RecommendationDefinition[] = [];

  switch (topic) {
    case "STRESS":
      pool = [RECOMMENDATION_RESOURCES, RECOMMENDATION_ASSESSMENT];
      break;
    case "SLEEP":
      pool = [
        RECOMMENDATION_RELAXATION,
        RECOMMENDATION_RESOURCES,
        RECOMMENDATION_PROFESSIONAL,
      ];
      break;
    case "ANXIETY":
      pool = [
        RECOMMENDATION_ASSESSMENT,
        RECOMMENDATION_RESOURCES,
        RECOMMENDATION_PROFESSIONAL,
      ];
      break;
    case "LOW_MOOD":
      pool = [
        RECOMMENDATION_ASSESSMENT,
        RECOMMENDATION_RESOURCES,
        RECOMMENDATION_PROFESSIONAL,
      ];
      break;
    case "GENERAL_WELLBEING":
    default:
      pool = [RECOMMENDATION_ASSESSMENT, RECOMMENDATION_RESOURCES];
      break;
  }

  const available = toAvailable(pool);

  // 4. Closing Intent Slicing
  if (closingIntent === "THANKS_CLOSING") {
    // Concise closing: return top 1 recommendation max
    return available.slice(0, 1);
  }

  // EXPLICIT_ASK or NATURAL_CONCLUSION -> return up to 3 available recommendations
  return available.slice(0, 3);
}
