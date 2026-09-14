/**
 * Thin, typed fetch layer over the Nuro API routes. Client components never
 * touch Prisma or the database directly — everything goes through
 * /api/chat and /api/conversations.
 */

export interface ConversationSummary {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface NuroMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  recommendations?: NuroRecommendation[];
}

import type { NuroRecommendation } from "@/lib/ai/recommendations";

export type { NuroRecommendation };

export type SafetyLevel = "NONE" | "LOW" | "MODERATE" | "HIGH" | "IMMEDIATE";

export interface SendMessageResult {
  conversationId: string;
  safetyLevel: SafetyLevel;
  message: { role: "ASSISTANT"; content: string };
  recommendations?: NuroRecommendation[];
}

export class NuroApiError extends Error {
  status: number;
  /**
   * Present when the server had already saved the user's message (and
   * possibly created a new conversation) before the failure — e.g. Gemini
   * timing out. Lets a failed /api/chat call still be "adopted" so a retry
   * continues the same conversation instead of creating a duplicate one.
   */
  conversationId?: string;

  constructor(message: string, status: number, conversationId?: string) {
    super(message);
    this.name = "NuroApiError";
    this.status = status;
    this.conversationId = conversationId;
  }
}

interface ApiErrorBody {
  error?: string;
  conversationId?: string;
}

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. a network-level failure page) — fall through to
    // the generic message below.
  }

  if (!res.ok) {
    const body = data as ApiErrorBody | null;
    const message =
      body && typeof body.error === "string"
        ? body.error
        : "Something went wrong. Please try again.";
    throw new NuroApiError(message, res.status, body?.conversationId);
  }

  return data as T;
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const res = await fetch("/api/conversations");
  const data = await parseJsonOrThrow<{ conversations: ConversationSummary[] }>(
    res,
  );
  return data.conversations;
}

export async function getConversation(
  id: string,
): Promise<{ conversation: ConversationSummary; messages: NuroMessage[] }> {
  const res = await fetch(`/api/conversations/${encodeURIComponent(id)}`);
  return parseJsonOrThrow(res);
}

export async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`/api/conversations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  await parseJsonOrThrow(res);
}

export async function sendChatMessage(params: {
  conversationId?: string;
  message: string;
}): Promise<SendMessageResult> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return parseJsonOrThrow(res);
}
