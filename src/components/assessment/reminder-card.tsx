import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export function ReminderCard() {
  return (
    <section className="py-8 sm:py-12">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] border border-[#DCE2D6] bg-[#ECEFE6] p-6 sm:p-8 md:flex-row md:items-center lg:p-10">
        {/* Left Side: Shield Icon + Text */}
        <div className="flex items-start gap-5 sm:gap-6">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#DFE4D8] text-[#233E33] sm:size-16">
            <Shield className="size-7 text-[#233E33]" aria-hidden="true" />
          </div>

          <div className="flex flex-col">
            <h3 className="font-heading text-xl font-medium text-[#1C352D] sm:text-2xl">
              A gentle reminder
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#4A5750] sm:text-base">
              This check-in is for self-reflection and does not provide a medical
              diagnosis. If you&apos;re going through a difficult time, consider
              reaching out to a qualified mental health professional.
            </p>
          </div>
        </div>

        {/* Right Side: Professional Support CTA */}
        <div className="w-full shrink-0 md:w-auto">
          <Link
            href="/professionals"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C8CEBE] bg-white px-6 py-3 text-sm font-medium text-[#1C352D] shadow-xs transition-all duration-200 hover:bg-[#F4F6F0] hover:shadow-sm sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
          >
            <span>Talk to a Professional</span>
            <ArrowRight className="size-4 sm:size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
