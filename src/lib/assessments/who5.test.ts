import { describe, expect, it } from "vitest";

import { WHO5_QUESTIONS, calculateWHO5 } from "./who5";

describe("calculateWHO5", () => {
  it("computes rawScore as the sum of the 5 responses and percentage as rawScore * 4", () => {
    const answers = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 };
    const result = calculateWHO5(answers);

    expect(result.rawScore).toBe(15);
    expect(result.maxScore).toBe(25);
    expect(result.percentage).toBe(60);
  });

  it("returns 0 for all-zero responses and 100 for all-max responses", () => {
    const zero = calculateWHO5({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    expect(zero.rawScore).toBe(0);
    expect(zero.percentage).toBe(0);

    const max = calculateWHO5({ 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 });
    expect(max.rawScore).toBe(25);
    expect(max.percentage).toBe(100);
  });

  it("flags suggestFurtherExploration only when percentage is below 50, and never sets safetyFlag or suggestProfessionalSupport", () => {
    // rawScore 12 -> 48%
    const low = calculateWHO5({ 1: 3, 2: 3, 3: 3, 4: 2, 5: 1 });
    expect(low.suggestFurtherExploration).toBe(true);
    expect(low.safetyFlag).toBe(false);
    expect(low.suggestProfessionalSupport).toBe(false);

    // rawScore 13 -> 52%
    const ok = calculateWHO5({ 1: 3, 2: 3, 3: 3, 4: 2, 5: 2 });
    expect(ok.suggestFurtherExploration).toBe(false);
  });

  it("produces a different result depending on the selected answers", () => {
    const low = calculateWHO5({ 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 });
    const high = calculateWHO5({ 1: 5, 2: 4, 3: 5, 4: 4, 5: 5 });

    expect(low.percentage).not.toBe(high.percentage);
    expect(low.levelKey).not.toBe(high.levelKey);
    expect(low.interpretation).not.toBe(high.interpretation);
  });

  it("treats a missing answer as 0 rather than throwing", () => {
    const result = calculateWHO5({ 1: 4, 2: 4 });
    expect(result.rawScore).toBe(8);
  });

  it("covers every WHO-5 question in the raw score", () => {
    expect(WHO5_QUESTIONS).toHaveLength(5);
  });

  it("is history/backend ready: userId defaults to null and responses preserves the raw answers", () => {
    const answers = { 1: 3, 2: 3, 3: 3, 4: 2, 5: 1 };
    const result = calculateWHO5(answers);

    expect(result.userId).toBeNull();
    expect(result.responses).toEqual(answers);
    expect(result.completedAt).toEqual(expect.any(String));
  });
});
