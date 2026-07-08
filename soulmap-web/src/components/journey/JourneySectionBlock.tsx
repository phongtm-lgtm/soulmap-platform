import { Sparkles } from 'lucide-react';
import type { JourneySection } from '../../types/journeyDetail';
import LockedSectionOverlay from './LockedSectionOverlay';

interface JourneySectionBlockProps {
  section: JourneySection;
  index: number;
  accentColor: string;
  /** Registers the block's DOM node with the parent's IntersectionObserver. */
  registerRef: (id: string, el: HTMLElement | null) => void;
  onUnlock?: () => void;
}

/**
 * One narrative section: Linh Nhi's serif-italic headline, the body copy,
 * and an optional Tử Vi chip. Locked sections blur their body behind a
 * premium overlay.
 */
export default function JourneySectionBlock({
  section,
  index,
  accentColor,
  registerRef,
  onUnlock,
}: JourneySectionBlockProps) {
  const { id, navLabel, headline, body, tuViNote, locked } = section;

  return (
    <section
      id={`journey-section-${id}`}
      ref={(el) => registerRef(id, el)}
      className="scroll-mt-28 py-8 first:pt-2"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full font-sans text-[0.82rem] font-extrabold text-white"
          style={{ backgroundColor: accentColor }}
        >
          {index + 1}
        </span>
        <span className="font-sans text-[0.74rem] font-extrabold uppercase tracking-[0.16em] text-[#214D3B]/55">
          {navLabel}
        </span>
      </div>

      {/* Linh Nhi headline — serif italic */}
      <h2 className="mt-4 font-serif text-[1.9rem] font-semibold italic leading-snug text-[#214D3B] md:text-[2.15rem]">
        {headline}
      </h2>

      {/* Body (blurred + gated when locked) */}
      <div className="relative mt-5">
        <div className={locked ? 'pointer-events-none select-none blur-[6px]' : undefined} aria-hidden={locked}>
          <div className="space-y-4 font-reading text-[1.02rem] leading-[1.85] text-[#4c534d]">
            {body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {tuViNote && (
            <div
              className="mt-6 flex items-start gap-3 rounded-[1.25rem] border px-4 py-3.5"
              style={{
                backgroundColor: `${accentColor}12`,
                borderColor: `${accentColor}33`,
              }}
            >
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: accentColor }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.12em]" style={{ color: accentColor }}>
                  Góc nhìn Tử Vi
                </p>
                <p className="mt-1 font-reading text-[0.95rem] leading-relaxed text-[#4c534d]">{tuViNote}</p>
              </div>
            </div>
          )}
        </div>

        {locked && <LockedSectionOverlay accentColor={accentColor} onUnlock={onUnlock} />}
      </div>
    </section>
  );
}
