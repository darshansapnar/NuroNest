import Image from "next/image";
import {
  BookOpen,
  ClipboardCheck,
  MessageCircle,
  User,
  Wind,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureCard } from "@/components/shared/feature-card";

const primaryTools = [
  {
    icon: MessageCircle,
    tone: "blue" as const,
    title: "Talk to Nuro",
    description:
      "A supportive, judgment-free space to talk about what's on your mind. Get gentle guidance or just someone to listen.",
    href: "/ai-companion",
    ctaLabel: "Start a conversation",
    image: "/images/nuro.png",
    alt: "A chat message from Nuro asking how you're feeling, in a cozy sunlit room",
  },
  {
    icon: ClipboardCheck,
    tone: "green" as const,
    title: "Assessments",
    description:
      "Evidence-based tools to help you understand your thoughts, feelings and mental wellbeing.",
    href: "/assessment",
    ctaLabel: "Take an assessment",
    image: "/images/assessments.png",
    alt: "An open reflection journal with a pen, resting on a wooden desk",
  },
  {
    icon: Wind,
    tone: "purple" as const,
    title: "Relaxation Hub",
    description:
      "Guided meditations, breathing exercises and sleep sounds to help you unwind and feel better.",
    href: "/relaxation",
    ctaLabel: "Find your calm",
    image: "/images/relaxation.png",
    alt: "A calm mountain lake with a wooden dock at sunrise",
  },
];

const secondaryTools = [
  {
    icon: BookOpen,
    tone: "amber" as const,
    title: "Wellness Resources",
    description:
      "Articles, videos and practical guides to help you learn, reflect and grow at your own pace.",
    href: "/resources",
    ctaLabel: "Explore resources",
    image: "/images/wellness.png",
    alt: "A stack of books beside a potted plant in a sunlit reading corner",
  },
  {
    icon: User,
    tone: "blue" as const,
    title: "Professionals",
    description:
      "Find trusted psychologists, psychiatrists and counselors when you're ready for personalized support.",
    href: "/professionals",
    ctaLabel: "Browse professionals",
    image: "/images/professionals.png",
    alt: "A comfortable reading chair beside a large window overlooking mountains",
  },
];

function ExploreToolsSection() {
  return (
    <section id="tools" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Explore NuroNest"
          title="Tools for your mental wellbeing"
          description="Support, guidance and resources — all in one peaceful space."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {primaryTools.map((tool) => (
            <FeatureCard
              key={tool.title}
              icon={tool.icon}
              tone={tool.tone}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              ctaLabel={tool.ctaLabel}
              className="lg:col-span-2"
              media={
                <Image
                  src={tool.image}
                  alt={tool.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              }
            />
          ))}
          {secondaryTools.map((tool) => (
            <FeatureCard
              key={tool.title}
              icon={tool.icon}
              tone={tool.tone}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              ctaLabel={tool.ctaLabel}
              className="lg:col-span-3"
              media={
                <Image
                  src={tool.image}
                  alt={tool.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export { ExploreToolsSection };
