import { describe, expect, it } from "vitest";

import { calculatePHQ9 } from "./phq9";
import { calculateGAD7 } from "./gad7";
import { getSafetyGuidance, isSafetyTriggered } from "./safety";

// Phrases the safety copy must never contain — this is the executable form
// of "do not diagnose" / "do not claim PHQ-9 alone determines risk".
const FORBIDDEN_PATTERNS = [
  /you have depression/i,
  /you have (an )?anxiety/i,
  /suicide risk/i,
  /at risk of suicide/i,
  /diagnos/i, // diagnose/diagnosis/diagnostic
  /determines? (your |the )?risk/i,
];

describe("isSafetyTriggered", () => {
  it("is true only when PHQ-9 item 9 is answered above 'Not at all'", () => {
    const flagged = calculatePHQ9({ 9: 1 });
    const notFlagged = calculatePHQ9({ 1: 3, 2: 3, 9: 0 });

    expect(isSafetyTriggered(flagged)).toBe(true);
    expect(isSafetyTriggered(notFlagged)).toBe(false);
  });

  it("is false for other assessment types regardless of severity", () => {
    const severeAnxiety = calculateGAD7({ 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3 });
    expect(isSafetyTriggered(severeAnxiety)).toBe(false);
  });

  it("stays true independent of overall PHQ-9 severity", () => {
    // Minimal total score, but item 9 alone is flagged.
    const minimalButFlagged = calculatePHQ9({ 9: 1 });
    expect(minimalButFlagged.levelKey).toBe("minimal");
    expect(isSafetyTriggered(minimalButFlagged)).toBe(true);
  });
});

describe("getSafetyGuidance", () => {
  const guidance = getSafetyGuidance();

  it("acknowledges the response, encourages reaching out, and states NuroNest is not an emergency service", () => {
    expect(guidance.headline.length).toBeGreaterThan(0);
    expect(guidance.acknowledgement.length).toBeGreaterThan(0);
    expect(guidance.guidance.toLowerCase()).toContain("reach");
    expect(guidance.notEmergencyServiceNotice.toLowerCase()).toContain("not an emergency service");
  });

  it("provides crisis resources with an emergency number and at least one helpline", () => {
    expect(guidance.crisisResources.emergencyNumber.length).toBeGreaterThan(0);
    expect(guidance.crisisResources.helplines.length).toBeGreaterThan(0);
    expect(guidance.crisisResources.helplines[0].numbers.length).toBeGreaterThan(0);
  });

  it("never diagnoses or claims to determine risk, anywhere in the guidance copy", () => {
    const fullText = [
      guidance.headline,
      guidance.acknowledgement,
      guidance.guidance,
      guidance.notEmergencyServiceNotice,
    ].join(" ");

    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(fullText).not.toMatch(pattern);
    }
  });
});
