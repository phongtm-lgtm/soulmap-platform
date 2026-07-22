import { ArrowLeft } from 'lucide-react';
import type { SoulMapJourney } from '../../types/journey';

interface JourneyDetailHeroProps {
  journey: SoulMapJourney;
  tagline: string;
  accentColor: string;
  onBack: () => void;
}

/**
 * Journey detail hero — full-width image banner with the journey title,
 * tagline and a back button. Tinted with the journey's accent color.
 */
export default function JourneyDetailHero({ journey, tagline, accentColor, onBack }: JourneyDetailHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-[#E8DFCF] bg-[#FFFCF8] shadow-[0_24px_70px_-44px_rgba(33,77,59,0.4)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={journey.imagePath}
          alt={journey.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
        {/* Accent + readability wash */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, ${accentColor}E6 0%, ${accentColor}A6 42%, ${accentColor}33 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c2b25]/55 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-6 md:min-h-[340px] md:p-10">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 font-sans text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>

          <span className="rounded-full border border-white/30 bg-white/15 px-4 py-1.5 font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            SoulMap Journey
          </span>
        </div>

        <div className="max-w-[42rem]">
          <h1 className="font-display text-[2.75rem] font-bold leading-[1.02] text-white drop-shadow-sm md:text-[3.5rem]">
            {journey.title}
          </h1>
          <p className="mt-3 max-w-[36rem] font-reading text-[1.02rem] leading-relaxed text-white/90 md:text-[1.1rem]">
            {tagline}
          </p>
        </div>
      </div>
    </header>
  );
}
