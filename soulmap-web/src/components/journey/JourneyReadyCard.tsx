import { User, Briefcase, Heart, Globe, Sparkles } from 'lucide-react';
import type { SoulMapJourney, JourneyIcon } from '../../types/journey';

const ICON_MAP: Record<JourneyIcon, typeof User> = {
  user: User,
  briefcase: Briefcase,
  heart: Heart,
  globe: Globe,
  sparkles: Sparkles,
};

interface JourneyReadyCardProps {
  journey: SoulMapJourney;
  index: number;
  onExplore: (journey: SoulMapJourney) => void;
}

export default function JourneyReadyCard({ journey, index, onExplore }: JourneyReadyCardProps) {
  const Icon = ICON_MAP[journey.icon];

  return (
    <article
      className="pillar-card group animate-fade-in"
      style={{ animationDelay: `${100 * index}ms`, animationFillMode: 'both' }}
    >
      <div className="pillar-icon" style={{ color: journey.accentColor }}>
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>

      <h4 className="pillar-title uppercase" style={{ color: journey.accentColor }}>
        {journey.title}
      </h4>
      <div className="pillar-image-wrap mt-7">
        <img
          src={journey.imagePath}
          alt={journey.title}
          className="pillar-image"
          draggable={false}
        />
      </div>

      <p className="pillar-desc mt-6 line-clamp-4">
        {journey.summary}
      </p>

      <button
        type="button"
        onClick={() => onExplore(journey)}
        className={`relative z-10 mt-auto flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 font-sans text-base font-bold text-white shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${journey.buttonClass}`}
      >
        Khám phá
      </button>
    </article>
  );
}
