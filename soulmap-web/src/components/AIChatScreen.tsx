"use client";

import { useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';
import ChatBackground from './chat/ChatBackground';
import ChatSidebar from './chat/ChatSidebar';
import ChatMessageBubble, { ChatTypingBubble } from './chat/ChatMessageBubble';
import ChatQuickActions from './chat/ChatQuickActions';
import ChatComposer from './chat/ChatComposer';
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
  const shouldShowDemo = chatHistory.length === 1 && chatHistory[0]?.sender === 'assistant';
  const messagesToRender = shouldShowDemo ? demoMessages : chatHistory;

  // Auto scroll to the latest message whenever the transcript changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messagesToRender.length, isTyping]);

  const handleNewChatClick = () => {
    onNewChat();
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSend = () => {
    handleSendMessage();
  };

  const lastMessage = messagesToRender[messagesToRender.length - 1];
  const showQuickActions = !isTyping && lastMessage?.sender === 'assistant';

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#FBF8F1]">
      <ChatBackground />

      <ChatSidebar
        conversations={[]}
        activeConversationId=""
        onSelectConversation={() => {}}
        onNewChat={handleNewChatClick}
        currentUser={currentUser}
      />

      {/* Main chat pane */}
      <main className="relative z-[1] flex min-w-0 flex-1 flex-col pt-20">
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex min-h-full w-full max-w-[1060px] flex-col px-4 pb-8 pt-6 sm:px-6 md:px-8 md:pt-10 xl:px-4">
            <div className="mx-auto mb-8 flex w-full max-w-[860px] items-center gap-4 text-[#B8B2A6]">
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

        <div className="mx-auto w-full max-w-[1060px] px-4 sm:px-6 md:px-8 xl:px-4">
          <ChatComposer
            value={chatInput}
            onChange={setChatInput}
            onSend={handleSend}
            disabled={isTyping}
          />
        </div>
      </main>
    </div>
  );
}
