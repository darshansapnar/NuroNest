"use client";

import { QuestionnairePage } from "@/components/assessment/questionnaire-page";
import { GAD7_OPTIONS, GAD7_QUESTIONS, calculateGAD7 } from "@/lib/assessments/gad7";

export default function Gad7Page() {
  return (
    <QuestionnairePage
      eyebrow="GAD-7 • Anxiety screening"
      description="Over the last 2 weeks, how often have you been bothered by any of the following problems?"
      questions={GAD7_QUESTIONS}
      options={GAD7_OPTIONS}
      calculate={calculateGAD7}
      resultRoute="/assessment/result/gad7"
    />
  );
}
