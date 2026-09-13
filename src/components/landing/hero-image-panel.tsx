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

function HeroImagePanel() {
  return (
    <div className="relative w-full pt-4 pr-4 pb-10 sm:pt-6 sm:pr-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm sm:aspect-[16/11]">
        <Image
          src="/images/hero.png"
          alt="A calm reading nook with an arched window looking out over mountains and a lake"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
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
  );
}

export { HeroImagePanel };
