import Link from "next/link";
import { Heart, HeartHandshake, LifeBuoy, MessageCircle } from "lucide-react";
import { getResultActions } from "@/lib/assessments/recommendations";
import { getSafetyGuidance } from "@/lib/assessments/safety";
import type { AnyAssessmentResult } from "@/lib/assessments/types";

const ACTION_ICONS: Record<string, typeof MessageCircle> = {
  "talk-to-nuro": MessageCircle,
  "professional-support": Heart,
};

interface SafetyResultStateProps {
  result: AnyAssessmentResult;
}

/**
 * Dedicated safety result screen. Rendered by AssessmentResultCard INSTEAD
 * OF the normal score/interpretation/recommendation layout whenever
 * isSafetyTriggered(result) is true — ordinary wellness recommendations
 * never appear alongside this state, by design.
 */
export function SafetyResultState({ result }: SafetyResultStateProps) {
  const guidance = getSafetyGuidance();
  const actions = getResultActions({
    assessmentType: result.assessmentType,
    score: result.rawScore,
    level: result.levelKey,
    safetyFlag: true,
    suggestProfessionalSupport: true,
  });

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="mb-1 flex size-14 items-center justify-center rounded-full bg-[#ECEFE6] text-[#233E33]">
          <HeartHandshake className="size-7" aria-hidden="true" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
          {result.assessmentLabel} check-in
        </span>
        <h1 className="font-heading text-3xl font-normal leading-tight text-[#1C352D] sm:text-4xl">
          {guidance.headline}
        </h1>
      </div>

      {/* Acknowledgement + guidance */}
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-[#E5E8E1] bg-white p-8 shadow-xs sm:p-10">
        <p className="text-sm leading-relaxed text-[#1C352D] sm:text-base">{guidance.acknowledgement}</p>
        <p className="text-sm leading-relaxed text-[#4A5750] sm:text-base">{guidance.guidance}</p>
        <p className="text-xs text-[#8A9690]">{guidance.notEmergencyServiceNotice}</p>
      </div>

      {/* Crisis resources */}
      <div className="mb-8 flex items-start gap-3 rounded-[28px] border border-[#E7C8C0] bg-[#FBEBE7] p-6 text-[#7A3226] sm:p-8">
        <LifeBuoy className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div className="text-sm leading-relaxed sm:text-base">
          <p className="mb-3">
            If you&apos;re thinking about harming yourself or are in immediate danger, please contact emergency
            services or a crisis line right away:
          </p>
          <ul className="flex flex-col gap-1 font-medium">
            <li>
              {guidance.crisisResources.emergencyLabel}: {guidance.crisisResources.emergencyNumber}
            </li>
            {guidance.crisisResources.helplines.map((helpline) => (
              <li key={helpline.label}>
                {helpline.label}: {helpline.numbers.join(" / ")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        {actions.map((action, index) => {
          const Icon = ACTION_ICONS[action.kind] ?? MessageCircle;
          return (
            <Link
              key={action.kind}
              href={action.href}
              className={
                index === 0
                  ? "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#233E33] px-6 py-3 text-sm font-medium text-white hover:bg-[#192E26] transition-colors"
                  : "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] hover:bg-[#F4F6F0] transition-colors"
              }
            >
              <Icon className="size-4" />
              <span>{action.label}</span>
            </Link>
          );
        })}
        <Link
          href="/assessment"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] hover:bg-[#F4F6F0] transition-colors"
        >
          <span>Return to Assessment Hub</span>
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-[#8A9690]">
        {result.assessmentLabel} is a brief self-reflection screening tool. It is not a diagnostic instrument and
        it does not determine risk on its own — it does not replace a professional evaluation.
      </p>
    </div>
  );
}
