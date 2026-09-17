import { getCrisisResources, type CountryCrisisResources } from "@/lib/ai/crisis-resources";
import type { AnyAssessmentResult } from "./types";

/**
 * Centralized assessment safety service.
 *
 * Today the only trigger is PHQ-9 item 9 > 0 (thoughts of death/self-harm),
 * which calculatePHQ9() already turns into `safetyFlag` on the result — this
 * module never re-derives the flag from raw answers, it only decides what to
 * show once a result is flagged. That keeps the door open for a future
 * assessment to set safetyFlag for its own reasons without this module
 * needing to change.
 *
 * This is explicitly NOT a risk-assessment or diagnostic tool: it never
 * claims to determine suicide risk, and it never overrides itself with
 * ordinary wellness recommendations. isSafetyTriggered() is the one gate the
 * UI should check before deciding whether to render the normal result flow
 * or the dedicated safety state.
 */

export interface SafetyGuidance {
  headline: string;
  /** Acknowledges the flagged response without alarming language or a diagnostic claim. */
  acknowledgement: string;
  /** Encourages reaching out to a trusted person and to professional support. */
  guidance: string;
  /** Makes explicit that NuroNest is not an emergency service. */
  notEmergencyServiceNotice: string;
  crisisResources: CountryCrisisResources;
}

export function isSafetyTriggered(result: AnyAssessmentResult): boolean {
  return result.safetyFlag === true;
}

/**
 * Builds the calm, supportive safety guidance shown in place of the ordinary
 * result. `countryCode` is optional and falls back to the default region
 * (see crisis-resources.ts) when the user's location isn't known.
 */
export function getSafetyGuidance(countryCode?: string): SafetyGuidance {
  return {
    headline: "You're not alone.",
    acknowledgement:
      "One of your answers suggests you may be going through a particularly difficult moment. Thank you for answering honestly — that takes courage, and it matters.",
    guidance:
      "Please consider reaching out to someone you trust — a friend, family member, or anyone who makes you feel safe — as well as a qualified mental health professional. A single questionnaire can't determine how serious things are; a person can help you figure that out.",
    notEmergencyServiceNotice:
      "NuroNest is a wellness companion, not an emergency service, and can't provide crisis care directly.",
    crisisResources: getCrisisResources(countryCode),
  };
}
