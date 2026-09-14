import { describe, expect, it, vi } from "vitest";

// Mock server-only module for Vitest Node environment
vi.mock("server-only", () => ({}));

import { buildCrisisResponse } from "./crisis-response";
import { detectSafety } from "./safety-detection";
import { getCrisisResources } from "./crisis-resources";
import type { AiProvider } from "./provider";

function classify(message: string) {
  return detectSafety(message);
}

// Mock provider returning contextually dynamic text
const mockProvider: AiProvider = {
  generateReply: vi.fn().mockImplementation(async ({ message }) => {
    return {
      content: `I am deeply sorry you are experiencing this regarding "${message}". Please know that you are taking a brave step by reaching out.`,
    };
  }),
};

describe("buildCrisisResponse — Module 2: Nuro Dynamic Crisis Response Layer", () => {
  // 1. MODERATE risk
  it("MODERATE: returns supportive, non-emergency guidance with dynamic text", async () => {
    const msg = "I feel hopeless lately.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result?.level).toBe("MODERATE");
    expect(result?.content).toContain("I am deeply sorry you are experiencing this");
    // Requirement: don't unnecessarily overwhelm with emergency info.
    expect(result?.content).not.toMatch(/emergency: 112/i);
    expect(result?.content).not.toMatch(/tele-manas/i);
  });

  // 2. HIGH risk
  it("HIGH (no plan): acknowledges disclosure, shows Tele-MANAS, but not emergency number", async () => {
    const msg = "I want to kill myself.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result?.level).toBe("HIGH");
    expect(result?.content).toContain("I am deeply sorry you are experiencing this");
    expect(result?.content).toContain("**Tele-MANAS: 14416**");
    expect(result?.content).toContain("**Tele-MANAS: 1800-89-14416**");
    expect(result?.content).not.toContain("**Emergency: 112**");
  });

  it("HIGH (with explicit plan): also surfaces emergency 112 number", async () => {
    const msg = "I have a plan to kill myself.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result?.level).toBe("HIGH");
    expect(result?.content).toContain("**Emergency: 112**");
    expect(result?.content).toContain("**Tele-MANAS: 14416**");
    expect(result?.content).toContain("**Tele-MANAS: 1800-89-14416**");
  });

  // 3. IMMEDIATE risk
  it("IMMEDIATE: leads with dynamic text and shows all India resources (Emergency 112 & Tele-MANAS)", async () => {
    const msg = "I'm going to hurt myself tonight.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result?.level).toBe("IMMEDIATE");
    expect(result?.content).toContain("I am deeply sorry you are experiencing this");
    expect(result?.content).toContain("**Emergency: 112**");
    expect(result?.content).toContain("**Tele-MANAS: 14416**");
    expect(result?.content).toContain("**Tele-MANAS: 1800-89-14416**");
  });

  // 4. Normal message
  it("normal message: no crisis response, continues normal flow", async () => {
    const msg = "I had a pretty good day today, thanks!";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result).toBeUndefined();
  });

  // 5. Educational suicide discussion
  it("educational discussion of suicide: no crisis response", async () => {
    const msg = "What does suicidal ideation mean, and why do people experience it?";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result).toBeUndefined();
  });

  it("fictional discussion of suicide: no crisis response", async () => {
    const msg = "In the novel we're reading for English class, the main character struggles with suicidal thoughts.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result).toBeUndefined();
  });

  // 6. User talking about another person
  it("user describing a friend's risk: does not trigger a crisis response (continues normal flow)", async () => {
    const msg = "My friend has been talking about suicide and I'm really worried about her.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
    expect(result).toBeUndefined();
  });

  // 7. High-risk message followed by normal message
  it("a HIGH-risk message followed by a normal message: each is classified independently", async () => {
    const firstMsg = "I want to kill myself.";
    const first = await buildCrisisResponse(classify(firstMsg), firstMsg, [], { provider: mockProvider });
    expect(first?.level).toBe("HIGH");

    const secondMsg = "Thanks, I'm feeling a bit better now.";
    const second = await buildCrisisResponse(classify(secondMsg), secondMsg, [], { provider: mockProvider });
    expect(second).toBeUndefined();
  });

  // 8. India crisis resources are present
  it("India resources (112, Tele-MANAS with both numbers) appear in HIGH and IMMEDIATE responses", async () => {
    const msg1 = "I have a plan to kill myself.";
    const msg2 = "I'm going to hurt myself tonight.";

    const high = await buildCrisisResponse(classify(msg1), msg1, [], { provider: mockProvider });
    const immediate = await buildCrisisResponse(classify(msg2), msg2, [], { provider: mockProvider });

    for (const response of [high, immediate]) {
      expect(response?.content).toContain("**Emergency: 112**");
      expect(response?.content).toContain("**Tele-MANAS: 14416**");
      expect(response?.content).toContain("**Tele-MANAS: 1800-89-14416**");
    }
  });

  it("the default crisis-resources lookup resolves to India", () => {
    const resources = getCrisisResources();
    expect(resources.countryCode).toBe("IN");
    expect(resources.emergencyNumber).toBe("112");
    expect(resources.helplines[0].numbers).toEqual(["14416", "1800-89-14416"]);
  });

  // 9. US 988 is not used as default India resource
  it("never surfaces US-specific resources (988, Crisis Text Line) anywhere in generated responses", async () => {
    const messages = [
      "I feel hopeless lately.",
      "I want to kill myself.",
      "I have a plan to kill myself.",
      "I'm going to hurt myself tonight.",
    ];

    for (const msg of messages) {
      const result = await buildCrisisResponse(classify(msg), msg, [], { provider: mockProvider });
      expect(result?.content).not.toMatch(/\b988\b/);
      expect(result?.content).not.toMatch(/crisis text line/i);
    }
  });

  // 10. Fallback execution when Gemini fails
  it("falls back gracefully to safe fallback text if provider fails", async () => {
    const failingProvider: AiProvider = {
      generateReply: vi.fn().mockRejectedValue(new Error("Network timeout")),
    };

    const msg = "I want to kill myself.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: failingProvider });
    expect(result).toBeDefined();
    expect(result?.level).toBe("HIGH");
    expect(result?.content).toContain("Thank you for telling me that");
    expect(result?.content).toContain("**Tele-MANAS: 14416**");
  });

  // 11. Application controls resource block regardless of Gemini output
  it("Gemini cannot override or remove verified crisis resource block", async () => {
    const customProvider: AiProvider = {
      generateReply: vi.fn().mockResolvedValue({
        content: "I hear that things are overwhelming right now. Please talk to a trusted friend.",
      }),
    };

    const msg = "I want to kill myself.";
    const result = await buildCrisisResponse(classify(msg), msg, [], { provider: customProvider });
    expect(result?.content).toContain("I hear that things are overwhelming right now");
    expect(result?.content).toContain("**Tele-MANAS: 14416**");
    expect(result?.content).toContain("**Tele-MANAS: 1800-89-14416**");
  });

  // 12. Different risk messages produce contextually different conversational responses
  it("different user messages produce contextually different dynamic responses", async () => {
    const msg1 = "I am going to suicide";
    const msg2 = "I don't want to live anymore";

    const res1 = await buildCrisisResponse(classify(msg1), msg1, [], { provider: mockProvider });
    const res2 = await buildCrisisResponse(classify(msg2), msg2, [], { provider: mockProvider });

    expect(res1?.content).toContain('regarding "I am going to suicide"');
    expect(res2?.content).toContain('regarding "I don\'t want to live anymore"');
    expect(res1?.content).not.toEqual(res2?.content);
  });
});
