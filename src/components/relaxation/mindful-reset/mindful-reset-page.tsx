import { RelaxationTopbar } from "@/components/relaxation/relaxation-topbar";
import { MindfulResetHero } from "@/components/relaxation/mindful-reset/mindful-reset-hero";
import { MindfulResetActivities } from "@/components/relaxation/mindful-reset/mindful-reset-activities";
import { MindfulResetWhyPanel } from "@/components/relaxation/mindful-reset/mindful-reset-why-panel";
import { MindfulResetTipsPanel } from "@/components/relaxation/mindful-reset/mindful-reset-tips-panel";

function MindfulResetPage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-9">
      <RelaxationTopbar currentPage="Mindful Reset" />
      <MindfulResetHero />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <MindfulResetActivities />

        <div className="flex flex-col gap-6">
          <MindfulResetWhyPanel />
          <MindfulResetTipsPanel />
        </div>
      </div>
    </div>
  );
}

export { MindfulResetPage };
