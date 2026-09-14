import { describe, expect, it } from "vitest";

import {
  generateRecommendations,
  detectClosingIntent,
  detectConversationTopic,
} from "./recommendations";

describe("Module 4: Nuro End-of-Conversation Recommendations", () => {
  // 1. stress -> no available action yet (Resources/Assessment not shipped) -> natural closing
  it("1: stress -> no recommendation cards yet (Resources/Assessment unavailable)", () => {
    const recs = generateRecommendations({
      message: "Thanks for listening, I feel a bit better about my stress. What should I do next?",
      history: [
        { role: "user", content: "I've been feeling so stressed about exams." },
        { role: "assistant", content: "That sounds heavy. Exam stress is tough." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // 2. sleep -> only Professional is live (Relaxation/Resources not shipped)
  it("2: sleep -> suggests only professional support (Relaxation/Resources not shipped yet)", () => {
    const recs = generateRecommendations({
      message: "What should I do next to help me sleep better?",
      history: [
        { role: "user", content: "I can't sleep at night." },
        { role: "assistant", content: "Sleep issues can be really exhausting." },
      ],
      safetyState: "NORMAL",
    });

    const types = recs.map((r) => r.type);
    expect(types).toEqual(["PROFESSIONAL"]);
    expect(types).not.toContain("RELAXATION");
    expect(types).not.toContain("RESOURCES");
  });

  // 3. anxiety -> only Professional is live (Assessment/Resources not shipped)
  it("3: anxiety -> suggests only professional support (Assessment/Resources not shipped yet)", () => {
    const recs = generateRecommendations({
      message: "What should I do next to manage this anxiety?",
      history: [
        { role: "user", content: "I have been experiencing terrible anxiety." },
        { role: "assistant", content: "Anxiety can feel very overwhelming." },
      ],
      safetyState: "NORMAL",
    });

    const types = recs.map((r) => r.type);
    expect(types).toEqual(["PROFESSIONAL"]);
    expect(types).not.toContain("ASSESSMENT");
    expect(types).not.toContain("RESOURCES");
  });

  // 4. low mood -> only Professional is live (Assessment/Resources not shipped)
  it("4: low mood -> suggests only professional support (Assessment/Resources not shipped yet)", () => {
    const recs = generateRecommendations({
      message: "What should I do next?",
      history: [
        { role: "user", content: "I've been feeling really low and sad lately." },
        { role: "assistant", content: "I hear you, low mood is hard to carry." },
      ],
      safetyState: "NORMAL",
    });

    const types = recs.map((r) => r.type);
    expect(types).toEqual(["PROFESSIONAL"]);
  });

  // 5. general wellbeing -> no available action yet (Assessment/Resources not shipped)
  it("5: general wellbeing -> no recommendation cards yet (Assessment/Resources not shipped)", () => {
    const recs = generateRecommendations({
      message: "What should I do next?",
      history: [
        { role: "user", content: "Just wanted to check in on my daily wellness." },
        { role: "assistant", content: "Checking in regularly is a great habit." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // 6. explicit request for professional -> professional (only live recommendation)
  it("6: explicit request for professional -> returns professional support", () => {
    const recs = generateRecommendations({
      message: "Where can I find a therapist or doctor?",
      history: [],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([
      expect.objectContaining({ type: "PROFESSIONAL" }),
    ]);
  });

  // 7. explicit request for relaxation -> not shipped yet -> natural closing, no dead link
  it("7: explicit request for relaxation -> no recommendation cards yet (Relaxation Hub not shipped)", () => {
    const recs = generateRecommendations({
      message: "What should I do next? I want a breathing exercise.",
      history: [],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // 8. "thanks" -> concise closing (0-1 recommendation)
  it("8: 'thanks' -> concise closing with 0 or 1 recommendation max", () => {
    const recs = generateRecommendations({
      message: "Thanks, that's helpful!",
      history: [
        { role: "user", content: "I'm stressed." },
        { role: "assistant", content: "I understand." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs.length).toBeLessThanOrEqual(1);
  });

  // 9. "bye" -> simple closing (0 recommendations)
  it("9: 'bye' -> simple goodbye with 0 recommendations", () => {
    const recs = generateRecommendations({
      message: "Bye, see ya!",
      history: [
        { role: "user", content: "I'm stressed." },
        { role: "assistant", content: "I understand." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // 10. "what should I do next?" for a topic with a live recommendation -> returned
  it("10: 'what should I do next?' with anxiety context -> returns professional support", () => {
    const recs = generateRecommendations({
      message: "What should I do next?",
      history: [
        { role: "user", content: "I feel anxious." },
        { role: "assistant", content: "Anxiety can be tough." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(3);
    expect(recs.every((r) => r.type === "PROFESSIONAL")).toBe(true);
  });

  // 11. ordinary message -> no recommendation
  it("11: ordinary mid-conversation message -> no recommendations", () => {
    const recs = generateRecommendations({
      message: "Why do I feel like this in the mornings?",
      history: [
        { role: "user", content: "I'm stressed." },
        { role: "assistant", content: "Tell me more about it." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // 12. early single message -> no recommendation
  it("12: early single message -> no recommendations", () => {
    const recs = generateRecommendations({
      message: "Hello Nuro, how are you?",
      history: [],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // 13. high-risk conversation -> only the live professional-support action, no dead crisis-page link
  it("13: high-risk conversation -> returns only professional support (no unshipped crisis-page link)", () => {
    const recs = generateRecommendations({
      message: "What should I do next?",
      history: [
        { role: "user", content: "I want to kill myself." },
        { role: "assistant", content: "Crisis response..." },
      ],
      safetyState: "HIGH",
    });

    const types = recs.map((r) => r.type);
    expect(types).toEqual(["PROFESSIONAL"]);
    expect(types).not.toContain("CRISIS_SUPPORT");
    expect(types).not.toContain("ASSESSMENT");
    expect(types).not.toContain("RELAXATION");
  });

  // 14. immediate-risk conversation -> only the live professional-support action
  it("14: immediate-risk conversation -> returns only professional support", () => {
    const recs = generateRecommendations({
      message: "What should I do next?",
      history: [
        { role: "user", content: "I am going to hurt myself tonight." },
        { role: "assistant", content: "Immediate crisis response..." },
      ],
      safetyState: "IMMEDIATE",
    });

    const types = recs.map((r) => r.type);
    expect(types).toEqual(["PROFESSIONAL"]);
    expect(types).not.toContain("ASSESSMENT");
  });

  // 15. user confirmed safe after previous risk -> normal (non-crisis-only) recommendations resume
  it("15: user confirmed safe after previous risk -> normal recommendation flow resumes", () => {
    const recs = generateRecommendations({
      message: "I am safe now. I've still been feeling anxious though — what should I do next?",
      history: [
        { role: "user", content: "I want to kill myself." },
        { role: "assistant", content: "Crisis response..." },
      ],
      safetyState: "NORMAL",
    });

    const types = recs.map((r) => r.type);
    expect(types).toEqual(["PROFESSIONAL"]);
    expect(types).not.toContain("CRISIS_SUPPORT");
  });

  // 16. unrelated/off-topic conversation -> no inappropriate wellness recommendation
  it("16: unrelated/off-topic conversation -> no wellness recommendations", () => {
    const recs = generateRecommendations({
      message: "Thanks, what should I do next with Python coding?",
      history: [
        { role: "user", content: "How do I print in Python?" },
        { role: "assistant", content: "Use print('hello')." },
      ],
      safetyState: "NORMAL",
    });

    expect(recs).toEqual([]);
  });

  // Helper tests
  it("detectClosingIntent correctly identifies thanks vs bye vs explicit ask", () => {
    expect(detectClosingIntent("What should I do next?")).toBe("EXPLICIT_ASK");
    expect(detectClosingIntent("Bye!")).toBe("BYE_CLOSING");
    expect(detectClosingIntent("Thanks so much")).toBe("THANKS_CLOSING");
    expect(detectClosingIntent("I'm feeling much better now")).toBe("NATURAL_CONCLUSION");
    expect(detectClosingIntent("Why does it happen?")).toBe("NONE");
  });

  it("detectConversationTopic identifies stress vs sleep vs anxiety", () => {
    expect(detectConversationTopic("I'm stressed about work", [])).toBe("STRESS");
    expect(detectConversationTopic("I can't sleep at night", [])).toBe("SLEEP");
    expect(detectConversationTopic("I'm having panic attacks", [])).toBe("ANXIETY");
    expect(detectConversationTopic("How to learn C++?", [])).toBe("OFF_TOPIC");
  });
});
