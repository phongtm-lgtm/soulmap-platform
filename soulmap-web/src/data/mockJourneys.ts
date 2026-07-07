import { APP_ASSETS } from '../assets';
import type { PersonalityProfile } from '../types';
import type { SoulMapJourney, JourneysGenerationResult } from '../types/journey';

/**
 * Build the 4 SoulMap journeys from a personality profile.
 * Phase 1 mock — summaries are pulled directly from `profile.pillars.*`.
 */
export function buildMockJourneys(profile: PersonalityProfile): SoulMapJourney[] {
  return [
    {
      id: 1,
      slug: 'identity',
      title: 'Tôi là ai',
      subtitle: 'Hành trình khám phá bản chất',
      summary: profile.pillars.identity,
      status: 'ready',
      icon: 'user',
      imagePath: APP_ASSETS.pillars.self,
      accentColor: '#3E7A50',
      accentBg: 'bg-[#3E7A50]',
      buttonClass: 'bg-[#5D8A67] hover:bg-[#3E7A50]',
    },
    {
      id: 2,
      slug: 'career',
      title: 'Sự nghiệp',
      subtitle: 'Hành trình phát triển sự nghiệp',
      summary: profile.pillars.career,
      status: 'ready',
      icon: 'briefcase',
      imagePath: APP_ASSETS.pillars.career,
      accentColor: '#3F7DB8',
      accentBg: 'bg-[#3F7DB8]',
      buttonClass: 'bg-[#4C82B4] hover:bg-[#326A9A]',
    },
    {
      id: 3,
      slug: 'love',
      title: 'Tình yêu',
      subtitle: 'Hành trình kết nối & yêu thương',
      summary: profile.pillars.love,
      status: 'ready',
      icon: 'heart',
      imagePath: APP_ASSETS.pillars.love,
      accentColor: '#C76A86',
      accentBg: 'bg-[#C76A86]',
      buttonClass: 'bg-[#C8738B] hover:bg-[#B85D78]',
    },
    {
      id: 4,
      slug: 'life',
      title: 'Cuộc đời',
      subtitle: 'Hành trình nhìn thấu tương lai',
      summary: profile.pillars.life,
      status: 'ready',
      icon: 'globe',
      imagePath: APP_ASSETS.pillars.life,
      accentColor: '#7B6AA8',
      accentBg: 'bg-[#7B6AA8]',
      buttonClass: 'bg-[#7D70A5] hover:bg-[#685B92]',
    },
  ];
}

export function buildMockJourneysResult(profile: PersonalityProfile): JourneysGenerationResult {
  return {
    journeys: buildMockJourneys(profile),
    generatedAt: new Date().toISOString(),
    coreSelfTitle: profile.name,
  };
}
