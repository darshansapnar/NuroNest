import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMeditationBySlug, meditations } from "@/data/meditations";
import { MeditationDetail } from "@/components/relaxation/meditation/meditation-detail";

export function generateStaticParams() {
  return meditations.map((meditation) => ({ slug: meditation.slug }));
}

export async function generateMetadata(
  props: PageProps<"/relaxation/meditation/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const meditation = getMeditationBySlug(slug);

  if (!meditation) {
    return { title: "Meditation — NuroNest" };
  }

  return {
    title: `${meditation.title} — NuroNest`,
    description: meditation.shortDescription,
  };
}

export default async function Page(
  props: PageProps<"/relaxation/meditation/[slug]">,
) {
  const { slug } = await props.params;
  const meditation = getMeditationBySlug(slug);

  if (!meditation) {
    notFound();
  }

  return <MeditationDetail meditation={meditation} />;
}
