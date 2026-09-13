import Link from "next/link";
import { Heart, Leaf, Lock, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HeroImagePanel } from "@/components/landing/hero-image-panel";

const trustItems = [
  { icon: Leaf, label: "No account required" },
  { icon: Lock, label: "Private & secure" },
  { icon: Heart, label: "Always here for you" },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Container className="relative z-10 flex flex-col gap-8 py-12 sm:py-16 lg:min-h-[600px] lg:justify-center lg:py-24">
        <div className="flex flex-col items-start gap-5 text-left lg:max-w-md lg:pr-4">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            A calmer tomorrow
          </span>

          <h1 className="font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            Your mind deserves a softer place.
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            NuroNest is your personal space to talk, reflect, relax and take
            the next step in your mental wellness journey.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 px-6 text-base"
              nativeButton={false}
              render={<Link href="/ai-companion" />}
            >
              <MessageCircle data-icon="inline-start" aria-hidden="true" />
              Talk to Nuro
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 gap-2 px-6 text-base"
              nativeButton={false}
              render={<Link href="/#tools" />}
            >
              Explore Features
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
            {trustItems.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <item.icon className="size-4 text-primary" aria-hidden="true" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </Container>

      <HeroImagePanel />
    </section>
  );
}

export { HeroSection };
