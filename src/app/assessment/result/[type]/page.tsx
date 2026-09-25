"use client";

import { use, useCallback } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Container } from "@/components/layout/container";
import { AssessmentResultBackground } from "@/components/assessment/assessment-result-background";
import { AssessmentResultCard } from "@/components/assessment/assessment-result-card";
import { ASSESSMENTS } from "@/lib/assessments/registry";
import { clearAssessmentResult, loadAssessmentResult, subscribeAssessmentResults } from "@/lib/assessments/storage";
import type { AssessmentType } from "@/lib/assessments/types";

const VALID_TYPES: AssessmentType[] = ["who5", "gad7", "phq9", "pss10", "psqi"];

export default function AssessmentResultPage(props: PageProps<"/assessment/result/[type]">) {
  const { type: rawType } = use(props.params);

  if (!VALID_TYPES.includes(rawType as AssessmentType)) {
    notFound();
  }
  const type = rawType as AssessmentType;

  const router = useRouter();

  const getSnapshot = useCallback(() => loadAssessmentResult(type), [type]);
  const result = useSyncExternalStore(subscribeAssessmentResults, getSnapshot, () => null);

  const handleRetake = () => {
    clearAssessmentResult(type);
    router.push(ASSESSMENTS[type].route);
  };

  if (!result) {
    return (
      <div className="min-h-screen text-[#1C352D]">
        <AssessmentResultBackground />
        <Container className="flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="font-heading text-2xl font-normal sm:text-3xl">No result to show yet</h1>
          <p className="max-w-md text-sm leading-relaxed text-[#4A5750] sm:text-base">
            We couldn&apos;t find a completed {ASSESSMENTS[type].label} check-in. Take a couple of minutes to
            answer the questions and we&apos;ll put together your snapshot.
          </p>
          <Link
            href={ASSESSMENTS[type].route}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#233E33] px-6 py-3 text-sm font-medium text-white hover:bg-[#192E26] transition-colors"
          >
            Start the check-in
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1C352D]">
      <AssessmentResultBackground />
      <Container className="py-10 sm:py-14">
        <AssessmentResultCard result={result} onRetake={handleRetake} />
      </Container>
    </div>
  );
}
