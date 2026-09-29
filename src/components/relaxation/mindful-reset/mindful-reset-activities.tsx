import { mindfulResetActivities } from "@/data/mindful-reset";
import { MindfulResetActivityCard } from "@/components/relaxation/mindful-reset/mindful-reset-activity-card";

function MindfulResetActivities() {
  return (
    <section aria-labelledby="mindful-reset-activities-heading">
      <h2
        id="mindful-reset-activities-heading"
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        Choose an activity
      </h2>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Simple, guided practices to help you feel more relaxed, present, and
        at ease.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mindfulResetActivities.map((activity) => (
          <MindfulResetActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}

export { MindfulResetActivities };
