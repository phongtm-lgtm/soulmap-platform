import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { SoulMapJourney } from '../../types/journey';
import type { JourneySectionId } from '../../types/journeyDetail';
import { getJourneyContent } from '../../data/careerJourneyContent';
import { APP_ASSETS } from '../../assets';
import JourneyDetailHero from './JourneyDetailHero';
import JourneyNavPanel from './JourneyNavPanel';
import JourneyTabNav from './JourneyTabNav';
import JourneySectionBlock from './JourneySectionBlock';

interface JourneyDetailScreenProps {
  journey: SoulMapJourney;
  onBack: () => void;
}

/**
 * Generic journey detail read. Narrative scroll with a sticky nav panel on
 * desktop and a horizontal tab bar on mobile. Content is resolved from the
 * mock registry by slug (no API in phase 1).
 */
export default function JourneyDetailScreen({ journey, onBack }: JourneyDetailScreenProps) {
  const content = useMemo(() => getJourneyContent(journey.slug), [journey.slug]);
  const { sections, tagline, accentColor } = content;

  const [activeId, setActiveId] = useState<JourneySectionId>(sections[0]?.id ?? 'intro');
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
    <div className="min-h-screen bg-[#FAF6EE] pt-20 pb-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <JourneyDetailHero journey={journey} tagline={tagline} accentColor={accentColor} onBack={onBack} />

        <JourneyTabNav
          sections={sections}
          activeId={activeId}
          accentColor={accentColor}
          onNavigate={handleNavigate}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Desktop sticky nav */}
          <aside className="hidden lg:block">
            <JourneyNavPanel
              sections={sections}
              activeId={activeId}
              accentColor={accentColor}
              onNavigate={handleNavigate}
            />
          </aside>

          {/* Narrative content */}
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

            {/* Closing CTA — chat with Linh Nhi */}
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
      </div>
    </div>
  );
}
