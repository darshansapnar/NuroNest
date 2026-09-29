import type { Metadata } from "next";

import { MindfulResetPage } from "@/components/relaxation/mindful-reset/mindful-reset-page";

export const metadata: Metadata = {
  title: "Mindful Reset — NuroNest",
  description:
    "Guided practices to release tension, reconnect with your body, and return to the present moment.",
};

export default function Page() {
  return <MindfulResetPage />;
}
