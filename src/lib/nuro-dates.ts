import type { ConversationSummary } from "@/lib/nuro-client";

// Pinned to "en-US" rather than the runtime's default locale (`undefined`)
// so formatting can never differ between server and client renders — that
// mismatch (e.g. "11:41 AM" vs "11:41 am") is a real hydration error, and
// pinning also keeps the format matching the design reference regardless of
// a visitor's browser locale.
const LOCALE = "en-US";

/** "10:24 AM" — used on individual message bubbles. */
export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Sep 10" — used for sidebar entries older than the last 7 days. */
function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
  });
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export interface ConversationGroup {
  label: string;
  items: (ConversationSummary & { timeLabel: string })[];
}

const GROUP_ORDER = ["Today", "Yesterday", "Previous 7 days", "Older"] as const;

/**
 * Buckets conversations by recency (based on `updatedAt`) into the same
 * groups a chat app's sidebar conventionally uses. Empty buckets are
 * omitted; group order is fixed regardless of which buckets are present.
 */
export function groupConversationsByDate(
  conversations: ConversationSummary[],
  now: Date = new Date(),
): ConversationGroup[] {
  const today = startOfDay(now);
  const yesterday = today - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;

  const buckets: Record<(typeof GROUP_ORDER)[number], ConversationGroup["items"]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    Older: [],
  };

  for (const conversation of conversations) {
    const updatedAt = new Date(conversation.updatedAt);
    const day = startOfDay(updatedAt);

    const isTimeLabel = day === today;
    const item = {
      ...conversation,
      timeLabel: isTimeLabel
        ? formatMessageTime(conversation.updatedAt)
        : formatShortDate(conversation.updatedAt),
    };

    if (day === today) {
      buckets.Today.push(item);
    } else if (day === yesterday) {
      buckets.Yesterday.push(item);
    } else if (day >= sevenDaysAgo) {
      buckets["Previous 7 days"].push(item);
    } else {
      buckets.Older.push(item);
    }
  }

  return GROUP_ORDER.filter((label) => buckets[label].length > 0).map(
    (label) => ({ label, items: buckets[label] }),
  );
}
