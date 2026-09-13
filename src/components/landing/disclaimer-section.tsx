import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";

function DisclaimerSection() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl bg-secondary/60 p-6 ring-1 ring-border sm:flex-row sm:items-center sm:p-8">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary ring-1 ring-border">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-secondary-foreground sm:text-base">
            NuroNest is a mental wellness and screening platform, not a
            medical diagnosis system. Assessments and AI conversations are
            self-help tools, not a substitute for professional evaluation. If
            you&apos;re in crisis, please reach out to local emergency
            services or a crisis helpline right away.
          </p>
        </div>
      </Container>
    </section>
  );
}

export { DisclaimerSection };
