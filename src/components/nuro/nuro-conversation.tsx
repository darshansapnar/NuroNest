"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AlertCircle, Menu } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NuroComposer } from "@/components/nuro/nuro-composer";
import {
  NuroMessageBubble,
  NuroTypingIndicator,
} from "@/components/nuro/nuro-message";
import type { NuroMessage } from "@/lib/nuro-client";

const SUGGESTED_PROMPTS = [
  "I'm feeling anxious",
  "I can't sleep",
  "I'm feeling low today",
  "Just want to talk",
];

const WELCOME_MESSAGE = [
  "Hi there! I'm Nuro. 👋",
  "This is a safe and supportive space where you can share whatever is on your mind.",
  "How are you feeling today?",
].join("\n\n");

export function NuroConversation({
  messages,
  isLoadingMessages,
  isSending,
  sendError,
  draft,
  onDraftChange,
  onSend,
  onSuggestedPrompt,
  onOpenSidebar,
}: {
  messages: NuroMessage[];
  isLoadingMessages: boolean;
  isSending: boolean;
  sendError: string | null;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSuggestedPrompt: (text: string) => void;
  onOpenSidebar: () => void;
}) {
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, isSending, isLoadingMessages]);

  const showWelcome = !isLoadingMessages && messages.length === 0;

  return (
    <main className="relative flex min-w-0 flex-1 flex-col bg-background">
      <Image
        src="/images/cetre-area.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-2.5 sm:px-8 sm:py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open conversation history"
            onClick={onOpenSidebar}
            className="md:hidden"
          >
            <Menu aria-hidden="true" />
          </Button>
          <div>
            <h1 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
              Chat with Nuro
            </h1>
            <p className="text-xs text-muted-foreground">
              Talk, reflect, and feel a little lighter.
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="h-6 shrink-0 gap-1.5 rounded-full px-2.5"
        >
          <span
            className="size-1.5 rounded-full bg-primary"
            aria-hidden="true"
          />
          Online
        </Badge>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {isLoadingMessages ? (
            <div className="flex flex-col gap-4">
              <div className="h-20 w-3/4 animate-pulse rounded-2xl bg-muted" />
              <div className="ml-auto h-14 w-2/3 animate-pulse rounded-2xl bg-muted" />
            </div>
          ) : showWelcome ? (
            <>
              <NuroMessageBubble role="ASSISTANT" content={WELCOME_MESSAGE} />
              <div className="flex flex-wrap gap-2 pl-10">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onSuggestedPrompt(prompt)}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            messages.map((message) => (
              <NuroMessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                createdAt={message.createdAt}
                recommendations={message.recommendations}
              />
            ))
          )}

          {isSending ? <NuroTypingIndicator /> : null}

          {sendError ? (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              {sendError}
            </div>
          ) : null}

          <div ref={scrollAnchorRef} />
        </div>
      </div>

      <div className="relative z-10 border-t border-border bg-background px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <NuroComposer
            value={draft}
            onChange={onDraftChange}
            onSend={onSend}
            disabled={isSending}
          />
        </div>
      </div>
    </main>
  );
}
