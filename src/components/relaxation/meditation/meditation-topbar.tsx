"use client";

import Link from "next/link";
import { useUser, Show, UserButton } from "@clerk/nextjs";
import { Bell, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function MeditationTopbar() {
  const { user } = useUser();

  return (
    <div className="hidden items-center gap-4 lg:flex">
      <div className="relative max-w-md flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search meditations, topics or intentions..."
          aria-label="Search meditations, topics or intentions"
          className="h-10 rounded-full bg-card pl-9"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
      >
        <Bell aria-hidden="true" />
      </Button>

      <Show
        when="signed-in"
        fallback={
          <Button
            size="sm"
            className="shrink-0 rounded-full px-4"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Log In
          </Button>
        }
      >
        <div className="flex shrink-0 items-center gap-2">
          <UserButton />
          <span className="text-sm font-medium text-foreground">
            {user?.firstName ?? "Account"}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </div>
      </Show>
    </div>
  );
}

export { MeditationTopbar };
