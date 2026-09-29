import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getMindfulResetActivityById,
  mindfulResetActivities,
} from "@/data/mindful-reset";
import { MindfulResetActivityDetail } from "@/components/relaxation/mindful-reset/mindful-reset-activity-detail";

export function generateStaticParams() {
  return mindfulResetActivities.map((activity) => ({ activityId: activity.id }));
}

export async function generateMetadata(
  props: PageProps<"/relaxation/mindful-reset/[activityId]">,
): Promise<Metadata> {
  const { activityId } = await props.params;
  const activity = getMindfulResetActivityById(activityId);

  if (!activity) {
    return { title: "Mindful Reset — NuroNest" };
  }

  return {
    title: `${activity.title} — NuroNest`,
    description: activity.description,
  };
}

export default async function Page(
  props: PageProps<"/relaxation/mindful-reset/[activityId]">,
) {
  const { activityId } = await props.params;
  const activity = getMindfulResetActivityById(activityId);

  if (!activity) {
    notFound();
  }

  // Icons are rendered here (server) and passed down as an element,
  // rather than passing the `icon` component reference through the
  // client-component boundary — see MindfulResetActivityDetail's doc.
  const { icon: Icon, ...activityWithoutIcon } = activity;

  return (
    <MindfulResetActivityDetail
      activity={activityWithoutIcon}
      icon={<Icon className="size-6" aria-hidden="true" />}
    />
  );
}
