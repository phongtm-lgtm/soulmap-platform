import { Leaf, Heart, Copy, MoreHorizontal, Check } from 'lucide-react';
import { APP_ASSETS } from '../../assets';
import type { ChatMessage } from '../../types/chat';

type BubbleVariant = 'full' | 'compact';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  /**
   * 'full'   — editorial layout for the dedicated chat page.
   * 'compact'— smaller teaser bubble used by the Landing chat demo window.
   */
  variant?: BubbleVariant;
  /** Timestamp label. Defaults differ per sender in full mode. */
  time?: string;
}

/**
 * Single chat message row. One source of truth for chat bubbles so the Landing
 * demo and the real AI Mentor page stop drifting apart.
 */
export default function ChatMessageBubble({ message, variant = 'full', time }: ChatMessageBubbleProps) {
  const isUser = message.sender === 'user';

  if (variant === 'compact') {
    return (
      <div
        className={`chat-demo-message flex items-start gap-3 max-w-[82%] ${
          isUser ? 'self-end flex-row-reverse text-right' : 'self-start text-left'
        }`}
      >
        {!isUser && (
          <div className="chat-demo-avatar w-12 h-12 rounded-full border border-[#B68A2F]/30 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 mt-1">
            <img
              src={APP_ASSETS.linhNhiMascot}
              alt="Linh Nhi"
              className="chat-demo-avatar-img w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div
          className={`p-4 rounded-2xl shadow-sm body-text-sm ${
            isUser
              ? 'chat-demo-user-bubble rounded-br-none'
              : 'bg-white border border-[#214D3B]/8 text-[#214D3B] rounded-bl-none'
          }`}
        >
          <p className="chat-demo-author">
            {isUser ? 'Người dùng' : 'Linh Nhi'}
            {!isUser && <Leaf className="inline-block w-3 h-3 ml-1 text-[#68A55C]" />}
          </p>
          <p className="chat-demo-text whitespace-pre-line">{message.text}</p>
          <div className="chat-demo-meta">
            <span>{time ?? '10:32'}</span>
            {isUser && <Check className="w-3.5 h-3.5" />}
          </div>
          {!isUser && (
            <div className="chat-demo-actions" aria-hidden="true">
              <Heart className="w-4 h-4" />
              <Copy className="w-4 h-4" />
              <MoreHorizontal className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex w-full animate-fade-in justify-end gap-3">
        <div className="max-w-[86%] rounded-[22px] bg-[#2D4739] px-5 py-4 font-sans text-[0.95rem] leading-[1.75] text-[#DCE9DF] shadow-sm md:max-w-[520px] md:px-6 md:text-[1rem]">
          <p className="whitespace-pre-line">{message.text}</p>
          <div className="mt-2 flex items-center justify-end gap-1.5 text-[0.72rem] font-medium text-[#B0CDBB]">
            <span>{time ?? '10:30'}</span>
            <span aria-hidden="true">✓</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[760px] animate-fade-in items-start gap-4 md:gap-6">
      <span className="mt-0 h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#F2E8D8] shadow-sm md:h-20 md:w-20">
        <img
          src={APP_ASSETS.linhNhiMascot}
          alt="Linh Nhi"
          className="h-full w-full scale-[1.9] object-contain"
          draggable={false}
        />
      </span>
      <div className="min-w-0 flex-1 rounded-[22px] border border-[#E5E2E1] bg-[#F6F3F2] px-5 py-4 font-sans text-[0.95rem] leading-[1.78] text-[#1C1B1B] shadow-sm backdrop-blur-sm md:px-6 md:py-5 md:text-[1rem]">
        <div className="space-y-3 whitespace-pre-line">{message.text}</div>
        <div className="mt-2 text-right text-[0.72rem] font-medium text-[#8A8D86]">{time ?? '10:31'}</div>
      </div>
    </div>
  );
}

/** Typing indicator shown while the assistant is "composing" a reply. */
export function ChatTypingBubble({ variant = 'full' }: { variant?: BubbleVariant }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-3 self-start text-left max-w-[82%]">
        <div className="chat-demo-avatar w-12 h-12 rounded-full border border-[#B68A2F]/30 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 mt-1">
          <img
            src={APP_ASSETS.linhNhiMascot}
            alt="Linh Nhi"
            className="chat-demo-avatar-img w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#214D3B]/8 text-[#214D3B] rounded-bl-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#214D3B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-[#214D3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-[#214D3B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex w-full max-w-[760px] animate-fade-in items-start gap-4 md:gap-6">
      <span className="mt-0 h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#F2E8D8] md:h-20 md:w-20">
        <img
          src={APP_ASSETS.linhNhiMascot}
          alt="Linh Nhi"
          className="h-full w-full scale-[1.9] object-contain"
          draggable={false}
        />
      </span>
      <div className="flex items-center gap-1.5 rounded-[22px] border border-[#E5E2E1] bg-[#F6F3F2] px-6 py-5 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
