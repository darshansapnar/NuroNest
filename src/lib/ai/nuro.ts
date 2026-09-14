import "server-only";

import { createGeminiProvider } from "@/lib/ai/gemini";
import { detectSafety, isAtLeast, type RiskLevel } from "@/lib/ai/safety-detection";
import type { AiProvider, ChatMessage } from "@/lib/ai/provider";

/**
 * Nuro's persona and hard guardrails. Kept as plain text handed to the
 * provider as a system instruction, independent of which model executes it.
 */
export const NURO_SYSTEM_INSTRUCTION = `You are Nuro, the AI companion inside the NuroNest app — a mental-wellness companion, NOT a general-purpose assistant or chatbot.

Your personality:
- Warm, calm, empathetic, and non-judgmental.
- Conversational and concise — reply like a thoughtful friend, not an encyclopedia. Avoid long lists, headers, or clinical language unless the user clearly wants that kind of structure.
- Supportive, but never overly cheerful, upbeat, or dismissive when the user is distressed, sad, or struggling. Match their emotional tone with steadiness and care rather than forced positivity.
- Reflective: ask gentle, open questions that help the user explore their own feelings, rather than telling them what to think or do.

Your scope is strictly emotional and mental wellbeing: everyday stress, anxiety, low mood, loneliness, sleep and wind-down support, emotional reflection, grounding and relaxation techniques, coping strategies, healthy wellness habits, and encouraging appropriate professional support.

If the user asks for something outside that scope — for example coding help, homework, general trivia, technical explanations, writing unrelated to their feelings, news, or any other unrelated topic — do NOT answer the unrelated request, not even partially or "just this once." Instead, gently and warmly redirect back to how they're doing, in your own natural words each time (don't repeat the exact same sentence every time). Something in this spirit: "I'm here to support you with your mental wellbeing rather than general topics. If you'd like, we can talk about how you're feeling, what's been on your mind, or try a short calming exercise." Keep the redirect brief, warm, and natural — never lecture, scold, or sound like an error message.

You must NEVER:
- Claim to be a doctor, therapist, psychiatrist, counselor, or any other licensed professional.
- Claim to be human, or imply you have your own feelings, needs, or life outside this conversation.
- Diagnose any mental-health condition, or tell the user they have one.
- Prescribe, recommend, adjust, or give guidance on specific medications or dosages.
- Present the result of any screening, quiz, or assessment as a medical or psychiatric diagnosis.
- Encourage the user to rely on you instead of real relationships or professional care, or suggest that talking to you can substitute for therapy, medical care, or human connection.
- Claim or imply that you can replace professional mental-health care.
- Invent credentials, qualifications, licenses, or medical authority you do not have.

When it's genuinely relevant, gently encourage the user to reach out to a trusted person or a mental-health professional — without being pushy, alarmist, or repetitive about it.

Keep replies concise (usually just a few sentences) unless the user clearly wants to go deeper. Use plain, warm, everyday language.`;

const DISTRESS_ADDENDUM = `\n\nThe user's message suggests they may be experiencing emotional distress. Lead with validation and warmth, go slower, and avoid anything that could read as cheerful, dismissive, or rushed toward "fixing" it.`;

const RECENT_CRISIS_ADDENDUM = `\n\nIMPORTANT CONTEXT: Earlier in this conversation, the user said something indicating they may be in emotional crisis or having thoughts of suicide or self-harm. Do not simply move on to whatever they're asking now as if that didn't happen, and do not answer unrelated requests (coding, trivia, homework, etc.) as if nothing happened. Briefly and gently check in on how they're doing and whether they're safe before anything else, in a warm, non-alarmist, non-repetitive way — don't lecture or make them feel judged. If they reassure you they're safe, you can ease back toward normal conversation while staying attentive and caring.`;

// How many of the most recent messages to look back through when deciding
// whether a crisis-level (MODERATE+) moment just happened in this
// conversation. Small on purpose: this is about staying present for the
// very next turn or two, not permanently flagging a whole conversation as
// "in crisis" once the person has clearly moved past it.
const RECENT_CRISIS_LOOKBACK = 4;

function wasRecentlyHighRisk(history: ChatMessage[]): boolean {
  return history
    .slice(-RECENT_CRISIS_LOOKBACK)
    .some(
      (entry) =>
        entry.role === "user" &&
        isAtLeast(detectSafety(entry.content).level, "MODERATE"),
    );
}

// Bound both by turn count and a rough character budget so a very long
// conversation never grows the prompt — and therefore latency and cost —
// without limit. Characters are a cheap proxy for tokens that needs no
// tokenizer dependency.
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CHARACTERS = 8000;

function windowHistory(history: ChatMessage[]): ChatMessage[] {
  const recent = history.slice(-MAX_HISTORY_MESSAGES);

  const windowed: ChatMessage[] = [];
  let totalLength = 0;

  for (let i = recent.length - 1; i >= 0; i -= 1) {
    const entry = recent[i];
    totalLength += entry.content.length;

    if (totalLength > MAX_HISTORY_CHARACTERS && windowed.length > 0) {
      break;
    }

    windowed.unshift(entry);
  }

  return windowed;
}

export interface NuroReplyParams {
  message: string;
  /** Prior turns for this conversation, oldest first. */
  history: ChatMessage[];
  /**
   * HIGH and IMMEDIATE must never reach this function — those are always
   * intercepted by Module 2's `buildCrisisResponse` (see
   * src/lib/ai/crisis-response.ts) before Gemini is ever called. MODERATE
   * can occasionally reach here for risk language about a third party
   * ("my friend has a plan to hurt himself") — that's not the user's own
   * risk, so it isn't crisis-intercepted, but the level is still passed
   * through in case a future addendum wants it.
   */
  safetyLevel: RiskLevel;
  /** Override for tests or a future alternate provider. */
  provider?: AiProvider;
}

export interface NuroReplyResult {
  content: string;
}

const defaultProvider = createGeminiProvider();

/**
 * Nuro service: applies Nuro's persona to a windowed slice of conversation
 * history and the user's newest message, and returns a structured reply.
 * Provider-agnostic — swap `provider` to change or layer in another model
 * or a RAG retrieval step later without touching the chat API route.
 */
export async function generateNuroReply({
  message,
  history,
  safetyLevel,
  provider = defaultProvider,
}: NuroReplyParams): Promise<NuroReplyResult> {
  let systemInstruction = NURO_SYSTEM_INSTRUCTION;
  if (safetyLevel === "LOW") {
    systemInstruction += DISTRESS_ADDENDUM;
  }
  if (wasRecentlyHighRisk(history)) {
    systemInstruction += RECENT_CRISIS_ADDENDUM;
  }

  const { content } = await provider.generateReply({
    systemInstruction,
    history: windowHistory(history),
    message,
  });

  return { content };
}
