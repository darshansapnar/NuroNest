"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, MessageCircle, Sparkles, X } from "lucide-react";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: 1,
    area: "Mood",
    text: "Over the past 2 weeks, how often have you felt cheerful, calm, or in good spirits?",
  },
  {
    id: 2,
    area: "Energy",
    text: "Over the past 2 weeks, how often have you felt active, energetic, and motivated?",
  },
  {
    id: 3,
    area: "Sleep",
    text: "Over the past 2 weeks, how often have you woken up feeling well-rested and refreshed?",
  },
  {
    id: 4,
    area: "Interest",
    text: "Over the past 2 weeks, how often have you felt interested and engaged in your daily life?",
  },
  {
    id: 5,
    area: "Overall Wellbeing",
    text: "Overall, how satisfied and at ease have you felt with your day-to-day life recently?",
  },
];

const options = [
  { label: "All of the time", score: 5 },
  { label: "Most of the time", score: 4 },
  { label: "More than half the time", score: 3 },
  { label: "Less than half the time", score: 2 },
  { label: "Some of the time", score: 1 },
  { label: "At no time", score: 0 },
];

export function AssessmentModal({ isOpen, onClose }: AssessmentModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];
  const selectedScore = answers[currentQuestion.id];

  const handleSelectOption = (score: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: score }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    onClose();
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    const percentage = Math.round((totalScore / 25) * 100);

    if (percentage >= 70) {
      return {
        level: "Positive Wellbeing",
        description:
          "Your responses suggest a generally positive and balanced state of wellbeing. Continuing your self-care practices can help maintain this rhythm.",
        color: "text-[#233E33]",
      };
    } else if (percentage >= 40) {
      return {
        level: "Moderate Wellbeing",
        description:
          "You may be experiencing some mild stress or fatigue. Taking time for relaxation, mindfulness, or sharing feelings with Nuro can be helpful.",
        color: "text-[#5A6E5A]",
      };
    } else {
      return {
        level: "Gentle Care Recommended",
        description:
          "Your responses indicate you might be going through a challenging period. Be gentle with yourself and consider speaking with a professional or trusted loved one.",
        color: "text-[#7A5230]",
      };
    }
  };

  const result = isCompleted ? calculateResult() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-[28px] border border-[#E5E8E1] bg-[#FBF9F4] p-6 shadow-xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-[#ECEFE6] text-[#4A5750] hover:bg-[#E2E6DD] hover:text-[#1C352D] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Header & Progress */}
            <div className="mb-6 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
                Question {currentIndex + 1} of {questions.length} • {currentQuestion.area}
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
        ) : (
          /* Completion Result View */
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#E9ECE4] text-[#233E33]">
              <Sparkles className="size-7" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
              Check-in Complete
            </span>

            <h3 className={`font-heading text-2xl font-normal sm:text-3xl mt-2 mb-3 ${result?.color}`}>
              {result?.level}
            </h3>

            <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-[#4A5750] mb-8">
              {result?.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link
                href="/ai-companion"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#233E33] px-6 py-3 text-sm font-medium text-white hover:bg-[#192E26] transition-colors"
              >
                <MessageCircle className="size-4" />
                <span>Talk to Nuro AI</span>
              </Link>
              <Link
                href="/professionals"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] hover:bg-[#F4F6F0] transition-colors"
              >
                <Heart className="size-4" />
                <span>Find Professionals</span>
              </Link>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-[#5A6E5A] hover:underline cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
