import "server-only";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Defensive cap so a power user's history can never make this an unbounded
// read — mirrors the same philosophy as the history windowing in /api/chat.
const MAX_CONVERSATIONS = 200;

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "You must be signed in to view conversations." },
      { status: 401 },
    );
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: MAX_CONVERSATIONS,
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[api/conversations] list failed", {
      reason: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
