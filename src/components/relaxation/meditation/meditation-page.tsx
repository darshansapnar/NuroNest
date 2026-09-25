import { featuredMeditation } from "@/data/meditations";
import { MeditationTopbar } from "@/components/relaxation/meditation/meditation-topbar";
import { MeditationHero } from "@/components/relaxation/meditation/meditation-hero";
import { FeaturedMeditation } from "@/components/relaxation/meditation/featured-meditation";
import { MeditationLibrary } from "@/components/relaxation/meditation/meditation-library";

function MeditationPage() {
  return (
    <div className="flex flex-col gap-6">
      <MeditationTopbar />

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
