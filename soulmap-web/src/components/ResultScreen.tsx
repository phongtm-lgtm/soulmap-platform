import React from 'react';
import {
  Compass,
  Grid2X2,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { PersonalityProfile, AppScreen } from '../types';
import Navbar from './Navbar';
import MbtiSummaryStep from './mbti/MbtiSummaryStep';
import BirthFormStep from './mbti/BirthFormStep';
import MbtiTestBackground from './MbtiTestBackground';
import JourneyDetailScreen from './journey/JourneyDetailScreen';
import FourJourneysScreen from './FourJourneysScreen';
import GeneratingStep from './result/GeneratingStep';
import SoulMapReveal from './result/SoulMapReveal';
import { buildMockJourneys } from '../data/mockJourneys';
import type { SoulMapJourney } from '../types/journey';
import {
  createLaSo,
  generateCareerReading,
  generateIdentityJourneyReading,
  SoulMapApiError,
} from '../lib/aiReadingsApi';

interface ResultScreenProps {
  profile: PersonalityProfile;
  answers: Record<number, 'A' | 'B'>;
  resultStep: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map';
  setResultStep: (step: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map') => void;
  birthName: string;
  setBirthName: (name: string) => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  birthCalendar: 'solar' | 'lunar';
  setBirthCalendar: (calendar: 'solar' | 'lunar') => void;
  birthTime: string;
  setBirthTime: (time: string) => void;
  gender: 'Nam' | 'Nữ';
  setGender: (gender: 'Nam' | 'Nữ') => void;
  generationProgress: number;
  setGenerationProgress: React.Dispatch<React.SetStateAction<number>>;
  zoomMap: boolean;
  setZoomMap: (zoom: boolean) => void;
  chatHistory: { sender: 'user' | 'assistant'; text: string }[];
  isLoggedIn: boolean;
  currentUser: { name: string; email: string } | null;
  handleLogout: () => void;
  setCurrentScreen: (screen: AppScreen) => void;
  setTransitionDirection: (direction: 'push' | 'push_back' | 'none') => void;
  navigateToAssessment: (direction?: 'push' | 'none') => void;
  navigateToTestIntro: (direction?: 'push' | 'none') => void;
  navigateToLanding: (direction?: 'push_back' | 'none') => void;
  navigateToAiChat: () => void;
  navigateToJourneys: () => void;
}

export default function ResultScreen({
  profile,
  resultStep,
  setResultStep,
  birthName,
  setBirthName,
  birthDate,
  setBirthDate,
  birthCalendar,
  setBirthCalendar,
  birthTime,
  setBirthTime,
  gender,
  setGender,
  generationProgress,
  setGenerationProgress,
  setZoomMap,
  chatHistory,
  isLoggedIn,
  currentUser,
  handleLogout,
  setCurrentScreen,
  setTransitionDirection,
  navigateToAssessment,
  navigateToTestIntro,
  navigateToLanding,
  navigateToAiChat,
  navigateToJourneys,
}: ResultScreenProps) {
  const [selectedJourney, setSelectedJourney] = React.useState<SoulMapJourney | null>(null);
  const [careerReadingId, setCareerReadingId] = React.useState<number | null>(() => {
    const savedId = Number(localStorage.getItem('soulmap_ai_reading_career_chapter_01_id'));
    return savedId || null;
  });
  const [generationError, setGenerationError] = React.useState<string | null>(null);
  const [isCareerReadingPending, setIsCareerReadingPending] = React.useState(
    () => localStorage.getItem('soulmap_ai_reading_career_pending') === 'true',
  );
  const [careerReadingToast, setCareerReadingToast] = React.useState<string | null>(null);
  const [isRegenerationModalOpen, setIsRegenerationModalOpen] = React.useState(false);

  const soulMapProfile = {
    mbtiType: profile.type,
    birthDate,
    birthCalendar,
    birthTime,
    gender,
    timezone: 1,
  };
  const savedSoulMapProfile = (() => {
    try {
      const value = localStorage.getItem('soulmap_profile_snapshot');
      return value ? JSON.parse(value) as typeof soulMapProfile : null;
    } catch {
      return null;
    }
  })();
  const hasExistingSoulMap = Boolean(savedSoulMapProfile);
  const hasProfileChanges = savedSoulMapProfile !== null
    && JSON.stringify(savedSoulMapProfile) !== JSON.stringify(soulMapProfile);

  const openJourneyDetail = (journey: SoulMapJourney) => {
    setSelectedJourney(journey);
    setResultStep('full_map');
  };

  const backToJourneysReady = () => {
    setSelectedJourney(null);
    setResultStep('reveal');
  };

  const openJourneysOverview = () => {
    navigateToJourneys();
  };

  const continueToJourneys = () => {
    navigateToJourneys();
  };

  const isFlowStep =
    resultStep === 'mbti_summary' || resultStep === 'birth_form' || resultStep === 'generating';

  // Keep the shared brand frame present on every step, including generating.
  const showSoulMapNavbar = true;

  const buildCareerReadingInput = () => {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, min] = birthTime.split(':').map(Number);
    const name = birthName.trim();
    const viewYear = new Date().getFullYear();
    const birthKey = [name.toLocaleLowerCase('vi'), birthDate, birthCalendar, birthTime, gender, viewYear].join('|');

    return {
      input: {
        mbtiType: profile.type,
        name,
        day,
        month,
        year,
        calendar: birthCalendar,
        gender: gender === 'Nam' ? 'male' as const : 'female' as const,
        hour,
        min,
        timezone: 1,
        viewYear,
      },
      birthInfo: {
        name,
        birthDate,
        birthCalendar,
        birthTime,
        gender,
        timezone: 1,
        viewYear,
      },
      birthKey,
    };
  };

  const persistCareerReading = (readingId: number, birthKey: string, birthInfo: object) => {
    const previousBirthKey = localStorage.getItem('soulmap_ai_reading_career_birth_key');
    if (previousBirthKey && previousBirthKey !== birthKey) {
      localStorage.removeItem('soulmap_ai_reading_career_chapter_03_v2_id');
      // Birth info changed: drop the cached Tu Vi reading so it is re-generated (streamed) on next open.
      localStorage.removeItem('soulmap_ai_reading_tuvi_id');
      localStorage.removeItem('soulmap_ai_reading_identity_id');
    }
      localStorage.setItem('soulmap_ai_reading_career_chapter_01_id', String(readingId));
      localStorage.setItem('soulmap_ai_reading_career_birth_key', birthKey);
      localStorage.setItem('soulmap_profile_snapshot', JSON.stringify(soulMapProfile));
    localStorage.setItem('soulmap_birth_info', JSON.stringify(birthInfo));
    localStorage.removeItem('soulmap_ai_reading_career_pending');
    setIsCareerReadingPending(false);
    setCareerReadingId(readingId);
  };

  const refreshCareerReadingInBackground = (showToast = true) => {
    const { input, birthKey, birthInfo } = buildCareerReadingInput();
    localStorage.setItem('soulmap_ai_reading_career_pending', 'true');
    setIsCareerReadingPending(true);
    generateCareerReading(input)
      .then((reading) => {
        persistCareerReading(reading.id, birthKey, birthInfo);
        if (showToast) {
          setCareerReadingToast('Bản đồ sự nghiệp của bạn đã sẵn sàng.');
          window.setTimeout(() => setCareerReadingToast(null), 5000);
        }
      })
      .catch((error: unknown) => {
        localStorage.removeItem('soulmap_ai_reading_career_pending');
        setIsCareerReadingPending(false);
        if (showToast) {
          setCareerReadingToast(
            error instanceof SoulMapApiError && error.status === 402
              ? 'Hồ sơ đã thay đổi. Bạn cần quyền tái tạo để tạo SoulMap mới.'
              : 'Linh Nhi chưa thể cập nhật bản đồ sự nghiệp. Bạn có thể thử lại sau.',
          );
          window.setTimeout(() => setCareerReadingToast(null), 5000);
        }
      });
  };

  const TOTAL_GENERATION_STEPS = 4;

  const startGeneration = async () => {
    setResultStep('generating');
    setGenerationProgress(0);
    setGenerationError(null);
    setZoomMap(false);

    const { input, birthKey, birthInfo } = buildCareerReadingInput();
    localStorage.setItem('soulmap_birth_info', JSON.stringify(birthInfo));
    localStorage.setItem('soulmap_ai_reading_identity_birth_key', birthKey);
    localStorage.setItem('soulmap_ai_reading_identity_pending', 'true');
    localStorage.removeItem('soulmap_ai_reading_identity_id');

    try {
      // 1. MBTI — already completed in the assessment flow
      setGenerationProgress(1);

      // 2. Tử Vi — create/persist lá số on backend
      const laSo = await createLaSo(input);
      setGenerationProgress(2);

      // 3. Phân tích — chart must be usable before identity generation
      if (!laSo?.cungs?.length) {
        throw new Error('Lá số chưa đủ dữ liệu để phân tích.');
      }
      setGenerationProgress(3);

      // 4. Khởi tạo hành trình Tôi là ai
      const reading = await generateIdentityJourneyReading(input);
      if (!reading.id) {
        throw new Error('Chưa nhận được hành trình Tôi là ai từ máy chủ.');
      }
      localStorage.setItem('soulmap_ai_reading_identity_id', String(reading.id));
      localStorage.setItem('soulmap_profile_snapshot', JSON.stringify(soulMapProfile));
      setGenerationProgress(TOTAL_GENERATION_STEPS);
    } catch (error: unknown) {
      if (error instanceof SoulMapApiError && error.status === 402) {
        setGenerationError('Hồ sơ đã thay đổi. Bạn cần quyền tái tạo để tạo SoulMap mới.');
      } else if (error instanceof Error && error.name === 'AbortError') {
        setGenerationError('Yêu cầu quá lâu. Hãy thử lại khi mạng ổn định hơn.');
      } else if (error instanceof Error && error.message) {
        setGenerationError(error.message);
      } else {
        setGenerationError('Linh Nhi chưa thể hoàn tất khởi tạo. Bạn có thể thử lại.');
      }
    } finally {
      localStorage.removeItem('soulmap_ai_reading_identity_pending');
    }
  };

  const handleBirthFormSubmit = () => {
    if (hasProfileChanges) {
      setIsRegenerationModalOpen(true);
      return;
    }
    startGeneration();
  };

  const generationPercent = Math.min(
    100,
    Math.round((generationProgress / TOTAL_GENERATION_STEPS) * 100),
  );
  const isGenerationComplete = generationProgress >= TOTAL_GENERATION_STEPS && !generationError;

  const generationSteps = [
    { title: 'MBTI', icon: Grid2X2 },
    { title: 'Tử Vi', icon: Compass },
    { title: 'Phân tích', icon: BarChart3 },
    { title: 'Khởi tạo hành trình tôi là ai', icon: Sparkles },
  ];

  return (
    <div className={`flex flex-col min-h-screen relative ${selectedJourney ? 'overflow-x-hidden bg-[#F8F4EB]' : `overflow-hidden ${isFlowStep ? 'bg-[#F8F4EB]' : 'bg-[#F8F4EB]'}`}`}>
      {!selectedJourney && isFlowStep && <MbtiTestBackground />}

      {careerReadingToast && (
        <div className="fixed right-5 top-24 z-50 max-w-sm rounded-2xl border border-[#E8DFCF] bg-[#FFFCF8] px-5 py-4 text-left shadow-[0_22px_60px_-36px_rgba(33,77,59,0.5)]">
          <p className="font-sans text-[0.9rem] font-extrabold text-[#214D3B]">{careerReadingToast}</p>
          <p className="mt-1 font-sans text-[0.78rem] text-[#5E625F]">Bạn có thể mở lại chương Sự nghiệp để xem bản cập nhật mới nhất.</p>
        </div>
      )}

      {isRegenerationModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#183C2D]/45 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="regeneration-title">
          <div className="w-full max-w-md rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8] p-6 shadow-[0_28px_90px_-35px_rgba(24,60,45,0.7)] sm:p-8">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-[#B68A2F]">SoulMap hiện tại được giữ nguyên</p>
            <h2 id="regeneration-title" className="mt-3 font-display text-3xl font-bold text-[#24533E]">Bạn đang thay đổi hồ sơ SoulMap</h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-[#5E625F]">
              Thay đổi MBTI hoặc thông tin sinh sẽ cần quyền tái tạo trước khi tạo một SoulMap mới. Bạn vẫn có thể xem SoulMap hiện tại của mình.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsRegenerationModalOpen(false)} className="rounded-full border border-[#E8DFCF] px-5 py-3 font-sans text-sm font-bold text-[#5E625F] transition hover:border-[#B68A2F]/50 hover:text-[#24533E]">
                Giữ SoulMap hiện tại
              </button>
              <button type="button" onClick={() => setIsRegenerationModalOpen(false)} className="rounded-full bg-[#24533E] px-5 py-3 font-sans text-sm font-bold text-white transition hover:bg-[#214D3B]">
                Tìm hiểu quyền tái tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background for other steps */}
      {!selectedJourney && !isFlowStep && (
        <>
          <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply pointer-events-none">
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600" alt="" className="w-full h-full object-cover filter blur-[4px]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F8F4EB]/92 via-[#F8F4EB]/76 to-[#FFFCF8]/42 z-0 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#B68A2F]/12 via-[#B68A2F]/4 to-transparent rounded-full blur-3xl z-0 pointer-events-none" />
        </>
      )}

      {/* Top Navbar */}
      {showSoulMapNavbar && (
        <Navbar
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          currentScreen="result"
          handleLogout={handleLogout}
          navigateToLanding={navigateToLanding}
          navigateToAssessment={navigateToAssessment}
          onOpenJourneys={openJourneysOverview}
          onOpenAiMentor={navigateToAiChat}
          setCurrentScreen={setCurrentScreen}
          setTransitionDirection={setTransitionDirection}
        />
      )}

      {/* Main Results Container */}
      <main className={`relative z-[1] flex-grow w-full flex flex-col justify-center ${selectedJourney ? 'max-w-none px-0 pt-0 pb-0' : resultStep === 'mbti_summary' ? 'max-w-none px-0 pt-0 pb-0' : resultStep === 'reveal' ? 'max-w-none px-0 pt-20 pb-0 md:pt-24' : `${isFlowStep ? 'max-w-[1220px]' : 'max-w-[1200px]'} mx-auto px-6 ${isFlowStep ? 'pt-24 pb-8' : 'pt-28 pb-20'}`}`}>
        {resultStep === 'mbti_summary' && (
          <MbtiSummaryStep
            profile={profile}
            onContinue={() => setResultStep('birth_form')}
            onRetake={() => navigateToTestIntro('none')}
          />
        )}

        {resultStep === 'birth_form' && (
          <BirthFormStep
            name={birthName}
            setName={setBirthName}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            birthCalendar={birthCalendar}
            setBirthCalendar={setBirthCalendar}
            birthTime={birthTime}
            setBirthTime={setBirthTime}
            gender={gender}
            setGender={setGender}
            onSubmit={handleBirthFormSubmit}
            onBack={() => setResultStep('mbti_summary')}
            hasExistingSoulMap={hasExistingSoulMap}
            hasProfileChanges={hasProfileChanges}
          />
        )}

        {resultStep === 'generating' && (
          <GeneratingStep
            generationProgress={generationProgress}
            generationPercent={generationPercent}
            generationSteps={generationSteps}
            isGenerationComplete={isGenerationComplete}
            generationError={generationError}
            onRetry={startGeneration}
            onContinue={continueToJourneys}
          />
        )}

        {resultStep === 'reveal' && (
          <FourJourneysScreen
            journeys={buildMockJourneys(profile)}
            onExplore={openJourneyDetail}
            onCreateSoulMap={navigateToTestIntro}
            userName={currentUser?.name}
          />
        )}

        {selectedJourney && resultStep === 'full_map' && (
          <JourneyDetailScreen journey={selectedJourney} onBack={backToJourneysReady} onOpenAiMentor={navigateToAiChat} />
        )}

        {!selectedJourney && resultStep === 'full_map' && (
          <SoulMapReveal
            profile={profile}
            chatHistory={chatHistory}
            onOpenAiChat={navigateToAiChat}
          />
        )}
      </main>

      {/* Footer space */}
      {!selectedJourney && <footer className="w-full py-12 mt-auto bg-[#214D3B] text-white">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-4 max-w-[1200px] mx-auto text-xs text-white/70 font-sans">
          <div className="font-display text-xl text-white font-semibold">SoulMap</div>
          <div>© 2026 SoulMap. Embark on your mystical journey.</div>
          <div className="flex gap-6">
            <a className="hover:text-white hover:underline transition-all" href="#">Privacy Policy</a>
            <a className="hover:text-white hover:underline transition-all" href="#">Terms of Service</a>
            <a className="hover:text-white hover:underline transition-all" href="#">Contact</a>
          </div>
        </div>
      </footer>}
    </div>
  );
}
