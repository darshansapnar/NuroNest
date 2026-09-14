"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HelpCircle,
  MessageCircleOff,
  Plus,
  Search,
  Settings,
  Trash2,
  UserRound,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { groupConversationsByDate } from "@/lib/nuro-dates";
import type { ConversationSummary } from "@/lib/nuro-client";

interface NuroSidebarContentProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

function ConversationRow({
  conversation,
  timeLabel,
  isActive,
  isDeleting,
  onSelect,
  onDelete,
}: {
  conversation: ConversationSummary;
  timeLabel: string;
  isActive: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm">
        <span className="text-destructive">Delete this chat?</span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-md bg-destructive/90 px-2 py-1 text-xs font-medium text-white hover:bg-destructive disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/row relative flex items-center rounded-lg text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-foreground"
          : "text-foreground/90 hover:bg-muted",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "min-w-0 flex-1 truncate px-3 py-2 text-left outline-none",
          isActive && "font-medium",
        )}
        aria-current={isActive ? "true" : undefined}
      >
        {conversation.title?.trim() || "New conversation"}
      </button>
      <span className="shrink-0 pr-1 text-xs text-muted-foreground group-hover/row:hidden">
        {timeLabel}
      </span>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Delete conversation"
        className="hidden shrink-0 rounded-md p-1.5 mr-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover/row:block"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function NuroSidebarContent({
  conversations,
  activeConversationId,
  isLoading,
  error,
  onRetry,
  searchQuery,
  onSearchChange,
  onSelect,
  onNewChat,
  onDelete,
  deletingId,
}: NuroSidebarContentProps) {
  const { openUserProfile } = useClerk();

  const filtered = searchQuery.trim()
    ? conversations.filter((c) =>
        (c.title ?? "New conversation")
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : conversations;

  const groups = groupConversationsByDate(filtered);

  return (
    <div className="relative flex h-full w-full flex-col bg-background">
      <Image
        src="/images/left-sidebar.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="320px"
        priority
        className="object-cover"
      />
      <div className="relative z-10 flex h-full flex-col">
      <div className="flex flex-col gap-2.5 px-4 pt-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-center gap-1.5 rounded-full"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Chat
        </Button>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations…"
            aria-label="Search conversations"
            className="h-9 rounded-full pl-8"
          />
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto px-2 pb-2">
        {isLoading ? (
          <div className="flex flex-col gap-1.5 px-2 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-muted"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-start gap-2 px-3 py-4 text-sm text-muted-foreground">
            <span>{error}</span>
            <button
              type="button"
              onClick={onRetry}
              className="font-medium text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-3 py-8 text-center text-sm text-muted-foreground">
            <MessageCircleOff
              className="size-6 text-muted-foreground/70"
              aria-hidden="true"
            />
            {conversations.length === 0
              ? "No conversations yet. Start your first chat with Nuro."
              : "No conversations match your search."}
          </div>
        ) : (
          <nav aria-label="Conversation history" className="flex flex-col gap-3">
            {groups.map((group) => (
              <div key={group.label}>
                <div className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {group.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <ConversationRow
                      key={item.id}
                      conversation={item}
                      timeLabel={item.timeLabel}
                      isActive={item.id === activeConversationId}
                      isDeleting={deletingId === item.id}
                      onSelect={() => onSelect(item.id)}
                      onDelete={() => onDelete(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-0.5 px-2 py-2">
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/dashboard" />}
          className="w-full justify-start gap-2.5 px-3 text-foreground"
        >
          <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
          Profile
        </Button>
        <Button
          variant="ghost"
          onClick={() => openUserProfile()}
          className="w-full justify-start gap-2.5 px-3 text-foreground"
        >
          <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
          Settings
        </Button>
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/contact" />}
          className="w-full justify-start gap-2.5 px-3 text-foreground"
        >
          <HelpCircle className="size-4 text-muted-foreground" aria-hidden="true" />
          Help &amp; Support
        </Button>
      </div>
      </div>
    </div>
  );
}

export function NuroSidebar(props: NuroSidebarContentProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border md:flex lg:w-80">
      <NuroSidebarContent {...props} />
    </aside>
  );
}
