import { describe, expect, it } from "vitest";

import { calculatePSS10 } from "./pss10";

describe("calculatePSS10", () => {
  it("reverse-scores items 4, 5, 7, 8 as (4 - originalScore) before summing", () => {
    // All items answered "2" (Sometimes). Reverse items also score (4-2)=2, so
    // every item nets 2 regardless of direction -> total 20.
    const allTwos = calculatePSS10({ 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2 });
    expect(allTwos.rawScore).toBe(20);

    // Answering the reverse items "4" (Very often) should score as 0 for
    // those items, not 4 — proving the reversal actually happened.
    const reversedHigh = calculatePSS10({ 1: 0, 2: 0, 3: 0, 4: 4, 5: 4, 6: 0, 7: 4, 8: 4, 9: 0, 10: 0 });
    expect(reversedHigh.rawScore).toBe(0);

    // Answering the reverse items "0" (Never) should score as 4 for those items.
    const reversedLow = calculatePSS10({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    expect(reversedLow.rawScore).toBe(16); // 4 reverse items * 4 points each
  });

  it("produces the max score of 40 when every non-reverse item is 4 and every reverse item is 0", () => {
    const max = calculatePSS10({ 1: 4, 2: 4, 3: 4, 4: 0, 5: 0, 6: 4, 7: 0, 8: 0, 9: 4, 10: 4 });
    expect(max.rawScore).toBe(40);
    expect(max.maxScore).toBe(40);
    expect(max.levelKey).toBe("high");
  });

  it("buckets scores into low/moderate/high at the documented cutoffs", () => {
    // Reverse items (4, 5, 7, 8) set to 4 so they contribute 0 each, isolating
    // item 1's raw value as the total score.
    const withItem1 = (value: number) => ({ 1: value, 4: 4, 5: 4, 7: 4, 8: 4 });

    expect(calculatePSS10(withItem1(13)).levelKey).toBe("low");
    expect(calculatePSS10(withItem1(14)).levelKey).toBe("moderate");
    expect(calculatePSS10(withItem1(26)).levelKey).toBe("moderate");
    expect(calculatePSS10(withItem1(27)).levelKey).toBe("high");
  });

  it("never sets safetyFlag", () => {
    expect(calculatePSS10({ 1: 4, 2: 4, 3: 4 }).safetyFlag).toBe(false);
  });

  it("is history/backend ready: userId defaults to null and responses preserves the raw answers", () => {
    const answers = { 1: 2, 2: 3 };
    const result = calculatePSS10(answers);

    expect(result.userId).toBeNull();
    expect(result.responses).toEqual(answers);
  });
});
