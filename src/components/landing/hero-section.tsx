import Link from "next/link";
import { ClipboardList, Lock, MessageCircle, Wind } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const ctaButtonClass =
  "h-12 gap-2 rounded-xl px-6 text-base has-data-[icon=inline-start]:pl-5";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[36rem] overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 size-[28rem] -translate-x-[70%] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute left-1/2 top-10 size-[24rem] -translate-x-[10%] rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute left-1/2 top-40 size-[22rem] -translate-x-[40%] rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <Badge
          variant="secondary"
          className="h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
        >
          <Lock className="size-3" aria-hidden="true" />
          Anonymous &amp; private by default
        </Badge>

        <h1 className="font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {siteConfig.name}
        </h1>

        <p className="text-xl font-medium text-primary sm:text-2xl">
          {siteConfig.tagline}
        </p>

        <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {siteConfig.description}
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button
            size="lg"
            className={ctaButtonClass}
            nativeButton={false}
            render={<Link href="/ai-companion" />}
          >
            <MessageCircle data-icon="inline-start" aria-hidden="true" />
            Talk to AI
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={ctaButtonClass}
            nativeButton={false}
            render={<Link href="/assessment" />}
          >
            <ClipboardList data-icon="inline-start" aria-hidden="true" />
            Mental Health Assessment
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={ctaButtonClass}
            nativeButton={false}
            render={<Link href="/relaxation" />}
          >
            <Wind data-icon="inline-start" aria-hidden="true" />
            Relaxation Hub
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          No sign-up required to start. Create a free account anytime to save
          your progress.
        </p>
      </Container>
    </section>
  );
}

export { HeroSection };
