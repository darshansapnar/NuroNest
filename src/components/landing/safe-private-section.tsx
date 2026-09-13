import Image from "next/image";
import Link from "next/link";
import { EyeOff, Lock, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: Lock, label: "Your data stays private" },
  { icon: EyeOff, label: "You're in control" },
  { icon: ShieldCheck, label: "A safe and respectful space" },
];

function SafePrivateSection() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-border">
          <Image
            src="/images/privacy-bg.png"
            alt=""
            fill
            aria-hidden="true"
            sizes="100vw"
            className="object-cover"
          />
          <div className="relative flex flex-col gap-8 px-6 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="text-sm font-medium tracking-wide text-primary uppercase">
                Your privacy matters
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
                A safe and private space, always.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Explore at your own pace. Create an account only when
                you&apos;re ready.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
                {trustItems.map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1.5 text-sm text-foreground"
                  >
                    <item.icon
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-fit shrink-0 bg-background px-6"
              nativeButton={false}
              render={<Link href="/privacy" />}
            >
              Learn about your privacy
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { SafePrivateSection };
