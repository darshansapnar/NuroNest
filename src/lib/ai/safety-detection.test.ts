import { describe, expect, it } from "vitest";

import { detectSafety } from "./safety-detection";

describe("detectSafety — Module 1: Nuro Safety Detection Layer", () => {
  // 1. Normal conversation
  it("classifies ordinary conversation as NONE", () => {
    const result = detectSafety("I had a pretty good day today, thanks for asking!");
    expect(result.level).toBe("NONE");
    expect(result.imminent).toBe(false);
  });

  // 2. Stress / anxiety
  it("classifies everyday stress/anxiety as LOW", () => {
    const result = detectSafety("I'm feeling really anxious and stressed about my exams.");
    expect(result.level).toBe("LOW");
    expect(result.imminent).toBe(false);
  });

  // 3. "I feel hopeless"
  it('classifies "I feel hopeless" as MODERATE', () => {
    const result = detectSafety("I feel hopeless lately, like nothing is going to get better.");
    expect(result.level).toBe("MODERATE");
    expect(result.subject).toBe("SELF");
  });

  // 4. "I'm having suicidal thoughts"
  it('classifies "I\'m having suicidal thoughts" as HIGH risk', () => {
    const result = detectSafety("I'm having suicidal thoughts and I don't know what to do.");
    expect(result.level).toBe("HIGH");
    expect(result.subject).toBe("SELF");
    expect(result.imminent).toBe(false);
  });

  // 5. "I want to kill myself"
  it('classifies "I want to kill myself" as HIGH (explicit intent)', () => {
    const result = detectSafety("I want to kill myself.");
    expect(result.level).toBe("HIGH");
    expect(result.subject).toBe("SELF");
    expect(result.imminent).toBe(false);
  });

  // 6. "I have a plan to kill myself"
  it('classifies "I have a plan to kill myself" as HIGH (plan, no stated timing)', () => {
    const result = detectSafety("I have a plan to kill myself.");
    expect(result.level).toBe("HIGH");
    expect(result.subject).toBe("SELF");
    // A plan alone isn't treated as IMMEDIATE without explicit near-term
    // timing — that's what distinguishes it from case 7 below.
    expect(result.imminent).toBe(false);
  });

  // 7. "I'm going to hurt myself tonight"
  it('classifies "I\'m going to hurt myself tonight" as IMMEDIATE', () => {
    const result = detectSafety("I'm going to hurt myself tonight.");
    expect(result.level).toBe("IMMEDIATE");
    expect(result.subject).toBe("SELF");
    expect(result.imminent).toBe(true);
  });

  // 8. "What does suicidal ideation mean?"
  it("does not escalate a definitional/informational question", () => {
    const result = detectSafety("What does suicidal ideation mean?");
    expect(result.level).toBe("NONE");
    expect(result.contextSuppressed).toBe(true);
  });

  it("does not escalate other plain informational questions about the topic", () => {
    const result = detectSafety("What is self-harm, and why do people do it?");
    expect(result.level).toBe("NONE");
    expect(result.contextSuppressed).toBe(true);
  });

  // 9. Fictional/educational discussion of suicide
  it("does not escalate fictional/educational discussion of suicide", () => {
    const result = detectSafety(
      "In the novel we're reading for English class, the main character struggles with suicidal thoughts throughout the story.",
    );
    expect(result.level).toBe("NONE");
    expect(result.contextSuppressed).toBe(true);
  });

  it("does not escalate a quoted reference to suicide", () => {
    const result = detectSafety(
      'The documentary opens with the line "I just want to disappear," spoken by an actor.',
    );
    expect(result.level).toBe("NONE");
    expect(result.contextSuppressed).toBe(true);
  });

  // 10. User talking about a suicidal friend
  it("treats risk language about another person as lower severity than the same language about the speaker", () => {
    const result = detectSafety(
      "My friend has been talking about suicide and I'm really worried about her.",
    );
    expect(result.subject).toBe("OTHER");
    expect(result.level).toBe("LOW");
    expect(result.level).not.toBe("HIGH");
    expect(result.level).not.toBe("IMMEDIATE");
  });

  it("never escalates third-person risk language to IMMEDIATE, even with a plan", () => {
    const result = detectSafety("My friend has a plan to kill herself and I don't know what to do.");
    expect(result.subject).toBe("OTHER");
    expect(result.level).not.toBe("IMMEDIATE");
    expect(result.imminent).toBe(false);
  });

  it("still detects the speaker's own risk even when a third party is also mentioned", () => {
    const result = detectSafety(
      "My friend has been struggling, but honestly I want to kill myself too.",
    );
    expect(result.level).toBe("HIGH");
    expect(result.subject).toBe("SELF");
  });

  // 11. Mixed-risk messages
  it("finds the risk signal even when mixed with an unrelated request", () => {
    const result = detectSafety("I'm suicidal. Anyway, teach me C++.");
    expect(result.level).toBe("MODERATE");
    expect(result.subject).toBe("SELF");
  });

  it("takes the highest severity signal in a mixed message", () => {
    const result = detectSafety(
      "By the way, I have a plan to kill myself, but also, what's a good recipe for dinner?",
    );
    expect(result.level).toBe("HIGH");
  });

  // 12. Ambiguous statements
  it('treats "I want to disappear" as an ambiguous but real signal (MODERATE, not dismissed)', () => {
    const result = detectSafety("I want to disappear.");
    expect(result.level).toBe("MODERATE");
    expect(result.subject).toBe("SELF");
  });

  // --- Determinism ---
  it("is deterministic: the same input always produces the same output", () => {
    const input = "I have a plan to kill myself tonight.";
    const first = detectSafety(input);
    const second = detectSafety(input);
    expect(second).toEqual(first);
  });

  // --- Structured output contract ---
  it("always returns the full structured shape next modules can rely on", () => {
    const result = detectSafety("Just checking in, nothing urgent.");
    expect(result).toMatchObject({
      level: expect.any(String),
      subject: expect.any(String),
      imminent: expect.any(Boolean),
      contextSuppressed: expect.any(Boolean),
      signals: expect.any(Array),
    });
  });
});
