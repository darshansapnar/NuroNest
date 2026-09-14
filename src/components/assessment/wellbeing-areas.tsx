import { Heart, Moon, Smile, Sprout, Zap } from "lucide-react";

const wellbeingAreas = [
  {
    id: "mood",
    title: "Mood",
    description: "How you've been feeling emotionally",
    icon: Smile,
  },
  {
    id: "energy",
    title: "Energy",
    description: "Your energy and motivation levels",
    icon: Zap,
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "Your sleep quality and rest",
    icon: Moon,
  },
  {
    id: "interest",
    title: "Interest",
    description: "Your interest and enjoyment in daily life",
    icon: Sprout,
  },
  {
    id: "overall",
    title: "Overall wellbeing",
    description: "Your general sense of wellbeing",
    icon: Heart,
  },
];

export function WellbeingAreas() {
  return (
    <section className="py-12 sm:py-16">
      {/* Section Header */}
      <div className="mb-10 text-center sm:mb-14">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-[#5A6E5A]">
          What this check-in explores
        </span>
        <h2 className="font-heading text-3xl font-normal text-[#1C352D] sm:text-4xl lg:text-[42px]">
          A snapshot of your overall wellbeing
        </h2>
      </div>

      {/* 5 Feature Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
        {wellbeingAreas.map((area) => {
          const IconComponent = area.icon;
          return (
            <div
              key={area.id}
              className="group flex flex-col items-center rounded-[22px] border border-[#E5E8E1] bg-white p-7 text-center shadow-2xs transition-all duration-300 hover:border-[#CBD4C5] hover:shadow-md"
            >
              {/* Circular Icon Container */}
              <div className="mb-5 flex size-14 shrink-0 items-center justify-center rounded-full bg-[#E9ECE4] text-[#233E33] transition-transform duration-300 group-hover:scale-105">
                <IconComponent className="size-6 text-[#233E33]" aria-hidden="true" />
              </div>

              {/* Title */}
              <h3 className="mb-2 font-medium text-lg text-[#1C352D]">
                {area.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#5A6860]">
                {area.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
