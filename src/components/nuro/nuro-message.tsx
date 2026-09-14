import Link from "next/link";
import { ArrowRight, Leaf, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/nuro-dates";
import type { MessageRole, NuroRecommendation } from "@/lib/nuro-client";

function Avatar({ isNuro }: { isNuro: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        isNuro ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      )}
    >
      {isNuro ? <Leaf className="size-4" /> : <User className="size-4" />}
    </span>
  );
}

export function NuroMessageBubble({
  role,
  content,
  createdAt,
  recommendations,
}: {
  role: MessageRole;
  content: string;
  /** Omit for a purely local/synthetic bubble (e.g. the welcome greeting). */
  createdAt?: string;
  recommendations?: NuroRecommendation[];
}) {
  const isNuro = role !== "USER";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2.5",
        isNuro ? "justify-start" : "flex-row-reverse justify-start",
      )}
    >
      <Avatar isNuro={isNuro} />
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1 sm:max-w-[75%]",
          isNuro ? "items-start" : "items-end",
        )}
      >
        {isNuro ? (
          <span className="px-1 text-xs font-medium text-muted-foreground">
            Nuro
          </span>
        ) : null}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isNuro
              ? "rounded-tl-sm bg-muted text-foreground"
              : "rounded-tr-sm bg-primary/10 text-foreground",
          )}
        >
          {content}
        </div>
        {recommendations && recommendations.length > 0 ? (
          <div className="mt-2 flex flex-col gap-2 w-full">
            <span className="text-xs font-semibold text-muted-foreground px-1">
              Suggested Next Steps:
            </span>
            {recommendations.map((rec) => (
              <Link
                key={rec.type + rec.route}
                href={rec.route}
                className="group flex flex-col gap-0.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-primary">
                  <span>{rec.title}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
              </Link>
            ))}
          </div>
        ) : null}
        {createdAt ? (
          <span className="px-1 text-xs text-muted-foreground">
            {formatMessageTime(createdAt)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function NuroTypingIndicator() {
  return (
    <div className="flex w-full items-start gap-2.5">
      <Avatar isNuro />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3.5">
        <span className="sr-only">Nuro is typing…</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
