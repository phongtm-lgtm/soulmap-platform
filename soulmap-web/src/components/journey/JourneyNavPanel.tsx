import { Lock } from 'lucide-react';
import type { JourneySection, JourneySectionId } from '../../types/journeyDetail';

interface JourneyNavPanelProps {
  sections: JourneySection[];
  activeId: JourneySectionId;
  accentColor: string;
  onNavigate: (id: JourneySectionId) => void;
}

/**
 * Desktop sticky sidebar. Highlights the section currently in view
 * (driven by the parent's IntersectionObserver) and marks locked
 * sections with a padlock.
 */
export default function JourneyNavPanel({ sections, activeId, accentColor, onNavigate }: JourneyNavPanelProps) {
  return (
    <nav
      aria-label="Mục lục hành trình"
      className="sticky top-24 rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8]/92 p-4 shadow-[0_18px_50px_-38px_rgba(33,77,59,0.35)]"
    >
      <p className="px-2 pb-3 font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[#214D3B]/60">
        Nội dung hành trình
      </p>

      <ul className="flex flex-col gap-1">
        {sections.map((section, index) => {
          const active = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onNavigate(section.id)}
                aria-current={active ? 'true' : undefined}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left font-sans text-[0.86rem] font-bold transition-all ${
                  active ? 'bg-[#F3EEE2] shadow-sm' : 'text-[#214D3B]/70 hover:bg-[#FAF6EE]'
                }`}
                style={active ? { color: accentColor } : undefined}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-extrabold transition-colors"
                  style={{
                    backgroundColor: active ? accentColor : '#EFE9DB',
                    color: active ? '#FFFFFF' : '#8B8F8A',
                  }}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">{section.navLabel}</span>
                {section.locked && (
                  <Lock className="h-3.5 w-3.5 shrink-0 text-[#B0A992]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
