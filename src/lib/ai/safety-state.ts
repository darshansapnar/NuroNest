/**
 * Module 3: Nuro Conversation Safety State & Follow-up Handling.
 *
 * Manages conversation-level safety state transitions deterministically across
 * multiple turns. Prevents Nuro from instantly switching back to a generic AI
 * chatbot (e.g. answering unrelated queries like programming trivia) when a
 * user topic-pivots after expressing HIGH or IMMEDIATE risk without confirming
 * current safety.
 *
 * Safety states:
 *  - NORMAL: Default state. No active risk disclosures in conversation history.
 *  - MODERATE: Recent moderate emotional distress/ideation.
 *  - HIGH: Active high-risk disclosure (suicidal intent / plan).
 *  - IMMEDIATE: Active immediate danger disclosure (imminent self-harm / suicide).
 *  - SAFETY_FOLLOW_UP: Active follow-up state after HIGH or IMMEDIATE risk when the
 *    user pivots to an unrelated topic or refuses to confirm safety.
 */

import { detectSafety, type SafetyDetectionResult } from "@/lib/ai/safety-detection";
import { buildCrisisResponse, type CrisisResponse } from "@/lib/ai/crisis-response";
import type { AiProvider, ChatMessage } from "@/lib/ai/provider";

export type ConversationSafetyState =
  | "NORMAL"
  | "MODERATE"
  | "HIGH"
  | "IMMEDIATE"
  | "SAFETY_FOLLOW_UP";

export type SafetyStateAction =
  | "CRISIS_RESPONSE"
  | "SAFETY_FOLLOW_UP"
  | "NORMAL_FLOW";

export interface SafetyStateEvaluation {
  /** Derived state before or after this turn. */
  state: ConversationSafetyState;
  /** Action the API route should take. */
  action: SafetyStateAction;
  /** Detection result for the current incoming message. */
  detection: SafetyDetectionResult;
  /** Crisis response payload if action === "CRISIS_RESPONSE". */
  crisisResponse?: CrisisResponse;
  /** Follow-up message text if action === "SAFETY_FOLLOW_UP". */
  followUpContent?: string;
}

const SAFETY_CONFIRMATION_PATTERNS: RegExp[] = [
  /\b(i'?m|i\s+am)\s+(safe|okay|ok|fine|feeling\s+better|in\s+a\s+safe\s+place)\b/i,
  /\bi\s+(feel|am)\s+safe\b/i,
  /\bi\s+won'?t\s+(hurt|kill|harm)\s+myself\b/i,
  /\bi'?m\s+not\s+going\s+to\s+(hurt|kill|harm)\s+myself\b/i,
  /\byes,?\s+(i'?m|i\s+am)\s+(safe|okay|ok)\b/i,
  /\bi'?m\s+safe\s+(now|today|right\s+now)\b/i,
  /\b(i\s+have|got)\s+help\b/i,
  /\bi'?m\s+with\s+(someone|family|friends|a\s+friend)\b/i,
];

const RISK_REAFFIRMATION_PATTERNS: RegExp[] = [
  /\b(i'?m|i\s+am)\s+not\s+safe\b/i,
  /\b(i'?m|i\s+am)\s+(still|really)\s+(suicidal|feeling\s+suicidal)\b/i,
  /\b(i\s+still\s+want\s+to|still\s+going\s+to)\s+(die|kill\s+myself|end\s+it)\b/i,
  /\bmight\s+(hurt|kill|harm)\s+myself\b/i,
  /\bno,?\s+i'?m\s+not\s+safe\b/i,
  /\bunsafe\b/i,
];

const NEGATIVE_SAFETY_PATTERNS: RegExp[] = [
  /^no[\s.!]*$/i,
  /^no,?\s+/i,
  /^nope[\s.!]*$/i,
  /^nah[\s.!]*$/i,
  /^not\s+safe[\s.!]*$/i,
  /^not\s+really[\s.!]*$/i,
  /i'?m\s+not\s+safe/i,
  /i\s+am\s+not\s+safe/i,
  /i\s+don'?t\s+feel\s+safe/i,
  /i\s+do\s+not\s+feel\s+safe/i,
  /not\s+okay/i,
  /not\s+ok/i,
];

const AFFIRMATIVE_SAFETY_PATTERNS: RegExp[] = [
  /^yes[\s.!]*$/i,
  /^yes,?\s+/i,
  /^yeah[\s.!]*$/i,
  /^yep[\s.!]*$/i,
  /^sure[\s.!]*$/i,
  /^i\s+am[\s.!]*$/i,
  /^i\s+do[\s.!]*$/i,
  /i'?m\s+safe/i,
  /i\s+am\s+safe/i,
  /i'?m\s+okay/i,
  /i'?m\s+ok/i,
  /i\s+feel\s+safe/i,
];

const UNSURE_SAFETY_PATTERNS: RegExp[] = [
  /i\s+don'?t\s+know/i,
  /\bidk\b/i,
  /not\s+sure/i,
  /\bmaybe\b/i,
  /i\s+guess/i,
  /kind\s+of/i,
  /sort\s+of/i,
  /confused/i,
  /unclear/i,
];

/**
 * Returns true if the message content asks if the user is feeling safe.
 */
export function isSafetyQuestion(content: string): boolean {
  if (!content) return false;
  const lower = content.toLowerCase();
  return (
    lower.includes("feeling safe right now") ||
    lower.includes("are you feeling safe") ||
    lower.includes("are you safe right now") ||
    lower.includes("in immediate danger") ||
    lower.includes("trusted person nearby") ||
    lower.includes("check in about what you shared")
  );
}

/**
 * Returns true if text explicitly indicates the user is currently safe.
 */
export function isSafetyConfirmation(text: string): boolean {
  return (
    SAFETY_CONFIRMATION_PATTERNS.some((p) => p.test(text)) ||
    AFFIRMATIVE_SAFETY_PATTERNS.some((p) => p.test(text.trim()))
  );
}

/**
 * Returns true if text explicitly re-affirms ongoing risk or feeling unsafe.
 */
export function isRiskReaffirmation(text: string): boolean {
  return (
    RISK_REAFFIRMATION_PATTERNS.some((p) => p.test(text)) ||
    NEGATIVE_SAFETY_PATTERNS.some((p) => p.test(text.trim()))
  );
}

export function isNegativeSafetyAnswer(text: string): boolean {
  return isRiskReaffirmation(text);
}

export function isAffirmativeSafetyAnswer(text: string): boolean {
  return isSafetyConfirmation(text);
}

export function isUnsureSafetyAnswer(text: string): boolean {
  return UNSURE_SAFETY_PATTERNS.some((p) => p.test(text.trim()));
}

export type SafetyAnswerCategory = "SAFE" | "NOT_SAFE" | "UNSURE" | "UNKNOWN";

export function classifySafetyAnswer(message: string): SafetyAnswerCategory {
  if (isNegativeSafetyAnswer(message)) {
    return "NOT_SAFE";
  }
  if (isAffirmativeSafetyAnswer(message)) {
    return "SAFE";
  }
  if (isUnsureSafetyAnswer(message)) {
    return "UNSURE";
  }
  return "UNKNOWN";
}

/**
 * Computes the conversation safety state from prior message history alone.
 */
export function deriveSafetyStateFromHistory(
  history: ChatMessage[],
): ConversationSafetyState {
  let currentState: ConversationSafetyState = "NORMAL";

  for (const entry of history) {
    if (entry.role !== "user") continue;

    const detection = detectSafety(entry.content);

    // Only SELF / UNSPECIFIED risk triggers personal crisis state — third-party disclosures
    // (OTHER) or suppressed contexts (educational/quotes) do NOT elevate state.
    const isPersonalRisk =
      detection.subject !== "OTHER" && !detection.contextSuppressed;

    if (isPersonalRisk && detection.level === "IMMEDIATE") {
      currentState = "IMMEDIATE";
      continue;
    }

    if (isPersonalRisk && detection.level === "HIGH") {
      currentState = currentState === "IMMEDIATE" ? "IMMEDIATE" : "HIGH";
      continue;
    }

    if (isPersonalRisk && detection.level === "MODERATE") {
      if (currentState === "NORMAL") {
        currentState = "MODERATE";
      }
      continue;
    }

    // Message is NONE or LOW
    if (currentState === "HIGH" || currentState === "IMMEDIATE" || currentState === "SAFETY_FOLLOW_UP") {
      if (isAffirmativeSafetyAnswer(entry.content)) {
        currentState = "NORMAL";
      } else if (isNegativeSafetyAnswer(entry.content)) {
        currentState = "HIGH";
      } else {
        currentState = "SAFETY_FOLLOW_UP";
      }
    } else if (currentState === "MODERATE") {
      if (isAffirmativeSafetyAnswer(entry.content)) {
        currentState = "NORMAL";
      }
    }
  }

  return currentState;
}

export function buildSafetyFollowUpText(): string {
  return (
    "Before we move on, I want to check in about what you shared earlier. " +
    "Are you feeling safe right now?"
  );
}

export function buildDifferentSafetyFollowUpText(): string {
  return (
    "Thank you for being open with me. Since you're not sure, your safety remains my top priority. " +
    "Is there a family member, friend, or trusted person you can be with right now?"
  );
}

/**
 * Main evaluation function for Module 3. Combines prior conversation safety state
 * with the newest incoming message classification to determine safety state and action.
 */
export async function evaluateSafetyState(params: {
  message: string;
  history: ChatMessage[];
  countryCode?: string;
  provider?: AiProvider;
}): Promise<SafetyStateEvaluation> {
  const { message, history, countryCode, provider } = params;

  const priorState = deriveSafetyStateFromHistory(history);
  const detection = detectSafety(message);

  const isPersonalRisk =
    detection.subject !== "OTHER" && !detection.contextSuppressed;

  // 1. Direct high or immediate escalation from incoming message classifier
  if (isPersonalRisk && detection.level === "IMMEDIATE") {
    const crisisResponse = await buildCrisisResponse(detection, message, history, { countryCode, provider });
    return {
      state: "IMMEDIATE",
      action: "CRISIS_RESPONSE",
      detection,
      crisisResponse,
    };
  }

  if (isPersonalRisk && detection.level === "HIGH") {
    const crisisResponse = await buildCrisisResponse(detection, message, history, { countryCode, provider });
    return {
      state: "HIGH",
      action: "CRISIS_RESPONSE",
      detection,
      crisisResponse,
    };
  }

  if (isPersonalRisk && detection.level === "MODERATE") {
    // If we were already in HIGH or IMMEDIATE or SAFETY_FOLLOW_UP, stay in high risk or elevate
    if (priorState === "HIGH" || priorState === "IMMEDIATE" || priorState === "SAFETY_FOLLOW_UP") {
      const crisisResponse =
        (await buildCrisisResponse({ ...detection, level: "HIGH" }, message, history, { countryCode, provider })) ??
        (await buildCrisisResponse(detection, message, history, { countryCode, provider }));
      return {
        state: "HIGH",
        action: "CRISIS_RESPONSE",
        detection,
        crisisResponse,
      };
    }

    const crisisResponse = await buildCrisisResponse(detection, message, history, { countryCode, provider });
    return {
      state: "MODERATE",
      action: "CRISIS_RESPONSE",
      detection,
      crisisResponse,
    };
  }

  // 2. Incoming message is NONE or LOW (not an explicit high/moderate risk disclosure)

  const lastAssistantMessage = history.slice().reverse().find((m) => m.role === "assistant");
  const isExpectingSafetyAnswer = lastAssistantMessage
    ? isSafetyQuestion(lastAssistantMessage.content)
    : false;

  const isElevatedPriorState =
    priorState === "HIGH" ||
    priorState === "IMMEDIATE" ||
    priorState === "SAFETY_FOLLOW_UP";

  if (isExpectingSafetyAnswer || isElevatedPriorState) {
    const answerCategory = classifySafetyAnswer(message);

    if (answerCategory === "NOT_SAFE") {
      const syntheticDetection: SafetyDetectionResult = {
        level: priorState === "IMMEDIATE" ? "IMMEDIATE" : "HIGH",
        subject: "SELF",
        imminent: priorState === "IMMEDIATE" || isNegativeSafetyAnswer(message),
        contextSuppressed: false,
        signals: ["user-reported-not-safe"],
      };
      const crisisResponse = await buildCrisisResponse(syntheticDetection, message, history, { countryCode, provider });
      return {
        state: syntheticDetection.level as ConversationSafetyState,
        action: "CRISIS_RESPONSE",
        detection: syntheticDetection,
        crisisResponse,
      };
    }

    if (answerCategory === "SAFE") {
      return {
        state: "NORMAL",
        action: "NORMAL_FLOW",
        detection,
      };
    }

    if (answerCategory === "UNSURE") {
      return {
        state: "SAFETY_FOLLOW_UP",
        action: "SAFETY_FOLLOW_UP",
        detection,
        followUpContent: buildDifferentSafetyFollowUpText(),
      };
    }

    // UNKNOWN: User pivoted to unrelated topic (e.g., "Teach me C++") without confirming safety
    return {
      state: "SAFETY_FOLLOW_UP",
      action: "SAFETY_FOLLOW_UP",
      detection,
      followUpContent: buildSafetyFollowUpText(),
    };
  }

  // Default: NORMAL / LOW state -> proceed to normal Nuro flow
  return {
    state: priorState === "MODERATE" && isAffirmativeSafetyAnswer(message) ? "NORMAL" : priorState,
    action: "NORMAL_FLOW",
    detection,
  };
}
