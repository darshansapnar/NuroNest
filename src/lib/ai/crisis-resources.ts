/**
 * Country-specific crisis resources for the HIGH_RISK safety response.
 *
 * NuroNest currently targets users in India, so `DEFAULT_COUNTRY` is "IN"
 * and that is what `getCrisisResources()` falls back to when no country is
 * given. This module is the seam for expanding beyond that: add another
 * entry to `CRISIS_RESOURCES_BY_COUNTRY` and pass its country code in from
 * wherever the user's country ends up being known (e.g. a future profile /
 * locale setting) — no caller of `getCrisisResources()` needs to change.
 */

export interface CrisisHelpline {
  /** What the service is, shown to the user (e.g. "Tele-MANAS (24/7)"). */
  label: string;
  /** One or more numbers to reach it, in display order. */
  numbers: string[];
}

export interface CountryCrisisResources {
  countryCode: string;
  /** Local equivalent of "911" — a single number for life-threatening emergencies. */
  emergencyNumber: string;
  emergencyLabel: string;
  /** Mental-health-specific helplines, most preferred first. */
  helplines: CrisisHelpline[];
}

export const DEFAULT_CRISIS_COUNTRY = "IN";

const CRISIS_RESOURCES_BY_COUNTRY: Record<string, CountryCrisisResources> = {
  IN: {
    countryCode: "IN",
    emergencyNumber: "112",
    emergencyLabel: "India's national emergency number",
    helplines: [
      {
        label: "Tele-MANAS",
        numbers: ["14416", "1800-89-14416"],
      },
    ],
  },
};

/**
 * Resolves crisis resources for a country, falling back to
 * `DEFAULT_CRISIS_COUNTRY` when `countryCode` is omitted or not (yet)
 * covered. Never throws — the safety response must always be able to
 * render something.
 */
export function getCrisisResources(countryCode?: string): CountryCrisisResources {
  const key = countryCode?.toUpperCase();
  return (
    (key ? CRISIS_RESOURCES_BY_COUNTRY[key] : undefined) ??
    CRISIS_RESOURCES_BY_COUNTRY[DEFAULT_CRISIS_COUNTRY]
  );
}
