"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { NuroSidebar, NuroSidebarContent } from "@/components/nuro/nuro-sidebar";
import { NuroConversation } from "@/components/nuro/nuro-conversation";
import { NuroWellnessPanel } from "@/components/nuro/nuro-wellness-panel";
import {
  NuroApiError,
  deleteConversation,
  getConversation,
  listConversations,
  sendChatMessage,
  type ConversationSummary,
  type NuroMessage,
} from "@/lib/nuro-client";

function genLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function NuroApp() {
  // This page is a dedicated, full-height app shell (see the fixed
  // container below) rather than a normal scrolling marketing page, so the
  // rest of the site's page scroll is suspended while it's mounted.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(
    null,
  );

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<NuroMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    setConversationsError(null);
    try {
      const items = await listConversations();
      setConversations(items);
    } catch (error) {
      setConversationsError(
        error instanceof NuroApiError
          ? error.message
          : "Couldn't load your conversations.",
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Mount-time fetch: deliberately calls the raw API function (not
  // loadConversations) so every setState happens inside a .then/.catch
  // callback rather than synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;

    listConversations()
      .then((items) => {
        if (!cancelled) setConversations(items);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setConversationsError(
            error instanceof NuroApiError
              ? error.message
              : "Couldn't load your conversations.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingConversations(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectConversation = useCallback(
    async (id: string) => {
      setMobileSidebarOpen(false);
      if (id === activeConversationId) return;

      setActiveConversationId(id);
      setSendError(null);
      setDraft("");
      setIsLoadingMessages(true);
      try {
        const { messages: loaded } = await getConversation(id);
        setMessages(loaded);
      } catch (error) {
        setMessages([]);
        setSendError(
          error instanceof NuroApiError
            ? error.message
            : "Couldn't load that conversation.",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [activeConversationId],
  );

  const startNewChat = useCallback(() => {
    setMobileSidebarOpen(false);
    setActiveConversationId(null);
    setMessages([]);
    setSendError(null);
    setDraft("");
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteConversation(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (id === activeConversationId) {
          startNewChat();
        }
      } catch (error) {
        console.error("[nuro] failed to delete conversation", {
          reason: error instanceof Error ? error.message : "unknown error",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [activeConversationId, startNewChat],
  );

  const handleSend = useCallback(
    async (explicitText?: string) => {
      const text = (explicitText ?? draft).trim();
      if (!text || isSending) return;

      setSendError(null);
      setIsSending(true);
      setDraft("");

      const optimisticUserMessage: NuroMessage = {
        id: genLocalId("local-user"),
        role: "USER",
        content: text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUserMessage]);

      try {
        const result = await sendChatMessage({
          conversationId: activeConversationId ?? undefined,
          message: text,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: genLocalId("local-assistant"),
            role: "ASSISTANT",
            content: result.message.content,
            recommendations: result.recommendations,
            createdAt: new Date().toISOString(),
          },
        ]);

        if (!activeConversationId) {
          setActiveConversationId(result.conversationId);
          void loadConversations();
        } else {
          setConversations((prev) =>
            prev
              .map((c) =>
                c.id === result.conversationId
                  ? { ...c, updatedAt: new Date().toISOString() }
                  : c,
              )
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              ),
          );
        }
      } catch (error) {
        const message =
          error instanceof NuroApiError
            ? error.message
            : "Something went wrong. Please try again.";
        setSendError(message);

        // The server may have already saved this message (and, for a brand
        // new conversation, created it) before failing — adopt its id so a
        // follow-up send continues the same conversation instead of
        // silently starting a second one.
        if (
          error instanceof NuroApiError &&
          error.conversationId &&
          !activeConversationId
        ) {
          setActiveConversationId(error.conversationId);
          void loadConversations();
        }
      } finally {
        setIsSending(false);
      }
    },
    [activeConversationId, draft, isSending, loadConversations],
  );

  const sidebarProps = {
    conversations,
    activeConversationId,
    isLoading: isLoadingConversations,
    error: conversationsError,
    onRetry: () => void loadConversations(),
    searchQuery,
    onSearchChange: setSearchQuery,
    onSelect: (id: string) => void selectConversation(id),
    onNewChat: startNewChat,
    onDelete: (id: string) => void handleDelete(id),
    deletingId,
  };

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-10 flex bg-background">
      <NuroSidebar {...sidebarProps} />

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[85%] max-w-xs p-0 sm:max-w-sm">
          <SheetTitle className="sr-only">Conversation history</SheetTitle>
          <NuroSidebarContent {...sidebarProps} />
        </SheetContent>
      </Sheet>

      <NuroConversation
        messages={messages}
        isLoadingMessages={isLoadingMessages}
        isSending={isSending}
        sendError={sendError}
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => void handleSend()}
        onSuggestedPrompt={(text) => void handleSend(text)}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
      />

      <NuroWellnessPanel />
    </div>
  );
}
