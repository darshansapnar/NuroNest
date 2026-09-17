"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Heart, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { ScoreGauge } from "@/components/assessment/score-gauge";
import { ScoreRangeCard } from "@/components/assessment/score-range-card";
import { SafetyResultState } from "@/components/assessment/safety-result-state";
import { ASSESSMENTS, EXPLORATION_OPTIONS, TARGETED_ASSESSMENT_TYPES } from "@/lib/assessments/registry";
import { getRecommendations, getResultActions } from "@/lib/assessments/recommendations";
import { SCORE_RANGES } from "@/lib/assessments/ranges";
import { isSafetyTriggered } from "@/lib/assessments/safety";
import { isPsqiResult, type AnyAssessmentResult } from "@/lib/assessments/types";

const ACTION_ICONS: Record<string, typeof MessageCircle> = {
  "talk-to-nuro": MessageCircle,
  "professional-support": Heart,
};

const PSQI_COMPONENT_LABELS: Record<string, string> = {
  subjectiveSleepQuality: "Overall sleep quality",
  sleepLatency: "Time to fall asleep",
  sleepDuration: "Hours of sleep",
  sleepEfficiency: "Restful sleep",
  sleepDisturbances: "Sleep interruptions",
  sleepMedication: "Use of sleep aids",
  daytimeDysfunction: "Daytime tiredness",
};

interface AssessmentResultCardProps {
  result: AnyAssessmentResult;
  onRetake: () => void;
}

/**
 * Reusable NuroNest assessment result presentation — same layout for every
 * screening (WHO-5, GAD-7, PHQ-9, PSS-10, PSQI). All interpretation copy and
 * recommendation logic is computed elsewhere (scoring modules + the
 * centralized recommendation service); this component only renders it.
 */
export function AssessmentResultCard({ result, onRetake }: AssessmentResultCardProps) {
  const [showBrowseHint, setShowBrowseHint] = useState(false);

  // Safety takes over the entire result screen — ordinary wellness
  // recommendations, score details, and branching prompts never render
  // alongside it.
  if (isSafetyTriggered(result)) {
    return <SafetyResultState result={result} />;
  }

  const meta = ASSESSMENTS[result.assessmentType];

  const recommendations = getRecommendations({
    assessmentType: result.assessmentType,
    score: result.rawScore,
    level: result.levelKey,
    safetyFlag: result.safetyFlag,
    suggestProfessionalSupport: result.suggestProfessionalSupport,
  });
  const actions = getResultActions({
    assessmentType: result.assessmentType,
    score: result.rawScore,
    level: result.levelKey,
    safetyFlag: result.safetyFlag,
    suggestProfessionalSupport: result.suggestProfessionalSupport,
  });

  const showProfessionalNote = result.suggestProfessionalSupport;
  const showExplorationPrompt = result.assessmentType === "who5" && result.suggestFurtherExploration;
  const otherTargetedAssessments = TARGETED_ASSESSMENT_TYPES.filter((type) => type !== result.assessmentType);
  const showTakeAnotherCheckIn = result.assessmentType !== "who5";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header + Score (one clear read, no repeated explanations) */}
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-[#E9ECE4] text-[#233E33]">
          <Sparkles className="size-6" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
          {meta.resultEyebrow}
        </span>
        <h1 className="font-heading text-3xl font-normal leading-tight text-[#1C352D] sm:text-4xl">
          {result.snapshotTitle}
        </h1>
      </div>

      <div className="mb-8 flex flex-col items-center gap-8 rounded-[28px] border border-[#E5E8E1] bg-white p-8 shadow-xs sm:flex-row sm:gap-10 sm:p-10">
        <ScoreGauge rawScore={result.rawScore} maxScore={result.maxScore} tone={result.tone} />
        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <span className="rounded-full bg-[#ECEFE6] px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#233E33]">
            {result.level}
          </span>
          <p className="text-sm leading-relaxed text-[#4A5750] sm:text-base">{result.interpretation}</p>
        </div>
      </div>

      {/* Understanding your score */}
      <ScoreRangeCard ranges={SCORE_RANGES[result.assessmentType]} currentScore={result.rawScore} />

      {/* Recommendations — short, simple cards */}
      <div className="mb-8 rounded-[28px] border border-[#E5E8E1] bg-white p-6 shadow-xs sm:p-8">
        <h2 className="font-heading text-lg font-normal text-[#1C352D] sm:text-xl mb-5">A few gentle ideas</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.kind}
              className="rounded-xl border border-[#E5E8E1] bg-[#FBF9F4] p-4"
            >
              <p className="mb-1 font-medium text-sm text-[#1C352D] sm:text-base">{recommendation.title}</p>
              <p className="text-sm leading-relaxed text-[#5A6860]">{recommendation.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional support — one short, calm note, never repeated elsewhere */}
      {showProfessionalNote && (
        <div className="mb-8 rounded-[28px] border border-[#E5E8E1] bg-[#ECEFE6] p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-[#1C352D] sm:text-base">
            If things have felt hard to manage, talking with a mental health professional can help.
          </p>
        </div>
      )}

      {/* PSQI component breakdown — extra detail for anyone curious, kept brief */}
      {isPsqiResult(result) && (
        <div className="mb-8 rounded-[28px] border border-[#E5E8E1] bg-white p-6 shadow-xs sm:p-8">
          <h2 className="font-heading text-lg font-normal text-[#1C352D] sm:text-xl mb-5">A closer look at your sleep</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(result.components).map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between rounded-xl border border-[#E5E8E1] bg-[#FBF9F4] px-4 py-3 text-sm text-[#1C352D]"
              >
                <span>{PSQI_COMPONENT_LABELS[key] ?? key}</span>
                <span className="font-semibold">{value} / 3</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* WHO-5 branching: explore what's been affecting you */}
      {showExplorationPrompt && (
        <div className="mb-8 rounded-[28px] border border-[#E5E8E1] bg-white p-6 shadow-xs sm:p-8">
          <h2 className="font-heading text-lg font-normal text-[#1C352D] sm:text-xl mb-2">
            Want to explore what&apos;s been affecting you?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[#4A5750] sm:text-base">
            Totally optional — pick whatever feels closest, or skip it for now.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXPLORATION_OPTIONS.map((option) => (
              <Link
                key={option.type}
                href={ASSESSMENTS[option.type].route}
                className="flex flex-col gap-1 rounded-xl border border-[#E5E8E1] bg-[#FBF9F4] p-4 transition-colors hover:border-[#CBD4C5] hover:bg-[#F5F7F2]"
              >
                <span className="font-medium text-[#1C352D]">{option.label}</span>
                <span className="text-sm text-[#5A6860]">{option.description}</span>
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setShowBrowseHint(true)}
              className="flex flex-col items-start gap-1 rounded-xl border border-dashed border-[#CBD4C5] bg-white p-4 text-left transition-colors hover:border-[#233E33] cursor-pointer"
            >
              <span className="font-medium text-[#1C352D]">I&apos;m not sure</span>
              <span className="text-sm text-[#5A6860]">That&apos;s okay — no need to decide right now.</span>
            </button>
          </div>
          {showBrowseHint && (
            <p className="mt-4 text-sm leading-relaxed text-[#4A5750]">
              No problem — the areas above are here whenever you feel ready.
            </p>
          )}
        </div>
      )}

      {/* Take another relevant check-in (targeted results only) */}
      {showTakeAnotherCheckIn && (
        <div className="mb-8 rounded-[28px] border border-[#E5E8E1] bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Compass className="size-5 text-[#5A6E5A]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-normal text-[#1C352D] sm:text-xl">
              Want to check in on something else?
            </h2>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-[#4A5750] sm:text-base">
            Entirely optional — only if it feels useful.
          </p>
          <div className="flex flex-wrap gap-3">
            {otherTargetedAssessments.map((type) => (
              <Link
                key={type}
                href={ASSESSMENTS[type].route}
                className="rounded-full border border-[#E5E8E1] bg-[#FBF9F4] px-4 py-2 text-sm font-medium text-[#1C352D] transition-colors hover:border-[#CBD4C5] hover:bg-[#F5F7F2]"
              >
                {ASSESSMENTS[type].fullName}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        {actions.map((action, index) => {
          const Icon = ACTION_ICONS[action.kind] ?? MessageCircle;
          const isPrimary = index === 0;
          return (
            <Link
              key={action.kind}
              href={action.href}
              className={
                isPrimary
                  ? "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#233E33] px-6 py-3 text-sm font-medium text-white hover:bg-[#192E26] transition-colors"
                  : "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] hover:bg-[#F4F6F0] transition-colors"
              }
            >
              <Icon className="size-4" />
              <span>{action.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onRetake}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] hover:bg-[#F4F6F0] transition-colors cursor-pointer"
        >
          <RotateCcw className="size-4" />
          <span>Retake this check-in</span>
        </button>
        <Link
          href="/assessment"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] hover:bg-[#F4F6F0] transition-colors"
        >
          <span>Return to Assessment Hub</span>
        </Link>
      </div>

      {/* Disclaimer — short and subtle */}
      <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-[#8A9690]">
        This result is only a snapshot of how you&apos;ve been feeling. It isn&apos;t a diagnosis.
      </p>
    </div>
  );
}
