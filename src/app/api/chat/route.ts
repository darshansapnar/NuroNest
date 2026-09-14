import "server-only";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateNuroReply } from "@/lib/ai/nuro";
import { MAX_MESSAGE_LENGTH, type ChatMessage } from "@/lib/ai/provider";
import { evaluateSafetyState } from "@/lib/ai/safety-state";
import { generateRecommendations } from "@/lib/ai/recommendations";
import { MessageRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// How many recent messages to pull from the database before handing them to
// Nuro's own (tighter) in-memory windowing — bounds the DB read itself so a
// very long conversation never gets read in full.
const MAX_HISTORY_FETCH = 40;

const MAX_TITLE_LENGTH = 60;

/**
 * Short, human-readable title for a new conversation's sidebar entry.
 * Deliberately not AI-generated — a plain truncation of the first message
 * keeps this fast, free, and safety-layer-independent.
 */
function deriveTitle(message: string): string {
  const collapsed = message.replace(/\s+/g, " ").trim();
  if (collapsed.length <= MAX_TITLE_LENGTH) {
    return collapsed;
  }

  const truncated = collapsed.slice(0, MAX_TITLE_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  const base = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;
  return `${base}…`;
}

const chatRequestSchema = z.object({
  // Omitted entirely -> start a new conversation. Present -> must belong to
  // the authenticated user (checked below, never trusted as-is).
  conversationId: z.string().trim().min(1).max(128).optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
    ),
});

function errorResponse(
  status: number,
  error: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error, ...extra }, { status });
}

function toChatMessage(entry: { role: MessageRole; content: string }): ChatMessage {
  return {
    role: entry.role === MessageRole.ASSISTANT ? "assistant" : "user",
    content: entry.content,
  };
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse(401, "You must be signed in to use Nuro.");
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(400, "Request body must be valid JSON.");
  }

  const parsed = chatRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse(
      400,
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  const { message } = parsed.data;

  try {
    // Resolve + authorize the conversation, and load prior history, before
    // writing anything. A conversationId that doesn't exist or doesn't
    // belong to this Clerk user is indistinguishable from "not found".
    let conversationId = parsed.data.conversationId;
    let priorMessages: ChatMessage[] = [];

    if (conversationId) {
      const existing = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
          id: true,
          userId: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: MAX_HISTORY_FETCH,
            select: { role: true, content: true },
          },
        },
      });

      if (!existing || existing.userId !== userId) {
        return errorResponse(404, "Conversation not found.");
      }

      priorMessages = existing.messages.reverse().map(toChatMessage);
    }

    // Module 1 & Module 3: Evaluate safety detection and conversation safety state.
    const evaluation = await evaluateSafetyState({ message, history: priorMessages });

    // Persist the user's message. A nested `messages.create` both writes
    // the row and (via @updatedAt) bumps the conversation's recency in one
    // query, whether the conversation is new or existing.
    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: { create: { role: MessageRole.USER, content: message } },
        },
      });
    } else {
      const created = await prisma.conversation.create({
        data: {
          userId,
          title: deriveTitle(message),
          messages: { create: { role: MessageRole.USER, content: message } },
        },
        select: { id: true },
      });
      conversationId = created.id;
    }

    // Module 4: Compute context-aware & safety-gated recommendations
    const recommendations = generateRecommendations({
      message,
      history: priorMessages,
      safetyState: evaluation.state,
    });
    const recPayload = recommendations.length > 0 ? recommendations : undefined;

    // Module 2 & Module 3: CRISIS_RESPONSE or SAFETY_FOLLOW_UP actions NEVER reach Gemini.
    if (evaluation.action === "CRISIS_RESPONSE" && evaluation.crisisResponse) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: {
            create: { role: MessageRole.ASSISTANT, content: evaluation.crisisResponse.content },
          },
        },
      });

      return NextResponse.json({
        conversationId,
        safetyLevel: evaluation.crisisResponse.level,
        message: { role: "ASSISTANT", content: evaluation.crisisResponse.content },
        recommendations: recPayload,
      });
    }

    if (evaluation.action === "SAFETY_FOLLOW_UP" && evaluation.followUpContent) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: {
            create: { role: MessageRole.ASSISTANT, content: evaluation.followUpContent },
          },
        },
      });

      return NextResponse.json({
        conversationId,
        safetyLevel: "HIGH",
        message: { role: "ASSISTANT", content: evaluation.followUpContent },
        recommendations: recPayload,
      });
    }

    let replyContent: string;
    try {
      const reply = await generateNuroReply({
        message,
        history: priorMessages,
        safetyLevel: evaluation.detection.level,
      });
      replyContent = reply.content;
    } catch (error) {
      console.error("[api/chat] Nuro reply generation failed", {
        conversationId,
        reason: error instanceof Error ? error.message : "unknown error",
      });
      return errorResponse(
        503,
        "Nuro is temporarily unavailable. Please try again in a moment.",
        // The user's message was already saved above — hand back the
        // conversation id so the client can continue the same conversation
        // instead of accidentally starting a new one on retry.
        { conversationId },
      );
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          create: { role: MessageRole.ASSISTANT, content: replyContent },
        },
      },
    });

    return NextResponse.json({
      conversationId,
      safetyLevel: evaluation.detection.level,
      message: { role: "ASSISTANT", content: replyContent },
      recommendations: recPayload,
    });
  } catch (error) {
    console.error("[api/chat] unexpected error", {
      reason: error instanceof Error ? error.message : "unknown error",
    });
    return errorResponse(500, "Something went wrong. Please try again.");
  }
}
