import type { Metadata } from "next";

import { SleepPage } from "@/components/relaxation/sleep/sleep-page";

export const metadata: Metadata = {
  title: "Sleep Support — NuroNest",
  description:
    "Create a gentle wind-down routine with calming sounds and simple practices for a more restful night.",
};

export default function Page() {
  return <SleepPage />;
}
