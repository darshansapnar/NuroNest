import { featuredMeditation } from "@/data/meditations";
import { RelaxationTopbar } from "@/components/relaxation/relaxation-topbar";
import { MeditationHero } from "@/components/relaxation/meditation/meditation-hero";
import { FeaturedMeditation } from "@/components/relaxation/meditation/featured-meditation";
import { MeditationLibrary } from "@/components/relaxation/meditation/meditation-library";

function MeditationPage() {
  return (
    <div className="flex flex-col gap-6">
      <RelaxationTopbar currentPage="Meditation" />

      <div className="flex flex-col gap-9">
        <MeditationHero />
        {featuredMeditation ? (
          <FeaturedMeditation meditation={featuredMeditation} />
        ) : null}
        <MeditationLibrary />
      </div>
    </div>
  );
}

export { MeditationPage };
