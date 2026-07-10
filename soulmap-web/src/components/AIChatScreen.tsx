"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, BookOpen, BriefcaseBusiness, ChevronRight, Heart, Leaf, Mic, PanelRightClose, PanelRightOpen, PenLine, Sparkles, Target, UserRound } from 'lucide-react';
import ChatBackground from './chat/ChatBackground';
import ChatSidebar from './chat/ChatSidebar';
import ChatMessageBubble, { ChatTypingBubble } from './chat/ChatMessageBubble';
import ChatQuickActions from './chat/ChatQuickActions';
import ChatComposer from './chat/ChatComposer';
import ChatContextPanel from './chat/ChatContextPanel';
import { APP_ASSETS } from '../assets';
import type { ChatMessage } from '../types/chat';

interface AIChatScreenProps {
  chatInput: string;
  setChatInput: (value: string) => void;
  chatHistory: ChatMessage[];
  isTyping: boolean;
  currentUser: { name: string; email: string } | null;
  handleSendMessage: (textToSend?: string) => void;
  onNewChat: () => void;
  onExit: () => void;
}

/**
 * Dedicated chat page — a clean, ChatGPT-style 2-column layout.
 * Desktop only: the sidebar is hidden on smaller viewports and replaced with
 * a lightweight notice, since the spec explicitly scopes this experience to
 * desktop.
 */
export default function AIChatScreen({
  chatInput,
  setChatInput,
  chatHistory,
  isTyping,
  currentUser,
  handleSendMessage,
  onNewChat,
  onExit,
}: AIChatScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasEnteredWorkspace, setHasEnteredWorkspace] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const demoMessages: ChatMessage[] = [
    {
      sender: 'user',
      text: 'Mình cảm thấy chán công việc hiện tại,\nkhông có động lực và thấy bế tắc.',
    },
    {
      sender: 'assistant',
      text:
        'Linh Nhi hiểu cảm giác đó của bạn. 🌿\nDựa trên SoulMap của bạn, mình thấy có một vài điều có thể bạn chưa nhận ra:\n\n🌿  Giá trị cốt lõi: Tự do - Sáng tạo - Ý nghĩa\n⚙️  Điểm mạnh nổi bật: Tư duy chiến lược, Đồng cảm, Sáng tạo\n✣  MBTI (INFJ): Hướng nội - Trực giác - Cảm xúc - Nguyên tắc\n🌿  Giai đoạn hiện tại: Bạn đang ở giai đoạn chuyển đổi quan trọng\n\nCó thể bạn không thiếu năng lực,\nmà chỉ đang làm một công việc chưa thật sự phù hợp với bạn.\n\nBạn muốn Linh Nhi phân tích sâu hơn về hướng đi phù hợp không? ✨',
    },
  ];
  const isOnlyWelcome = chatHistory.length === 1 && chatHistory[0]?.sender === 'assistant';
  const shouldShowDemo = isOnlyWelcome && hasEnteredWorkspace;
  const messagesToRender = shouldShowDemo ? demoMessages : chatHistory;
  const shouldShowHome = !hasEnteredWorkspace && isOnlyWelcome && !isTyping;

  // Auto scroll to the latest message whenever the transcript changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messagesToRender.length, isTyping]);

  const handleNewChatClick = () => {
    setHasEnteredWorkspace(false);
    onNewChat();
  };

  const handleQuickAction = (prompt: string) => {
    setHasEnteredWorkspace(true);
    handleSendMessage(prompt);
  };

  const handleSend = () => {
    setHasEnteredWorkspace(true);
    handleSendMessage();
  };

  const userName = currentUser?.name?.trim().split(' ')[0] || 'bạn';

  if (shouldShowHome) {
    return (
      <LinhNhiHome
        userName={userName}
        value={chatInput}
        onChange={setChatInput}
        onSend={handleSend}
        onNewChat={handleNewChatClick}
        onSelectPrompt={handleQuickAction}
        onExit={onExit}
        currentUser={currentUser}
      />
    );
  }

  const lastMessage = messagesToRender[messagesToRender.length - 1];
  const showQuickActions = !isTyping && lastMessage?.sender === 'assistant';

  return (
    <div className="relative mt-20 flex h-[calc(100vh-5rem)] w-full flex-col overflow-hidden bg-[#FCF9F8]">
      <ChatBackground />

      <div className="relative z-[1] flex min-h-0 flex-1 overflow-hidden">
        <ChatSidebar
          conversations={[]}
          activeConversationId=""
          onSelectConversation={() => {}}
          onNewChat={handleNewChatClick}
          currentUser={currentUser}
        />

        <main className="relative z-[1] flex min-w-0 flex-1 flex-col bg-[#FCF9F8]/82">
          <button
            type="button"
            onClick={() => setShowContextPanel((value) => !value)}
            className="absolute right-4 top-4 z-[3] hidden h-10 w-10 place-items-center rounded-full border border-[#E6DDCE] bg-white/85 text-[#424844] shadow-sm backdrop-blur transition hover:bg-white hover:text-[#173124] xl:grid"
            aria-label={showContextPanel ? 'Ẩn phần tham chiếu' : 'Hiển thị phần tham chiếu'}
          >
            {showContextPanel ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </button>

          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="mx-auto flex min-h-full w-full max-w-[820px] flex-col px-4 pb-8 pt-10 sm:px-6 md:px-8">
              <div className="mx-auto mb-8 flex w-full max-w-[720px] items-center gap-4 text-[#B8B2A6]">
                <span className="h-px flex-1 bg-[#E1DACF]" />
                <Leaf className="h-4 w-4" />
                <span className="font-sans text-[0.9rem] font-extrabold text-[#22251F]">Hôm nay</span>
                <Leaf className="h-4 w-4 -scale-x-100" />
                <span className="h-px flex-1 bg-[#E1DACF]" />
              </div>

              {messagesToRender.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-center">
                  <p className="font-display text-xl font-bold text-[#24533E]">Bắt đầu trò chuyện với Linh Nhi</p>
                  <p className="max-w-sm font-sans text-sm text-[#8B9088]">
                    Hãy chia sẻ điều bạn đang suy nghĩ, Linh Nhi luôn sẵn sàng lắng nghe và đồng hành cùng bạn.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-8">
                {messagesToRender.map((message, index) => (
                  <ChatMessageBubble key={index} message={message} />
                ))}
              </div>

              {isTyping && <ChatTypingBubble />}

              {showQuickActions && <ChatQuickActions onSelect={handleQuickAction} />}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 md:px-8">
            <ChatComposer
              value={chatInput}
              onChange={setChatInput}
              onSend={handleSend}
              disabled={isTyping}
            />
          </div>
        </main>

        {showContextPanel && <ChatContextPanel onSelectSuggestion={handleQuickAction} />}
      </div>
    </div>
  );
}

interface LinhNhiHomeProps {
  userName: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onNewChat: () => void;
  onSelectPrompt: (prompt: string) => void;
  onExit: () => void;
  currentUser: { name: string; email: string } | null;
}

function LinhNhiHome({ userName, value, onChange, onSend, onNewChat, onSelectPrompt, onExit: _onExit, currentUser }: LinhNhiHomeProps) {
  const prompts = useMemo(
    () => [
      {
        title: 'Sự nghiệp',
        subtitle: 'Định hướng, công việc, phát triển',
        text: 'Mình có nên đổi hướng công việc trong giai đoạn này không?',
        icon: BriefcaseBusiness,
        iconClass: 'bg-[#DFECDC] text-[#24533E]',
        chips: ['Mình phù hợp với nghề nào?', 'Làm sao tăng thu nhập?'],
      },
      {
        title: 'Tình yêu',
        subtitle: 'Mối quan hệ, cảm xúc, kết nối',
        text: 'Vì sao mình dễ bất an trong các mối quan hệ?',
        icon: Heart,
        iconClass: 'bg-[#F7DEDA] text-[#B84D43]',
        chips: ['Người phù hợp với mình là ai?', 'Làm sao giữ mối quan hệ bền vững?'],
      },
      {
        title: 'Tôi là ai',
        subtitle: 'Hiểu mình, giá trị, điểm mạnh',
        text: 'Điểm mạnh tiềm ẩn lớn nhất của mình là gì?',
        icon: Sparkles,
        iconClass: 'bg-[#F7E7C5] text-[#C78B2B]',
        chips: ['Điểm mạnh tiềm ẩn của mình?', 'Mình thật sự muốn gì?'],
      },
      {
        title: 'Nhật ký',
        subtitle: 'Ghi lại, phản chiếu, trưởng thành',
        text: 'Giúp mình nhìn lại cảm xúc gần đây một cách rõ ràng hơn.',
        icon: PenLine,
        iconClass: 'bg-[#E9DDEE] text-[#7C4F82]',
        chips: ['Viết nhật ký hôm nay', 'Nhìn lại cảm xúc tuần này'],
      },
      {
        title: 'Hành trình',
        subtitle: 'Tiếp tục hành trình của bạn',
        text: 'Mình đang ở chặng nào trong hành trình phát triển bản thân?',
        icon: BookOpen,
        iconClass: 'bg-[#DDECF1] text-[#2D7182]',
        chips: ['Xem tiến độ hành trình', 'Chương gần nhất của tôi'],
      },
      {
        title: 'Ra quyết định',
        subtitle: 'Lựa chọn, mục tiêu, kế hoạch',
        text: 'Giúp mình chọn hướng đi phù hợp nhất lúc này.',
        icon: Target,
        iconClass: 'bg-[#F3E3C9] text-[#B66D24]',
        chips: ['Nên chọn phương án nào?', 'Đặt mục tiêu cho tháng này'],
      },
    ],
    [],
  );

  const canSend = value.trim().length > 0;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#FCF9F8] pt-20 text-[#1C1B1B]">
      <ChatBackground />
      <div className="relative z-[2] h-[calc(100vh-5rem)] shrink-0 self-start">
        <ChatSidebar
          conversations={[]}
          activeConversationId=""
          onSelectConversation={() => {}}
          onNewChat={onNewChat}
          currentUser={currentUser}
        />
      </div>

      <main className="relative z-[1] mx-auto w-full max-w-[1120px] px-6 pb-10 pt-10 md:px-10 md:pt-14">
        <section className="relative overflow-hidden pb-4 text-center">
          <h1 className="mx-auto max-w-[760px] font-display text-[3rem] font-medium leading-[1.05] tracking-[-0.02em] text-[#173124] md:text-[4.2rem]">
            Xin chào, {userName}.
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] font-display text-[1.35rem] italic leading-snug text-[#6F756F] md:text-[1.55rem]">
            Hôm nay bạn muốn khám phá điều gì về chính mình?
          </p>
        </section>

        <section className="mx-auto mt-6 max-w-[760px]">
          <div className="flex items-end gap-2 rounded-full border border-[#E8DFCF] bg-white/94 p-2 pl-5 shadow-[0_18px_46px_-34px_rgba(23,49,36,0.55)] backdrop-blur-sm focus-within:ring-1 focus-within:ring-[#7C5730]">
            <Mic className="h-5 w-5 shrink-0 self-center text-[#7C5730]" />
            <textarea
              rows={1}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  if (canSend) onSend();
                }
              }}
              placeholder="Hãy hỏi Linh Nhi về sự nghiệp, tình yêu hoặc cuộc sống..."
              className="max-h-[120px] min-h-11 flex-1 resize-none border-none bg-transparent py-3 font-sans text-[1rem] leading-relaxed text-[#173124] outline-none placeholder:italic placeholder:text-[#424844]/50 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => canSend && onSend()}
              disabled={!canSend}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#073D2A] text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Gửi câu hỏi"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-center font-sans text-[0.78rem] font-semibold text-[#8A7C6A]">
            Gợi ý: “Điểm mạnh tiềm ẩn của mình là gì?”
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <article
                key={prompt.title}
                className="group min-h-[168px] rounded-2xl border border-[#EDE3D4] bg-white/72 p-5 text-left shadow-[0_18px_40px_-34px_rgba(23,49,36,0.62)] transition hover:-translate-y-0.5 hover:border-[#CFAE80] hover:bg-white"
              >
                <button type="button" onClick={() => onSelectPrompt(prompt.text)} className="flex w-full items-start gap-4 text-left">
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${prompt.iconClass}`}>
                    <Icon className="h-7 w-7 transition group-hover:scale-110" />
                  </span>
                  <span className="min-w-0 flex-1 pt-1">
                    <span className="block font-display text-[1.55rem] font-semibold leading-none text-[#173124]">{prompt.title}</span>
                    <span className="mt-2 block font-sans text-[0.78rem] text-[#7B817B]">{prompt.subtitle}</span>
                  </span>
                  <ChevronRight className="mt-2 h-5 w-5 text-[#9A5D24] transition group-hover:translate-x-0.5" />
                </button>
                <div className="mt-5 flex flex-wrap gap-2">
                  {prompt.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => onSelectPrompt(chip)}
                      className="rounded-full border border-[#E4D2BD] bg-[#FFF9F0] px-3 py-1.5 font-sans text-xs text-[#5E625F] transition hover:border-[#CFAE80] hover:text-[#173124]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        <section className="relative mt-6 overflow-hidden rounded-2xl border border-[#EDE3D4] bg-[#F5F2EA]/88 px-8 py-5 text-center shadow-[0_18px_40px_-34px_rgba(23,49,36,0.55)]">
          <p className="relative z-[1] mx-auto max-w-[620px] font-display text-[1.1rem] italic leading-relaxed text-[#24533E]">
            <span className="mr-3 text-3xl text-[#D0A75B]">“</span>
            Bạn không cần phải biết tất cả ngay hôm nay.<br />
            Chỉ cần bước tiếp một bước nhỏ với sự chân thành.
            <span className="ml-3 text-3xl text-[#D0A75B]">”</span>
          </p>
          <img src={APP_ASSETS.pillars.decorLeaf} alt="" className="pointer-events-none absolute right-10 top-0 h-24 w-24 opacity-55" draggable={false} />
        </section>
      </main>
    </div>
  );
}
