"use client";

import { QuestionnairePage } from "@/components/assessment/questionnaire-page";
import { PSS10_OPTIONS, PSS10_QUESTIONS, calculatePSS10 } from "@/lib/assessments/pss10";

export default function Pss10Page() {
  return (
    <QuestionnairePage
      eyebrow="PSS-10 • Stress screening"
      description="In the last month, how often have you felt or experienced each of the following?"
      questions={PSS10_QUESTIONS}
      options={PSS10_OPTIONS}
      calculate={calculatePSS10}
      resultRoute="/assessment/result/pss10"
    />
  );
}
