import type { JourneySlug } from './journey';

/**
 * The seven narrative sections that make up a Journey detail read.
 * Order is meaningful — it defines both scroll order and nav order.
 */
export type JourneySectionId =
  | 'intro'
  | 'work-identity'
  | 'career-path'
  | 'money-style'
  | 'environment'
  | 'watch-out'
  | 'next-steps';

/**
 * A single narrative block inside a Journey detail.
 * Written in Linh Nhi's voice (warm, addresses the reader as "bạn",
 * gently weaves Tử Vi symbolism through `tuViNote`).
 */
export interface JourneySection {
  /** Stable id — used as the scroll anchor and nav target. */
  id: JourneySectionId;
  /** Short label shown in the side nav / mobile tab bar. */
  navLabel: string;
  /** Linh Nhi's leading line (rendered as serif italic). */
  headline: string;
  /** The body copy — one string per paragraph. */
  body: string[];
  /** When true the section content is blurred behind a premium overlay. */
  locked?: boolean;
  /** Optional Tử Vi weave — surfaced as a small chip under the body. */
  tuViNote?: string;
}

/**
 * Full content payload for one Journey detail screen.
 * Phase 1 is mock only; the shape mirrors a future API response so the
 * UI can swap `getJourneyContent` for a real fetch without changes.
 */
export interface JourneyDetailContent {
  slug: JourneySlug;
  /** Hero tagline shown under the Journey title. */
  tagline: string;
  /** Accent color for headers, chips and active nav states. */
  accentColor: string;
  sections: JourneySection[];
}
