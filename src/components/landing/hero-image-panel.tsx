import Image from "next/image";
import { Leaf, TrendingUp } from "lucide-react";

function FloatingBadge({
  icon: Icon,
  text,
  className,
}: {
  icon: typeof Leaf;
  text: string;
  className: string;
}) {
  return (
    <div
      className={`absolute z-10 flex max-w-[12rem] items-start gap-2.5 rounded-2xl bg-card p-3.5 shadow-lg ring-1 ring-foreground/5 ${className}`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="text-sm leading-snug font-medium text-foreground">{text}</p>
    </div>
  );
}

const heroImageAlt =
  "A calm reading nook with an arched window looking out over mountains and a lake";

function HeroImagePanel() {
  return (
    <>
      {/* Mobile / tablet: integrated image continuation below the text */}
      <div className="relative -mt-2 pt-4 pr-4 pb-10 sm:pt-6 sm:pr-8 lg:hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-r-[2.5rem] rounded-bl-[2.5rem] sm:aspect-[16/11]">
          <Image
            src="/images/hero.png"
            alt={heroImageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-background via-background/55 to-transparent"
            aria-hidden="true"
          />
        </div>

        <FloatingBadge
          icon={Leaf}
          text="A kinder mindset, brighter tomorrows."
          className="top-0 -right-2 sm:right-2"
        />
        <FloatingBadge
          icon={TrendingUp}
          text="Small steps create big change."
          className="right-6 bottom-2 sm:right-10"
        />
      </div>

      {/* Desktop: full-bleed image extending to the viewport edge */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/images/hero.png"
            alt={heroImageAlt}
            fill
            sizes="56vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-background via-background/75 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="pointer-events-auto">
          <FloatingBadge
            icon={Leaf}
            text="A kinder mindset, brighter tomorrows."
            className="top-12 right-10 xl:right-16"
          />
          <FloatingBadge
            icon={TrendingUp}
            text="Small steps create big change."
            className="right-16 bottom-16 xl:right-24"
          />
        </div>
      </div>
    </>
  );
}

export { HeroImagePanel };
