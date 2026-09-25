import type { Metadata } from "next";

import { MeditationPage } from "@/components/relaxation/meditation/meditation-page";

export const metadata: Metadata = {
  title: "Meditation — NuroNest",
  description:
    "Guided meditation practices to help you slow down, notice the present moment, and create a little space for yourself.",
};

export default function Page() {
  return <MeditationPage />;
}
