import "server-only";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Same display-history cap philosophy as the LLM context window in
// /api/chat — bounds the read regardless of how long a conversation gets.
const MAX_MESSAGES = 100;

function errorResponse(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

async function loadOwnedConversation(id: string, userId: string) {
  // Ownership is part of the query itself, not a check after the fact — a
  // conversation that exists but belongs to someone else is indistinguishable
  // from one that doesn't exist.
  return prisma.conversation.findFirst({
    where: { id, userId },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse(401, "You must be signed in to view this conversation.");
  }

  const { id } = await params;

  try {
    const conversation = await loadOwnedConversation(id, userId);
    if (!conversation) {
      return errorResponse(404, "Conversation not found.");
    }

    const recent = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "desc" },
      take: MAX_MESSAGES,
      select: { id: true, role: true, content: true, createdAt: true },
    });

    return NextResponse.json({ conversation, messages: recent.reverse() });
  } catch (error) {
    console.error("[api/conversations/:id] get failed", {
      reason: error instanceof Error ? error.message : "unknown error",
    });
    return errorResponse(500, "Something went wrong. Please try again.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse(401, "You must be signed in to delete a conversation.");
  }

  const { id } = await params;

  try {
    const conversation = await loadOwnedConversation(id, userId);
    if (!conversation) {
      return errorResponse(404, "Conversation not found.");
    }

    // Messages cascade-delete via the schema's onDelete: Cascade.
    await prisma.conversation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/conversations/:id] delete failed", {
      reason: error instanceof Error ? error.message : "unknown error",
    });
    return errorResponse(500, "Something went wrong. Please try again.");
  }
}
