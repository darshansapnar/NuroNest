/**
 * Module 2: Nuro Dynamic Crisis Response Layer.
 *
 * Combines Gemini dynamic conversational generation with application-controlled,
 * deterministic crisis resource injection for MODERATE, HIGH, and IMMEDIATE risk.
 *
 * Architecture & Safety Guarantees:
 * 1. Application code deterministically classifies risk (Module 1).
 * 2. Application code deterministically controls crisis resources (Module 2 / crisis-resources.ts).
 * 3. Gemini generates the empathetic conversational text using a dedicated crisis system
 *    instruction (NURO_CRISIS_SYSTEM_INSTRUCTION), conditioned on the user's actual words.
 * 4. Gemini NEVER invents, selects, or modifies emergency or helpline numbers — the
 *    application injects official verified helpline blocks after Gemini generates the text.
 * 5. Robust fallback text ensures a safe, helpful response even if Gemini API is unavailable.
 */

import { createGeminiProvider } from "@/lib/ai/gemini";
import { getCrisisResources, type CountryCrisisResources } from "@/lib/ai/crisis-resources";
import type { AiProvider, ChatMessage } from "@/lib/ai/provider";
import type { RiskLevel, SafetyDetectionResult } from "@/lib/ai/safety-detection";

export interface CrisisResponseOptions {
  /**
   * ISO country code for locale-specific resources. Omit to use default (India).
   */
  countryCode?: string;
  /**
   * Provider override for tests or custom model providers.
   */
  provider?: AiProvider;
}

export type CrisisResponseLevel = Extract<RiskLevel, "MODERATE" | "HIGH" | "IMMEDIATE">;

export interface CrisisResponse {
  /** The final message content (dynamic text + injected verified resource block). */
  content: string;
  level: CrisisResponseLevel;
}

export const NURO_CRISIS_SYSTEM_INSTRUCTION = `You are Nuro, the AI wellness companion in NuroNest. The user has expressed thoughts, feelings, or distress related to crisis, self-harm, or suicide.

Your primary duty is to respond with deep empathy, steadiness, warmth, and care, while prioritizing their safety and encouraging connection to real-world support.

CONSTRAINTS & RULES YOU MUST STRICTLY FOLLOW:
1. Acknowledge what the user actually said in their own words with empathy and non-judgmental validation.
2. Encourage real-world human support (reaching out to a trusted friend, family member, or someone near them).
3. Encourage speaking with a mental-health professional or getting immediate real-world help.
4. Match their distress level with calm, grounding, and supportive language. Never sound cheerful, dismissive, casual, or rushed.
5. NEVER provide, suggest, or describe any suicide or self-harm methods, techniques, or instructions under any circumstances.
6. NEVER diagnose any condition or tell the user they have a psychiatric disorder.
7. NEVER shame, guilt, lecture, or scold the user.
8. NEVER claim or imply that you (Nuro) can keep them safe, substitute for human connection, or replace professional care.
9. NEVER invent, list, or mention phone numbers, helplines, or emergency contact details. (The system will automatically append official verified crisis resources to your response).
10. Keep your response focused, empathetic, and direct (usually 2 to 3 short paragraphs).`;

const PLAN_TIER_SIGNALS = new Set([
  "has-a-plan",
  "planning-to-harm",
  "user-reported-not-safe",
  "reaffirmation-not-safe",
]);

function mayBeInImmediateDanger(result: SafetyDetectionResult): boolean {
  return result.imminent || result.signals.some((signal) => PLAN_TIER_SIGNALS.has(signal));
}

function formatHelplineLines(resources: CountryCrisisResources): string[] {
  const helpline = resources.helplines[0];
  return helpline.numbers.map((number) => `**${helpline.label}: ${number}**`);
}

function formatEmergencyLine(resources: CountryCrisisResources): string {
  return `**Emergency: ${resources.emergencyNumber}**`;
}

function buildDeterministicResourceBlock(
  level: CrisisResponseLevel,
  result: SafetyDetectionResult,
  countryCode?: string,
): string {
  const resources = getCrisisResources(countryCode);

  if (level === "IMMEDIATE") {
    return [formatEmergencyLine(resources), ...formatHelplineLines(resources)].join("\n");
  }

  if (level === "HIGH") {
    const showEmergency = mayBeInImmediateDanger(result);
    return (
      showEmergency
        ? [formatEmergencyLine(resources), ...formatHelplineLines(resources)]
        : formatHelplineLines(resources)
    ).join("\n");
  }

  // MODERATE risk: no emergency numbers block to avoid overwhelming
  return "";
}

function buildFallbackConversationalText(
  level: CrisisResponseLevel,
  result: SafetyDetectionResult,
): string {
  if (level === "IMMEDIATE") {
    return [
      "Right now, getting you immediate help matters most.",
      "Please contact emergency services or go to your nearest emergency department right away.",
      "If you can, reach out to someone you trust and try to stay with someone right now — please don't be alone with this.",
    ].join("\n\n");
  }

  if (level === "HIGH") {
    const showEmergency = mayBeInImmediateDanger(result);
    return [
      "Thank you for telling me that — it takes real courage to share something like this, and I'm taking it seriously.",
      showEmergency
        ? "What you're feeling matters, and it deserves real support. Speaking with a mental-health professional can make a meaningful difference — and if things ever feel unsafe, please don't wait to get immediate help."
        : "What you're feeling matters, and it deserves real support. Speaking with a mental-health professional can make a meaningful difference.",
      "Please also try to reach out to someone you trust — a friend, family member, or anyone who can be there for you right now.",
    ].join("\n\n");
  }

  // MODERATE
  return [
    "Thank you for sharing that with me — what you're feeling is real, and you don't have to carry it alone.",
    "It can help to talk to a mental-health professional who can support you properly, especially if these feelings have been sticking around.",
    "NuroNest's wellness tools might help too — a short breathing exercise or mood check-in are available whenever you want them.",
  ].join("\n\n");
}

const defaultProvider = createGeminiProvider();

/**
 * Builds the dynamic, context-aware crisis response for MODERATE/HIGH/IMMEDIATE risk.
 * Returns `undefined` for LOW/NONE.
 */
export async function buildCrisisResponse(
  result: SafetyDetectionResult,
  message: string,
  history: ChatMessage[] = [],
  options: CrisisResponseOptions = {},
): Promise<CrisisResponse | undefined> {
  const { countryCode, provider = defaultProvider } = options;

  if (result.level === "NONE" || result.level === "LOW") {
    return undefined;
  }

  const level = result.level as CrisisResponseLevel;
  let dynamicText: string;

  try {
    const promptAddendum = `\n\n[RISK LEVEL: ${level}. USER MESSAGE: "${message}"]`;
    const response = await provider.generateReply({
      systemInstruction: NURO_CRISIS_SYSTEM_INSTRUCTION + promptAddendum,
      history,
      message,
    });
    dynamicText = response.content.trim();
  } catch (error) {
    console.error("[crisis-response] Gemini generation failed, using fallback text", {
      reason: error instanceof Error ? error.message : "unknown error",
    });
    dynamicText = buildFallbackConversationalText(level, result);
  }

  const resourceBlock = buildDeterministicResourceBlock(level, result, countryCode);

  const finalContent = resourceBlock
    ? `${dynamicText}\n\n${resourceBlock}`
    : dynamicText;

  return {
    level,
    content: finalContent,
  };
}
