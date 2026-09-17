import { describe, expect, it } from "vitest";

import { PHQ9_QUESTIONS, calculatePHQ9 } from "./phq9";

function answersOf(score: number) {
  return Object.fromEntries(PHQ9_QUESTIONS.map((q) => [q.id, score]));
}

describe("calculatePHQ9", () => {
  it("sums all 9 items into a 0-27 range", () => {
    expect(calculatePHQ9(answersOf(0)).rawScore).toBe(0);
    expect(calculatePHQ9(answersOf(3)).rawScore).toBe(27);
    expect(calculatePHQ9(answersOf(3)).maxScore).toBe(27);
  });

  it("buckets scores into minimal/mild/moderate/moderately-severe/severe at the documented cutoffs", () => {
    expect(calculatePHQ9({ 1: 4 }).levelKey).toBe("minimal");
    expect(calculatePHQ9({ 1: 5 }).levelKey).toBe("mild");
    expect(calculatePHQ9({ 1: 9 }).levelKey).toBe("mild");
    expect(calculatePHQ9({ 1: 10 }).levelKey).toBe("moderate");
    expect(calculatePHQ9({ 1: 14 }).levelKey).toBe("moderate");
    expect(calculatePHQ9({ 1: 15 }).levelKey).toBe("moderately-severe");
    expect(calculatePHQ9({ 1: 19 }).levelKey).toBe("moderately-severe");
    expect(calculatePHQ9({ 1: 20 }).levelKey).toBe("severe");
    expect(calculatePHQ9({ 1: 27 }).levelKey).toBe("severe");
  });

  it("sets item9Score from question 9 and safetyFlag = item9Score > 0, independent of total severity", () => {
    // Low total score, but item 9 answered "Several days" (1) -> flag must still be set.
    const flagged = calculatePHQ9({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 1 });
    expect(flagged.item9Score).toBe(1);
    expect(flagged.safetyFlag).toBe(true);
    expect(flagged.levelKey).toBe("minimal"); // total score is still just 1

    const notFlagged = calculatePHQ9({ 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 0 });
    expect(notFlagged.item9Score).toBe(0);
    expect(notFlagged.safetyFlag).toBe(false);
  });

  it("suggests professional support whenever safetyFlag is set, even at low severity", () => {
    const flagged = calculatePHQ9({ 9: 1 });
    expect(flagged.suggestProfessionalSupport).toBe(true);
  });

  it("treats a missing answer as 0, including item 9", () => {
    const result = calculatePHQ9({ 1: 2, 2: 2 });
    expect(result.rawScore).toBe(4);
    expect(result.item9Score).toBe(0);
    expect(result.safetyFlag).toBe(false);
  });

  it("is history/backend ready: userId defaults to null and responses preserves the raw answers", () => {
    const answers = { 1: 2, 9: 1 };
    const result = calculatePHQ9(answers);

    expect(result.userId).toBeNull();
    expect(result.responses).toEqual(answers);
  });
});
