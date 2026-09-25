import Image from "next/image";

function RelaxationHero() {
  return (
    <section>
      <div className="relative h-40 w-full overflow-hidden rounded-2xl ring-1 ring-foreground/5 sm:h-48 lg:h-56">
        <Image
          src="/images/relaxation-hub/hero.png"
          alt="Sunrise over misty mountains and a forest valley"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent"
          aria-hidden="true"
        />

        <div className="relative flex h-full max-w-md flex-col justify-center gap-1.5 p-5 sm:gap-2 sm:p-8 lg:p-10">
          <span className="text-xs font-medium tracking-wide text-white/85 uppercase">
            Relaxation Hub
          </span>
          <h1 className="font-heading text-xl leading-tight font-semibold text-balance text-white sm:text-2xl lg:text-3xl">
            Take a moment for yourself.
          </h1>
          <p className="text-xs leading-relaxed text-white/85 sm:text-sm">
            Slow down, breathe, and find a little space to reset.
          </p>
        </div>
      </div>
    </section>
  );
}

export { RelaxationHero };
