import { describe, expect, it } from "vitest";

import { GAD7_QUESTIONS, calculateGAD7 } from "./gad7";

function answersOf(score: number) {
  return Object.fromEntries(GAD7_QUESTIONS.map((q) => [q.id, score]));
}

describe("calculateGAD7", () => {
  it("sums all 7 items into a 0-21 range", () => {
    expect(calculateGAD7(answersOf(0)).rawScore).toBe(0);
    expect(calculateGAD7(answersOf(3)).rawScore).toBe(21);
    expect(calculateGAD7(answersOf(3)).maxScore).toBe(21);
  });

  it("buckets scores into minimal/mild/moderate/severe at the documented cutoffs", () => {
    expect(calculateGAD7({ 1: 4 }).levelKey).toBe("minimal"); // 4
    expect(calculateGAD7({ 1: 5 }).levelKey).toBe("mild"); // 5
    expect(calculateGAD7({ 1: 9 }).levelKey).toBe("mild"); // 9
    expect(calculateGAD7({ 1: 10 }).levelKey).toBe("moderate"); // 10
    expect(calculateGAD7({ 1: 14 }).levelKey).toBe("moderate"); // 14
    expect(calculateGAD7({ 1: 15 }).levelKey).toBe("severe"); // 15
    expect(calculateGAD7({ 1: 21 }).levelKey).toBe("severe"); // 21
  });

  it("never sets safetyFlag (GAD-7 has no self-harm item)", () => {
    expect(calculateGAD7(answersOf(3)).safetyFlag).toBe(false);
  });

  it("suggests professional support only at moderate/severe", () => {
    expect(calculateGAD7({ 1: 9 }).suggestProfessionalSupport).toBe(false);
    expect(calculateGAD7({ 1: 10 }).suggestProfessionalSupport).toBe(true);
    expect(calculateGAD7({ 1: 21 }).suggestProfessionalSupport).toBe(true);
  });

  it("treats a missing answer as 0", () => {
    expect(calculateGAD7({ 1: 3, 2: 3 }).rawScore).toBe(6);
  });

  it("is history/backend ready: userId defaults to null and responses preserves the raw answers", () => {
    const answers = { 1: 2, 2: 1 };
    const result = calculateGAD7(answers);

    expect(result.userId).toBeNull();
    expect(result.responses).toEqual(answers);
  });
});
