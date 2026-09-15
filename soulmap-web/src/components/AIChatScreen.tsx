"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, BookOpen, BriefcaseBusiness, ChevronRight, Heart, Leaf, Mic, PenLine, Sparkles, Target } from 'lucide-react';
import ChatBackground from './chat/ChatBackground';
import ChatSidebar from './chat/ChatSidebar';
import ChatMessageBubble, { ChatTypingBubble } from './chat/ChatMessageBubble';
import ChatQuickActions from './chat/ChatQuickActions';
import ChatComposer from './chat/ChatComposer';
import { APP_ASSETS } from '../assets';
import type { ChatConversationSummary, ChatMessage } from '../types/chat';

interface AIChatScreenProps {
  chatInput: string;
  setChatInput: (value: string) => void;
  chatHistory: ChatMessage[];
  isTyping: boolean;
  currentUser: { name: string; email: string } | null;
  handleSendMessage: (textToSend?: string) => void;
  onNewChat: () => void;
  onExit: () => void;
  conversations: ChatConversationSummary[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  chatError?: string | null;
  requiresLogin?: boolean;
  onRequestLogin?: () => void;
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
  conversations,
  activeConversationId,
  onSelectConversation,
  chatError,
  requiresLogin = false,
  onRequestLogin,
}: AIChatScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasEnteredWorkspace, setHasEnteredWorkspace] = useState(false);
  const isOnlyWelcome = chatHistory.length === 1 && chatHistory[0]?.sender === 'assistant';
  const messagesToRender = chatHistory;
  const shouldShowHome = !hasEnteredWorkspace && isOnlyWelcome && !isTyping && !activeConversationId;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messagesToRender.length, isTyping]);

  useEffect(() => {
    if (activeConversationId || chatHistory.length > 1) {
      setHasEnteredWorkspace(true);
    }
  }, [activeConversationId, chatHistory.length]);

  const handleNewChatClick = () => {
    setHasEnteredWorkspace(false);
    onNewChat();
  };

  const handleQuickAction = (prompt: string) => {
    if (requiresLogin) {
      onRequestLogin?.();
      return;
    }
    setHasEnteredWorkspace(true);
    handleSendMessage(prompt);
  };

  const handleSend = () => {
    if (requiresLogin) {
      onRequestLogin?.();
      return;
    }
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
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setHasEnteredWorkspace(true);
          onSelectConversation(id);
        }}
        chatError={chatError}
        requiresLogin={requiresLogin}
        onRequestLogin={onRequestLogin}
      />
    );
  }

  const lastMessage = messagesToRender[messagesToRender.length - 1];
  const showQuickActions = !isTyping && lastMessage?.sender === 'assistant';

  return (
    <div className="relative mt-20 flex h-[calc(100vh-5rem)] w-full flex-col overflow-hidden bg-[#F8F4EB]">
      <ChatBackground />

      <div className="relative z-[1] flex min-h-0 flex-1 overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setHasEnteredWorkspace(true);
            onSelectConversation(id);
          }}
          onNewChat={handleNewChatClick}
          currentUser={currentUser}
        />

        <main className="relative z-[1] flex min-w-0 flex-1 flex-col bg-[#F8F4EB]/82">
          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="mx-auto flex min-h-full w-full max-w-[820px] flex-col px-4 pb-8 pt-10 sm:px-6 md:px-8">
              <div className="mx-auto mb-8 flex w-full max-w-[720px] items-center gap-4 text-[#B8B2A6]">
                <span className="h-px flex-1 bg-[#E1DACF]" />
                <Leaf className="h-4 w-4" />
                <span className="font-sans text-[0.9rem] font-extrabold text-[#214D3B]">Hôm nay</span>
                <Leaf className="h-4 w-4 -scale-x-100" />
                <span className="h-px flex-1 bg-[#E1DACF]" />
              </div>

              {requiresLogin && (
                <div className="mb-6 rounded-2xl border border-[#E8DFCF] bg-white/80 px-5 py-4 text-center">
                  <p className="font-sans text-sm text-[#5E625F]">
                    Đăng nhập để trò chuyện với Linh Nhi và lưu lịch sử mentor.
                  </p>
                  <button
                    type="button"
                    onClick={onRequestLogin}
                    className="mt-3 rounded-full bg-[#24533E] px-4 py-2 font-sans text-sm font-semibold text-white"
                  >
                    Đăng nhập bằng Google
                  </button>
                </div>
              )}

              {chatError && (
                <p className="mb-4 rounded-xl border border-[#F0D3C8] bg-[#FFF6F3] px-4 py-3 font-sans text-sm text-[#9A4B3C]">
                  {chatError}
                </p>
              )}

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

              {showQuickActions && !requiresLogin && <ChatQuickActions onSelect={handleQuickAction} />}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 md:px-8">
            <ChatComposer
              value={chatInput}
              onChange={setChatInput}
              onSend={handleSend}
              disabled={isTyping || requiresLogin}
            />
          </div>
        </main>
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
  conversations: ChatConversationSummary[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  chatError?: string | null;
  requiresLogin?: boolean;
  onRequestLogin?: () => void;
}

function LinhNhiHome({
  userName,
  value,
  onChange,
  onSend,
  onNewChat,
  onSelectPrompt,
  onExit: _onExit,
  currentUser,
  conversations,
  activeConversationId,
  onSelectConversation,
  chatError,
  requiresLogin,
  onRequestLogin,
}: LinhNhiHomeProps) {
  const prompts = useMemo(
    () => [
      {
        title: 'Sự nghiệp',
        text: 'Mình có nên đổi hướng công việc trong giai đoạn này không?',
        icon: BriefcaseBusiness,
        iconClass: 'bg-[#DFECDC] text-[#24533E]',
        chips: ['Mình phù hợp với nghề nào?', 'Làm sao tăng thu nhập?'],
      },
      {
        title: 'Tình yêu',
        text: 'Vì sao mình dễ bất an trong các mối quan hệ?',
        icon: Heart,
        iconClass: 'bg-[#F7DEDA] text-[#B84D43]',
        chips: ['Người phù hợp với mình là ai?', 'Làm sao giữ mối quan hệ bền vững?'],
      },
      {
        title: 'Tôi là ai',
        text: 'Điểm mạnh tiềm ẩn lớn nhất của mình là gì?',
        icon: Sparkles,
        iconClass: 'bg-[#F7E7C5] text-[#C78B2B]',
        chips: ['Điểm mạnh tiềm ẩn của mình?', 'Mình thật sự muốn gì?'],
      },
      {
        title: 'Nhật ký',
        text: 'Giúp mình nhìn lại cảm xúc gần đây một cách rõ ràng hơn.',
        icon: PenLine,
        iconClass: 'bg-[#E9DDEE] text-[#7C4F82]',
        chips: ['Viết nhật ký hôm nay', 'Nhìn lại cảm xúc tuần này'],
      },
      {
        title: 'Hành trình',
        text: 'Mình đang ở chặng nào trong hành trình phát triển bản thân?',
        icon: BookOpen,
        iconClass: 'bg-[#DDECF1] text-[#2D7182]',
        chips: ['Xem tiến độ hành trình', 'Chương gần nhất của tôi'],
      },
      {
        title: 'Ra quyết định',
        text: 'Giúp mình chọn hướng đi phù hợp nhất lúc này.',
        icon: Target,
        iconClass: 'bg-[#F3E3C9] text-[#B66D24]',
        chips: ['Nên chọn phương án nào?', 'Đặt mục tiêu cho tháng này'],
      },
    ],
    [],
  );

  const canSend = value.trim().length > 0 && !requiresLogin;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8F4EB] pt-20 text-[#1C1B1B]">
      <ChatBackground />
      <div className="relative z-[2] h-[calc(100vh-5rem)] shrink-0 self-start">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onNewChat={onNewChat}
          currentUser={currentUser}
        />
      </div>

      <main className="relative z-[1] mx-auto w-full max-w-[1120px] px-6 pb-10 pt-10 md:px-10 md:pt-14">
        <section className="relative overflow-hidden pb-4 text-center">
          <h1 className="mx-auto max-w-[760px] font-display text-[3rem] font-medium leading-[1.05] tracking-[-0.02em] text-[#214D3B] md:text-[4.2rem]">
            Xin chào, {userName}.
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] font-display text-[1.35rem] italic leading-snug text-[#6F756F] md:text-[1.55rem]">
            Hôm nay bạn muốn khám phá điều gì về chính mình?
          </p>
        </section>

        {requiresLogin && (
          <div className="mx-auto mb-4 max-w-[760px] rounded-2xl border border-[#E8DFCF] bg-white/80 px-5 py-4 text-center">
            <p className="font-sans text-sm text-[#5E625F]">
              Đăng nhập để bắt đầu trò chuyện với Linh Nhi.
            </p>
            <button
              type="button"
              onClick={onRequestLogin}
              className="mt-3 rounded-full bg-[#24533E] px-4 py-2 font-sans text-sm font-semibold text-white"
            >
              Đăng nhập bằng Google
            </button>
          </div>
        )}

        {chatError && (
          <p className="mx-auto mb-4 max-w-[760px] rounded-xl border border-[#F0D3C8] bg-[#FFF6F3] px-4 py-3 text-center font-sans text-sm text-[#9A4B3C]">
            {chatError}
          </p>
        )}

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
              className="max-h-[120px] min-h-11 flex-1 resize-none border-none bg-transparent py-3 font-sans text-[1rem] leading-relaxed text-[#214D3B] outline-none placeholder:italic placeholder:text-[#424844]/50 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => canSend && onSend()}
              disabled={!canSend}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#24533E] text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-[#EEE7DD] disabled:text-[#B5ADA0] disabled:opacity-100"
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
                    <span className="block font-display text-[1.55rem] font-semibold leading-none text-[#214D3B]">{prompt.title}</span>
                  </span>
                  <ChevronRight className="mt-2 h-5 w-5 text-[#9A5D24] transition group-hover:translate-x-0.5" />
                </button>
                <div className="mt-5 flex flex-wrap gap-2">
                  {prompt.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => onSelectPrompt(chip)}
                      className="rounded-full border border-[#E4D2BD] bg-[#FFF9F0] px-3 py-1.5 font-sans text-xs text-[#5E625F] transition hover:border-[#CFAE80] hover:text-[#214D3B]"
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
          <p className="relative z-[1] mx-auto max-w-[620px] font-display text-[1.1rem] italic leading-[1.8] text-[#24533E]">
            <span className="mr-3 text-3xl text-[#B68A2F]">“</span>
            Bạn không cần phải biết tất cả ngay hôm nay.<br />
            Chỉ cần bước tiếp một bước nhỏ với sự chân thành.
            <span className="ml-3 text-3xl text-[#B68A2F]">”</span>
          </p>
          <img src={APP_ASSETS.pillars.decorLeaf} alt="" className="pointer-events-none absolute right-10 top-0 h-24 w-24 opacity-55" draggable={false} />
        </section>
      </main>
    </div>
  );
}
