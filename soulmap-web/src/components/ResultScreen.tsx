import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  User, 
  Briefcase, 
  Heart, 
  Globe, 
  Trees, 
  Flame, 
  CloudLightning, 
  Droplet, 
  Mountain, 
  Quote, 
  ArrowRight,
  Compass, 
  CheckCircle2,
  Lock,
  HelpCircle,
  Grid2X2,
  BarChart3,
  Bot,
  Leaf,
  MessageCircle,
} from 'lucide-react';
import { PersonalityProfile, AppScreen } from '../types';
import Navbar from './Navbar';
import MbtiSummaryStep from './mbti/MbtiSummaryStep';
import BirthFormStep from './mbti/BirthFormStep';
import MbtiTestBackground from './MbtiTestBackground';
import JourneyDetailScreen from './journey/JourneyDetailScreen';
import FourJourneysScreen from './FourJourneysScreen';
import { buildMockJourneys } from '../data/mockJourneys';
import type { SoulMapJourney } from '../types/journey';
import { generateCareerReading } from '../lib/aiReadingsApi';

interface ResultScreenProps {
  profile: PersonalityProfile;
  answers: Record<number, 'A' | 'B'>;
  resultStep: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map';
  setResultStep: (step: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map') => void;
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

  const getElementColorClass = (element: string) => {
    switch(element) {
      case 'Mộc': return { bg: 'bg-[#E2F0D9]', text: 'text-[#385723]', border: 'border-[#385723]/30', fill: '#385723' };
      case 'Hỏa': return { bg: 'bg-[#FCE4D6]', text: 'text-[#C65911]', border: 'border-[#C65911]/30', fill: '#C65911' };
      case 'Kim': return { bg: 'bg-[#FFF2CC]', text: 'text-[#7F6000]', border: 'border-[#7F6000]/30', fill: '#7F6000' };
      case 'Thủy': return { bg: 'bg-[#DDEBF7]', text: 'text-[#1F4E79]', border: 'border-[#1F4E79]/30', fill: '#1F4E79' };
      default: return { bg: 'bg-[#EAEAEA]', text: 'text-[#3F3F3F]', border: 'border-[#3F3F3F]/30', fill: '#3F3F3F' };
    }
  };

  const isFlowStep =
    resultStep === 'mbti_summary' || resultStep === 'birth_form' || resultStep === 'generating';

  const showSoulMapNavbar = resultStep !== 'generating';

  const buildCareerReadingInput = () => {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, min] = birthTime.split(':').map(Number);
    const name = currentUser?.name ?? 'Bạn';
    const viewYear = new Date().getFullYear();
    const birthKey = [birthDate, birthCalendar, birthTime, gender, viewYear].join('|');

    return {
      input: {
        userId: currentUser?.email,
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
    }
    localStorage.setItem('soulmap_ai_reading_career_chapter_01_id', String(readingId));
    localStorage.setItem('soulmap_ai_reading_career_birth_key', birthKey);
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
      .catch(() => {
        localStorage.removeItem('soulmap_ai_reading_career_pending');
        setIsCareerReadingPending(false);
        if (showToast) {
          setCareerReadingToast('Linh Nhi chưa thể cập nhật bản đồ sự nghiệp. Bạn có thể thử lại sau.');
          window.setTimeout(() => setCareerReadingToast(null), 5000);
        }
      });
  };

  const startGeneration = () => {
    setResultStep('generating');
    setGenerationProgress(0);
    setGenerationError(null);

    let cur = 0;
    let progressDone = false;
    const t = setInterval(() => {
      cur += 1;
      setGenerationProgress(cur);
      if (cur >= 6) {
        clearInterval(t);
        progressDone = true;
      }
    }, 1200);

    const existingReadingId = Number(localStorage.getItem('soulmap_ai_reading_career_chapter_01_id'));
    if (existingReadingId) {
      const { birthKey, birthInfo } = buildCareerReadingInput();
      persistCareerReading(existingReadingId, birthKey, birthInfo);
    }

    refreshCareerReadingInBackground(true);

    window.setTimeout(() => {
      if (!progressDone) clearInterval(t);
      setGenerationProgress(6);
      setZoomMap(false);
    }, 1400);
  };

  const generationPercent = Math.min(100, Math.round((generationProgress / 6) * 100));
  const isGenerationComplete = generationProgress >= 6 && !generationError;

  const generationSteps = [
    { title: 'MBTI', subtitle: 'Phân tích tính cách', icon: Grid2X2 },
    { title: 'Tử Vi', subtitle: 'Lá số tử vi đầu số', icon: Compass },
    { title: 'Phân tích', subtitle: 'AI phân tích dữ liệu', icon: BarChart3 },
    { title: 'Xây dựng Core Self', subtitle: 'Xác định bản ngã cốt lõi', icon: Trees },
    { title: 'Tạo 4 Journey', subtitle: 'Đang xây dựng 4 hành trình của bạn', icon: Compass },
    { title: 'Khởi tạo AI Mentor', subtitle: 'Chuẩn bị người đồng hành AI', icon: Bot },
  ];

  return (
    <div className={`flex flex-col min-h-screen relative ${selectedJourney ? 'overflow-x-hidden bg-[#FAF6EE]' : `overflow-hidden ${isFlowStep ? 'bg-[#FAF6EE]' : 'bg-[#FAF6EE]'}`}`}>
      {!selectedJourney && isFlowStep && <MbtiTestBackground />}

      {careerReadingToast && (
        <div className="fixed right-5 top-24 z-50 max-w-sm rounded-2xl border border-[#E8DFCF] bg-[#FFFCF8] px-5 py-4 text-left shadow-[0_22px_60px_-36px_rgba(33,77,59,0.5)]">
          <p className="font-sans text-[0.9rem] font-extrabold text-[#214D3B]">{careerReadingToast}</p>
          <p className="mt-1 font-sans text-[0.78rem] text-[#6A6E69]">Bạn có thể mở lại chương Sự nghiệp để xem bản cập nhật mới nhất.</p>
        </div>
      )}

      {/* Background for other steps */}
      {!selectedJourney && !isFlowStep && (
        <>
          <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply pointer-events-none">
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600" alt="" className="w-full h-full object-cover filter blur-[4px]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF6EE]/92 via-[#FAF6EE]/76 to-[#FFFCF8]/42 z-0 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#C8A15A]/12 via-[#C8A15A]/4 to-transparent rounded-full blur-3xl z-0 pointer-events-none" />
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
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            birthCalendar={birthCalendar}
            setBirthCalendar={setBirthCalendar}
            birthTime={birthTime}
            setBirthTime={setBirthTime}
            gender={gender}
            setGender={setGender}
            onSubmit={startGeneration}
            onBack={() => setResultStep('mbti_summary')}
          />
        )}

        {resultStep === 'generating' && (
          <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1180px] animate-fade-in items-center py-3">
            <div className="relative max-h-[calc(100vh-3rem)] min-h-[680px] w-full overflow-y-auto overflow-x-hidden rounded-[2rem] border border-[#E8DFCF]/90 bg-[#FFFCF8]/88 px-6 py-6 text-center shadow-[0_28px_90px_-46px_rgba(33,77,59,0.48)] backdrop-blur-sm md:px-8 md:py-6">
              <img
                src="/soulmap-island.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-18 blur-[1px]"
                draggable={false}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_22%,rgba(255,252,248,0.86),rgba(255,252,248,0.62)_36%,rgba(250,246,238,0.78)_100%)]" />
              <div className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[420px] rounded-full bg-[#C8A15A]/12 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[#24533E]/10 blur-3xl" />

              <div className="relative z-10 flex min-h-[628px] flex-col items-center">
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C8A15A]/30 bg-[#FFFDF8]/80 text-[#B68A2F] shadow-sm">
                      <Leaf className="h-5 w-5" />
                    </span>
                    <span className="font-display text-[1.35rem] font-bold uppercase tracking-wide text-[#214D3B]">SoulMap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="hidden items-center gap-2 rounded-full border border-[#E8DFCF] bg-[#FFFDF8]/86 px-4 py-2 font-sans text-[0.82rem] font-bold text-[#7A6E5C] shadow-sm sm:flex"
                    >
                      <HelpCircle className="h-4 w-4 text-[#B68A2F]" />
                      Hướng dẫn
                    </button>
                    <div className="flex items-center gap-2 rounded-full bg-[#FFFDF8]/70 px-2 py-1.5">
                      <img
                        src="/linh-nhi-mascot.png"
                        alt="Linh Nhi"
                        className="h-10 w-10 rounded-full object-contain"
                        draggable={false}
                      />
                      <span className="hidden font-sans text-[0.82rem] font-bold text-[#214D3B] sm:inline">Linh Nhi</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="font-display text-[1.2rem] leading-none text-[#C8A15A]">✦</p>
                  <h2 className="mt-1 font-display text-[2.5rem] font-bold leading-tight text-[#214D3B] md:text-[3.25rem]">
                    {isGenerationComplete ? 'Bạn Có Thể Bắt Đầu Hành Trình' : 'Linh Nhi Đang Tạo SoulMap'}
                  </h2>
                  <p className="mt-2 font-sans text-[0.94rem] font-medium text-[#636A64] md:text-[1rem]">
                    {isGenerationComplete
                      ? 'Chapter sẽ tiếp tục được cập nhật ở nền. Linh Nhi sẽ báo khi bản đồ sự nghiệp sẵn sàng.'
                      : 'Bạn không cần chờ ở màn này. Linh Nhi vẫn sẽ tiếp tục tạo bản đồ ở nền.'}
                  </p>
                </div>

                <div className="mt-6 grid w-full flex-1 grid-cols-1 items-stretch gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-[#E8DFCF] bg-gradient-to-b from-[#FFFDF8]/82 to-[#FAF6EE]/72 p-5 shadow-[0_18px_44px_-34px_rgba(77,52,28,0.38)] backdrop-blur-sm">
                    <div className="relative flex flex-col items-center">
                      <div className="relative flex h-36 w-36 items-center justify-center md:h-40 md:w-40">
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#C8A15A]/45" />
                        <div className="absolute inset-3 rounded-full bg-[#F4EFE3] shadow-inner" />
                        <div
                          className="absolute inset-3 rounded-full shadow-[0_18px_38px_-30px_rgba(33,77,59,0.8)]"
                          style={{
                            background: `conic-gradient(#24533E 0deg ${generationPercent * 3.6}deg, #E7DFD0 ${generationPercent * 3.6}deg 360deg)`,
                          }}
                        />
                        <div className="absolute inset-[24px] rounded-full bg-[#FFFDF8] shadow-[inset_0_0_0_1px_rgba(232,223,207,0.9)]" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#FFFDF8] md:h-24 md:w-24">
                          <span className="font-sans text-[1.45rem] font-extrabold leading-none text-[#24533E] md:text-[1.6rem]">
                            {generationPercent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex w-full items-center gap-4 rounded-[1.25rem] border border-[#E8DFCF] bg-[#FFFDF8]/82 p-4 text-left shadow-[0_12px_32px_-26px_rgba(77,52,28,0.36)]">
                      <img
                        src="/linh-nhi-mascot.png"
                        alt="Linh Nhi"
                        className="h-20 w-20 shrink-0 object-contain"
                        draggable={false}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-[0.98rem] font-extrabold text-[#214D3B]">
                          {isGenerationComplete ? 'Bạn có thể rời đi ngay ✨' : 'Linh Nhi đang chuẩn bị bản đồ dành riêng cho bạn ✨'}
                        </p>
                        <p className="mt-1.5 font-sans text-[0.82rem] leading-relaxed text-[#6A6E69]">
                          {isCareerReadingPending
                            ? 'Khi bản đồ hoàn tất, chương Sự nghiệp sẽ tự dùng nội dung mới nhất.'
                            : 'Bản đồ hiện có đã sẵn sàng, Linh Nhi vẫn có thể cập nhật thêm ở nền.'}
                        </p>
                      </div>
                    </div>

                    {generationError && (
                      <div className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50/90 p-4 text-left">
                        <p className="font-sans text-[0.9rem] font-bold text-red-700">{generationError}</p>
                        <button
                          type="button"
                          onClick={startGeneration}
                          className="mt-3 inline-flex items-center justify-center rounded-full bg-[#24533E] px-5 py-2.5 font-sans text-[0.88rem] font-extrabold text-white shadow-sm"
                        >
                          Thử lại
                        </button>
                      </div>
                    )}

                    {isGenerationComplete && !generationError && (
                      <button
                        type="button"
                        onClick={continueToJourneys}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#24533E] px-7 py-3.5 font-sans text-[0.95rem] font-extrabold text-white shadow-[0_16px_30px_-16px_rgba(33,77,59,0.58)]"
                      >
                        Vào Journey ngay
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col justify-center rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8]/72 p-5 text-left shadow-[0_18px_44px_-30px_rgba(77,52,28,0.42)] backdrop-blur-sm md:p-6">
                    {generationSteps.map((step, idx) => {
                      const isDone = generationProgress > idx;
                      const isActive = generationProgress === idx && !isGenerationComplete;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.title} className="flex items-center gap-4 border-b border-[#E8DFCF] py-3 first:pt-0 last:border-none last:pb-0">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isDone ? 'bg-[#24533E]/10 text-[#24533E]' : isActive ? 'bg-[#C8A15A]/14 text-[#B17922]' : 'bg-[#E8E4DC] text-[#A7A39B]'
                          }`}>
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-sans text-[0.98rem] font-extrabold ${
                              isDone ? 'text-[#24533E]' : isActive ? 'text-[#B17922]' : 'text-[#A7A39B]'
                            }`}>
                              {idx + 1}. {step.title}
                            </p>
                            <p className="mt-0.5 font-sans text-[0.82rem] text-[#6A6E69]">{step.subtitle}</p>
                          </div>
                          <div className="flex min-w-[92px] items-center justify-end gap-2">
                            {isDone ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-[#24533E]" />
                                <span className="font-sans text-[0.82rem] font-medium text-[#5F9071]">Hoàn tất</span>
                              </>
                            ) : isActive ? (
                              <>
                                <RefreshCw className="h-5 w-5 animate-spin text-[#B17922]" />
                                <span className="font-sans text-[0.82rem] font-bold text-[#B17922]">Đang xử lý</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 text-[#B9B5AE]" />
                                <span className="font-sans text-[0.82rem] text-[#B9B5AE]">Chờ xử lý</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <p className="mt-4 text-center font-sans text-[0.78rem] text-[#7A8A7D]">
                      Dữ liệu của bạn được bảo mật tuyệt đối và chỉ bạn mới có thể xem SoulMap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {resultStep === 'reveal' && (
          <FourJourneysScreen
            journeys={buildMockJourneys(profile)}
            onExplore={openJourneyDetail}
            userName={currentUser?.name}
          />
        )}

        {selectedJourney && resultStep === 'full_map' && (
          <JourneyDetailScreen journey={selectedJourney} onBack={backToJourneysReady} />
        )}

        {!selectedJourney && resultStep === 'full_map' && (
          <>
            {/* Header Title with sparkles */}
            <div className="text-center max-w-[800px] mx-auto flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#C8A15A]/10 border border-[#C8A15A]/20 flex items-center justify-center text-[#C8A15A] animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8A15A] block mt-1">Khải Huyền Bản Đồ Tâm Hồn</span>
              <h1 className="font-display text-3xl md:text-5xl text-[#24533E] font-semibold leading-tight">
                Bản Đồ Nội Tâm Của Bạn Đã Sẵn Sàng
              </h1>
              <p className="body-text text-[#636A64] max-w-[640px]">
                Tinh tú hội tụ, khoa học định hình. Dưới đây là bức tranh toàn cảnh về thế giới nội tâm sâu thẳm của bạn được dệt nên bởi thuật toán SoulMap.
              </p>
            </div>

            {/* Core Archetype Showcase Card */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-[#C8A15A]/30 shadow-2xl relative overflow-hidden text-left bg-gradient-to-br from-[#FAF6EE] via-[#FFFCF8] to-[#24533E]/5 animate-fade-in">
              {/* Background abstract layout */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C8A15A]/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                {/* Left side: Mascot Card with elements */}
                <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-3xl bg-[#FAF6EE] border border-[#24533E]/8 shadow-lg">
                  {/* Energy Badge */}
                  <div className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5 shadow-sm ${getElementColorClass(profile.element).bg} ${getElementColorClass(profile.element).text} border ${getElementColorClass(profile.element).border}`}>
                    {profile.element === 'Mộc' && <Trees className="w-4 h-4" />}
                    {profile.element === 'Hỏa' && <Flame className="w-4 h-4 animate-pulse" />}
                    {profile.element === 'Kim' && <CloudLightning className="w-4 h-4" />}
                    {profile.element === 'Thủy' && <Droplet className="w-4 h-4" />}
                    {profile.element === 'Thổ' && <Mountain className="w-4 h-4" />}
                    Mệnh ngũ hành: {profile.element}
                  </div>

                  {/* Character Illustration Frame */}
                  <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-[#24533E]/10 to-[#C8A15A]/10 flex items-center justify-center p-1.5 mb-4 border border-[#C8A15A]/20">
                    <div className="w-full h-full rounded-full bg-[#FFFCF8] overflow-hidden shadow-inner flex items-center justify-center p-2">
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                        alt="Linh Nhi Mascot Element" 
                        className="w-full h-full object-contain animate-float"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Badges details */}
                  <h3 className="font-display text-2xl font-semibold text-[#24533E] mb-1">{profile.type}</h3>
                  <p className="font-sans text-xs font-semibold text-[#C8A15A] uppercase tracking-wider mb-4">
                    {profile.mbtiMatch}
                  </p>

                  <div className="w-full bg-[#eae8e4] h-px my-3"></div>

                  <div className="flex justify-around w-full text-xs font-sans text-[#636A64]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#636A64]/60 mb-0.5">Tử Vi Hộ Mệnh</p>
                      <span className="font-bold text-[#24533E]">{profile.zodiac}</span>
                    </div>
                    <div className="w-px bg-[#eae8e4]"></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#636A64]/60 mb-0.5">Năng lượng chính</p>
                      <span className="font-bold text-[#24533E]">{profile.element} Thượng Đẳng</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Persona text Description & Pillars details */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C8A15A] mb-1 block">Hình Mẫu Linh Hồn</span>
                    <h2 className="font-display text-3xl font-semibold text-[#24533E] leading-snug mb-3">
                      {profile.name}
                    </h2>
                    <h4 className="font-serif text-[#24533E] text-base italic font-semibold mb-3">
                      &quot;{profile.title}&quot;
                    </h4>
                    <p className="body-text text-[#636A64]">
                      {profile.description}
                    </p>
                  </div>

                  <div className="w-full bg-[#24533E]/5 h-px"></div>

                  {/* 4 Pillars Details in Accordion or Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                      <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                        <User className="w-4 h-4 text-[#C8A15A]" />
                        Trụ Cột Tôi Là Ai
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.identity}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                      <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                        <Briefcase className="w-4 h-4 text-[#C8A15A]" />
                        Trụ Cột Sự Nghiệp
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.career}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                      <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                        <Heart className="w-4 h-4 text-[#C8A15A]" />
                        Trụ Cột Tình Yêu
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.love}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                      <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                        <Globe className="w-4 h-4 text-[#C8A15A]" />
                        Trụ Cột Cuộc Đời
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.life}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Advice & AI Companion Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in">
              {/* Left Side: Suggestions / Advice Cards (4 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glass-card rounded-3xl p-6 md:p-8 text-left border border-[#24533E]/8 shadow-lg flex flex-col gap-6 h-full">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C8A15A] block mb-1">Chỉ Dẫn Phát Triển</span>
                    <h3 className="font-display text-2xl font-semibold text-[#24533E]">
                      Lời khuyên dành riêng cho bạn
                    </h3>
                    <div className="w-12 h-0.5 bg-[#C8A15A]/40 mt-3"></div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {profile.advice.map((adv, index) => (
                      <div key={index} className="flex gap-3 items-start group">
                        <div className="w-6 h-6 rounded-full bg-[#24533E]/5 flex items-center justify-center text-[#24533E] font-sans font-bold text-xs flex-shrink-0 mt-0.5 group-hover:bg-[#C8A15A] group-hover:text-white transition-all duration-300">
                          {index + 1}
                        </div>
                        <p className="body-text-sm text-[#636A64]">
                          {adv}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Motivational Quote */}
                  <div className="p-4 rounded-2xl bg-[#24533E]/5 border border-[#24533E]/10 flex flex-col gap-2 mt-auto text-left relative overflow-hidden">
                    <Quote className="w-12 h-12 text-[#24533E]/5 absolute -right-2 -bottom-2" />
                    <p className="body-text-xs text-[#24533E] italic">
                      &quot;Hành trình ngàn dặm bắt đầu bằng một bước chân đầu tiên thấu hiểu bản thể toàn vẹn. Hãy kiên nhẫn bồi đắp ngọc quý trong tim bạn.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Launcher card for the dedicated AI Chat page (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="glass-card flex h-full min-h-[480px] flex-col justify-between gap-6 rounded-3xl border border-[#24533E]/8 p-6 text-left shadow-lg md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C8A15A]/30 bg-[#FFFCF8] p-1 shadow-sm">
                      <img
                        src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ"
                        alt="Linh Nhi"
                        className="h-full w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-[#24533E]">AI Mentor Linh Nhi</h4>
                      <span className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Đang trực tuyến
                      </span>
                    </div>
                  </div>

                  {/* Preview of the latest exchange */}
                  <div className="flex flex-col gap-3 rounded-2xl border border-[#24533E]/8 bg-[#FFFCF8]/60 p-5">
                    {chatHistory.slice(-2).map((msg, index) => (
                      <p
                        key={index}
                        className={`body-text-sm line-clamp-2 ${
                          msg.sender === 'user' ? 'text-right text-[#24533E]/70' : 'text-left text-[#24533E]'
                        }`}
                      >
                        {msg.sender === 'assistant' ? '“' : ''}
                        {msg.text}
                        {msg.sender === 'assistant' ? '”' : ''}
                      </p>
                    ))}
                  </div>

                  <p className="body-text-sm text-[#636A64]">
                    Trò chuyện chi tiết hơn với Linh Nhi trong không gian riêng, tập trung hoàn toàn vào cuộc hội thoại của bạn.
                  </p>

                  <button
                    type="button"
                    onClick={navigateToAiChat}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#24533E] px-6 py-3.5 font-sans text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(33,77,59,0.55)] transition hover:-translate-y-0.5 hover:bg-[#1D4433] active:translate-y-0"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Mở cuộc trò chuyện
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
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
