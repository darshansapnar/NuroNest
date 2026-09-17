"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { WHO5_QUESTIONS, WHO5_OPTIONS, calculateWHO5 } from "@/lib/assessments/who5";
import { saveAssessmentResult } from "@/lib/assessments/storage";
import { LikertQuestionnaire } from "@/components/assessment/likert-questionnaire";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssessmentModal({ isOpen, onClose }: AssessmentModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleComplete = (answers: Record<number, number>) => {
    const result = calculateWHO5(answers);
    saveAssessmentResult(result);
    onClose();
    router.push("/assessment/result/who5");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-[28px] border border-[#E5E8E1] bg-[#FBF9F4] p-6 shadow-xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-[#ECEFE6] text-[#4A5750] hover:bg-[#E2E6DD] hover:text-[#1C352D] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <LikertQuestionnaire questions={WHO5_QUESTIONS} options={WHO5_OPTIONS} onComplete={handleComplete} />
      </div>
    </div>
  );
}
