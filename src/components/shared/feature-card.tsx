import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "purple" | "amber";

const toneClasses: Record<Tone, string> = {
  blue: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  green:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  purple:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

function FeatureCard({
  icon: Icon,
  tone = "blue",
  title,
  description,
  href,
  ctaLabel = "Explore",
  media,
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  media?: React.ReactNode;
  className?: string;
}) {
  const content = (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl shadow-sm ring-1 ring-foreground/5 transition-all duration-200",
        media && "pt-0",
        href && "group-hover:-translate-y-0.5 group-hover:shadow-md",
        !href && className,
      )}
    >
      {media ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden">{media}</div>
      ) : null}
      <CardContent className="flex flex-col gap-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {href ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {ctaLabel}
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      {content}
    </Link>
  );
}

export { FeatureCard };
