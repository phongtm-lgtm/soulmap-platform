import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Crown,
  Edit3,
  FileDown,
  Heart,
  Map as MapIcon,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import type { SoulMapJourney } from '../../types/journey';
import type { JourneySection, JourneySectionId } from '../../types/journeyDetail';
import { getJourneyContent } from '../../data/careerJourneyContent';
import { APP_ASSETS } from '../../assets';
import JourneyDetailHero from './JourneyDetailHero';
import JourneyNavPanel from './JourneyNavPanel';
import JourneyTabNav from './JourneyTabNav';
import JourneySectionBlock from './JourneySectionBlock';
import MarkdownReading from './MarkdownReading';
import TuViJourneyDetail from './TuViJourneyDetail';
import IdentityJourneyDetail from './IdentityJourneyDetail';
import {
  fetchAiReading,
  generateLoveReading,
  type AiReading,
  type LoveReadingRequest,
} from '../../lib/aiReadingsApi';

interface JourneyDetailScreenProps {
  journey: SoulMapJourney;
  onBack: () => void;
  onOpenAiMentor?: () => void;
}

/**
 * Generic journey detail read. Narrative scroll with a sticky nav panel on
 * desktop and a horizontal tab bar on mobile. Content is resolved from the
 * mock registry by slug (no API in phase 1).
 */
export default function JourneyDetailScreen({ journey, onBack, onOpenAiMentor }: JourneyDetailScreenProps) {
  const content = useMemo(() => getJourneyContent(journey.slug), [journey.slug]);
  const { sections, tagline, accentColor } = content;
  const isCareerJourney = journey.slug === 'career';
  const isLoveJourney = journey.slug === 'love';
  const isIdentityJourney = journey.slug === 'identity';
  const isTuViJourney = journey.slug === 'tuvi';

  const [activeId, setActiveId] = useState<JourneySectionId>(sections[0]?.id ?? 'intro');
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [isAiReadingLoading, setIsAiReadingLoading] = useState(false);
  const [aiReadingError, setAiReadingError] = useState<string | null>(null);
  const [loveReading, setLoveReading] = useState<AiReading | null>(null);
  const [isLoveReadingLoading, setIsLoveReadingLoading] = useState(false);
  const [loveReadingError, setLoveReadingError] = useState<string | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isProgrammaticScroll = useRef(false);

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  }, []);

  // Highlight the section closest to the top of the viewport while scrolling.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace('journey-section-', '') as JourneySectionId;
          setActiveId(id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    const nodes = Array.from(sectionRefs.current.values());
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!isCareerJourney) {
      setAiReading(null);
      setAiReadingError(null);
      setIsAiReadingLoading(false);
      return;
    }

    const readingId = Number(localStorage.getItem('soulmap_ai_reading_career_chapter_01_id'));
    if (!readingId) {
      setAiReading(null);
      const isPending = localStorage.getItem('soulmap_ai_reading_career_pending') === 'true';
      setAiReadingError(
        isPending
          ? 'Linh Nhi đang tạo bản đồ sự nghiệp của bạn ở nền. Bạn có thể quay lại chương này sau ít phút.'
          : 'Bạn cần tạo SoulMap trước khi mở hành trình Sự nghiệp.',
      );
      setIsAiReadingLoading(false);
      return;
    }

    let cancelled = false;
    setIsAiReadingLoading(true);
    setAiReadingError(null);
    fetchAiReading(readingId)
      .then((reading) => {
        if (!cancelled) setAiReading(reading);
      })
      .catch(() => {
        if (!cancelled) setAiReadingError('Linh Nhi chưa thể tải bản đồ sự nghiệp lúc này. Bạn thử lại nhé.');
      })
      .finally(() => {
        if (!cancelled) setIsAiReadingLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isCareerJourney]);

  const loadLoveReading = useCallback(async () => {
    setIsLoveReadingLoading(true);
    setLoveReadingError(null);
    try {
      const savedId = Number(localStorage.getItem('soulmap_ai_reading_love_v2_id'));
      if (savedId) {
        try {
          const reading = await fetchAiReading(savedId);
          setLoveReading(reading);
          return;
        } catch {
          localStorage.removeItem('soulmap_ai_reading_love_v2_id');
        }
      }

      const rawBirthInfo = localStorage.getItem('soulmap_birth_info');
      if (!rawBirthInfo) throw new Error('missing birth info');
      const birthInfo = JSON.parse(rawBirthInfo) as {
        name: string;
        birthDate: string;
        birthCalendar: 'solar' | 'lunar';
        birthTime: string;
        gender: 'Nam' | 'Nữ';
        timezone?: number;
        viewYear?: number;
      };
      const [year, month, day] = birthInfo.birthDate.split('-').map(Number);
      const [hour, min] = birthInfo.birthTime.split(':').map(Number);
      const input: LoveReadingRequest = {
        name: birthInfo.name || 'Bạn',
        day,
        month,
        year,
        calendar: birthInfo.birthCalendar,
        gender: birthInfo.gender === 'Nam' ? 'male' : 'female',
        hour,
        min,
        timezone: birthInfo.timezone ?? 1,
        viewYear: birthInfo.viewYear ?? new Date().getFullYear(),
      };
      localStorage.setItem('soulmap_ai_reading_love_pending', 'true');
      const reading = await generateLoveReading(input);
      localStorage.setItem('soulmap_ai_reading_love_v2_id', String(reading.id));
      localStorage.removeItem('soulmap_ai_reading_love_pending');
      setLoveReading(reading);
    } catch {
      localStorage.removeItem('soulmap_ai_reading_love_pending');
      setLoveReadingError('Chưa thể tạo bản đọc Người bạn đời tương lai lúc này. Hãy chắc rằng bạn đã tạo SoulMap trước đó rồi thử lại.');
    } finally {
      setIsLoveReadingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoveJourney) return;
    void loadLoveReading();
  }, [isLoveJourney, loadLoveReading]);

  const handleNavigate = useCallback((id: JourneySectionId) => {
    const el = sectionRefs.current.get(id);
    if (!el) return;
    setActiveId(id);
    isProgrammaticScroll.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  }, []);

  return (
    isTuViJourney ? (
      <TuViJourneyDetail journey={journey} onBack={onBack} />
    ) : (
    <div className="min-h-screen bg-[#F8F4EB] pt-20 pb-16">
      <div className={`mx-auto w-full px-4 md:px-6 ${isCareerJourney ? 'max-w-[1840px]' : 'max-w-[1200px]'}`}>
        {isCareerJourney ? (
          <CareerJourneyDetail
            journey={journey}
            tagline={tagline}
            aiReading={aiReading}
            isAiReadingLoading={isAiReadingLoading}
            aiReadingError={aiReadingError}
            onBack={onBack}
          />
        ) : isLoveJourney ? (
          <LoveJourneyDetail
            journey={journey}
            tagline={tagline}
            reading={loveReading}
            isLoading={isLoveReadingLoading}
            error={loveReadingError}
            onBack={onBack}
            onRetry={loadLoveReading}
          />
        ) : isIdentityJourney ? (
          <IdentityJourneyDetail journey={journey} onBack={onBack} />
        ) : (
          <>
            <JourneyDetailHero journey={journey} tagline={tagline} accentColor={accentColor} onBack={onBack} />

            <JourneyTabNav
              sections={sections}
              activeId={activeId}
              accentColor={accentColor}
              onNavigate={handleNavigate}
            />

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
              <aside className="hidden lg:block">
                <JourneyNavPanel
                  sections={sections}
                  activeId={activeId}
                  accentColor={accentColor}
                  onNavigate={handleNavigate}
                />
              </aside>

              <main className="min-w-0">
                <div className="rounded-[2rem] border border-[#E8DFCF] bg-[#FFFCF8] px-5 py-4 shadow-[0_20px_60px_-44px_rgba(33,77,59,0.32)] md:px-10 md:py-6">
                  {sections.map((section, index) => (
                    <div key={section.id} className="border-b border-[#EFE9DB] last:border-none">
                      <JourneySectionBlock
                        section={section}
                        index={index}
                        accentColor={accentColor}
                        registerRef={registerRef}
                      />
                    </div>
                  ))}
                </div>

                <div
                  className="mt-8 overflow-hidden rounded-[2rem] border p-6 md:p-8"
                  style={{
                    borderColor: `${accentColor}33`,
                    background: `linear-gradient(135deg, ${accentColor}14 0%, #FFFCF8 60%)`,
                  }}
                >
                  <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={APP_ASSETS.linhNhiMascot}
                        alt="Linh Nhi"
                        className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_12px_20px_rgba(65,92,55,0.18)]"
                        draggable={false}
                      />
                      <div>
                        <h3 className="font-display text-[1.7rem] font-bold leading-tight text-[#214D3B]">
                          Còn điều gì bạn muốn hỏi mình không?
                        </h3>
                        <p className="mt-1.5 max-w-[34rem] font-reading text-[0.98rem] leading-relaxed text-[#5E625F]">
                          Mình có thể đi sâu hơn vào tình huống thật của bạn, thay vì chỉ những điều chung chung ở trên. Nhắn cho Linh Nhi nhé.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenAiMentor}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3.5 font-sans text-[0.95rem] font-extrabold text-white shadow-md transition hover:-translate-y-0.5"
                      style={{ backgroundColor: accentColor }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Trò chuyện với Linh Nhi
                    </button>
                  </div>

                  <div className="mt-6 flex items-center gap-3 rounded-full border border-[#E8DFCF] bg-[#FFFCF8] px-4 py-2.5">
                    <input
                      type="text"
                      disabled
                      placeholder="Ví dụ: Mình đang phân vân giữa hai công việc, nên chọn thế nào?"
                      className="min-w-0 flex-1 bg-transparent font-sans text-[0.9rem] text-[#214D3B] outline-none placeholder:text-[#A59C8C]"
                    />
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Send className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </div>
    )
  );
}

interface LoveJourneyDetailProps {
  journey: SoulMapJourney;
  tagline: string;
  reading: AiReading | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
}

function LoveJourneyDetail({
  journey,
  tagline,
  reading,
  isLoading,
  error,
  onBack,
  onRetry,
}: LoveJourneyDetailProps) {
  const accentColor = journey.accentColor || '#B95F75';

  const handleExportPdf = () => {
    document.body.classList.add('love-printing');
    window.print();
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('love-printing');
    }, { once: true });
  };

  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="love-no-print mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#E6D8D5] bg-white px-4 py-2.5 font-sans text-[0.86rem] font-extrabold text-[#332927] shadow-sm transition hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Journey
        </button>
        {reading && (
          <button
            type="button"
            id="love-export-pdf-btn"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 rounded-full border border-[#D9A0B4] bg-[#B95F75] px-4 py-2.5 font-sans text-[0.86rem] font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#A04D62] active:scale-95"
          >
            <FileDown className="h-4 w-4" />
            Xuất PDF
          </button>
        )}
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[#EADAD7] bg-[#FFFCF8] shadow-[0_26px_80px_-58px_rgba(93,42,57,0.5)]">
        <div className="relative overflow-hidden border-b border-[#EFE2DF] px-6 py-8 md:px-10 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,95,117,0.18),transparent_44%),linear-gradient(135deg,#fff9f6_0%,#fffdf9_60%)]" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[700px]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F8E9EC] px-3.5 py-2 font-sans text-[0.76rem] font-extrabold uppercase tracking-[0.1em] text-[#9E4D63]">
                <Heart className="h-4 w-4 fill-current" />
                Love Journey
              </div>
              <h1 className="font-display text-[2.5rem] font-bold leading-none text-[#4A2832] md:text-[3.6rem]">
                {journey.title}
              </h1>
              <p className="mt-4 max-w-[640px] font-reading text-[1.02rem] leading-relaxed text-[#665A58]">{tagline}</p>
            </div>
            <img
              src={journey.imagePath}
              alt=""
              className="h-32 w-32 self-center object-contain drop-shadow-[0_18px_25px_rgba(120,55,73,0.2)] md:h-40 md:w-40"
              draggable={false}
            />
          </div>
        </div>

        <div className="px-5 py-7 md:px-10 md:py-10">
          {isLoading ? (
            <div className="grid min-h-[360px] place-items-center text-center">
              <div>
                <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#F0DADD] border-t-[#B95F75]" />
                <h2 className="mt-5 font-display text-[1.7rem] font-bold text-[#4A2832]">Linh Nhi đang viết chân dung người bạn đời</h2>
                <p className="mt-2 font-reading text-[#766A67]">Bản đọc cần một chút thời gian để đi đủ sâu, có cả điểm hay lẫn điểm cần tỉnh táo.</p>
              </div>
            </div>
          ) : error ? (
            <div className="grid min-h-[320px] place-items-center text-center">
              <div className="max-w-md">
                <Heart className="mx-auto h-10 w-10 text-[#B95F75]" />
                <p className="mt-4 font-reading leading-relaxed text-[#665A58]">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-5 rounded-full px-5 py-3 font-sans text-[0.88rem] font-extrabold text-white shadow-md transition hover:-translate-y-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : reading ? (
            <MarkdownReading content={reading.content} accentColor={accentColor} />
          ) : null}
        </div>
      </section>
    </div>
  );
}

interface CareerJourneyDetailProps {
  journey: SoulMapJourney;
  tagline: string;
  aiReading: AiReading | null;
  isAiReadingLoading: boolean;
  aiReadingError: string | null;
  onBack: () => void;
}

function CareerJourneyDetail({
  journey,
  tagline,
  aiReading,
  isAiReadingLoading,
  aiReadingError,
  onBack,
}: CareerJourneyDetailProps) {
  const router = useRouter();
  const handleExportPdf = () => {
    document.body.classList.add('career-printing');
    window.print();
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('career-printing');
    }, { once: true });
  };

  if (!isAiReadingLoading && !aiReading && aiReadingError) {
    return (
      <div className="mx-auto max-w-[1080px]">
        <CareerHero journey={journey} tagline={tagline} />
        <main className="mt-6 rounded-[2rem] border border-[#E8DFCF] bg-[#FFFCF8] px-5 py-7 shadow-[0_20px_60px_-44px_rgba(33,77,59,0.28)] md:px-10 md:py-10">
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <Sparkles className="h-11 w-11 text-[#A66D24]" />
            <h2 className="mt-5 font-display text-2xl font-bold text-[#214D3B]">Hành trình Sự nghiệp chưa sẵn sàng</h2>
            <p className="mt-3 max-w-lg font-reading leading-relaxed text-[#5E625F]">Bạn cần tạo SoulMap trước khi mở hành trình Sự nghiệp.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => router.push('/mbti-test')} className="inline-flex items-center gap-2 rounded-full border border-[#D7B77E] bg-[#FFF6E5] px-5 py-2.5 font-sans text-sm font-extrabold text-[#87571B]">
                <Sparkles className="h-4 w-4" />
                Mở hành trình
              </button>
              <button type="button" onClick={onBack} className="rounded-full bg-[#2E3E33] px-5 py-2.5 font-sans text-sm font-extrabold text-white">Về danh sách Journey</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[250px_minmax(0,1fr)_300px]">
      <CareerLeftRail onBack={onBack} onExportPdf={handleExportPdf} />

      <main className="min-w-0 rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_24px_70px_-52px_rgba(62,41,22,0.38)] md:p-6">
        <CareerHero journey={journey} tagline={tagline} />

        <div className="mt-8 space-y-8">
          <CareerAiReadingSection aiReading={aiReading} isAiReadingLoading={isAiReadingLoading} aiReadingError={aiReadingError} onBack={onBack} />
        </div>
      </main>

      <CareerRightRail />
    </div>
  );
}

function CareerLeftRail({
  onBack,
  onExportPdf,
}: {
  onBack: () => void;
  onExportPdf: () => void;
}) {
  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <section className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#E6DDCE] bg-white px-3.5 py-2 font-sans text-[0.84rem] font-extrabold text-[#214D3B] shadow-sm transition hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Journey
        </button>

        <div className="mt-7">
          <p className="font-sans text-[0.82rem] font-extrabold text-[#214D3B]">Hành trình</p>
          <h2 className="mt-1 font-display text-[1.8rem] font-bold leading-none text-[#9A5D24]">Sự nghiệp</h2>
        </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between font-sans text-[0.82rem] font-extrabold text-[#214D3B]">
             <span>Bản đọc cá nhân hóa</span>
             <span>Sẵn sàng</span>
            </div>
            <div className="h-2 rounded-full bg-[#EFE9DB]">
             <div className="h-full w-full rounded-full bg-[#17483D]" />
            </div>
            <div className="mt-5 rounded-xl bg-[#F8EFE2] px-3 py-3 font-sans text-[0.78rem] font-semibold text-[#9A5D24]">
             <BookOpen className="mr-2 inline h-4 w-4" />
             Bản đồ sự nghiệp được đọc từ cùng hồ sơ SoulMap của bạn.
            </div>
          </div>

        <button
          type="button"
          id="career-export-pdf-btn"
          onClick={onExportPdf}
          className="career-no-print mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#C2873B] bg-[#9A5D24] px-4 py-3 font-sans text-[0.84rem] font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#7F4D1D] active:scale-95"
        >
          <FileDown className="h-4 w-4" />
          Xuất PDF
        </button>
      </section>

      <section className="hidden overflow-hidden rounded-[1.5rem] border border-[#E8DFCF] bg-[#F9F0E1] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)] xl:block">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F5DFB9] text-[#C2873B]">
            <Crown className="h-8 w-8" />
          </div>
          <div>
            <p className="font-sans text-[0.78rem] font-extrabold text-[#214D3B]">Mở khóa toàn bộ hành trình</p>
            <p className="mt-1 font-sans text-[0.72rem] leading-relaxed text-[#6F756F]">Nhận góc nhìn chuyên sâu và lộ trình phát triển cá nhân hóa.</p>
          </div>
        </div>
        <button type="button" className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#123D5A] px-4 py-3 font-sans text-sm font-extrabold text-white transition hover:-translate-y-0.5">
          <Crown className="h-4 w-4 text-[#F3C85B]" />
          Mở khóa ngay
        </button>
      </section>
    </aside>
  );
}

function CareerHero({ journey, tagline }: { journey: SoulMapJourney; tagline: string }) {
  return (
    <header className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-[#D7B77E] p-7 text-[#36251A] md:min-h-[330px] md:p-8">
      <img src={journey.imagePath} alt="" className="absolute inset-0 h-full w-full object-cover opacity-100" draggable={false} />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,244,215,0.98)_0%,rgba(252,235,196,0.82)_34%,rgba(250,230,193,0.28)_58%,rgba(22,35,45,0)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.06),transparent_26%)]" />
      <div className="relative z-[1] flex min-h-[244px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-[#E7C98E] bg-[#FFF8ED]/80 px-4 py-2 font-sans text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[#9A5D24] shadow-sm">
            SoulMap Journey · Sự nghiệp
          </span>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white/86 px-4 py-3 font-sans text-[0.82rem] font-extrabold text-[#214D3B] shadow-sm transition hover:bg-white">
            <Bookmark className="h-4 w-4" />
            Đánh dấu
          </button>
        </div>

        <div>
          <h1 className="max-w-[520px] font-display text-[3rem] font-bold leading-[1.02] tracking-[-0.03em] !text-[#214D3B] [text-shadow:0_2px_12px_rgba(255,248,226,0.7)] md:text-[4rem]">
            Bản đồ sự nghiệp
          </h1>
          <p className="mt-7 max-w-[520px] font-display text-[1.18rem] italic leading-relaxed !text-[#55402D] [text-shadow:0_1px_8px_rgba(255,248,226,0.85)]">
            “{tagline || 'Sự nghiệp của bạn không sinh ra để đi theo một con đường bằng phẳng.'}”
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E7C98E] bg-[#FFF8ED]/75 px-4 py-2 font-sans text-[0.82rem] font-bold text-[#6D4A25]">
              <BookOpen className="h-4 w-4" />
              ≈ 8 phút đọc
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E7C98E] bg-[#FFF8ED]/75 px-4 py-2 font-sans text-[0.82rem] font-bold text-[#6D4A25]">
              <MapIcon className="h-4 w-4" />
              Khám phá 12 góc nhìn
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function CareerAiReadingSection({
  aiReading,
  isAiReadingLoading,
  aiReadingError,
  onBack,
}: {
  aiReading: AiReading | null;
  isAiReadingLoading: boolean;
  aiReadingError: string | null;
  onBack: () => void;
}) {
  return (
    <section className="border-t border-[#E8DFCF] pt-8">
      <div className="rounded-xl border border-[#E8DFCF] bg-[#FFF9F0] p-5 md:p-6">
        {isAiReadingLoading && (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DFCF] border-t-[#9A5D24]" />
            <p className="mt-4 font-sans text-[0.94rem] font-bold text-[#24533E]">Linh Nhi đang mở bản đồ sự nghiệp của bạn...</p>
          </div>
        )}

        {!isAiReadingLoading && aiReadingError && (
          <div className="mx-auto flex min-h-[180px] max-w-[560px] flex-col items-center justify-center text-center">
            <p className="font-display text-[1.5rem] font-bold text-[#214D3B]">Chưa có bản đồ sự nghiệp</p>
            <p className="mt-3 font-reading text-[1rem] leading-relaxed text-[#5E625F]">{aiReadingError}</p>
            <button type="button" onClick={onBack} className="mt-5 rounded-full bg-[#24533E] px-5 py-2.5 font-sans text-[0.88rem] font-extrabold text-white transition hover:-translate-y-0.5">
              Quay lại tạo SoulMap
            </button>
          </div>
        )}

        {!isAiReadingLoading && aiReading && (
          <article>
            <MarkdownReading content={aiReading.deepReadingMarkdown || aiReading.content} />
          </article>
        )}
      </div>
    </section>
  );
}

function CareerRightRail() {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
      <section className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-sans text-[0.84rem] font-extrabold text-[#214D3B]"><BookOpen className="mr-1.5 inline h-4 w-4 text-[#B17835]" />Ghi chú nhanh</p>
          <Edit3 className="h-4 w-4 text-[#214D3B]" />
        </div>
        <textarea disabled placeholder="Ghi lại những điều bạn tâm đắc..." className="h-20 w-full resize-none rounded-xl border border-[#E8DFCF] bg-white px-3 py-3 font-sans text-[0.82rem] outline-none placeholder:text-[#A59C8C]" />
      </section>

    </aside>
  );
}
