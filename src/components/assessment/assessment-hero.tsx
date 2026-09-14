"use client";

import Image from "next/image";
import { ArrowRight, Clock, FileText, Leaf } from "lucide-react";

interface AssessmentHeroProps {
  onBeginCheckIn: () => void;
}

export function AssessmentHero({ onBeginCheckIn }: AssessmentHeroProps) {
  return (
    <section className="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        {/* Left Side: Copy & Actions */}
        <div className="flex flex-col items-start lg:col-span-6 xl:col-span-6">
          <span className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
            Wellbeing Check-in
          </span>

          <h1 className="font-heading text-4xl font-normal leading-[1.12] tracking-tight text-[#1C352D] sm:text-5xl sm:leading-[1.1] lg:text-[52px] xl:text-[58px]">
            How have you been
            <br />
            feeling lately?
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#4A5750] sm:text-lg sm:leading-relaxed">
            Take a few minutes to reflect on your wellbeing. There are no right or
            wrong answers — just answer based on how you’ve been feeling recently.
          </p>

          {/* Info Badge Row */}
          <div className="my-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-[#233E33] sm:gap-x-8 sm:text-base">
            <div className="flex items-center gap-2">
              <Clock className="size-4.5 text-[#233E33] sm:size-5" aria-hidden="true" />
              <span>2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="size-4.5 text-[#233E33] sm:size-5" aria-hidden="true" />
              <span>5 questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="size-4.5 text-[#233E33] sm:size-5" aria-hidden="true" />
              <span>Self-reflection</span>
            </div>
          </div>

          {/* Action Button & Privacy Text */}
          <div className="flex flex-col items-start gap-3">
            <button
              onClick={onBeginCheckIn}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#233E33] px-8 py-3.5 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#192E26] hover:shadow-md active:scale-[0.99] sm:px-9 sm:py-4 sm:text-lg cursor-pointer"
            >
              <span>Begin check-in</span>
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>

            <p className="pl-1 text-xs text-[#66746E] sm:text-sm">
              Your responses are private and secure.
            </p>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#E5E8E1] shadow-xs sm:aspect-[1.2/1] sm:rounded-[36px]">
            <Image
              src="/images/assessment-hero.png"
              alt="A peaceful desk setup with stacked books titled A Calmer Mind, A Kinder You, A Brighter Tomorrow, and a thriving green houseplant next to a window"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
