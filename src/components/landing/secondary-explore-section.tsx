import { BookOpen, Stethoscope } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureCard } from "@/components/shared/feature-card";

function SecondaryExploreSection() {
  return (
    <section className="pb-16 sm:pb-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Keep exploring"
          title="More ways to take care of yourself"
          align="left"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FeatureCard
            icon={Stethoscope}
            tone="blue"
            title="Find a Mental Health Professional"
            description="Search and filter psychologists, psychiatrists, and counselors by specialization, location, and availability."
            href="/professionals"
            ctaLabel="Search professionals"
          />
          <FeatureCard
            icon={BookOpen}
            tone="green"
            title="Wellness Resources"
            description="Browse articles, videos, guides, and coping strategies on anxiety, stress, sleep, and self-care."
            href="/resources"
            ctaLabel="Browse resources"
          />
        </div>
      </Container>
    </section>
  );
}

export { SecondaryExploreSection };
