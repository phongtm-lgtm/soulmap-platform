import { APP_ASSETS } from '../../assets';
import type { ChatMessage } from '../../types/chat';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

/** Single chat message row — white card for assistant, forest green bubble for user. */
export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex w-full animate-fade-in justify-end">
        <div className="max-w-[86%] rounded-[1.35rem] rounded-br-md bg-gradient-to-br from-[#2C704D] to-[#1D5338] px-5 py-3.5 font-sans text-[0.95rem] leading-[1.75] text-white shadow-[0_22px_42px_-24px_rgba(33,77,59,0.72)] md:max-w-[410px] md:px-6 md:py-4 md:text-[1rem]">
          <p className="whitespace-pre-line">{message.text}</p>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-[0.72rem] font-medium text-white/90">
            <span>10:30</span>
            <span aria-hidden="true">✓</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[760px] animate-fade-in items-start gap-3 md:gap-4">
      <span className="mt-1 h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#F2E8D8] shadow-[0_10px_22px_-18px_rgba(33,77,59,0.5)] md:h-12 md:w-12">
        <img
          src={APP_ASSETS.linhNhiMascot}
          alt="Linh Nhi"
          className="h-full w-full scale-[1.85] object-contain"
          draggable={false}
        />
      </span>
      <div className="min-w-0 flex-1 rounded-[1.35rem] border border-[#E5D9C7] bg-[#FFFDFB]/95 px-5 py-4 font-sans text-[0.95rem] leading-[1.78] text-[#171D19] shadow-[0_18px_46px_-32px_rgba(33,77,59,0.5)] backdrop-blur-sm md:px-6 md:py-5 md:text-[1rem]">
        <div className="space-y-3 whitespace-pre-line">{message.text}</div>
        <div className="mt-1 text-right text-[0.72rem] font-medium text-[#8A8D86]">10:31</div>
      </div>
    </div>
  );
}

/** Typing indicator shown while the assistant is "composing" a reply. */
export function ChatTypingBubble() {
  return (
    <div className="mt-8 flex w-full max-w-[760px] animate-fade-in items-start gap-3 md:gap-4">
      <span className="mt-1 h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#F2E8D8] md:h-12 md:w-12">
        <img
          src={APP_ASSETS.linhNhiMascot}
          alt="Linh Nhi"
          className="h-full w-full scale-[1.85] object-contain"
          draggable={false}
        />
      </span>
      <div className="flex items-center gap-1.5 rounded-[1.35rem] border border-[#E5D9C7] bg-[#FFFDFB]/95 px-6 py-5 shadow-[0_18px_46px_-32px_rgba(33,77,59,0.5)]">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
