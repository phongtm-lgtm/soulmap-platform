import { APP_ASSETS } from '../../assets';
import type { ChatMessage } from '../../types/chat';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

/** Single chat message row — quiet editorial card for assistant, forest bubble for user. */
export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex w-full animate-fade-in justify-end gap-3">
        <div className="max-w-[86%] rounded-[22px] bg-[#2D4739] px-5 py-4 font-sans text-[0.95rem] leading-[1.75] text-[#DCE9DF] shadow-sm md:max-w-[520px] md:px-6 md:text-[1rem]">
          <p className="whitespace-pre-line">{message.text}</p>
          <div className="mt-2 flex items-center justify-end gap-1.5 text-[0.72rem] font-medium text-[#B0CDBB]">
            <span>10:30</span>
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
        <div className="mt-2 text-right text-[0.72rem] font-medium text-[#8A8D86]">10:31</div>
      </div>
    </div>
  );
}

/** Typing indicator shown while the assistant is "composing" a reply. */
export function ChatTypingBubble() {
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
