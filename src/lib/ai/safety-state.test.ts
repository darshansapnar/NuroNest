import { describe, expect, it, vi } from "vitest";

// Mock server-only module for Vitest Node environment
vi.mock("server-only", () => ({}));

import {
  evaluateSafetyState,
  deriveSafetyStateFromHistory,
  isSafetyConfirmation,
  isRiskReaffirmation,
  isNegativeSafetyAnswer,
  isAffirmativeSafetyAnswer,
  isUnsureSafetyAnswer,
  classifySafetyAnswer,
} from "./safety-state";
import type { ChatMessage } from "./provider";

describe("Module 3: Conversation Safety State & Follow-up Handling", () => {
  // A. NORMAL -> NORMAL
  it("A: NORMAL -> NORMAL: ordinary conversation stays in NORMAL state", async () => {
    const result = await evaluateSafetyState({
      message: "How are you doing today?",
      history: [],
    });
    expect(result.state).toBe("NORMAL");
    expect(result.action).toBe("NORMAL_FLOW");
  });

  // B. NORMAL -> MODERATE
  it("B: NORMAL -> MODERATE: moderate distress transitions to MODERATE state", async () => {
    const result = await evaluateSafetyState({
      message: "I feel hopeless lately and nothing seems to go right.",
      history: [],
    });
    expect(result.state).toBe("MODERATE");
    expect(result.action).toBe("CRISIS_RESPONSE");
    expect(result.crisisResponse?.level).toBe("MODERATE");
  });

  // C. NORMAL -> HIGH
  it("C: NORMAL -> HIGH: high-risk disclosure transitions to HIGH state", async () => {
    const result = await evaluateSafetyState({
      message: "I want to kill myself.",
      history: [],
    });
    expect(result.state).toBe("HIGH");
    expect(result.action).toBe("CRISIS_RESPONSE");
    expect(result.crisisResponse?.level).toBe("HIGH");
  });

  // D. HIGH -> unrelated question
  it("D: HIGH -> unrelated question: intercepts topic pivot with safety follow-up, NOT normal answer", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      {
        role: "assistant",
        content: "Thank you for telling me that... Tele-MANAS: 14416",
      },
    ];

    const result = await evaluateSafetyState({
      message: "Teach me C++.",
      history,
    });

    expect(result.state).toBe("SAFETY_FOLLOW_UP");
    expect(result.action).toBe("SAFETY_FOLLOW_UP");
    expect(result.followUpContent).toMatch(/are you feeling safe right now\?/i);
    expect(result.followUpContent).not.toMatch(/c\+\+/i);
  });

  // E. HIGH -> "I'm safe now"
  it("E: HIGH -> 'I'm safe now': transitions safety state back toward NORMAL", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      {
        role: "assistant",
        content: "Thank you for telling me that... Tele-MANAS: 14416",
      },
    ];

    const result = await evaluateSafetyState({
      message: "I'm safe now, thanks for checking.",
      history,
    });

    expect(result.state).toBe("NORMAL");
    expect(result.action).toBe("NORMAL_FLOW");
  });

  // F. REAL-WORLD BUG FIX: HIGH -> "please help me" -> "no"
  it("F: REAL-WORLD SEQUENCE: suicidal thoughts -> 'please help me' -> 'no' escalates to CRISIS_RESPONSE, NOT repeating safety question", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I'm having suicidal thoughts." },
      { role: "assistant", content: "Tele-MANAS: 14416\nTele-MANAS: 1800-89-14416" },
      { role: "user", content: "please help me" },
      {
        role: "assistant",
        content: "Before we move on, I want to check in about what you shared earlier. Are you feeling safe right now?",
      },
    ];

    const result = await evaluateSafetyState({
      message: "no",
      history,
    });

    expect(result.state).toBe("HIGH");
    expect(result.action).toBe("CRISIS_RESPONSE");
    expect(result.crisisResponse?.content).toContain("Tele-MANAS");
    expect(result.crisisResponse?.content).toContain("Emergency: 112");
    expect(result.crisisResponse?.content).not.toContain("Are you feeling safe right now?");
  });

  it("G: Expected safety answer 'no, I'm not safe' escalates to crisis response", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      { role: "assistant", content: "Tele-MANAS: 14416" },
      { role: "user", content: "What should I do?" },
      {
        role: "assistant",
        content: "Before we move on, I want to check in about what you shared earlier. Are you feeling safe right now?",
      },
    ];

    const result = await evaluateSafetyState({
      message: "no, I'm not safe",
      history,
    });

    expect(result.state).toBe("HIGH");
    expect(result.action).toBe("CRISIS_RESPONSE");
    expect(result.crisisResponse?.content).toContain("Tele-MANAS");
  });

  it("H: Expected safety answer 'yes' transitions state to NORMAL", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      { role: "assistant", content: "Tele-MANAS: 14416" },
      { role: "user", content: "Can we talk?" },
      {
        role: "assistant",
        content: "Before we move on, I want to check in about what you shared earlier. Are you feeling safe right now?",
      },
    ];

    const result = await evaluateSafetyState({
      message: "yes",
      history,
    });

    expect(result.state).toBe("NORMAL");
    expect(result.action).toBe("NORMAL_FLOW");
  });

  it("I: Expected safety answer 'I don't know' asks a DIFFERENT safety question", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      { role: "assistant", content: "Tele-MANAS: 14416" },
      { role: "user", content: "Help me" },
      {
        role: "assistant",
        content: "Before we move on, I want to check in about what you shared earlier. Are you feeling safe right now?",
      },
    ];

    const result = await evaluateSafetyState({
      message: "I don't know",
      history,
    });

    expect(result.state).toBe("SAFETY_FOLLOW_UP");
    expect(result.action).toBe("SAFETY_FOLLOW_UP");
    expect(result.followUpContent).not.toContain("Before we move on, I want to check in about what you shared earlier");
    expect(result.followUpContent).toMatch(/trusted person/i);
  });

  it("J: Expected safety answer with explicit threat 'I might hurt myself' escalates immediately", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      { role: "assistant", content: "Tele-MANAS: 14416" },
      { role: "user", content: "Help" },
      {
        role: "assistant",
        content: "Before we move on, I want to check in about what you shared earlier. Are you feeling safe right now?",
      },
    ];

    const result = await evaluateSafetyState({
      message: "I might hurt myself",
      history,
    });

    expect(result.action).toBe("CRISIS_RESPONSE");
    expect(result.crisisResponse?.content).toContain("Tele-MANAS");
  });

  it("K: Expected safety answer 'I am going to kill myself' escalates to IMMEDIATE", async () => {
    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      { role: "assistant", content: "Tele-MANAS: 14416" },
      { role: "user", content: "Help" },
      {
        role: "assistant",
        content: "Before we move on, I want to check in about what you shared earlier. Are you feeling safe right now?",
      },
    ];

    const result = await evaluateSafetyState({
      message: "I am going to kill myself tonight",
      history,
    });

    expect(result.state).toBe("IMMEDIATE");
    expect(result.action).toBe("CRISIS_RESPONSE");
    expect(result.crisisResponse?.content).toContain("Emergency: 112");
  });

  // Additional helper classification tests
  it("classifySafetyAnswer and helper functions correctly categorize safety responses", () => {
    expect(classifySafetyAnswer("no")).toBe("NOT_SAFE");
    expect(classifySafetyAnswer("no, I'm not safe")).toBe("NOT_SAFE");
    expect(classifySafetyAnswer("nope")).toBe("NOT_SAFE");
    expect(classifySafetyAnswer("yes")).toBe("SAFE");
    expect(classifySafetyAnswer("yes, I'm safe")).toBe("SAFE");
    expect(classifySafetyAnswer("I'm safe now")).toBe("SAFE");
    expect(classifySafetyAnswer("I don't know")).toBe("UNSURE");
    expect(classifySafetyAnswer("not sure")).toBe("UNSURE");
    expect(classifySafetyAnswer("Teach me C++")).toBe("UNKNOWN");

    expect(isNegativeSafetyAnswer("no")).toBe(true);
    expect(isAffirmativeSafetyAnswer("yes")).toBe(true);
    expect(isUnsureSafetyAnswer("I don't know")).toBe(true);
    expect(isSafetyConfirmation("I am safe")).toBe(true);
    expect(isRiskReaffirmation("I am not safe")).toBe(true);

    const history: ChatMessage[] = [
      { role: "user", content: "I want to kill myself." },
      { role: "assistant", content: "Tele-MANAS: 14416" },
    ];
    expect(deriveSafetyStateFromHistory(history)).toBe("HIGH");
  });
});
