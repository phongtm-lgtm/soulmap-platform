import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  Check,
  Crown,
  Edit3,
  Heart,
  Lock,
  Map as MapIcon,
  MessageCircle,
  Mountain,
  Send,
  Sparkles,
  Target,
  Trophy,
  WandSparkles,
  Zap,
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
import {
  fetchAiReading,
  generateCareerTalentReading,
  generateLoveReading,
  type AiReading,
  type CareerReadingRequest,
  type LoveReadingRequest,
} from '../../lib/aiReadingsApi';

interface JourneyDetailScreenProps {
  journey: SoulMapJourney;
  onBack: () => void;
  initialCareerChapter?: 1 | 3;
  onCareerChapterChange?: (chapter: 1 | 3) => void;
}

/**
 * Generic journey detail read. Narrative scroll with a sticky nav panel on
 * desktop and a horizontal tab bar on mobile. Content is resolved from the
 * mock registry by slug (no API in phase 1).
 */
export default function JourneyDetailScreen({ journey, onBack, initialCareerChapter = 1, onCareerChapterChange }: JourneyDetailScreenProps) {
  const content = useMemo(() => getJourneyContent(journey.slug), [journey.slug]);
  const { sections, tagline, accentColor } = content;
  const isCareerJourney = journey.slug === 'career';
  const isLoveJourney = journey.slug === 'love';
  const isTuViJourney = journey.slug === 'tuvi';

  const [activeId, setActiveId] = useState<JourneySectionId>(sections[0]?.id ?? 'intro');
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [isAiReadingLoading, setIsAiReadingLoading] = useState(false);
  const [aiReadingError, setAiReadingError] = useState<string | null>(null);
  const [loveReading, setLoveReading] = useState<AiReading | null>(null);
  const [isLoveReadingLoading, setIsLoveReadingLoading] = useState(false);
  const [loveReadingError, setLoveReadingError] = useState<string | null>(null);
  const [activeCareerChapter, setActiveCareerChapter] = useState<1 | 3>(initialCareerChapter);
  const activeCareerChapterRef = useRef<1 | 3>(1);
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
        if (!cancelled && initialCareerChapter === 1 && activeCareerChapterRef.current === 1) setAiReading(reading);
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
  }, [initialCareerChapter, isCareerJourney]);

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
      setLoveReadingError('Chưa thể tạo Bản đồ tình yêu lúc này. Hãy chắc rằng bạn đã tạo SoulMap trước đó rồi thử lại.');
    } finally {
      setIsLoveReadingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoveJourney) return;
    void loadLoveReading();
  }, [isLoveJourney, loadLoveReading]);

  const loadCareerChapter = useCallback(async (chapter: 1 | 3, updateUrl = true) => {
    activeCareerChapterRef.current = chapter;
    setActiveCareerChapter(chapter);
    if (updateUrl) onCareerChapterChange?.(chapter);
    if (chapter === 1) {
      const readingId = Number(localStorage.getItem('soulmap_ai_reading_career_chapter_01_id'));
      if (!readingId) return;
      setIsAiReadingLoading(true);
      setAiReadingError(null);
      try {
        const reading = await fetchAiReading(readingId);
        if (activeCareerChapterRef.current === chapter) setAiReading(reading);
      } catch {
        setAiReadingError('Linh Nhi chưa thể tải bản đồ sự nghiệp lúc này. Bạn thử lại nhé.');
      } finally {
        setIsAiReadingLoading(false);
      }
      return;
    }

    setIsAiReadingLoading(true);
    setAiReadingError(null);
    try {
      const savedId = Number(localStorage.getItem('soulmap_ai_reading_career_chapter_03_v2_id'));
      if (savedId) {
        const reading = await fetchAiReading(savedId);
        if (activeCareerChapterRef.current === chapter) setAiReading(reading);
        return;
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
      const input: CareerReadingRequest = {
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
      const reading = await generateCareerTalentReading(input);
      localStorage.setItem('soulmap_ai_reading_career_chapter_03_v2_id', String(reading.id));
      if (activeCareerChapterRef.current === chapter) setAiReading(reading);
    } catch {
      if (activeCareerChapterRef.current === chapter) {
        setAiReading(null);
        setAiReadingError('Chưa thể tạo chương Thiên phú lúc này. Hãy chắc rằng bạn đã tạo SoulMap trước đó rồi thử lại.');
      }
    } finally {
      if (activeCareerChapterRef.current === chapter) setIsAiReadingLoading(false);
    }
  }, [onCareerChapterChange]);

  useEffect(() => {
    if (!isCareerJourney || initialCareerChapter === activeCareerChapterRef.current) return;
    void loadCareerChapter(initialCareerChapter, false);
  }, [initialCareerChapter, isCareerJourney, loadCareerChapter]);

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
    <div className="min-h-screen bg-[#FAF6EE] pt-20 pb-16">
      <div className={`mx-auto w-full px-4 md:px-6 ${isCareerJourney ? 'max-w-[1840px]' : 'max-w-[1200px]'}`}>
        {isCareerJourney ? (
          <CareerJourneyDetail
            journey={journey}
            sections={sections}
            tagline={tagline}
            activeId={activeId}
            aiReading={aiReading}
            isAiReadingLoading={isAiReadingLoading}
            aiReadingError={aiReadingError}
            activeChapter={activeCareerChapter}
            onSelectChapter={loadCareerChapter}
            onBack={onBack}
            onNavigate={handleNavigate}
            registerRef={registerRef}
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

  return (
    <div className="mx-auto max-w-[1120px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E6D8D5] bg-white px-4 py-2.5 font-sans text-[0.86rem] font-extrabold text-[#332927] shadow-sm transition hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Journey
      </button>

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
                <h2 className="mt-5 font-display text-[1.7rem] font-bold text-[#4A2832]">Linh Nhi đang viết Bản đồ tình yêu</h2>
                <p className="mt-2 font-reading text-[#766A67]">Bản đọc cần một chút thời gian để đi đủ sâu và giữ đúng câu chuyện của bạn.</p>
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
  sections: JourneySection[];
  tagline: string;
  activeId: JourneySectionId;
  aiReading: AiReading | null;
  isAiReadingLoading: boolean;
  aiReadingError: string | null;
  activeChapter: 1 | 3;
  onSelectChapter: (chapter: 1 | 3) => void;
  onBack: () => void;
  onNavigate: (id: JourneySectionId) => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

const CAREER_CHAPTERS = [
  'Bản đồ sự nghiệp',
  'DNA nghề nghiệp',
  'Thiên phú & năng lực',
  'Động lực bên trong',
  'Môi trường phù hợp',
  'Nhóm nghề nghiệp',
  'Tiềm năng lãnh đạo',
  'Thử thách & rủi ro',
  'Cơ hội bứt phá',
  'Chiến lược dài hạn',
  'Lời nhắn cuối',
];

function CareerJourneyDetail({
  journey,
  sections,
  tagline,
  activeId,
  aiReading,
  isAiReadingLoading,
  aiReadingError,
  activeChapter,
  onSelectChapter,
  onBack,
  onNavigate,
  registerRef,
}: CareerJourneyDetailProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[250px_minmax(0,1fr)_300px]">
      <CareerLeftRail activeChapter={activeChapter} onBack={onBack} onSelectChapter={onSelectChapter} />

      <main className="min-w-0 rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_24px_70px_-52px_rgba(62,41,22,0.38)] md:p-6">
        <CareerHero journey={journey} tagline={tagline} activeChapter={activeChapter} />

        <div className="mt-8 space-y-8">
          {activeChapter === 1 ? (
            <>
              <CareerPathSection section={sections[0]} aiReading={aiReading} registerRef={registerRef} />
              <CareerGrowthSection section={sections[1]} aiReading={aiReading} registerRef={registerRef} />
              <CareerAiReadingSection section={sections[2]} aiReading={aiReading} isAiReadingLoading={isAiReadingLoading} aiReadingError={aiReadingError} onBack={onBack} registerRef={registerRef} />
            </>
          ) : (
            <CareerTalentChapter aiReading={aiReading} isLoading={isAiReadingLoading} error={aiReadingError} />
          )}
        </div>
      </main>

      <CareerRightRail />
    </div>
  );
}

function CareerLeftRail({
  activeChapter,
  onBack,
  onSelectChapter,
}: {
  activeChapter: 1 | 3;
  onBack: () => void;
  onSelectChapter: (chapter: 1 | 3) => void;
}) {
  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <section className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#E6DDCE] bg-white px-3.5 py-2 font-sans text-[0.84rem] font-extrabold text-[#22251F] shadow-sm transition hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Journey
        </button>

        <div className="mt-7">
          <p className="font-sans text-[0.82rem] font-extrabold text-[#22251F]">Hành trình</p>
          <h2 className="mt-1 font-display text-[1.8rem] font-bold leading-none text-[#9A5D24]">Sự nghiệp</h2>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between font-sans text-[0.82rem] font-extrabold text-[#22251F]">
            <span>Tiến độ hành trình</span>
            <span>40%</span>
          </div>
          <div className="h-2 rounded-full bg-[#EFE9DB]">
            <div className="h-full w-[40%] rounded-full bg-[#17483D]" />
          </div>
          <div className="mt-5 rounded-xl bg-[#F8EFE2] px-3 py-3 font-sans text-[0.78rem] font-semibold text-[#9A5D24]">
            <BookOpen className="mr-2 inline h-4 w-4" />
            Bạn đang khám phá bản đồ sự nghiệp
          </div>
        </div>

        <div className="mt-7">
          <p className="mb-3 font-sans text-[0.82rem] font-extrabold text-[#22251F]">Danh sách chương</p>
          <div className="space-y-1.5">
            {CAREER_CHAPTERS.map((title, index) => {
              const chapterNumber = index + 1;
              if (chapterNumber === 3) return null;
              const isAvailable = chapterNumber === 1 || chapterNumber === 3;
              const isActive = chapterNumber === activeChapter;
              const isDone = isAvailable && !isActive;
              const isLocked = !isAvailable;
              return (
                <button
                  key={title}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onSelectChapter(chapterNumber as 1 | 3)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-sans text-[0.82rem] transition ${
                    isActive ? 'bg-[#F8ECDC] text-[#9A5D24] shadow-sm' : 'text-[#22251F] hover:bg-[#FAF6EE]'
                  } ${!isAvailable ? 'cursor-default opacity-65' : ''}`}
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center text-[#9A5D24]">
                    {isLocked ? <Lock className="h-4 w-4 text-[#A8A194]" /> : <Sparkles className="h-4 w-4" />}
                  </span>
                  <span className="w-6 shrink-0 tabular-nums text-[#5E625F]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{title}</span>
                  {isDone && <Check className="h-4 w-4 shrink-0 text-[#4F8A68]" />}
                  {isActive && <ArrowRight className="h-4 w-4 shrink-0 text-[#C2873B]" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hidden overflow-hidden rounded-[1.5rem] border border-[#E8DFCF] bg-[#F9F0E1] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)] xl:block">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F5DFB9] text-[#C2873B]">
            <Crown className="h-8 w-8" />
          </div>
          <div>
            <p className="font-sans text-[0.78rem] font-extrabold text-[#173124]">Mở khóa toàn bộ hành trình</p>
            <p className="mt-1 font-sans text-[0.72rem] leading-relaxed text-[#6F756F]">Nhận góc nhìn chuyên sâu và lộ trình phát triển cá nhân hóa.</p>
          </div>
        </div>
        <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#123D5A] px-4 py-3 font-sans text-sm font-extrabold text-white transition hover:-translate-y-0.5">
          <Crown className="h-4 w-4 text-[#F3C85B]" />
          Mở khóa ngay
        </button>
      </section>
    </aside>
  );
}

function CareerHero({ journey, tagline, activeChapter }: { journey: SoulMapJourney; tagline: string; activeChapter: 1 | 3 }) {
  const isTalentChapter = activeChapter === 3;
  return (
    <header className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-[#D7B77E] p-7 text-[#36251A] md:min-h-[330px] md:p-8">
      <img src={journey.imagePath} alt="" className="absolute inset-0 h-full w-full object-cover opacity-100" draggable={false} />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,244,215,0.98)_0%,rgba(252,235,196,0.82)_34%,rgba(250,230,193,0.28)_58%,rgba(22,35,45,0)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.06),transparent_26%)]" />
      <div className="relative z-[1] flex min-h-[244px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-[#E7C98E] bg-[#FFF8ED]/80 px-4 py-2 font-sans text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[#9A5D24] shadow-sm">
            Chapter {String(activeChapter).padStart(2, '0')}
          </span>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white/86 px-4 py-3 font-sans text-[0.82rem] font-extrabold text-[#22251F] shadow-sm transition hover:bg-white">
            <Bookmark className="h-4 w-4" />
            Đánh dấu
          </button>
        </div>

        <div>
          <h1 className="max-w-[520px] font-display text-[3rem] font-bold leading-[1.02] tracking-[-0.03em] !text-[#214D3B] [text-shadow:0_2px_12px_rgba(255,248,226,0.7)] md:text-[4rem]">
            {isTalentChapter ? 'Thiên phú và năng lực nổi bật' : 'Bản đồ sự nghiệp'}
          </h1>
          <p className="mt-7 max-w-[520px] font-display text-[1.18rem] italic leading-relaxed !text-[#55402D] [text-shadow:0_1px_8px_rgba(255,248,226,0.85)]">
            “{isTalentChapter ? 'Nhìn ra điều bạn làm tốt một cách tự nhiên.' : tagline || 'Sự nghiệp của bạn không sinh ra để đi theo một con đường bằng phẳng.'}”
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

function CareerPathSection({ section, aiReading, registerRef }: { section?: JourneySection; aiReading: AiReading | null; registerRef: (id: string, el: HTMLElement | null) => void }) {
  if (!section) return null;

  const careerPath = aiReading?.careerPath;
  const cards = careerPath?.cards?.length === 3
    ? careerPath.cards
    : [
        { icon: Target, title: 'Thử thách', description: 'Cần việc khó để kích thích bản lĩnh.' },
        { icon: Mountain, title: 'Mục tiêu', description: 'Cần biết mình đang hướng đến đâu.' },
        { icon: Trophy, title: 'Cảm giác chiến thắng', description: 'Cần thấy mình vượt qua giới hạn.' },
      ];
  const fallbackIcons = [Target, Mountain, Trophy];

  return (
    <section id={`journey-section-${section.id}`} ref={(el) => registerRef(section.id, el)} className="scroll-mt-28">
      <CareerSectionTitle icon={<Target className="h-7 w-7" />} number="1" title="Con đường của bạn" tone="gold" />
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_240px]">
        <div>
          <p className="max-w-[520px] font-sans text-[0.98rem] leading-relaxed text-[#22251F]">
            {careerPath?.intro || 'Bạn không phải kiểu người hợp với một công việc lặp lại nhiều năm. Bạn cần:'}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {cards.map((item, index) => {
              const Icon = 'icon' in item && item.icon ? item.icon : fallbackIcons[index] || Target;
              return (
                <div key={item.title} className="rounded-xl border border-[#E8DFCF] bg-[#FCF5EA] p-4 shadow-sm">
                  <Icon className="h-8 w-8 text-[#C2873B]" />
                  <p className="mt-3 font-sans text-[0.88rem] font-extrabold text-[#3A2A1E]">{item.title}</p>
                  <p className="mt-1.5 font-sans text-[0.78rem] leading-relaxed text-[#6F756F]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <blockquote className="rounded-xl border border-[#E8DFCF] bg-[#FCF5EA] p-6 shadow-sm">
          <span className="font-display text-4xl font-bold text-[#C2873B]">“</span>
          <p className="mt-2 font-display text-[1.55rem] font-bold leading-tight text-[#4A2D1F]">{careerPath?.quote || 'Bạn cần được va vào việc thật.'}</p>
          <span className="mt-5 block h-px w-24 bg-[#C2873B]" />
        </blockquote>
      </div>
    </section>
  );
}

function CareerGrowthSection({ section, aiReading, registerRef }: { section?: JourneySection; aiReading: AiReading | null; registerRef: (id: string, el: HTMLElement | null) => void }) {
  if (!section) return null;

  const strong = aiReading?.growthDrivers?.strongWhen?.length
    ? aiReading.growthDrivers.strongWhen
    : [
        { title: 'Có cạnh tranh', description: 'Được tin tưởng và có không gian vượt lên.' },
        { title: 'Có quyền tự quyết', description: 'Được tin tưởng và trao quyền rõ ràng.' },
        { title: 'Có kết quả rõ ràng', description: 'Được đo lường bằng con số cụ thể.' },
        { title: 'Có cơ hội thăng tiến', description: 'Nỗ lực tốt được ghi nhận và tưởng thưởng xứng đáng.' },
      ];
  const weak = aiReading?.growthDrivers?.notFitWith?.length
    ? aiReading.growthDrivers.notFitWith
    : [
        { title: 'Công việc quá lặp lại' },
        { title: 'Không được ghi nhận' },
        { title: 'Bị quản lý vi mô' },
        { title: 'Thiếu cơ hội phát triển' },
      ];

  return (
    <section id={`journey-section-${section.id}`} ref={(el) => registerRef(section.id, el)} className="scroll-mt-28">
      <CareerSectionTitle icon={<BriefcaseBusiness className="h-7 w-7" />} number="2" title="Điều khiến bạn phát triển nhanh" tone="blue" />
      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-[#DDE7D4] bg-[#F5F8EF] p-5">
          <p className="font-display text-[1.15rem] font-bold text-[#24533E]">Bạn phát triển mạnh nhất khi:</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {strong.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#9FBCAC] bg-white text-[#24533E]">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-sans text-[0.86rem] font-extrabold text-[#173124]">{item.title}</p>
                  <p className="mt-1 font-sans text-[0.76rem] leading-relaxed text-[#5E625F]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#F0D9D2] bg-[#FFF5F1] p-5">
          <p className="font-display text-[1.15rem] font-bold text-[#B84D43]">Không hợp với:</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {weak.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E8B7AE] bg-white text-[#D05248]">
                  <Zap className="h-4 w-4" />
                </span>
                <p className="font-sans text-[0.84rem] font-extrabold text-[#3A2A1E]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerAiReadingSection({
  section,
  aiReading,
  isAiReadingLoading,
  aiReadingError,
  onBack,
  registerRef,
}: {
  section?: JourneySection;
  aiReading: AiReading | null;
  isAiReadingLoading: boolean;
  aiReadingError: string | null;
  onBack: () => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
}) {
  if (!section) return null;

  return (
    <section id={`journey-section-${section.id}`} ref={(el) => registerRef(section.id, el)} className="scroll-mt-28 border-t border-[#E8DFCF] pt-8">
      <CareerSectionTitle icon={<Sparkles className="h-7 w-7" />} number="3" title="Linh Nhi đọc sâu bản đồ của bạn" tone="gold" />
      <div className="mt-5 rounded-xl border border-[#E8DFCF] bg-[#FFF9F0] p-5 md:p-6">
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
            <p className="font-sans text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-[#9A5D24]">
              {aiReading.chapterTitle || 'Phân tích cá nhân hóa'}
            </p>
            <div className="mt-4">
              <MarkdownReading content={aiReading.deepReadingMarkdown || aiReading.content} scrollable />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

function CareerTalentChapter({ aiReading, isLoading, error }: { aiReading: AiReading | null; isLoading: boolean; error: string | null }) {
  if (isLoading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFF9F0] text-center">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#E8DFCF] border-t-[#9A5D24]" />
        <p className="mt-5 font-display text-[1.35rem] font-bold text-[#214D3B]">Linh Nhi đang tìm ba năng lực nổi bật của bạn...</p>
        <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-[#6F756F]">Chương này được tạo riêng từ dữ liệu SoulMap và có thể mất một chút thời gian.</p>
      </div>
    );
  }

  if (error || !aiReading) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFF9F0] px-6 text-center">
        <WandSparkles className="h-10 w-10 text-[#C2873B]" />
        <h2 className="mt-4 font-display text-2xl font-bold text-[#214D3B]">Chương thiên phú chưa sẵn sàng</h2>
        <p className="mt-3 max-w-lg font-reading leading-relaxed text-[#5E625F]">{error || 'Bạn thử mở lại chương này sau nhé.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <CareerSectionTitle icon={<WandSparkles className="h-7 w-7" />} number="1" title="Ba năng lực nổi bật" tone="gold" />
        <p className="mt-5 max-w-3xl font-reading text-[1.03rem] leading-[1.8] text-[#4c534d]">{aiReading.talentIntro}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {aiReading.talents?.map((talent, index) => (
            <article key={talent.title} className="relative overflow-hidden rounded-2xl border border-[#E8DFCF] bg-[#FCF5EA] p-5 shadow-sm">
              <span className="absolute right-4 top-3 font-display text-5xl font-bold text-[#E8D2AE]">0{index + 1}</span>
              <Sparkles className="h-7 w-7 text-[#9A5D24]" />
              <h3 className="mt-4 pr-10 font-display text-[1.4rem] font-bold text-[#3A2A1E]">{talent.title}</h3>
              <p className="mt-3 font-reading leading-relaxed text-[#5E625F]">{talent.description}</p>
              <div className="mt-5 border-t border-[#E4D6C2] pt-4">
                <p className="font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#9A5D24]">Trong công việc</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#3A2A1E]">{talent.workExpression}</p>
              </div>
              <p className="mt-4 rounded-xl bg-white/70 p-3 font-sans text-[0.82rem] leading-relaxed text-[#24533E]">{talent.developmentTip}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <CareerSectionTitle icon={<Zap className="h-7 w-7" />} number="2" title="Khi các năng lực đi cùng nhau" tone="blue" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl bg-[#123D5A] p-6 text-white shadow-sm">
            <p className="font-display text-[1.35rem] font-bold !text-white">Cách bạn tạo ra giá trị riêng</p>
            <p className="mt-3 font-reading text-[1rem] leading-[1.8] text-white/85">{aiReading.combinationInsight}</p>
          </div>
          <div className="rounded-2xl border border-[#F0D9D2] bg-[#FFF5F1] p-5">
            <p className="font-display text-[1.2rem] font-bold !text-[#B84D43]">Khi dùng quá tay</p>
            <div className="mt-4 space-y-3">
              {aiReading.balanceRisks?.map((risk) => (
                <div key={risk.title} className="flex gap-3">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[#D05248]">!</span>
                  <div>
                    <p className="font-sans text-sm font-extrabold text-[#3A2A1E]">{risk.title}</p>
                    <p className="mt-1 font-sans text-[0.82rem] leading-relaxed text-[#6F756F]">{risk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <CareerSectionTitle icon={<BookOpen className="h-7 w-7" />} number="3" title="Linh Nhi luận sâu về năng lực của bạn" tone="gold" />
        <div className="mt-5 rounded-2xl border border-[#E8DFCF] bg-[#FFF9F0] p-5 md:p-7">
          <MarkdownReading content={aiReading.deepReadingMarkdown || aiReading.content} scrollable />
        </div>
      </section>
    </div>
  );
}

function CareerSectionTitle({ icon, number, title, tone }: { icon: React.ReactNode; number: string; title: string; tone: 'gold' | 'blue' }) {
  const color = tone === 'gold' ? '#123D5A' : '#123D5A';
  const bg = tone === 'gold' ? '#123D5A' : '#123D5A';
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#F4D99B] text-white shadow-sm" style={{ backgroundColor: bg }}>
        {icon}
      </span>
      <h2 className="font-display text-[1.5rem] font-bold text-[#3A2A1E] md:text-[1.75rem]">
        <span style={{ color }}>{number}. </span>
        {title}
      </h2>
      <span className="hidden h-px flex-1 bg-[#E8DFCF] md:block" />
    </div>
  );
}

function CareerRightRail() {
  const suggestions = [
    'Mình có hợp làm quản lý không?',
    'Ngành nghề nào phù hợp nhất với mình?',
    'Vì sao mình dễ chán công việc?',
    'Làm sao để tăng tốc sự nghiệp?',
  ];

  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
      <section className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)]">
        <div className="flex items-center gap-3">
          <img src={APP_ASSETS.linhNhiMascot} alt="Linh Nhi" className="h-14 w-14 object-contain" draggable={false} />
          <div>
            <h3 className="font-display text-[1.35rem] font-bold text-[#9A5D24]">Linh Nhi ✨</h3>
            <p className="font-sans text-[0.82rem] text-[#5E625F]">AI đồng hành cùng bạn</p>
          </div>
        </div>
        <img src={APP_ASSETS.linhNhiMascot} alt="" className="mx-auto mt-4 h-36 w-36 object-contain drop-shadow-[0_18px_26px_rgba(65,92,55,0.14)]" draggable={false} />
        <p className="mt-4 rounded-xl border border-[#E8DFCF] bg-[#F8EFE2] p-4 font-sans text-[0.84rem] leading-relaxed text-[#22251F]">
          Mình ở đây để giúp bạn hiểu sâu hơn về bản thân và đưa ra những lựa chọn phù hợp trong hành trình sự nghiệp.
        </p>

        <div className="mt-5">
          <p className="mb-2 font-sans text-[0.82rem] font-extrabold text-[#22251F]">Hỏi Linh Nhi về chương này</p>
          <div className="flex items-center gap-2 rounded-xl border border-[#E8DFCF] bg-white px-3 py-2.5">
            <input disabled placeholder="Bạn muốn hỏi điều gì?" className="min-w-0 flex-1 bg-transparent font-sans text-[0.82rem] outline-none placeholder:text-[#A59C8C]" />
            <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-[#E6C493] text-[#9A5D24]">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#E8DFCF] bg-white p-3">
          <p className="mb-2 font-sans text-[0.82rem] font-extrabold text-[#22251F]">Gợi ý câu hỏi</p>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" className="flex w-full items-center justify-between gap-2 font-sans text-[0.78rem] text-[#4c534d] transition hover:text-[#9A5D24]">
                <span className="truncate">{suggestion}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4 shadow-[0_20px_60px_-48px_rgba(62,41,22,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-sans text-[0.84rem] font-extrabold text-[#22251F]"><BookOpen className="mr-1.5 inline h-4 w-4 text-[#B17835]" />Ghi chú nhanh</p>
          <Edit3 className="h-4 w-4 text-[#22251F]" />
        </div>
        <textarea disabled placeholder="Ghi lại những điều bạn tâm đắc..." className="h-20 w-full resize-none rounded-xl border border-[#E8DFCF] bg-white px-3 py-3 font-sans text-[0.82rem] outline-none placeholder:text-[#A59C8C]" />
      </section>

    </aside>
  );
}
