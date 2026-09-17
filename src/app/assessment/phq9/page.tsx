"use client";

import { QuestionnairePage } from "@/components/assessment/questionnaire-page";
import { PHQ9_OPTIONS, PHQ9_QUESTIONS, calculatePHQ9 } from "@/lib/assessments/phq9";

export default function Phq9Page() {
  return (
    <QuestionnairePage
      eyebrow="PHQ-9 • Mood screening"
      description="Over the last 2 weeks, how often have you been bothered by any of the following problems?"
      questions={PHQ9_QUESTIONS}
      options={PHQ9_OPTIONS}
      calculate={calculatePHQ9}
      resultRoute="/assessment/result/phq9"
    />
  );
}
