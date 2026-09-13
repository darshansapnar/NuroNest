import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

function CtaBannerSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src="/images/calmer.png"
            alt="A wide mountain and lake landscape at sunrise"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/40" aria-hidden="true" />

          <div className="relative flex flex-col items-center gap-5 px-6 py-20 text-center sm:py-28">
            <h2 className="font-heading max-w-xl text-3xl font-semibold text-balance text-white sm:text-4xl">
              A calmer, brighter you is possible.
            </h2>
            <p className="max-w-md text-base text-white/90">
              Take the first step today. No account required.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-6 text-base text-foreground"
                nativeButton={false}
                render={<Link href="/ai-companion" />}
              >
                Talk to Nuro
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href="/#tools" />}
              >
                Explore All Features
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { CtaBannerSection };
