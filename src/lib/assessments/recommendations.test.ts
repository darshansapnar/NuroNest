import { describe, expect, it } from "vitest";

import { getRecommendations, getResultActions } from "./recommendations";
import type { AssessmentType } from "./types";

const ALL_TYPES: AssessmentType[] = ["who5", "gad7", "phq9", "pss10", "psqi"];
const MEDICATION_PATTERN = /\b(medicine|medication|prescri\w*|dosage|pill)\b/i;

describe("getRecommendations", () => {
  it("never mentions medication or medical treatment for any assessment/level", () => {
    const levelsByType: Record<AssessmentType, string[]> = {
      who5: ["high", "moderate", "low"],
      gad7: ["minimal", "mild", "moderate", "severe"],
      phq9: ["minimal", "mild", "moderate", "moderately-severe", "severe"],
      pss10: ["low", "moderate", "high"],
      psqi: ["good", "poor", "very-poor"],
    };

    for (const assessmentType of ALL_TYPES) {
      for (const level of levelsByType[assessmentType]) {
        const items = getRecommendations({ assessmentType, score: 0, level, safetyFlag: false });
        for (const item of items) {
          expect(item.title).not.toMatch(MEDICATION_PATTERN);
          expect(item.description).not.toMatch(MEDICATION_PATTERN);
        }
      }
    }
  });

  it("gives every recommendation a short title and a one-sentence description", () => {
    const items = getRecommendations({ assessmentType: "gad7", score: 12, level: "moderate", safetyFlag: false });
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.title.split(" ").length).toBeLessThanOrEqual(5);
      expect(item.description.length).toBeGreaterThan(0);
    }
  });

  it("changes recommendations as the level changes, for every assessment", () => {
    expect(getRecommendations({ assessmentType: "who5", score: 20, level: "high", safetyFlag: false })).not.toEqual(
      getRecommendations({ assessmentType: "who5", score: 5, level: "low", safetyFlag: false }),
    );
    expect(getRecommendations({ assessmentType: "gad7", score: 2, level: "minimal", safetyFlag: false })).not.toEqual(
      getRecommendations({ assessmentType: "gad7", score: 18, level: "severe", safetyFlag: false }),
    );
    expect(getRecommendations({ assessmentType: "pss10", score: 5, level: "low", safetyFlag: false })).not.toEqual(
      getRecommendations({ assessmentType: "pss10", score: 35, level: "high", safetyFlag: false }),
    );
    expect(getRecommendations({ assessmentType: "psqi", score: 1, level: "good", safetyFlag: false })).not.toEqual(
      getRecommendations({ assessmentType: "psqi", score: 15, level: "very-poor", safetyFlag: false }),
    );
  });

  it("never includes professional-support for WHO-5, even when suggestProfessionalSupport is (hypothetically) true", () => {
    const items = getRecommendations({
      assessmentType: "who5",
      score: 5,
      level: "low",
      safetyFlag: false,
      suggestProfessionalSupport: true,
    });
    expect(items.some((item) => item.kind === "professional-support")).toBe(false);
  });

  it("never includes professional-support as a recommendation card, even when suggestProfessionalSupport or safetyFlag is true — it gets its own dedicated section on the page instead", () => {
    const withSupport = getRecommendations({
      assessmentType: "gad7",
      score: 12,
      level: "moderate",
      safetyFlag: false,
      suggestProfessionalSupport: true,
    });
    expect(withSupport.some((item) => item.kind === "professional-support")).toBe(false);

    const withSafetyFlag = getRecommendations({
      assessmentType: "phq9",
      score: 2,
      level: "minimal",
      safetyFlag: true,
    });
    expect(withSafetyFlag.some((item) => item.kind === "professional-support")).toBe(false);
  });
});

describe("getResultActions", () => {
  it("always leads with Talk with Nuro, pointing at the live /ai-companion route", () => {
    for (const assessmentType of ALL_TYPES) {
      const actions = getResultActions({ assessmentType, score: 0, level: "low", safetyFlag: false });
      expect(actions[0]).toEqual({ kind: "talk-to-nuro", label: "Talk with Nuro", href: "/ai-companion" });
    }
  });

  it("only ever returns actions for routes that exist today (/ai-companion, /professional)", () => {
    const allowedHrefs = new Set(["/ai-companion", "/professional"]);
    const levelsByType: Record<AssessmentType, string[]> = {
      who5: ["high", "moderate", "low"],
      gad7: ["minimal", "mild", "moderate", "severe"],
      phq9: ["minimal", "mild", "moderate", "moderately-severe", "severe"],
      pss10: ["low", "moderate", "high"],
      psqi: ["good", "poor", "very-poor"],
    };

    for (const assessmentType of ALL_TYPES) {
      for (const level of levelsByType[assessmentType]) {
        const actions = getResultActions({
          assessmentType,
          score: 0,
          level,
          safetyFlag: true,
          suggestProfessionalSupport: true,
        });
        for (const action of actions) {
          expect(allowedHrefs.has(action.href)).toBe(true);
        }
      }
    }
  });

  it("includes Talk to a Professional only when appropriate", () => {
    const withoutSupport = getResultActions({ assessmentType: "gad7", score: 2, level: "minimal", safetyFlag: false });
    expect(withoutSupport.some((a) => a.href === "/professional")).toBe(false);

    const withSupport = getResultActions({
      assessmentType: "gad7",
      score: 16,
      level: "severe",
      safetyFlag: false,
      suggestProfessionalSupport: true,
    });
    expect(withSupport.some((a) => a.href === "/professional")).toBe(true);
  });

  it("never includes Talk to a Professional for WHO-5", () => {
    const actions = getResultActions({
      assessmentType: "who5",
      score: 2,
      level: "low",
      safetyFlag: false,
      suggestProfessionalSupport: true,
    });
    expect(actions.some((a) => a.href === "/professional")).toBe(false);
  });

  it("never returns duplicate hrefs", () => {
    const actions = getResultActions({
      assessmentType: "psqi",
      score: 18,
      level: "very-poor",
      safetyFlag: false,
      suggestProfessionalSupport: true,
    });
    const hrefs = actions.map((a) => a.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
