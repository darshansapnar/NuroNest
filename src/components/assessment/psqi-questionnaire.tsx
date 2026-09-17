"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  PSQI_FREQUENCY_OPTIONS,
  PSQI_PROBLEM_OPTIONS,
  PSQI_QUALITY_OPTIONS,
  type PsqiAnswers,
  type PsqiDisturbances,
} from "@/lib/assessments/psqi";

interface PsqiQuestionnaireProps {
  onComplete: (answers: PsqiAnswers) => void;
}

const DISTURBANCE_ITEMS: { key: keyof PsqiDisturbances; text: string }[] = [
  { key: "cannotSleep30", text: "Cannot get to sleep within 30 minutes" },
  { key: "wakeNight", text: "Wake up in the middle of the night or early morning" },
  { key: "bathroom", text: "Have to get up to use the bathroom" },
  { key: "breathing", text: "Cannot breathe comfortably" },
  { key: "coughSnore", text: "Cough or snore loudly" },
  { key: "tooCold", text: "Feel too cold" },
  { key: "tooHot", text: "Feel too hot" },
  { key: "badDreams", text: "Have bad dreams" },
  { key: "pain", text: "Have pain" },
  { key: "other", text: "Other reason(s)" },
];

const STEP_IDS = ["times", "latency", "duration", "disturbances", "medication", "daytime", "quality", "partner"] as const;
type StepId = (typeof STEP_IDS)[number];

interface ScaleOption {
  label: string;
  score: number;
}

function ScaleOptionList({
  options,
  value,
  onChange,
}: {
  options: ScaleOption[];
  value: number | undefined;
  onChange: (score: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const isSelected = value === opt.score;
        return (
          <button
            key={opt.score}
            type="button"
            onClick={() => onChange(opt.score)}
            className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-all duration-150 cursor-pointer sm:text-base ${
              isSelected
                ? "border-[#233E33] bg-[#233E33] text-white shadow-xs"
                : "border-[#E5E8E1] bg-white text-[#1C352D] hover:border-[#CBD4C5] hover:bg-[#F5F7F2]"
            }`}
          >
            <span>{opt.label}</span>
            {isSelected && <CheckCircle2 className="size-5 text-white shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Custom multi-step PSQI form. Unlike the other screenings, PSQI mixes bed
 * and wake times, numeric entries, and several distinct frequency scales, so
 * it can't reuse the single-select LikertQuestionnaire — but it keeps the
 * same visual language (progress bar, card, option buttons).
 */
export function PsqiQuestionnaire({ onComplete }: PsqiQuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepLatencyMinutes, setSleepLatencyMinutes] = useState("");
  const [sleepDurationHours, setSleepDurationHours] = useState("");
  const [disturbances, setDisturbances] = useState<Partial<Record<keyof PsqiDisturbances, number>>>({});
  const [sleepMedicationFreq, setSleepMedicationFreq] = useState<number | undefined>(undefined);
  const [troubleStayingAwake, setTroubleStayingAwake] = useState<number | undefined>(undefined);
  const [enthusiasmProblem, setEnthusiasmProblem] = useState<number | undefined>(undefined);
  const [overallSleepQuality, setOverallSleepQuality] = useState<number | undefined>(undefined);
  const [hasBedPartner, setHasBedPartner] = useState<boolean | null>(null);

  const stepId: StepId = STEP_IDS[step];

  const isStepValid = (): boolean => {
    switch (stepId) {
      case "times":
        return bedTime !== "" && wakeTime !== "";
      case "latency":
        return sleepLatencyMinutes !== "" && Number(sleepLatencyMinutes) >= 0;
      case "duration":
        return sleepDurationHours !== "" && Number(sleepDurationHours) >= 0;
      case "disturbances":
        return DISTURBANCE_ITEMS.every((item) => disturbances[item.key] !== undefined);
      case "medication":
        return sleepMedicationFreq !== undefined;
      case "daytime":
        return troubleStayingAwake !== undefined && enthusiasmProblem !== undefined;
      case "quality":
        return overallSleepQuality !== undefined;
      case "partner":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < STEP_IDS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    onComplete({
      bedTime,
      wakeTime,
      sleepLatencyMinutes: Number(sleepLatencyMinutes),
      sleepDurationHours: Number(sleepDurationHours),
      disturbances: disturbances as PsqiDisturbances,
      sleepMedicationFreq: sleepMedicationFreq as number,
      troubleStayingAwake: troubleStayingAwake as number,
      enthusiasmProblem: enthusiasmProblem as number,
      overallSleepQuality: overallSleepQuality as number,
    });
  };

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div>
      {/* Header & Progress */}
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6E5A]">
          Question {step + 1} of {STEP_IDS.length}
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E8E1]">
          <div
            className="h-full bg-[#233E33] transition-all duration-300"
            style={{ width: `${((step + 1) / STEP_IDS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        {stepId === "times" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              During the past month, what time have you usually gone to bed at night, and what time have you
              usually gotten up in the morning?
            </h3>
            <div className="flex flex-col gap-4 sm:flex-row">
              <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-[#1C352D]">
                Usual bedtime
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="rounded-xl border border-[#E5E8E1] bg-white p-3.5 text-base text-[#1C352D] focus:border-[#233E33] focus:outline-none"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-[#1C352D]">
                Usual wake-up time
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="rounded-xl border border-[#E5E8E1] bg-white p-3.5 text-base text-[#1C352D] focus:border-[#233E33] focus:outline-none"
                />
              </label>
            </div>
          </div>
        )}

        {stepId === "latency" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              During the past month, how long (in minutes) has it usually taken you to fall asleep each night?
            </h3>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Minutes"
              value={sleepLatencyMinutes}
              onChange={(e) => setSleepLatencyMinutes(e.target.value)}
              className="w-full max-w-[200px] rounded-xl border border-[#E5E8E1] bg-white p-3.5 text-base text-[#1C352D] focus:border-[#233E33] focus:outline-none"
            />
          </div>
        )}

        {stepId === "duration" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              During the past month, how many hours of actual sleep did you get at night? (This may be different
              than the number of hours you spent in bed.)
            </h3>
            <input
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              placeholder="Hours"
              value={sleepDurationHours}
              onChange={(e) => setSleepDurationHours(e.target.value)}
              className="w-full max-w-[200px] rounded-xl border border-[#E5E8E1] bg-white p-3.5 text-base text-[#1C352D] focus:border-[#233E33] focus:outline-none"
            />
          </div>
        )}

        {stepId === "disturbances" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              During the past month, how often have you had trouble sleeping because you...
            </h3>
            <div className="flex flex-col gap-4">
              {DISTURBANCE_ITEMS.map((item) => (
                <label key={item.key} className="flex flex-col gap-1.5 text-sm font-medium text-[#1C352D] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="sm:max-w-[60%]">{item.text}</span>
                  <select
                    value={disturbances[item.key] ?? ""}
                    onChange={(e) =>
                      setDisturbances((prev) => ({ ...prev, [item.key]: Number(e.target.value) }))
                    }
                    className="rounded-xl border border-[#E5E8E1] bg-white p-3 text-sm text-[#1C352D] focus:border-[#233E33] focus:outline-none sm:w-64"
                  >
                    <option value="" disabled>
                      Select frequency
                    </option>
                    {PSQI_FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.score} value={opt.score}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        )}

        {stepId === "medication" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              During the past month, how often have you taken medicine to help you sleep (prescribed or
              &quot;over the counter&quot;)?
            </h3>
            <ScaleOptionList options={PSQI_FREQUENCY_OPTIONS} value={sleepMedicationFreq} onChange={setSleepMedicationFreq} />
          </div>
        )}

        {stepId === "daytime" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
                During the past month, how often have you had trouble staying awake while driving, eating meals,
                or engaging in social activity?
              </h3>
              <ScaleOptionList options={PSQI_FREQUENCY_OPTIONS} value={troubleStayingAwake} onChange={setTroubleStayingAwake} />
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
                During the past month, how much of a problem has it been for you to keep up enough enthusiasm to
                get things done?
              </h3>
              <ScaleOptionList options={PSQI_PROBLEM_OPTIONS} value={enthusiasmProblem} onChange={setEnthusiasmProblem} />
            </div>
          </div>
        )}

        {stepId === "quality" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              During the past month, how would you rate your sleep quality overall?
            </h3>
            <ScaleOptionList options={PSQI_QUALITY_OPTIONS} value={overallSleepQuality} onChange={setOverallSleepQuality} />
          </div>
        )}

        {stepId === "partner" && (
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-xl font-normal leading-snug text-[#1C352D] sm:text-2xl">
              Do you have a bed partner or room mate?
            </h3>
            <p className="text-xs text-[#66746E]">This last question is for context only — it does not affect your score.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHasBedPartner(true)}
                className={`flex-1 rounded-xl border p-3.5 text-sm font-medium transition-colors cursor-pointer ${
                  hasBedPartner === true
                    ? "border-[#233E33] bg-[#233E33] text-white"
                    : "border-[#E5E8E1] bg-white text-[#1C352D] hover:border-[#CBD4C5]"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setHasBedPartner(false)}
                className={`flex-1 rounded-xl border p-3.5 text-sm font-medium transition-colors cursor-pointer ${
                  hasBedPartner === false
                    ? "border-[#233E33] bg-[#233E33] text-white"
                    : "border-[#E5E8E1] bg-white text-[#1C352D] hover:border-[#CBD4C5]"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5E8E1]">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4A5750] disabled:opacity-40 hover:text-[#1C352D] cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="size-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="inline-flex items-center gap-2 rounded-full bg-[#233E33] px-6 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50 hover:bg-[#192E26] cursor-pointer disabled:cursor-not-allowed"
        >
          <span>{step === STEP_IDS.length - 1 ? "See Results" : "Next"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
