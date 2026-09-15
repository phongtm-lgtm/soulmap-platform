import { APP_ASSETS } from '../../assets';
import type { PersonalityProfile } from '../../types';
import type { SoulMapJourney } from '../../types/journey';
import { buildMockJourneys } from '../../data/mockJourneys';
import JourneysMapView from './JourneysMapView';

interface JourneysReadyStepProps {
  profile: PersonalityProfile;
  onExplore: (journey: SoulMapJourney) => void;
}

export default function JourneysReadyStep({ profile, onExplore }: JourneysReadyStepProps) {
  const journeys = buildMockJourneys(profile);

  return (
    <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[2rem] px-6 py-8 lg:px-0 lg:py-10">
      {/* Nền phong cảnh */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#F8F4EB]" />
      <img
        src={APP_ASSETS.journey.scenery}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#FFFCF8]/90 via-[#FFFCF8]/60 to-[#F8F4EB]/85" />
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] -z-10 h-80 w-80 rounded-full bg-[#B68A2F]/25 blur-3xl" />

      <JourneysMapView journeys={journeys} onExplore={onExplore} />
    </div>
  );
}
