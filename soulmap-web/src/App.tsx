"use client";

import React, { Suspense, useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SOULMAP_QUESTIONS, PERSONALITY_PROFILES, PersonalityProfile, AppScreen, Question } from './types';

// Import modular subcomponents
import Navbar from './components/Navbar';
import LandingScreen from './components/LandingScreen';
import GoogleAuthScreen from './components/GoogleAuthScreen';
import MbtiStartScreen from './components/MbtiStartScreen';
import AssessmentScreen from './components/AssessmentScreen';
import ResultScreen from './components/ResultScreen';
import FourJourneysScreen from './components/FourJourneysScreen';
import JourneyDetailScreen from './components/journey/JourneyDetailScreen';
import AIChatScreen from './components/AIChatScreen';
import JournalScreen from './components/JournalScreen';
import AcademyScreen from './components/AcademyScreen';
import { buildMockJourneys } from './data/mockJourneys';
import type { SoulMapJourney } from './types/journey';
import { fetchMbtiQuestions, submitMbtiAnswers } from './lib/mbtiApi';
import { fetchCurrentUser, signOut, verifyGoogleCredential } from './lib/authApi';
import {
  createMentorConversation,
  getMentorConversation,
  listMentorConversations,
  MentorApiError,
  sendMentorMessage,
  toChatMessages,
  toConversationSummaries,
} from './lib/mentorApi';
import type { ChatConversationSummary, ChatMessage } from './types/chat';

interface AppProps {
  initialScreen?: AppScreen;
}

export default function App(props: AppProps) {
  return (
    <Suspense fallback={null}>
      <AppContent {...props} />
    </Suspense>
  );
}

function AppContent({ initialScreen = 'landing' }: AppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  type Screen = AppScreen;
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  // Reserved for future screen-transition animations. Currently write-only:
  // handlers record intended direction but no CSS transition consumes it yet.
  // Kept as a stable prop across screens to avoid churn when the effect lands.
  const [, setTransitionDirection] = useState<'push' | 'push_back' | 'none'>('none');

  // User Authentication State
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Restore the HttpOnly session cookie after mounting.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('soulmap_logged_in');
    localStorage.removeItem('soulmap_user');

    void fetchCurrentUser()
      .then((user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
      })
      .finally(() => setIsAuthReady(true));

    const savedProgress = localStorage.getItem('soulmap_mbti_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as {
          currentQuestionIndex?: number;
          answers?: Record<number, 'A' | 'B'>;
        };
        if (typeof parsed.currentQuestionIndex === 'number') {
          setCurrentQuestionIndex(parsed.currentQuestionIndex);
        }
        if (parsed.answers) {
          setAnswers(parsed.answers);
        }
      } catch (e) {
        console.error('Failed to parse MBTI progress from localStorage:', e);
      }
    }

    const savedProfile = localStorage.getItem('soulmap_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse SoulMap profile from localStorage:', e);
        localStorage.removeItem('soulmap_profile');
      }
    }

  }, []);

  // Authentication feedback state
  const [authError, setAuthError] = useState<string>('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      setIsLoggedIn(false);
      setCurrentUser(null);
      navigateToLanding('push_back');
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    try {
      const userObj = await verifyGoogleCredential(credential);

      setIsLoggedIn(true);
      setCurrentUser(userObj);
      setAuthSuccessMsg('Đăng nhập bằng Google thành công!');
      setTimeout(() => goToScreen('landing'), 1200);
    } catch (error) {
      console.error('Failed to read Google credential:', error);
      setAuthError('Không thể xác thực tài khoản Google. Vui lòng thử lại.');
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  // Assessment State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [mbtiQuestions, setMbtiQuestions] = useState<Question[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [isSubmittingMbti, setIsSubmittingMbti] = useState<boolean>(false);
  
  // Profile / Result State
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);

  useEffect(() => {
    if (!isAuthReady || currentScreen !== 'result' || profile) return;
    router.replace('/mbti-test');
    setCurrentScreen('test_intro');
  }, [currentScreen, isAuthReady, profile, router]);

  useEffect(() => {
    // A failed request must wait for an explicit re-entry to the assessment.
    // Otherwise toggling isQuestionsLoading in finally() continuously re-runs this effect.
    if (currentScreen !== 'assessment' || mbtiQuestions.length > 0 || isQuestionsLoading || questionsError) return;

    setIsQuestionsLoading(true);
    setQuestionsError(null);

    fetchMbtiQuestions()
      .then((questions) => {
        setMbtiQuestions(questions);
        const currentQuestion = questions[currentQuestionIndex];
        setSelectedOption(currentQuestion ? answers[currentQuestion.id] || null : null);
      })
      .catch((error) => {
        console.error('Failed to fetch MBTI questions:', error);
        setQuestionsError('Không thể tải bộ câu hỏi MBTI. Vui lòng kiểm tra kết nối backend và thử lại.');
      })
      .finally(() => {
        setIsQuestionsLoading(false);
      });
  }, [answers, currentQuestionIndex, currentScreen, isQuestionsLoading, mbtiQuestions.length, questionsError]);

  // Sub-steps for the results screen: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map'
  const [resultStep, setResultStep] = useState<'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map'>('mbti_summary');
  
  // Birth Information State
  const [birthName, setBirthName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('1998-08-15');
  const [birthCalendar, setBirthCalendar] = useState<'solar' | 'lunar'>('solar');
  const [birthTime, setBirthTime] = useState<string>('08:00');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nữ');

  useEffect(() => {
    if (currentUser?.name) {
      setBirthName((currentName) => currentName || currentUser.name);
    }
  }, [currentUser]);

  // Generation Animation Progress
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [zoomMap, setZoomMap] = useState<boolean>(false);

  React.useEffect(() => {
    if (resultStep === 'reveal') {
      const timer = setTimeout(() => {
        setZoomMap(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setZoomMap(false);
    }
  }, [resultStep]);
  
  // AI Chat State
  const WELCOME_CHAT: ChatMessage[] = [
    {
      sender: 'assistant',
      text: 'Chào mừng bạn đến với Bản đồ nội tâm! Linh Nhi ở đây để giúp bạn diễn giải chi tiết hơn về MBTI, lá số Tử Vi, cũng như tháo gỡ những vướng mắc trong sự nghiệp, tình duyên hay cuộc sống của bạn.',
    },
  ];
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(WELCOME_CHAT);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [mentorConversations, setMentorConversations] = useState<ChatConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [activeMentorJourney, setActiveMentorJourney] = useState<string | null>(null);

  // ── Navigation (single source of truth) ────────────────────────────────
  // Every screen maps to exactly one URL here, so router.push + setCurrentScreen
  // never drift apart. Prefer goToScreen() over calling them separately.
  const SCREEN_PATHS: Record<Screen, string> = {
    landing: '/soulmap',
    test_intro: '/mbti-test',
    assessment: '/mbti-assessment',
    result: '/soulmap-result',
    four_journeys: '/journeys',
    ai_chat: '/ai-mentor',
    journal: '/journal',
    academy: '/academy',
    auth: '/soulmap',
  };

  const goToScreen = (
    screen: Screen,
    direction: 'push' | 'push_back' | 'none' = 'push',
    pathOverride?: string,
  ) => {
    setTransitionDirection(direction);
    router.push(pathOverride ?? SCREEN_PATHS[screen]);
    setCurrentScreen(screen);
  };

  const navigateToAssessment = (direction: 'push' | 'none' = 'push') => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setQuestionsError(null);
    goToScreen('assessment', direction);
  };

  const navigateToTestIntro = (direction: 'push' | 'none' = 'push') => {
    goToScreen('test_intro', direction);
  };

  const navigateToLanding = (direction: 'push_back' | 'none' = 'push_back') => {
    goToScreen('landing', direction);
  };

  const navigateToFourJourneys = () => {
    setJourneyDetail(null);
    goToScreen('four_journeys');
  };

  const navigateToJournal = () => {
    goToScreen('journal');
  };

  const navigateToAcademy = () => {
    goToScreen('academy');
  };

  // Track which screen to return to when the user exits the dedicated AI Chat page.
  const [screenBeforeChat, setScreenBeforeChat] = useState<Screen>('result');

  const navigateToAiChat = () => {
    setScreenBeforeChat(currentScreen);
    if (journeyDetail?.slug) {
      setActiveMentorJourney(journeyDetail.slug);
    }
    goToScreen('ai_chat');
  };

  const exitAiChat = () => {
    goToScreen(screenBeforeChat, 'push_back');
  };

  const handleNewChat = () => {
    setActiveConversationId('');
    setActiveMentorJourney(null);
    setChatError(null);
    setChatHistory([
      {
        sender: 'assistant',
        text: 'Chào bạn! Linh Nhi đang lắng nghe. Hãy chia sẻ điều bạn đang suy nghĩ nhé.',
      },
    ]);
    setChatInput('');
  };

  const refreshMentorConversations = useCallback(async () => {
    if (!isLoggedIn) {
      setMentorConversations([]);
      return;
    }
    try {
      const list = await listMentorConversations();
      setMentorConversations(toConversationSummaries(list));
    } catch (error) {
      console.error('Failed to load mentor conversations', error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentScreen !== 'ai_chat' || !isAuthReady) return;
    void refreshMentorConversations();
  }, [currentScreen, isAuthReady, isLoggedIn, refreshMentorConversations]);

  const handleSelectConversation = async (id: string) => {
    if (!isLoggedIn) {
      goToScreen('auth');
      return;
    }
    setChatError(null);
    try {
      const detail = await getMentorConversation(Number(id));
      setActiveConversationId(String(detail.id));
      setActiveMentorJourney(detail.activeJourney ?? null);
      setChatHistory(toChatMessages(detail.messages));
      setChatInput('');
    } catch (error) {
      const message = error instanceof MentorApiError
        ? error.message
        : 'Không thể mở cuộc trò chuyện. Vui lòng thử lại.';
      setChatError(message);
    }
  };

  // Journey detail overlay for the standalone four_journeys screen
  const [journeyDetail, setJourneyDetail] = useState<SoulMapJourney | null>(null);

  useEffect(() => {
    if (initialScreen !== 'four_journeys' || !isAuthReady) return;

    const slug = searchParams.get('journey');
    if (!slug) {
      setJourneyDetail(null);
      return;
    }
    const journeys = buildMockJourneys(profile || PERSONALITY_PROFILES.DEFAULT);
    setJourneyDetail(journeys.find((journey) => journey.slug === slug) ?? null);
  }, [initialScreen, isAuthReady, profile, searchParams]);

  const handleExploreJourney = (journey: SoulMapJourney) => {
    setTransitionDirection('push');
    setJourneyDetail(journey);
    router.push(`/journeys?journey=${journey.slug}`);
  };

  const getJourneys = () => {
    const journeys = buildMockJourneys(profile || PERSONALITY_PROFILES.DEFAULT);
    if (!profile) return journeys.map((journey) => ({ ...journey, status: 'locked' as const }));

    const readingKeys: Partial<Record<SoulMapJourney['slug'], string>> = {
      identity: 'soulmap_ai_reading_identity_id',
      career: 'soulmap_ai_reading_career_chapter_01_id',
      love: 'soulmap_ai_reading_love_v2_id',
      tuvi: 'soulmap_ai_reading_tuvi_id',
    };
    const hasReading = Object.values(readingKeys).some((key) => key && localStorage.getItem(key));
    if (!hasReading) return journeys.map((journey) => ({ ...journey, status: 'locked' as const }));

    return journeys.map((journey) => {
      const key = readingKeys[journey.slug];
      return { ...journey, status: !key || localStorage.getItem(key) ? 'ready' as const : 'locked' as const };
    });
  };

  const handleBackFromJourneyDetail = () => {
    setTransitionDirection('push_back');
    setJourneyDetail(null);
    router.push('/journeys');
  };

  const buildAnswersFromMbtiType = (mbtiType: string): Record<number, 'A' | 'B'> => {
    const letters = new Set(mbtiType.split(''));
    return SOULMAP_QUESTIONS.reduce<Record<number, 'A' | 'B'>>((acc, question) => {
      const preferred = question.options.find((option) => letters.has(option.mbtiValue));
      acc[question.id] = preferred?.key || 'A';
      return acc;
    }, {});
  };

  const handleManualMbtiSubmit = (mbtiType: string) => {
    const normalizedType = mbtiType.trim().toUpperCase();
    const computedProfile = PERSONALITY_PROFILES[normalizedType] || PERSONALITY_PROFILES.DEFAULT;
    const inferredAnswers = buildAnswersFromMbtiType(computedProfile.type);

    setTransitionDirection('push');
    setAnswers(inferredAnswers);
    setSelectedOption(null);
    setCurrentQuestionIndex(0);
    setProfile(computedProfile);
    localStorage.setItem('soulmap_profile', JSON.stringify(computedProfile));
    localStorage.setItem('soulmap_mbti_answers', JSON.stringify(inferredAnswers));
    setChatHistory([
      {
        sender: 'assistant',
        text: `Linh Nhi đã ghi nhận kết quả MBTI ${computedProfile.type} của bạn. Bước tiếp theo là bổ sung thông tin ngày sinh để mở khóa SoulMap hoàn chỉnh nhé. ✨`,
      },
    ]);
    setResultStep('mbti_summary');
    setGenerationProgress(0);
    setZoomMap(false);
    router.push('/soulmap-result');
    setCurrentScreen('result');
  };

  const handleSelectOption = (option: 'A' | 'B') => {
    const currentQuestion = mbtiQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    setSelectedOption(option);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNextQuestion = async () => {
    if (!selectedOption) return;
    const currentQuestion = mbtiQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Transition between questions is 'none'
    setTransitionDirection('none');
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };

    if (currentQuestionIndex < mbtiQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Pre-fill if already answered
      const nextQId = mbtiQuestions[currentQuestionIndex + 1].id;
      setSelectedOption(updatedAnswers[nextQId] || null);
    } else {
      setIsSubmittingMbti(true);

      let computedProfile: PersonalityProfile;
      try {
        const mbtiType = await submitMbtiAnswers(updatedAnswers);
        computedProfile = PERSONALITY_PROFILES[mbtiType] || PERSONALITY_PROFILES.DEFAULT;
      } catch (error) {
        console.error('Failed to submit MBTI answers:', error);
        setQuestionsError('Không thể gửi kết quả MBTI. Vui lòng thử lại sau.');
        setIsSubmittingMbti(false);
        return;
      }

      setIsSubmittingMbti(false);
      setProfile(computedProfile);
      localStorage.setItem('soulmap_profile', JSON.stringify(computedProfile));
      localStorage.setItem('soulmap_mbti_answers', JSON.stringify(updatedAnswers));
      
      // Initialize AI welcome chat for this archetype
      setChatHistory([
        { 
          sender: 'assistant', 
          text: `Chúc mừng bạn đã hoàn thành bản đồ nội tâm! Bản mệnh của bạn mang năng lượng cốt lõi của nguyên tố ${computedProfile.element} (${computedProfile.mbtiMatch}). Linh Nhi ở đây để cùng bạn khám phá chi tiết từng trụ cột cuộc đời. Bạn muốn tìm hiểu sâu hơn về khía cạnh nào trước tiên? ✨` 
        }
      ]);
      
      setResultStep('mbti_summary');
      setGenerationProgress(0);
      setZoomMap(false);
      router.push('/soulmap-result');
      setCurrentScreen('result');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setTransitionDirection('none');
      setCurrentQuestionIndex(prev => prev - 1);
      const prevQId = mbtiQuestions[currentQuestionIndex - 1].id;
      setSelectedOption(answers[prevQId] || null);
    }
  };

  const handleSaveProgress = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'soulmap_mbti_progress',
      JSON.stringify({ currentQuestionIndex, answers }),
    );
  };

  // Dynamically get support message from Linh Nhi based on progress
  const getLinhNhiDialogue = () => {
    if (currentQuestionIndex === 0) return 'Đừng suy nghĩ quá lâu nhé! Câu trả lời đầu tiên thường phản ánh bạn thật nhất.';
    if (currentQuestionIndex === 2) return "Tính cách của bạn đang dần hiển lộ trên bản đồ rồi. Thật kỳ diệu! ✨";
    if (currentQuestionIndex === 5) return "Đã đi được nửa chặng đường rồi! Hãy hít thở thật sâu và tiếp tục lắng nghe nội tâm của mình nhé.";
    if (currentQuestionIndex === 8) return "Chỉ còn vài câu hỏi nữa thôi, Linh Nhi đang chuẩn bị dệt nên bức tranh tâm hồn độc bản dành riêng cho bạn!";
    return "Hãy cứ trả lời thật lòng, không có đúng hay sai, chỉ có phiên bản chân thực nhất của bạn thôi. ❤️";
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || chatInput).trim();
    if (!messageText || isTyping) return;

    if (!isLoggedIn) {
      goToScreen('auth');
      return;
    }

    setChatError(null);
    setChatHistory((prev) => [...prev, { sender: 'user', text: messageText }]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    try {
      let conversationId = activeConversationId ? Number(activeConversationId) : null;
      if (!conversationId) {
        const created = await createMentorConversation({
          activeJourney: activeMentorJourney ?? undefined,
        });
        conversationId = created.id;
        setActiveConversationId(String(created.id));
        setActiveMentorJourney(created.activeJourney ?? null);
        // Keep welcome + user message already shown; server also has welcome.
      }

      const result = await sendMentorMessage(conversationId, messageText);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'assistant', text: result.assistantMessage.content },
      ]);
      setActiveConversationId(String(result.conversation.id));
      await refreshMentorConversations();
    } catch (error) {
      const message = error instanceof MentorApiError
        ? (error.status === 401
          ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          : error.message)
        : 'Không thể gửi tin nhắn tới Linh Nhi. Vui lòng thử lại.';
      setChatError(message);
      setChatHistory((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.sender === 'user' && last.text === messageText) {
          next.pop();
        }
        return next;
      });
      if (!textToSend) setChatInput(messageText);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EB] flex flex-col overflow-x-hidden">
      
      {/* Top Navigation Bar (Shared across all pages except custom headers) */}
      {currentScreen !== 'auth' && currentScreen !== 'result' && (
        <Navbar 
          isLoggedIn={isLoggedIn}
          isAuthReady={isAuthReady}
          currentUser={currentUser}
          currentScreen={currentScreen}
          handleLogout={handleLogout}
          navigateToLanding={navigateToLanding}
          navigateToAssessment={navigateToAssessment}
          navigateToTestIntro={navigateToTestIntro}
          onOpenJourneys={navigateToFourJourneys}
          onOpenAiMentor={navigateToAiChat}
          setCurrentScreen={setCurrentScreen}
          setTransitionDirection={setTransitionDirection}
        />
      )}

      {/* Screen Routing */}
      {currentScreen === 'landing' && (
        <LandingScreen 
          isLoggedIn={isLoggedIn}
          setTransitionDirection={setTransitionDirection}
          setCurrentScreen={setCurrentScreen}
          navigateToAssessment={navigateToAssessment}
          navigateToTestIntro={navigateToTestIntro}
        />
      )}

      {currentScreen === 'test_intro' && (
        <MbtiStartScreen
          navigateToAssessment={navigateToAssessment}
          handleManualMbtiSubmit={handleManualMbtiSubmit}
        />
      )}

      {currentScreen === 'auth' && (
        <GoogleAuthScreen
          authError={authError}
          setAuthError={setAuthError}
          authSuccessMsg={authSuccessMsg}
          setAuthSuccessMsg={setAuthSuccessMsg}
          isAuthLoading={isAuthLoading}
          setIsAuthLoading={setIsAuthLoading}
          handleGoogleSignIn={handleGoogleSignIn}
          navigateToLanding={navigateToLanding}
        />
      )}

      {currentScreen === 'assessment' && (
        <AssessmentScreen 
          questions={mbtiQuestions}
          currentQuestionIndex={currentQuestionIndex}
          selectedOption={selectedOption}
          handleSelectOption={handleSelectOption}
          handlePrevQuestion={handlePrevQuestion}
          handleNextQuestion={handleNextQuestion}
          getLinhNhiDialogue={getLinhNhiDialogue}
          onSaveProgress={handleSaveProgress}
          isLoading={isQuestionsLoading}
          error={questionsError}
          isSubmitting={isSubmittingMbti}
        />
      )}

      {currentScreen === 'result' && profile && (
        <ResultScreen 
          profile={profile}
          answers={answers}
          resultStep={resultStep}
          setResultStep={setResultStep}
          birthName={birthName}
          setBirthName={setBirthName}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          birthCalendar={birthCalendar}
          setBirthCalendar={setBirthCalendar}
          birthTime={birthTime}
          setBirthTime={setBirthTime}
          gender={gender}
          setGender={setGender}
          generationProgress={generationProgress}
          setGenerationProgress={setGenerationProgress}
          zoomMap={zoomMap}
          setZoomMap={setZoomMap}
          chatHistory={chatHistory}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          handleLogout={handleLogout}
          setCurrentScreen={setCurrentScreen}
          setTransitionDirection={setTransitionDirection}
          navigateToAssessment={navigateToAssessment}
          navigateToTestIntro={navigateToTestIntro}
          navigateToLanding={navigateToLanding}
          navigateToAiChat={navigateToAiChat}
          navigateToJourneys={navigateToFourJourneys}
        />
      )}

      {currentScreen === 'four_journeys' && journeyDetail && (
          <JourneyDetailScreen
            journey={journeyDetail}
            onOpenAiMentor={navigateToAiChat}
          onBack={handleBackFromJourneyDetail}
        />
      )}

      {currentScreen === 'four_journeys' && !journeyDetail && (
        <FourJourneysScreen
          journeys={getJourneys()}
          onExplore={handleExploreJourney}
          onCreateSoulMap={navigateToTestIntro}
          userName={currentUser?.name}
        />
      )}

      {currentScreen === 'ai_chat' && (
        <AIChatScreen
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatHistory={chatHistory}
          isTyping={isTyping}
          currentUser={currentUser}
          handleSendMessage={handleSendMessage}
          onNewChat={handleNewChat}
          onExit={exitAiChat}
          conversations={mentorConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          chatError={chatError}
          requiresLogin={!isLoggedIn}
          onRequestLogin={() => goToScreen('auth')}
        />
      )}

      {currentScreen === 'journal' && (
        <JournalScreen currentUser={currentUser} />
      )}

      {currentScreen === 'academy' && (
        <AcademyScreen currentUser={currentUser} />
      )}
    </div>
  );
}
