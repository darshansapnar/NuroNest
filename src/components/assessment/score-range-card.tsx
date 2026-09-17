import type { ScoreRange } from "@/lib/assessments/ranges";

interface ScoreRangeCardProps {
  ranges: ScoreRange[];
  currentScore: number;
}

/**
 * "Understanding your score" box, reused across every assessment result.
 * Generic on purpose — it only knows about {min, max, label} ranges and a
 * score to place within them, never about which assessment it's showing.
 */
export function ScoreRangeCard({ ranges, currentScore }: ScoreRangeCardProps) {
  return (
    <div className="mb-8 rounded-[28px] border border-[#E5E8E1] bg-white p-6 shadow-xs sm:p-8">
      <h2 className="font-heading text-lg font-normal text-[#1C352D] sm:text-xl mb-4">Understanding your score</h2>
      <ul className="flex flex-col gap-2">
        {ranges.map((range) => {
          const isCurrent = currentScore >= range.min && currentScore <= range.max;
          return (
            <li
              key={range.levelKey}
              aria-current={isCurrent ? "true" : undefined}
              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm sm:text-base ${
                isCurrent
                  ? "border border-[#CBD4C5] bg-[#ECEFE6] font-medium text-[#1C352D]"
                  : "border border-transparent text-[#5A6860]"
              }`}
            >
              <span className="tabular-nums">
                {range.min}–{range.max}
              </span>
              <span className="flex-1 text-right sm:text-left">{range.label}</span>
              {isCurrent && (
                <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-[#233E33]">
                  Your range
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
