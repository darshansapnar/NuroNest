import Image from "next/image";

import { SleepChips } from "@/components/relaxation/sleep/sleep-chips";

function SleepHero({
  selectedIntentId,
  onSelectIntent,
}: {
  selectedIntentId: string | null;
  onSelectIntent: (id: string | null) => void;
}) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl ring-1 ring-foreground/5">
      <Image
        src="/images/sleep-support/header.png"
        alt="A moonlit mountain valley seen through a bedroom window, with a warm bedside lamp glowing beside the bed"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/90 via-[#0b1220]/55 to-[#0b1220]/10"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-3 px-5 py-8 sm:gap-4 sm:px-8 sm:py-10 lg:max-w-xl lg:py-12">
        <span className="text-xs font-medium tracking-widest text-white/80 uppercase">
          Sleep Support
        </span>
        <h1 className="font-heading text-2xl leading-tight font-semibold text-balance text-white sm:text-3xl lg:text-4xl">
          Let the day become quieter.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          Create a gentle wind-down routine with calming sounds and simple
          practices for a more restful night.
        </p>

        <div className="mt-1">
          <SleepChips selectedId={selectedIntentId} onSelect={onSelectIntent} />
        </div>
      </div>
    </section>
  );
}

export { SleepHero };
