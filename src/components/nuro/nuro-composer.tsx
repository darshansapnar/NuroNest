"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { MAX_MESSAGE_LENGTH } from "@/lib/ai/provider";

const MAX_TEXTAREA_HEIGHT = 160;

export function NuroComposer({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Share what's on your mind…",
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  const trimmed = value.trim();
  const overLimit = value.length > MAX_MESSAGE_LENGTH;
  const canSend = trimmed.length > 0 && !overLimit && !disabled;

  function handleSend() {
    if (!canSend) return;
    onSend();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-2 rounded-3xl border border-border bg-background px-3 py-2 shadow-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
          rows={1}
          aria-label="Message Nuro"
          disabled={disabled}
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-1.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
            canSend && "hover:bg-primary/85",
          )}
        >
          <ArrowUp className="size-4.5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>
          Nuro provides supportive, non-clinical guidance and is not a
          replacement for professional help.
        </span>
        {value.length > MAX_MESSAGE_LENGTH * 0.8 ? (
          <span className={cn(overLimit && "font-medium text-destructive")}>
            {value.length}/{MAX_MESSAGE_LENGTH}
          </span>
        ) : null}
      </div>
    </div>
  );
}
