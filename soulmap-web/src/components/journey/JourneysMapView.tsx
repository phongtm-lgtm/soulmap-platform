import { useState } from 'react';
import { ArrowRight, Check, Map, LayoutGrid, Sparkles, User, Briefcase, Heart, Globe } from 'lucide-react';
import { APP_ASSETS } from '../../assets';
import type { SoulMapJourney, JourneyIcon } from '../../types/journey';
import JourneyMapNode from './JourneyMapNode';
import JourneyReadyCard from './JourneyReadyCard';
import LinhNhiMessage from '../LinhNhiMessage';
import '../../styles/journeys-map.css';

const ICON_MAP: Record<JourneyIcon, typeof User> = {
  user: User,
  briefcase: Briefcase,
  heart: Heart,
  globe: Globe,
};

const MAP_POSITIONS: Record<SoulMapJourney['slug'], { left: string; top: string }> = {
  identity: { left: '11%', top: '14%' },
  career: { left: '73%', top: '18%' },
  love: { left: '15%', top: '64%' },
  life: { left: '75%', top: '58%' },
};

interface JourneysMapViewProps {
  journeys: SoulMapJourney[];
  onExplore: (journey: SoulMapJourney) => void;
}

export default function JourneysMapView({ journeys, onExplore }: JourneysMapViewProps) {
  const [activeSlug, setActiveSlug] = useState<SoulMapJourney['slug']>(journeys[0]?.slug ?? 'identity');
  const [hoveredSlug, setHoveredSlug] = useState<SoulMapJourney['slug'] | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  const activeJourney = journeys.find((j) => j.slug === activeSlug) ?? journeys[0];
  const ActiveIcon = activeJourney ? ICON_MAP[activeJourney.icon] : User;

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <header className="animate-fade-in text-center">
        <span className="inline-flex items-center gap-1.5 font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B68A2F]">
          <Sparkles className="h-3.5 w-3.5" />
          Hành trình đã mở khóa
        </span>

        <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight text-[#214D3B] md:text-5xl">
          4 Chặng Đường SoulMap
        </h1>

        <p className="mx-auto mt-3 max-w-[38rem] font-serif text-sm leading-relaxed text-[#5E625F] md:text-base">
          Mỗi chặng là một cánh cửa khám phá bản thân — từ bản chất cốt lõi đến hành trình cuộc đời.
        </p>

        <div
          className="mt-5 inline-flex rounded-full border border-[#B68A2F]/28 bg-[#FFFCF8]/82 p-1 shadow-[0_8px_24px_-16px_rgba(33,77,59,0.28)]"
          role="tablist"
          aria-label="Cách xem hành trình"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'map'}
            onClick={() => setViewMode('map')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[0.82rem] font-bold transition-all duration-300 ${
              viewMode === 'map'
                ? 'bg-[#FFFDF8] text-[#214D3B] shadow-[0_4px_14px_-8px_rgba(33,77,59,0.35)]'
                : 'text-[#5E625F] hover:text-[#214D3B]'
            }`}
          >
            <Map className="h-4 w-4" />
            Bản đồ
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[0.82rem] font-bold transition-all duration-300 ${
              viewMode === 'grid'
                ? 'bg-[#FFFDF8] text-[#214D3B] shadow-[0_4px_14px_-8px_rgba(33,77,59,0.35)]'
                : 'text-[#5E625F] hover:text-[#214D3B]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Thẻ Journey
          </button>
        </div>
      </header>

      {viewMode === 'map' ? (
        <>
          {/* Scenic map — desktop */}
          <div
            className="relative hidden min-h-[420px] overflow-hidden rounded-[1.75rem] border border-[#B68A2F]/28 shadow-[0_24px_60px_-36px_rgba(33,77,59,0.42)] md:block animate-fade-in"
            style={{ animationDelay: '120ms', animationFillMode: 'both' }}
          >
            <img
              src={APP_ASSETS.journey.scenery}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              draggable={false}
            />

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(680px 320px at 50% 42%, rgba(255,252,248,0.55) 0%, transparent 62%), linear-gradient(180deg, rgba(255,252,248,0.82) 0%, rgba(250,246,238,0.38) 48%, rgba(250,246,238,0.88) 100%)',
              }}
            />

            <svg
              className="journeys-map-trail pointer-events-none absolute left-[2%] top-[38%] z-[1] h-[120px] w-[96%]"
              viewBox="0 0 1000 420"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="journeys-map-trail__glow"
                d="M 60 95 C 140 95, 180 55, 260 60 C 340 65, 380 110, 460 105 C 540 100, 580 55, 660 58 C 740 61, 780 105, 860 100 C 920 96, 960 88, 980 85"
              />
              <path
                className="journeys-map-trail__line"
                d="M 60 95 C 140 95, 180 55, 260 60 C 340 65, 380 110, 460 105 C 540 100, 580 55, 660 58 C 740 61, 780 105, 860 100 C 920 96, 960 88, 980 85"
              />
            </svg>

            <img
              src={APP_ASSETS.journey.start}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[12%] left-[1%] z-[2] w-[108px] drop-shadow-[0_8px_14px_rgba(33,77,59,0.16)]"
              draggable={false}
            />
            <img
              src={APP_ASSETS.journey.goal}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-[1%] top-[8%] z-[2] w-[118px] drop-shadow-[0_8px_14px_rgba(33,77,59,0.16)]"
              draggable={false}
            />

            {journeys.map((journey, index) => {
              const pos = MAP_POSITIONS[journey.slug];
              return (
                <div
                  key={journey.slug}
                  className="absolute z-[3] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pos.left, top: pos.top }}
                  onMouseEnter={() => setHoveredSlug(journey.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  <JourneyMapNode
                    journey={journey}
                    index={index}
                    isActive={activeSlug === journey.slug}
                    isHovered={hoveredSlug === journey.slug}
                    onSelect={() => setActiveSlug(journey.slug)}
                    onExplore={() => onExplore(journey)}
                  />
                </div>
              );
            })}

            <div className="pointer-events-none absolute bottom-[6%] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center">
              <img
                src={APP_ASSETS.linhNhiMascot}
                alt="Linh Nhi"
                className="w-[88px] animate-float drop-shadow-[0_16px_24px_rgba(65,92,55,0.18)]"
                draggable={false}
              />
              <p className="mt-1 max-w-[14rem] text-center font-sans text-[0.72rem] font-semibold text-[#24533E]">
                Linh Nhi sẽ đồng hành cùng bạn trên từng chặng 🌿
              </p>
            </div>
          </div>

          {/* Timeline — mobile */}
          <div
            className="relative flex flex-col gap-6 pl-5 md:hidden animate-fade-in"
            style={{ animationDelay: '120ms', animationFillMode: 'both' }}
          >
            <div
              className="absolute bottom-2 left-[0.45rem] top-2 w-0.5 rounded-full bg-gradient-to-b from-[#B68A2F] to-[#B68A2F]/20"
              aria-hidden="true"
            />
            {journeys.map((journey, index) => (
              <JourneyMapNode
                key={journey.slug}
                journey={journey}
                index={index}
                isActive={activeSlug === journey.slug}
                isHovered={false}
                layout="timeline"
                onSelect={() => setActiveSlug(journey.slug)}
                onExplore={() => onExplore(journey)}
              />
            ))}
          </div>

          {/* Detail panel */}
          {activeJourney && (
            <article
              className="hidden animate-fade-in gap-6 rounded-[1.5rem] border border-[#B68A2F]/24 bg-gradient-to-br from-[#FFFCF8]/96 to-[#FAF6EE]/88 p-5 shadow-[0_18px_50px_-36px_rgba(33,77,59,0.32)] md:flex"
              style={{ animationDelay: '200ms', animationFillMode: 'both' }}
            >
              <div className="relative h-[168px] w-[168px] shrink-0 overflow-hidden rounded-[1.25rem] border border-[#B68A2F]/28">
                <img
                  src={activeJourney.imagePath}
                  alt={activeJourney.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 font-sans text-[0.68rem] font-extrabold text-[#FFFDF8]"
                  style={{ background: activeJourney.accentColor }}
                >
                  Chặng {activeJourney.id}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[0.72rem] font-bold"
                    style={{
                      color: activeJourney.accentColor,
                      borderColor: `${activeJourney.accentColor}33`,
                      background: `${activeJourney.accentColor}12`,
                    }}
                  >
                    <ActiveIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    Journey {activeJourney.id}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#4B7E55]/20 bg-[#4B7E55]/10 px-3 py-1 font-sans text-[0.72rem] font-bold text-[#4B7E55]">
                    <Check className="h-3 w-3" />
                    Đã tạo xong
                  </span>
                </div>

                <h2
                  className="font-display text-[2rem] font-bold leading-tight"
                  style={{ color: activeJourney.accentColor }}
                >
                  {activeJourney.title}
                </h2>
                <p className="font-sans text-[0.88rem] font-semibold text-[#5E625F]">{activeJourney.subtitle}</p>
                <p className="line-clamp-3 font-serif text-[0.86rem] leading-relaxed text-[#5E625F]">
                  {activeJourney.summary}
                </p>

                <div className="mt-1 rounded-xl border border-[#214D3B]/8 bg-[#FFFCF8]/72 px-4 py-3">
                  <div className="flex items-center justify-between font-sans text-xs font-bold text-[#24533E]">
                    <span>Tiến độ chặng</span>
                    <span style={{ color: activeJourney.accentColor }}>0%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8DFCF]">
                    <div
                      className="h-full rounded-full transition-all duration-400"
                      style={{ width: '0%', background: activeJourney.accentColor }}
                    />
                  </div>
                  <p className="mt-1.5 font-sans text-[11px] font-medium text-[#5E625F]">
                    10 chapter đang chờ bạn khám phá
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onExplore(activeJourney)}
                  className={`mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 font-sans text-[0.88rem] font-extrabold text-white shadow-[0_10px_24px_-12px_rgba(33,77,59,0.45)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${activeJourney.buttonClass}`}
                >
                  Bắt đầu chặng {activeJourney.id}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          )}

          <LinhNhiMessage
            variant="tip"
            title="Linh Nhi gợi ý"
            message="Hãy bắt đầu từ chặng «Tôi là ai» để hiểu nền tảng, rồi dần mở các chặng Sự nghiệp, Tình yêu và Cuộc đời. Mỗi chặng có 10 chapter insight cá nhân hóa dành riêng cho bạn."
            className="hidden animate-fade-in md:block"
          />
        </>
      ) : (
        <div className="grid w-full animate-fade-in grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
          {journeys.map((journey, index) => (
            <JourneyReadyCard key={journey.slug} journey={journey} index={index} onExplore={onExplore} />
          ))}
        </div>
      )}
    </div>
  );
}
