"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PsqiQuestionnaire } from "@/components/assessment/psqi-questionnaire";
import { calculatePSQI, type PsqiAnswers } from "@/lib/assessments/psqi";
import { saveAssessmentResult } from "@/lib/assessments/storage";

export default function PsqiPage() {
  const router = useRouter();

  const handleComplete = (answers: PsqiAnswers) => {
    const result = calculatePSQI(answers);
    saveAssessmentResult(result);
    router.push("/assessment/result/psqi");
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1C352D]">
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-xl">
          <Link
            href="/assessment"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#4A5750] hover:text-[#1C352D]"
          >
            <ArrowLeft className="size-4" />
            Back to Assessment
          </Link>

          <div className="rounded-[28px] border border-[#E5E8E1] bg-white p-6 shadow-xs sm:p-8">
            <div className="mb-6">
              <h1 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
                PSQI • Sleep quality screening
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#4A5750]">
                The following questions relate to your usual sleep habits during the past month only.
              </p>
            </div>

            <PsqiQuestionnaire onComplete={handleComplete} />
          </div>
        </div>
      </Container>
    </div>
  );
}
