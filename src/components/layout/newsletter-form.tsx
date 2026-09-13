"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function NewsletterForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="flex items-center gap-2 text-sm text-secondary-foreground">
        <Check className="size-4 text-primary" aria-hidden="true" />
        You&apos;re on the list. Thank you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xs gap-2">
      <Input
        type="email"
        required
        placeholder="Your email"
        aria-label="Email address"
        className="h-10 rounded-full bg-background"
      />
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 shrink-0"
        aria-label="Subscribe"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}

export { NewsletterForm };
