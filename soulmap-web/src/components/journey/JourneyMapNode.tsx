import { User, Briefcase, Heart, Globe, Check, Sparkles } from 'lucide-react';
import type { SoulMapJourney, JourneyIcon } from '../../types/journey';

const ICON_MAP: Record<JourneyIcon, typeof User> = {
  user: User,
  briefcase: Briefcase,
  heart: Heart,
  globe: Globe,
  sparkles: Sparkles,
};

interface JourneyMapNodeProps {
  journey: SoulMapJourney;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onExplore: () => void;
  layout?: 'map' | 'timeline';
}

export default function JourneyMapNode({
  journey,
  index,
  isActive,
  isHovered,
  onSelect,
  onExplore,
  layout = 'map',
}: JourneyMapNodeProps) {
  const Icon = ICON_MAP[journey.icon];
  const highlighted = isActive || isHovered;

  if (layout === 'timeline') {
    return (
      <article
        className={`flex gap-4 animate-fade-in ${highlighted ? 'is-active' : ''}`}
        style={{ animationDelay: `${120 * index}ms`, animationFillMode: 'both' }}
      >
        <button
          type="button"
          onClick={onSelect}
          className="relative shrink-0 h-[72px] w-[72px] border-0 bg-transparent p-0 cursor-pointer"
        >
          <span className="absolute -right-1 -top-1 z-[2] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#214D3B] font-sans text-[0.65rem] font-extrabold text-[#FFFDF8] shadow-md">
            {journey.id}
          </span>
          <img
            src={journey.imagePath}
            alt=""
            className="h-[72px] w-[72px] rounded-full border-2 border-[#B68A2F]/35 object-cover shadow-[0_8px_20px_-10px_rgba(33,77,59,0.35)]"
            draggable={false}
          />
        </button>

        <div
          className={`min-w-0 flex-1 rounded-[1.1rem] border bg-[#FFFCF8]/92 p-4 transition-shadow duration-300 ${
            highlighted
              ? 'border-[#B68A2F]/45 shadow-[0_12px_28px_-18px_rgba(33,77,59,0.35)]'
              : 'border-[#E8DFCF]/80'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[0.72rem] font-bold"
              style={{
                color: journey.accentColor,
                borderColor: `${journey.accentColor}33`,
                background: `${journey.accentColor}12`,
              }}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              Journey {journey.id}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#4B7E55]/20 bg-[#4B7E55]/10 px-3 py-1 font-sans text-[0.72rem] font-bold text-[#4B7E55]">
              <Check className="h-3 w-3" />
              Sẵn sàng
            </span>
          </div>

          <h3
            className="mt-2 font-display text-[1.45rem] font-bold leading-tight"
            style={{ color: journey.accentColor }}
          >
            {journey.title}
          </h3>
          <p className="mt-2 line-clamp-3 font-serif text-[0.82rem] leading-relaxed text-[#5E625F]">
            {journey.summary}
          </p>

          <button
            type="button"
            onClick={onExplore}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-sans text-[0.82rem] font-extrabold text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${journey.buttonClass}`}
          >
            Khám phá chặng này
          </button>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onExplore}
      className={`journeys-map-node group relative flex w-[118px] cursor-pointer flex-col items-center border-0 bg-transparent p-0 transition-all duration-300 animate-fade-in ${
        highlighted ? 'is-active -translate-y-1.5 scale-[1.04]' : 'hover:-translate-y-1.5 hover:scale-[1.04]'
      }`}
      style={{ animationDelay: `${150 * index}ms`, animationFillMode: 'both' }}
      aria-label={`Journey ${journey.id}: ${journey.title}`}
      aria-pressed={isActive}
    >
      <span
        className="journeys-map-node__ring absolute top-[18px] h-[88px] w-[88px] rounded-full border-2 bg-[#FFFCF8]/72 shadow-[0_0_0_6px_rgba(255,252,248,0.55),0_14px_28px_-14px_rgba(33,77,59,0.35)] transition-all duration-300"
        style={{ borderColor: `${journey.accentColor}${highlighted ? 'cc' : '55'}` }}
      />

      <span
        className="absolute right-2 top-2 z-[4] flex h-6 w-6 items-center justify-center rounded-full font-sans text-[0.68rem] font-extrabold text-[#FFFDF8] shadow-md"
        style={{ background: journey.accentColor }}
      >
        {journey.id}
      </span>

      <span
        className="relative z-[4] mt-7 flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#B68A2F]/28 bg-[#FFFCF8]/92"
        style={{ color: journey.accentColor }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <img
        src={journey.imagePath}
        alt=""
        className="relative z-[3] -mt-2 h-[72px] w-[72px] rounded-full border-2 border-[#FFFCF8]/92 object-cover shadow-[0_8px_20px_-10px_rgba(33,77,59,0.45)]"
        draggable={false}
      />

      <span className="relative z-[4] mt-2 flex flex-col items-center rounded-full border border-[#B68A2F]/22 bg-[#FFFCF8]/88 px-3 py-1.5 shadow-[0_6px_16px_-10px_rgba(33,77,59,0.35)]">
        <span className="font-sans text-[0.58rem] font-bold uppercase tracking-wide text-[#8B8F8A]">
          Journey {journey.id}
        </span>
        <span className="font-display text-[0.95rem] font-bold leading-tight" style={{ color: journey.accentColor }}>
          {journey.title}
        </span>
      </span>
    </button>
  );
}
