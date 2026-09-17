"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { AssessmentOption, AssessmentQuestion } from "@/lib/assessments/types";

interface LikertQuestionnaireProps {
  questions: AssessmentQuestion[];
  options: AssessmentOption[];
  onComplete: (answers: Record<number, number>) => void;
}

/**
 * Shared single-select question flow (progress bar, question text, option
 * list, prev/next nav) used by every Likert-style screening — WHO-5, GAD-7,
 * PHQ-9, PSS-10. Extracted from the original WHO-5 modal so its visual
 * design and interaction stay identical across assessments.
 */
export function LikertQuestionnaire({ questions, options, onComplete }: LikertQuestionnaireProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestion = questions[currentIndex];
  const selectedScore = answers[currentQuestion.id];

  const handleSelectOption = (score: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: score }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    onComplete(answers);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div>
      {/* Header & Progress */}
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
          Question {currentIndex + 1} of {questions.length}
          {currentQuestion.area ? ` • ${currentQuestion.area}` : ""}
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E8E1]">
          <div
            className="h-full bg-[#233E33] transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Text */}
      <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl mb-6">
        {currentQuestion.text}
      </h3>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-8">
        {options.map((opt) => {
          const isSelected = selectedScore === opt.score;
          return (
            <button
              key={opt.score}
              onClick={() => handleSelectOption(opt.score)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left font-medium text-sm sm:text-base transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "border-[#233E33] bg-[#233E33] text-white shadow-xs"
                  : "border-[#E5E8E1] bg-white text-[#1C352D] hover:border-[#CBD4C5] hover:bg-[#F5F7F2]"
              }`}
            >
              <span>{opt.label}</span>
              {isSelected && <CheckCircle2 className="size-5 text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5E8E1]">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4A5750] disabled:opacity-40 hover:text-[#1C352D] cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="size-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={selectedScore === undefined}
          className="inline-flex items-center gap-2 rounded-full bg-[#233E33] px-6 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50 hover:bg-[#192E26] cursor-pointer disabled:cursor-not-allowed"
        >
          <span>{currentIndex === questions.length - 1 ? "See Results" : "Next"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
