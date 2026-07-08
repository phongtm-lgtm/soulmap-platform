import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import type { JourneySection, JourneySectionId } from '../../types/journeyDetail';

interface JourneyTabNavProps {
  sections: JourneySection[];
  activeId: JourneySectionId;
  accentColor: string;
  onNavigate: (id: JourneySectionId) => void;
}

/**
 * Mobile horizontal tab bar. Sticks just under the hero and scrolls the
 * active tab into view as the reader moves through the sections.
 */
export default function JourneyTabNav({ sections, activeId, accentColor, onNavigate }: JourneyTabNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = activeRef.current;
    const list = listRef.current;
    if (!el || !list) return;
    const elCenter = el.offsetLeft + el.offsetWidth / 2;
    list.scrollTo({ left: elCenter - list.clientWidth / 2, behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-[#E8DFCF] bg-[#FAF6EE]/95 backdrop-blur-md lg:hidden">
      <div
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section, index) => {
          const active = section.id === activeId;
          return (
            <button
              key={section.id}
              ref={active ? activeRef : undefined}
              type="button"
              onClick={() => onNavigate(section.id)}
              aria-current={active ? 'true' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-[0.8rem] font-bold transition-all ${
                active ? 'border-transparent text-white shadow-sm' : 'border-[#E8DFCF] bg-[#FFFCF8] text-[#214D3B]/70'
              }`}
              style={active ? { backgroundColor: accentColor } : undefined}
            >
              <span className="opacity-70">{index + 1}</span>
              {section.navLabel}
              {section.locked && <Lock className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
