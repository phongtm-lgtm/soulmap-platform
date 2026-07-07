import type { PersonalityProfile } from '../types';

export type JourneySlug = 'identity' | 'career' | 'love' | 'life';

export type JourneyIcon = 'user' | 'briefcase' | 'heart' | 'globe';

export type JourneyStatus = 'ready' | 'generating' | 'locked';

export interface SoulMapJourney {
  id: 1 | 2 | 3 | 4;
  slug: JourneySlug;
  title: string;
  subtitle: string;
  summary: string;
  status: JourneyStatus;
  icon: JourneyIcon;
  imagePath: string;
  accentColor: string;
  accentBg: string;
  buttonClass: string;
}

export interface JourneysGenerationResult {
  journeys: SoulMapJourney[];
  generatedAt: string;
  coreSelfTitle?: string;
}

/**
 * Future API contract (not implemented in phase 1).
 * The mock factory `buildMockJourneys` mirrors this shape so the UI can swap
 * to a real backend call without structural changes.
 */
export interface GenerateJourneysInput {
  profile: PersonalityProfile;
  birthDate: string;
  birthTime: string;
  gender: string;
}
