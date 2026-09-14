import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock Next.js server-only package for Node test environment
vi.mock("server-only", () => ({}));

import { POST } from "./route";

// --- Mocks ---

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "test_user_123" }),
}));

// Mock Gemini / Nuro reply generator so tests run offline without network calls
vi.mock("@/lib/ai/nuro", () => ({
  generateNuroReply: vi.fn().mockResolvedValue({
    content: "I hear you. Let's talk about how you're feeling.",
  }),
}));

// In-memory conversation store for Prisma mock
const memoryStore = new Map<string, { id: string; userId: string; messages: Array<{ id: string; role: "USER" | "ASSISTANT"; content: string; createdAt: Date }> }>();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    conversation: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        return memoryStore.get(where.id) ?? null;
      }),
      create: vi.fn().mockImplementation(async ({ data }) => {
        const id = `conv_${Date.now()}_${Math.random()}`;
        const newConv = {
          id,
          userId: data.userId,
          messages: [
            {
              id: `msg_1`,
              role: data.messages.create.role,
              content: data.messages.create.content,
              createdAt: new Date(),
            },
          ],
        };
        memoryStore.set(id, newConv);
        return { id };
      }),
      update: vi.fn().mockImplementation(async ({ where, data }) => {
        const existing = memoryStore.get(where.id);
        if (!existing) throw new Error("Not found");
        if (data.messages?.create) {
          existing.messages.push({
            id: `msg_${existing.messages.length + 1}`,
            role: data.messages.create.role,
            content: data.messages.create.content,
            createdAt: new Date(),
          });
        }
        return existing;
      }),
    },
  },
}));

function createJsonRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat Integration Tests", () => {
  beforeEach(() => {
    memoryStore.clear();
    vi.clearAllMocks();
  });

  // 1. normal message -> Gemini
  it("1: normal message -> invokes Nuro/Gemini and returns NONE/LOW safetyLevel", async () => {
    const req = createJsonRequest({ message: "Hello Nuro, I am feeling okay." });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.conversationId).toBeDefined();
    expect(body.safetyLevel).toBe("NONE");
    expect(body.message.role).toBe("ASSISTANT");
    expect(body.message.content).toContain("I hear you");
  });

  // 2. suicidal thoughts -> crisis response with Tele-MANAS
  it("2: suicidal thoughts -> returns HIGH crisis response with Tele-MANAS, bypassing Gemini", async () => {
    const req = createJsonRequest({ message: "I'm having suicidal thoughts." });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.safetyLevel).toBe("HIGH");
    expect(body.message.content).toContain("Tele-MANAS: 14416");
    expect(body.message.content).toContain("Tele-MANAS: 1800-89-14416");
    expect(body.message.content).not.toContain("Emergency: 112");
  });

  // 3. explicit suicide intent -> crisis response with Tele-MANAS
  it("3: explicit suicide intent -> returns HIGH crisis response with Tele-MANAS", async () => {
    const req = createJsonRequest({ message: "I want to kill myself." });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.safetyLevel).toBe("HIGH");
    expect(body.message.content).toContain("Tele-MANAS: 14416");
  });

  // 4. immediate danger -> emergency response with Emergency 112
  it("4: immediate danger -> returns IMMEDIATE crisis response with Emergency 112 & Tele-MANAS", async () => {
    const req = createJsonRequest({ message: "I am going to hurt myself tonight." });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.safetyLevel).toBe("IMMEDIATE");
    expect(body.message.content).toContain("Emergency: 112");
    expect(body.message.content).toContain("Tele-MANAS: 14416");
  });

  // 5. educational suicide question -> no false crisis escalation
  it("5: educational suicide question -> no false crisis escalation", async () => {
    const req = createJsonRequest({ message: "What does suicidal ideation mean in medical textbooks?" });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.safetyLevel).toBe("NONE");
    expect(body.message.content).not.toContain("Tele-MANAS");
  });

  // 6. suicidal friend/third-person context -> no false user-risk classification
  it("6: suicidal friend context -> no false user-risk classification", async () => {
    const req = createJsonRequest({
      message: "My friend has been talking about suicide and I am really worried about her.",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.safetyLevel).toBe("LOW");
    expect(body.message.content).not.toContain("Tele-MANAS");
  });

  // 7. HIGH risk -> unrelated follow-up -> safety follow-up
  it("7: HIGH risk -> unrelated follow-up -> intercepts topic pivot with safety follow-up", async () => {
    // Step 1: User sends high risk message
    const req1 = createJsonRequest({ message: "I want to kill myself." });
    const res1 = await POST(req1);
    const { conversationId } = await res1.json();

    // Step 2: User tries to ask about C++ coding in same conversation
    const req2 = createJsonRequest({ conversationId, message: "Can you teach me C++?" });
    const res2 = await POST(req2);
    expect(res2.status).toBe(200);

    const body2 = await res2.json();
    expect(body2.message.content).toMatch(/are you feeling safe right now\?/i);
    expect(body2.message.content).not.toMatch(/c\+\+/i);
  });

  // 8. HIGH risk -> "I'm safe now" -> normal flow can resume
  it("8: HIGH risk -> 'I'm safe now' -> normal flow resumes", async () => {
    // Step 1: High risk message
    const req1 = createJsonRequest({ message: "I want to kill myself." });
    const res1 = await POST(req1);
    const { conversationId } = await res1.json();

    // Step 2: Confirm safety
    const req2 = createJsonRequest({ conversationId, message: "I spoke to a friend and I am safe now." });
    const res2 = await POST(req2);
    expect(res2.status).toBe(200);

    const body2 = await res2.json();
    expect(body2.safetyLevel).toBe("NONE");
    expect(body2.message.content).toContain("I hear you");
  });

  // 9. meaningful conversation ending -> recommendations returned (only ones that actually exist in the app)
  it("9: meaningful conversation ending -> returns structured, available recommendations", async () => {
    // Step 1: User shares anxiety (a topic whose recommendation pool currently
    // includes a live route — /professional. Resources/Assessment aren't shipped yet.)
    const req1 = createJsonRequest({ message: "I've been feeling really anxious about exams lately." });
    const res1 = await POST(req1);
    const { conversationId } = await res1.json();

    // Step 2: Conversation continues
    const req2 = createJsonRequest({ conversationId, message: "Thanks for listening, I feel a bit better now. What should I do next?" });
    const res2 = await POST(req2);
    expect(res2.status).toBe(200);

    const body2 = await res2.json();
    expect(body2.recommendations).toBeDefined();
    expect(body2.recommendations.length).toBeGreaterThan(0);
    expect(body2.recommendations[0].title).toBeDefined();
    expect(body2.recommendations[0].route).toBeDefined();
    // Every recommendation must point at a route that actually exists today.
    for (const rec of body2.recommendations) {
      expect(rec.route).toBe("/professional");
    }
  });

  // 10. "bye" -> concise closing
  it("10: 'bye' -> concise closing without recommendation dump", async () => {
    const req = createJsonRequest({ message: "Bye!" });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.recommendations).toBeUndefined();
  });

  // 11. "what should I do next?" for a topic with a live route -> recommendations
  it("11: 'what should I do next?' with a topic mapped to an available route -> returns recommendations", async () => {
    const req = createJsonRequest({
      message: "Where can I find a therapist? What should I do next?",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.recommendations).toBeDefined();
    expect(body.recommendations.length).toBeGreaterThan(0);
    expect(body.recommendations[0].route).toBe("/professional");
  });

  // 12. HIGH/IMMEDIATE -> recommendations do not override safety
  it("12: HIGH/IMMEDIATE -> recommendations do NOT show normal wellness tools (only safety/crisis)", async () => {
    const req = createJsonRequest({ message: "I want to kill myself." });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    if (body.recommendations) {
      const types = body.recommendations.map((r: { type: string }) => r.type);
      expect(types).not.toContain("ASSESSMENT");
      expect(types).not.toContain("RELAXATION");
    }
  });

  // 13. Real-world sequence: "I'm having suicidal thoughts" -> "please help me" -> "no"
  it("13: real-world sequence: suicidal thoughts -> 'please help me' -> 'no' escalates to crisis response with 112 & Tele-MANAS (NOT repeating question)", async () => {
    // Step 1: User says "I'm having suicidal thoughts"
    const req1 = createJsonRequest({ message: "I'm having suicidal thoughts." });
    const res1 = await POST(req1);
    const { conversationId } = await res1.json();

    // Step 2: User says "please help me" -> receives safety question
    const req2 = createJsonRequest({ conversationId, message: "please help me" });
    const res2 = await POST(req2);
    const body2 = await res2.json();
    expect(body2.message.content).toContain("Are you feeling safe right now?");

    // Step 3: User says "no" -> MUST escalate to crisis response with helplines, NOT repeating safety question
    const req3 = createJsonRequest({ conversationId, message: "no" });
    const res3 = await POST(req3);
    expect(res3.status).toBe(200);

    const body3 = await res3.json();
    expect(body3.safetyLevel).toBe("HIGH");
    expect(body3.message.content).toContain("Tele-MANAS: 14416");
    expect(body3.message.content).toContain("Emergency: 112");
    expect(body3.message.content).not.toContain("Are you feeling safe right now?");
  });
});
