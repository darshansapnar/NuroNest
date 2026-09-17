import type { ResultTone } from "@/lib/assessments/types";

interface ScoreGaugeProps {
  rawScore: number;
  maxScore: number;
  tone: ResultTone;
}

const TONE_COLORS: Record<ResultTone, string> = {
  positive: "#233E33",
  neutral: "#5A6E5A",
  caution: "#957A4A",
  concern: "#8C4A3D",
};

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreGauge({ rawScore, maxScore, tone }: ScoreGaugeProps) {
  const fillRatio = maxScore > 0 ? Math.max(0, Math.min(1, rawScore / maxScore)) : 0;
  const offset = CIRCUMFERENCE - fillRatio * CIRCUMFERENCE;
  const color = TONE_COLORS[tone];

  return (
    <div className="relative flex size-44 shrink-0 items-center justify-center sm:size-52">
      <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true" focusable="false">
        <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#E5E8E1" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-heading text-4xl font-normal text-[#1C352D] sm:text-5xl">{rawScore}</span>
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-[#5A6E5A]">out of {maxScore}</span>
      </div>
    </div>
  );
}
