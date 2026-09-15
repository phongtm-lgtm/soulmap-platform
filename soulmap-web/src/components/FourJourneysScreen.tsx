"use client";
import { useState } from 'react';
import {
  Timer, CalendarDays, Star, Leaf,
  Search,
} from 'lucide-react';
import type { SoulMapJourney } from '../types/journey';
import Button from './ui/Button';

// ─── Constants ───────────────────────────────────────────────────────────────

const JOURNEY_ORNAMENTS: Record<string, string> = {
  identity: '/pillars/branch/journey-tree-ornament.png',
  career: '/pillars/branch/journey-mountain-ornament.png',
  love: '/pillars/branch/journey-love-ornament.png',
  life: '/pillars/branch/journey-life-ornament.png',
  tuvi: '/pillars/branch/journey-life-ornament.png',
};

const JOURNEY_INSIGHTS: Record<string, string> = {
  identity: '18 / 25 Insight',
  career: '11 / 25 Insight',
  love: '7 / 25 Insight',
  life: '4 / 25 Insight',
  tuvi: '7 / 7 Bước luận',
};

const JOURNEY_CARD_STYLES: Record<string, { bg: string; icon: string }> = {
  identity: { bg: 'linear-gradient(180deg, #EEF5E5 0%, #FFFDF8 70%, #F5EBD8 100%)', icon: '♧' },
  career: { bg: 'linear-gradient(180deg, #EEF5F8 0%, #FFFDF8 70%, #F3E8D8 100%)', icon: '△' },
  love: { bg: 'linear-gradient(180deg, #FFE7E1 0%, #FFF7F0 70%, #F5E0D3 100%)', icon: '♡' },
  life: { bg: 'linear-gradient(180deg, #F0EADB 0%, #FFFDF8 70%, #EFE0D1 100%)', icon: '♌' },
  tuvi: { bg: 'linear-gradient(180deg, #FFF1D6 0%, #FFFDF8 70%, #EFE0C3 100%)', icon: '✦' },
};

const FILTERS = ['Tất cả', 'Đang học', 'Đã hoàn thành', 'Khóa', 'Đề xuất'] as const;
type JourneyFilter = typeof FILTERS[number];

// ─── Journey Card ─────────────────────────────────────────────────────────────

function JourneyCard({
  journey, index, onExplore, onUnlock,
}: { journey: SoulMapJourney; index: number; onExplore: (j: SoulMapJourney) => void; onUnlock: (j: SoulMapJourney) => void }) {
  const cardStyle = JOURNEY_CARD_STYLES[journey.slug];
  const insightText = JOURNEY_INSIGHTS[journey.slug] ?? '0 / 25 Insight';
  const ornamentPath = JOURNEY_ORNAMENTS[journey.slug];
  const isLocked = journey.status === 'locked';

  return (
    <article
      className="relative flex min-h-[430px] flex-col overflow-hidden rounded-[1.45rem] border border-[#E1D0B2] shadow-[0_16px_38px_-28px_rgba(77,52,28,0.55)] animate-fade-in max-[430px]:min-h-[400px] max-[430px]:rounded-[1.25rem]"
      style={{ animationDelay: `${80 * index}ms`, animationFillMode: 'both', background: cardStyle?.bg }}
    >
      {ornamentPath && (
        <img
          src={ornamentPath}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 -right-8 z-[1] w-28 opacity-75 max-[430px]:-right-7 max-[430px]:bottom-0 max-[430px]:w-20"
          draggable={false}
        />
      )}
      <div className="relative h-[255px] shrink-0 overflow-hidden max-[430px]:h-[225px]">
        <img
          src={journey.imagePath}
          alt={journey.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FFFDF8] via-[#FFFDF8]/70 to-transparent" />
      </div>

      <div className="relative z-10 -mt-8 flex flex-1 flex-col items-center px-5 pb-5 text-center max-[430px]:px-4 max-[430px]:pb-4">
        <span className="font-display text-[1.7rem] leading-none max-[430px]:text-[1.5rem]" style={{ color: journey.accentColor }}>
          {cardStyle?.icon}
        </span>
        <h3 className="mt-1 flex min-h-[82px] items-center justify-center font-display text-[1.88rem] font-bold leading-tight max-[430px]:min-h-[70px] max-[430px]:text-[1.65rem]" style={{ color: journey.accentColor }}>
          {journey.title}
        </h3>
        <div className="mb-4 mt-3 flex w-full items-center justify-center border-t border-[#E8DFCF] pt-3 max-[430px]:mb-3">
          <span className="font-sans text-[0.88rem] font-bold text-[#7A7E78] max-[430px]:text-[0.82rem]">
            ◎ {insightText}
          </span>
        </div>

        <Button
          type="button"
          accentColor={journey.accentColor}
          onClick={() => (isLocked ? onUnlock : onExplore)(journey)}
          className="relative z-10 mt-auto w-[86%] shadow-[0_12px_22px_-12px_rgba(33,77,59,0.55)] max-[430px]:w-[82%] max-[430px]:py-2"
        >
          {isLocked ? 'Mở khóa hành trình' : 'Tiếp tục hành trình'}
        </Button>
      </div>
    </article>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface FourJourneysScreenProps {
  journeys: SoulMapJourney[];
  onExplore: (journey: SoulMapJourney) => void;
  onCreateSoulMap: () => void;
  userName?: string;
}

// PLACEHOLDER demo stats — not wired to a backend yet.
// TODO: replace with real companion/streak data before launch.
const COMPANION_DAYS_PLACEHOLDER = '186';
const CURRENT_STREAK_PLACEHOLDER = '23 ngày';

export default function FourJourneysScreen({ journeys, onExplore, onCreateSoulMap, userName }: FourJourneysScreenProps) {
  const displayName = userName || 'Linh Nhi';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<JourneyFilter>('Tất cả');
  const [showSoulMapPrompt, setShowSoulMapPrompt] = useState(false);
  const hasAvailableJourney = journeys.some((journey) => journey.status !== 'locked');

  const handleUnlock = (journey: SoulMapJourney) => {
    if (!hasAvailableJourney) {
      setShowSoulMapPrompt(true);
      return;
    }
    onExplore(journey);
  };

  const filteredJourneys = journeys.filter((journey) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      journey.title.toLowerCase().includes(normalizedSearch) ||
      journey.subtitle.toLowerCase().includes(normalizedSearch);

    const matchesFilter =
      activeFilter === 'Tất cả' ||
      (activeFilter === 'Đang học' && journey.status === 'ready') ||
      (activeFilter === 'Khóa' && journey.status === 'locked') ||
      (activeFilter === 'Đề xuất' && ['identity', 'love', 'tuvi'].includes(journey.slug));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F4EB]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 pb-5 pt-32 lg:flex-row lg:px-6 xl:px-8 min-[1800px]:max-w-[1680px] min-[1800px]:gap-7 min-[1800px]:px-10 max-[430px]:gap-4 max-[430px]:px-3 max-[430px]:pb-4 max-[430px]:pt-20">
        <aside className="w-full shrink-0 rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFDF8]/92 p-4 shadow-[0_18px_45px_-30px_rgba(77,52,28,0.45)] lg:sticky lg:top-32 lg:z-20 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:w-[280px] lg:overflow-y-auto min-[1800px]:w-[300px] min-[1800px]:p-5 max-[430px]:rounded-[1.35rem] max-[430px]:p-3.5">
          <div>
            <p className="font-sans text-[0.88rem] font-medium text-[#5E625F]">Xin chào,</p>
            <h1 className="mt-1 truncate font-sans text-[1.35rem] font-extrabold leading-tight tracking-tight text-[#214D3B] max-[430px]:text-[1.18rem]">
              {displayName} <span className="text-[#B68A2F]">✦</span>
            </h1>
            <p className="mt-2 font-sans text-[0.78rem] leading-relaxed text-[#5E625F] max-[430px]:text-[0.72rem]">
              Hôm nay là một ngày tuyệt vời để hiểu bản thân nhiều hơn. 💚
            </p>
          </div>

          <div className="mt-3 border-t border-[#E8DFCF] pt-3">
            <p className="font-sans text-[0.72rem] font-extrabold uppercase tracking-wide text-[#9A8E7A]">Tiến độ tổng thể</p>
            <div className="mt-3 space-y-2 rounded-2xl bg-[#F8F2E8] p-3 max-[430px]:p-2.5">
              <div className="flex items-center gap-3">
                <div className="flex min-w-[118px] items-center gap-2 rounded-xl bg-[#FFFDF8] px-3 py-2 shadow-sm max-[430px]:min-w-[108px]">
                  <Star className="h-3.5 w-3.5 text-[#5E625F]" />
                  <span className="font-sans text-[0.72rem] font-bold text-[#214D3B]">32 / 48</span>
                </div>
                <p className="font-sans text-[0.72rem] leading-snug text-[#7A7E78]">Insight đã mở khóa</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex min-w-[118px] items-center gap-2 rounded-xl bg-[#FFFDF8] px-3 py-2 shadow-sm max-[430px]:min-w-[108px]">
                  <Timer className="h-3.5 w-3.5 text-[#5E625F]" />
                  <span className="font-sans text-[0.72rem] font-bold text-[#214D3B]">{COMPANION_DAYS_PLACEHOLDER}</span>
                </div>
                <p className="font-sans text-[0.72rem] leading-snug text-[#7A7E78]">Ngày đồng hành</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex min-w-[118px] items-center gap-2 rounded-xl bg-[#FFFDF8] px-3 py-2 shadow-sm max-[430px]:min-w-[108px]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#5E625F]" />
                  <span className="font-sans text-[0.72rem] font-bold text-[#214D3B]">{CURRENT_STREAK_PLACEHOLDER}</span>
                </div>
                <p className="font-sans text-[0.72rem] leading-snug text-[#7A7E78]">Streak hiện tại</p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-[#ECD9B8] bg-[#FFF4D9] p-3.5 shadow-sm max-[430px]:p-3">
            <div className="flex items-center gap-2">
              <p className="font-sans text-[0.86rem] font-extrabold text-[#6D4F23]">Insight hôm nay</p>
              <span className="text-[#B68A2F]">✦</span>
            </div>
            <p className="mt-2 font-sans text-[0.78rem] leading-relaxed text-[#6A6254]">
              Bạn thường mạnh nhất khi được làm việc độc lập và sáng tạo.
            </p>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4C891] bg-[#FFFDF8] px-3 py-2 font-sans text-[0.76rem] font-extrabold text-[#B17922] shadow-sm" type="button">
              Đọc thêm insight
            </button>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#E8DFCF] bg-[#FFFDF8] p-3.5 shadow-sm max-[430px]:p-3">
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[#3E7A50]" />
            <div>
              <p className="font-sans text-[0.78rem] font-extrabold text-[#214D3B]">Bạn đang làm rất tốt!</p>
              <p className="mt-1 font-sans text-[0.72rem] leading-relaxed text-[#5E625F]">
                Kiên trì mỗi ngày, bạn sẽ hiểu mình nhiều hơn nữa!
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-4 max-[430px]:flex-col max-[430px]:items-stretch max-[430px]:gap-3">
            <h2 className="font-display text-[1.6rem] font-bold text-[#2C251B] max-[430px]:text-[1.35rem]">Các hành trình của bạn</h2>
            <div className="relative hidden w-[260px] sm:block min-[1800px]:w-[320px] max-[430px]:block max-[430px]:w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8E7A]" />
              <input
                type="search"
                placeholder="Tìm kiếm hành trình"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-full border border-[#E8DFCF] bg-[#FFFDF8] pl-10 pr-4 font-sans text-[0.82rem] text-[#4F514D] shadow-[0_8px_22px_-16px_rgba(77,52,28,0.45)] outline-none placeholder:text-[#A59C8C] focus:border-[#B68A2F] max-[430px]:h-10 max-[430px]:text-[0.78rem]"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2 max-[430px]:gap-1.5">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 font-sans text-[0.78rem] font-bold max-[430px]:px-3 max-[430px]:py-1.5 max-[430px]:text-[0.72rem] ${
                  activeFilter === filter
                    ? 'border-[#3E7A50] bg-[#3E7A50] text-white'
                    : 'border-[#E8DFCF] bg-[#FFFDF8] text-[#6A6254]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:gap-4 min-[1800px]:gap-5 max-[430px]:gap-3">
            {filteredJourneys.map((journey, index) => (
              <JourneyCard key={journey.slug} journey={journey} index={index} onExplore={onExplore} onUnlock={handleUnlock} />
            ))}
          </div>
        </div>
      </div>

      {showSoulMapPrompt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1D2E25]/40 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="soulmap-unlock-title">
          <section className="w-full max-w-md rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8] p-6 text-center shadow-[0_28px_80px_-38px_rgba(33,77,59,0.55)]">
            <span className="grid mx-auto h-12 w-12 place-items-center rounded-full bg-[#FFF1D6] font-display text-2xl text-[#A66D24]">✦</span>
            <h2 id="soulmap-unlock-title" className="mt-4 font-display text-2xl font-bold text-[#214D3B]">Bạn chưa có SoulMap</h2>
            <p className="mt-3 font-reading leading-relaxed text-[#5E625F]">Hãy tạo SoulMap trước để mở khóa các hành trình được thiết kế riêng cho bạn.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => setShowSoulMapPrompt(false)} className="rounded-full border border-[#E8DFCF] bg-white px-5 py-2.5 font-sans text-sm font-extrabold text-[#5E625F]">Để sau</button>
              <button type="button" onClick={onCreateSoulMap} className="rounded-full bg-[#2E3E33] px-5 py-2.5 font-sans text-sm font-extrabold text-white">Tạo SoulMap</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
