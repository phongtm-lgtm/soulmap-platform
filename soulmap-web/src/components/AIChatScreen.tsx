"use client";

import { useEffect, useRef, useState } from 'react';
import { MonitorSmartphone } from 'lucide-react';
import ChatBackground from './chat/ChatBackground';
import ChatSidebar from './chat/ChatSidebar';
import ChatTopBar from './chat/ChatTopBar';
import ChatMessageBubble, { ChatTypingBubble } from './chat/ChatMessageBubble';
import ChatQuickActions from './chat/ChatQuickActions';
import ChatComposer from './chat/ChatComposer';
import { MOCK_CONVERSATIONS } from '../data/mockConversations';
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

const LIVE_CONVERSATION_ID = MOCK_CONVERSATIONS.find((c) => c.isLive)?.id ?? 'career-orientation';

/**
 * Dedicated SoulMap AI Chat page — a clean, ChatGPT-style 2-column layout.
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
  const [activeConversationId, setActiveConversationId] = useState(LIVE_CONVERSATION_ID);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = MOCK_CONVERSATIONS.find((c) => c.id === activeConversationId);
  const isViewingLive = !activeConversation || activeConversation.isLive;
  const messagesToRender = isViewingLive ? chatHistory : activeConversation?.messages ?? [];

  // Auto scroll to the latest message whenever the transcript changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messagesToRender.length, isTyping, activeConversationId]);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleNewChatClick = () => {
    setActiveConversationId(LIVE_CONVERSATION_ID);
    onNewChat();
  };

  const handleQuickAction = (prompt: string) => {
    if (!isViewingLive) setActiveConversationId(LIVE_CONVERSATION_ID);
    handleSendMessage(prompt);
  };

  const handleSend = () => {
    if (!isViewingLive) setActiveConversationId(LIVE_CONVERSATION_ID);
    handleSendMessage();
  };

  const lastMessage = messagesToRender[messagesToRender.length - 1];
  const showQuickActions = isViewingLive && !isTyping && lastMessage?.sender === 'assistant';

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <ChatBackground />

      <ChatSidebar
        conversations={MOCK_CONVERSATIONS}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChatClick}
        onExit={onExit}
        currentUser={currentUser}
      />

      {/* Mobile / tablet notice — this experience is desktop only */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center lg:hidden">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#24533E]/8 text-[#24533E]">
          <MonitorSmartphone className="h-6 w-6" />
        </span>
        <p className="font-display text-lg font-bold text-[#24533E]">Trải nghiệm tối ưu trên desktop</p>
        <p className="max-w-xs font-sans text-sm text-[#6A6E69]">
          SoulMap AI Chat hiện được thiết kế riêng cho màn hình lớn. Vui lòng mở trên máy tính để trò chuyện cùng Linh Nhi.
        </p>
        <button
          type="button"
          onClick={onExit}
          className="mt-2 rounded-full bg-[#24533E] px-5 py-2.5 font-sans text-sm font-bold text-white"
        >
          Quay lại
        </button>
      </div>

      {/* Main chat pane */}
      <main className="relative z-[1] hidden flex-1 flex-col lg:flex">
        <ChatTopBar
          title={activeConversation?.title ?? 'Trò chuyện mới'}
          onSaveInsight={() => {
            /* Phase 1 — no backend yet; hook up to Journal API later. */
          }}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col gap-6 px-6 py-8 md:px-10">
            {messagesToRender.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-center">
                <p className="font-display text-xl font-bold text-[#24533E]">Bắt đầu trò chuyện với Linh Nhi</p>
                <p className="max-w-sm font-sans text-sm text-[#8B9088]">
                  Hãy chia sẻ điều bạn đang suy nghĩ, Linh Nhi luôn sẵn sàng lắng nghe và đồng hành cùng bạn.
                </p>
              </div>
            )}

            {messagesToRender.map((message, index) => (
              <ChatMessageBubble key={index} message={message} />
            ))}

            {isViewingLive && isTyping && <ChatTypingBubble />}

            {showQuickActions && <ChatQuickActions onSelect={handleQuickAction} />}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[900px]">
          <ChatComposer
            value={isViewingLive ? chatInput : ''}
            onChange={setChatInput}
            onSend={handleSend}
            disabled={isTyping}
          />
        </div>
      </main>
    </div>
  );
}
