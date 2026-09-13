import { cn } from "@/lib/utils";

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-sm font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" && "max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeading };
