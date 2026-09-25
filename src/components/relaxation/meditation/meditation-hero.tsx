import Image from "next/image";

import { MeditationIntentions } from "@/components/relaxation/meditation/meditation-intentions";

function MeditationHero() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl">
      <Image
        src="/images/meditation/hero.png"
        alt="A cozy meditation corner with a cushion, candle and mountain view at sunset"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/5"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 px-5 py-8 sm:px-8 sm:py-10 lg:max-w-2xl lg:py-12">
        <span className="text-xs font-medium tracking-wide text-white/85 uppercase">
          Meditation
        </span>
        <h1 className="font-heading text-2xl leading-tight font-semibold text-balance text-white sm:text-3xl lg:text-4xl">
          Find a quieter moment.
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
          Explore guided meditation practices designed to help you slow
          down, notice the present moment, and create a little space for
          yourself.
        </p>

        <MeditationIntentions />
      </div>
    </section>
  );
}

export { MeditationHero };
