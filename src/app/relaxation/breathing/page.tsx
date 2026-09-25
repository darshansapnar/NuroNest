import type { Metadata } from "next";

import { BreathingPage } from "@/components/relaxation/breathing/breathing-page";

export const metadata: Metadata = {
  title: "Breathing Exercises — NuroNest",
  description:
    "Simple guided breathing exercises to help you pause, settle your breathing, and create a moment of calm.",
};

export default function Page() {
  return <BreathingPage />;
}
