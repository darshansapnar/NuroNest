import { ClipboardCheck, Clock, HeartHandshake, Lock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureCard } from "@/components/shared/feature-card";

const valueProps = [
  {
    icon: Lock,
    tone: "purple" as const,
    title: "Private by default",
    description:
      "Chat, screen, and relax without creating an account. Your journal and conversations are never shown to other users.",
  },
  {
    icon: ClipboardCheck,
    tone: "blue" as const,
    title: "Evidence-informed screenings",
    description:
      "Trusted tools like GAD-7, PHQ-9, and WHO-5 give you a clear snapshot of how you're doing — always a screening, never a diagnosis.",
  },
  {
    icon: Clock,
    tone: "green" as const,
    title: "Support whenever you need it",
    description:
      "Your AI companion is available any time you want to talk, reflect, or find a calmer moment — no waiting room required.",
  },
  {
    icon: HeartHandshake,
    tone: "amber" as const,
    title: "A path to real human help",
    description:
      "When it's time for more support, discover psychologists, psychiatrists, and counselors ready to help.",
  },
];

function ValuePropsSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Why NuroNest"
          title="Support that meets you where you are"
          description="NuroNest blends calm, everyday wellness tools with a clear path to professional care — never presenting itself as a substitute for medical diagnosis or treatment."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop) => (
            <FeatureCard key={prop.title} {...prop} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export { ValuePropsSection };
