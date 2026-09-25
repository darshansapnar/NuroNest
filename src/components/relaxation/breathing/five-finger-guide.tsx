import { cn } from "@/lib/utils";
import type { BreathingPhaseType } from "@/data/breathing-exercises";
import { phaseTypeLabels } from "@/components/relaxation/breathing/breathing-circle";

const fingers = [
  { name: "Thumb", x: 18, y: 132, width: 30, height: 66, rx: 15, rotate: -22 },
  { name: "Index finger", x: 54, y: 42, width: 24, height: 98, rx: 12, rotate: 0 },
  { name: "Middle finger", x: 87, y: 22, width: 24, height: 118, rx: 12, rotate: 0 },
  { name: "Ring finger", x: 120, y: 36, width: 24, height: 104, rx: 12, rotate: 0 },
  { name: "Little finger", x: 153, y: 60, width: 22, height: 80, rx: 11, rotate: 0 },
];

function HandIllustration({ activeFingerIndex }: { activeFingerIndex?: number }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className="h-40 w-auto sm:h-48"
      role="img"
      aria-label="Illustration of an open hand with five fingers"
    >
      <rect
        x={38}
        y={118}
        width={124}
        height={92}
        rx={42}
        className="fill-primary/10"
      />
      {fingers.map((finger, index) => (
        <rect
          key={finger.name}
          x={finger.x}
          y={finger.y}
          width={finger.width}
          height={finger.height}
          rx={finger.rx}
          transform={
            finger.rotate
              ? `rotate(${finger.rotate} ${finger.x + finger.width / 2} ${finger.y + finger.height})`
              : undefined
          }
          className={cn(
            "transition-colors duration-300",
            activeFingerIndex === index
              ? "fill-primary"
              : "fill-primary/25",
          )}
        />
      ))}
    </svg>
  );
}

function FiveFingerGuide({
  variant,
  instructions,
  activeFingerIndex,
  phaseType,
  phaseLabel,
  secondsRemaining,
  className,
}: {
  variant: "preview" | "session";
  instructions?: string[];
  activeFingerIndex?: number;
  phaseType?: BreathingPhaseType;
  phaseLabel?: string;
  secondsRemaining?: number;
  className?: string;
}) {
  if (variant === "preview") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-6 rounded-2xl bg-muted/50 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8",
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-center">
          <HandIllustration />
        </div>
        <ol className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          {instructions?.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 sm:gap-4",
        className,
      )}
    >
      <HandIllustration activeFingerIndex={activeFingerIndex} />
      <div className="flex flex-col items-center gap-1 text-center">
        <span
          aria-live="polite"
          aria-atomic="true"
          className="font-heading text-lg font-semibold text-foreground sm:text-xl"
        >
          {phaseType ? phaseTypeLabels[phaseType] : ""}
        </span>
        <span className="font-heading text-4xl font-semibold text-primary tabular-nums sm:text-5xl">
          {secondsRemaining}
        </span>
        {phaseLabel ? (
          <span className="max-w-xs text-sm text-muted-foreground">
            {phaseLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { FiveFingerGuide };
