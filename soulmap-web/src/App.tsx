"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SOULMAP_QUESTIONS, PERSONALITY_PROFILES, PersonalityProfile, AppScreen, Question } from './types';

// Import modular subcomponents
import Navbar from './components/Navbar';
import LandingScreen from './components/LandingScreen';
import AuthScreen from './components/AuthScreen';
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

interface AppProps {
  initialScreen?: AppScreen;
}

export default function App({ initialScreen = 'landing' }: AppProps) {
  const router = useRouter();
  type Screen = AppScreen;
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  const [transitionDirection, setTransitionDirection] = useState<'push' | 'push_back' | 'none'>('none');

  // User Authentication State
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Initialize from localStorage safely in useEffect after mounting to avoid Next.js SSR hydration errors
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loggedIn = localStorage.getItem('soulmap_logged_in') === 'true';
    const u = localStorage.getItem('soulmap_user');
    let parsedUser: { name: string; email: string } | null = null;
    if (u) {
      try {
        parsedUser = JSON.parse(u);
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
      }
    }

    if (loggedIn && parsedUser) {
      setIsLoggedIn(true);
      setCurrentUser(parsedUser);
    } else {
      localStorage.removeItem('soulmap_logged_in');
      localStorage.removeItem('soulmap_user');
      setIsLoggedIn(false);
      setCurrentUser(null);
    }

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

    setIsAuthReady(true);
  }, []);

  // Auth Screen Local States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.removeItem('soulmap_logged_in');
    localStorage.removeItem('soulmap_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigateToLanding('push_back');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    // Validation
    if (!authEmail) {
      setAuthError('Vui lòng nhập địa chỉ email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authEmail)) {
      setAuthError('Địa chỉ email không đúng định dạng.');
      return;
    }

    if (!authPassword) {
      setAuthError('Vui lòng nhập mật khẩu.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Mật khẩu phải chứa nhất 6 ký tự.');
      return;
    }

    if (authMode === 'register') {
      if (!authName.trim()) {
        setAuthError('Vui lòng nhập họ và tên.');
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthError('Mật khẩu xác nhận không trùng khớp.');
        return;
      }
      if (!agreeTerms) {
        setAuthError('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
        return;
      }
    }

    setIsAuthLoading(true);

    // Simulate authenticating/syncing flow with the cosmic aesthetic
    setTimeout(() => {
      setIsAuthLoading(false);
      const userObj = {
        name: authMode === 'register' ? authName.trim() : (authEmail.split('@')[0].toUpperCase()),
        email: authEmail.trim().toLowerCase()
      };

      localStorage.setItem('soulmap_logged_in', 'true');
      localStorage.setItem('soulmap_user', JSON.stringify(userObj));
      setIsLoggedIn(true);
      setCurrentUser(userObj);

      setAuthSuccessMsg(authMode === 'login' ? 'Đăng nhập thành công! Đang kết nối chòm sao hộ mệnh...' : 'Đăng ký tài khoản thành công! Linh Nhi chào mừng bạn.');
      
      // Auto redirect after a short magical pause
      setTimeout(() => {
        // Clear forms
        setAuthEmail('');
        setAuthPassword('');
        setAuthConfirmPassword('');
        setAuthName('');
        setAuthError('');
        setAuthSuccessMsg('');
        
        router.push('/journeys');
        setCurrentScreen('four_journeys');
        setTransitionDirection('push');
      }, 1500);

    }, 2000);
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
    if (currentScreen !== 'assessment' || mbtiQuestions.length > 0 || isQuestionsLoading) return;

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
  }, [answers, currentQuestionIndex, currentScreen, isQuestionsLoading, mbtiQuestions.length]);

  // Sub-steps for the results screen: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map'
  const [resultStep, setResultStep] = useState<'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map'>('mbti_summary');
  
  // Birth Information State
  const [birthDate, setBirthDate] = useState<string>('1998-08-15');
  const [birthCalendar, setBirthCalendar] = useState<'solar' | 'lunar'>('solar');
  const [birthTime, setBirthTime] = useState<string>('08:30');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nữ');

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
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    { 
      sender: 'assistant', 
      text: 'Chào mừng bạn đến với Bản đồ nội tâm! 🌿 Linh Nhi ở đây để giúp bạn diễn giải chi tiết hơn về MBTI, lá số Tử Vi, Ngũ hành, cũng như tháo gỡ những vướng mắc trong sự nghiệp, tình duyên hay cuộc sống của bạn.' 
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Navigation handlers with specified transition names
  const navigateToAssessment = (direction: 'push' | 'none' = 'push') => {
    setTransitionDirection(direction);
    router.push('/mbti-assessment');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setCurrentScreen('assessment');
  };

  const navigateToTestIntro = (direction: 'push' | 'none' = 'push') => {
    setTransitionDirection(direction);
    router.push('/mbti-test');
    setCurrentScreen('test_intro');
  };

  const navigateToLanding = (direction: 'push_back' | 'none' = 'push_back') => {
    setTransitionDirection(direction);
    router.push('/soulmap');
    setCurrentScreen('landing');
  };

  const navigateToFourJourneys = () => {
    setJourneyDetail(null);
    setTransitionDirection('push');
    router.push('/journeys');
    setCurrentScreen('four_journeys');
  };

  const navigateToJournal = () => {
    setTransitionDirection('push');
    router.push('/journal');
    setCurrentScreen('journal');
  };

  const navigateToAcademy = () => {
    setTransitionDirection('push');
    router.push('/academy');
    setCurrentScreen('academy');
  };

  // Track which screen to return to when the user exits the dedicated AI Chat page.
  const [screenBeforeChat, setScreenBeforeChat] = useState<Screen>('result');

  const navigateToAiChat = () => {
    setScreenBeforeChat(currentScreen);
    setTransitionDirection('push');
    router.push('/ai-mentor');
    setCurrentScreen('ai_chat');
  };

  const exitAiChat = () => {
    setTransitionDirection('push_back');
    router.push(screenBeforeChat === 'four_journeys' ? '/journeys' : '/soulmap');
    setCurrentScreen(screenBeforeChat);
  };

  const handleNewChat = () => {
    setChatHistory([
      {
        sender: 'assistant',
        text: 'Chào bạn! Linh Nhi đang lắng nghe. Hãy chia sẻ điều bạn đang suy nghĩ nhé. 🌿',
      },
    ]);
    setChatInput('');
  };

  // Journey detail overlay for the standalone four_journeys screen
  const [journeyDetail, setJourneyDetail] = useState<SoulMapJourney | null>(null);

  const handleExploreJourney = (journey: SoulMapJourney) => {
    setTransitionDirection('push');
    setJourneyDetail(journey);
  };

  const handleBackFromJourneyDetail = () => {
    setTransitionDirection('push_back');
    setJourneyDetail(null);
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

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;

    // Add user message
    setChatHistory(prev => [...prev, { sender: 'user', text: messageText }]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    // Simulate AI Wisdom Reply
    setTimeout(() => {
      let replyText = "";
      const lowerText = messageText.toLowerCase();
      const userType = profile?.type || "INFJ";
      const element = profile?.element || "Mộc";

      if (lowerText.includes("sự nghiệp") || lowerText.includes("công việc") || lowerText.includes("career")) {
        replyText = `Với năng lượng của một ${profile?.name} (hệ ${element}), con đường sự nghiệp lý tưởng của bạn không chỉ là kiếm sống mà là tìm kiếm "sứ mệnh thiêng liêng". Bạn phát huy tốt nhất khi được làm việc trong môi trường tôn trọng sự độc lập và mang tính nhân văn sâu sắc. Tránh các công việc lặp đi lặp lại hay thiếu đi sự thấu cảm nhé. Bạn nghĩ sao về một vai trò kết nối hoặc sáng tạo nội dung? 💡`;
      } else if (lowerText.includes("tình duyên") || lowerText.includes("tình yêu") || lowerText.includes("love") || lowerText.includes("mối quan hệ")) {
        replyText = `Trong tình duyên, bạn là người tìm kiếm sự kết nối "tâm giao" - sâu sắc, chân thành và thấu hiểu lẫn nhau ở cấp độ linh hồn. Bạn cực kỳ nhạy cảm với năng lượng của đối phương. Lời khuyên từ Linh Nhi là hãy học cách bày tỏ mong muốn của mình rõ ràng hơn, và đừng ngần ngại cho bản thân cơ hội đón nhận tình yêu ấm áp nhé! 🌟`;
      } else if (lowerText.includes("khuyên") || lowerText.includes("lời khuyên") || lowerText.includes("advice")) {
        replyText = `Lời khuyên dành cho bạn hôm nay là: "Hãy tin vào trực giác của mình". Đôi khi thế giới bên ngoài quá ồn ào khiến bạn nghi ngờ bản thân. Hãy dành ra 10 phút tĩnh lặng cuối ngày, thắp một ngọn nến thơm hoặc ngồi thiền nhẹ để kết nối lại với ngọn lửa nội tâm của bạn nhé! 🧘‍♀️`;
      } else if (lowerText.includes("tử vi") || lowerText.includes("ngũ hành") || lowerText.includes("zodiac") || lowerText.includes("sao")) {
        replyText = `Bạn có lá số hộ mệnh được chiếu sáng bởi ${profile?.zodiac}. Sự tương tác giữa tinh tú cổ xưa phương Đông và tính cách ${userType} phương Tây mang lại cho bạn một nguồn năng lượng độc bản. Hệ ${element} thúc đẩy bạn luôn hướng thượng, thích che chở và lan tỏa giá trị tốt đẹp. Hãy phát huy tối đa tinh thần này! 🎋`;
      } else {
        replyText = `Linh Nhi rất hiểu chia sẻ của bạn. Là một ${profile?.name}, bạn thường có xu hướng suy nghĩ rất nhiều (overthinking) và tự tạo áp lực cho mình. Hãy nhớ rằng hành trình khám phá bản thân là một chặng đường dài đầy thú vị, hãy bước từng bước nhẹ nhàng và tận hưởng hiện tại nhé. Linh Nhi luôn ở bên bạn! 🌸`;
      }

      setChatHistory(prev => [...prev, { sender: 'assistant', text: replyText }]);
      setIsTyping(false);
    }, 1200);
  };

  // Determine container translation animation classes based on state
  const getScreenTransitionClass = () => {
    return '';
  };

  return (
    <div className={`min-h-screen bg-[#fbf9f5] flex flex-col overflow-x-hidden ${getScreenTransitionClass()}`}>
      
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
          onOpenJournal={navigateToJournal}
          onOpenAcademy={navigateToAcademy}
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
        <AuthScreen 
          authMode={authMode}
          setAuthMode={setAuthMode}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authConfirmPassword={authConfirmPassword}
          setAuthConfirmPassword={setAuthConfirmPassword}
          authName={authName}
          setAuthName={setAuthName}
          authError={authError}
          setAuthError={setAuthError}
          authSuccessMsg={authSuccessMsg}
          setAuthSuccessMsg={setAuthSuccessMsg}
          isAuthLoading={isAuthLoading}
          setIsAuthLoading={setIsAuthLoading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
          handleAuthSubmit={handleAuthSubmit}
          navigateToLanding={navigateToLanding}
          setCurrentScreen={setCurrentScreen}
          setTransitionDirection={setTransitionDirection}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentUser={setCurrentUser}
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
        <JourneyDetailScreen journey={journeyDetail} onBack={handleBackFromJourneyDetail} />
      )}

      {currentScreen === 'four_journeys' && !journeyDetail && (
        <FourJourneysScreen
          journeys={profile ? buildMockJourneys(profile) : buildMockJourneys({
            type: 'INFJ', name: 'Người Bảo Hộ', title: 'The Advocate',
            element: 'Mộc', zodiac: 'Xử Nữ', mbtiMatch: 'INFJ',
            description: '',
            pillars: {
              identity: 'Khám phá bản sắc và nội tâm để hiểu rõ con người thật của bạn.',
              career: 'Định hướng và phát triển con đường sự nghiệp phù hợp với bản thân.',
              love: 'Thấu hiểu tình yêu và kết nối để xây dựng mối quan hệ bền vững.',
              life: 'Hiểu vận mệnh và sống trọn vẹn hành trình của chính bạn.',
            },
            advice: [],
          })}
          onExplore={handleExploreJourney}
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
