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
        <div className="max-w-[720px] rounded-[1.35rem] rounded-br-md bg-[#24533E] px-5 py-3.5 font-sans text-[0.94rem] leading-relaxed text-white shadow-[0_10px_24px_-16px_rgba(33,77,59,0.5)]">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[720px] animate-fade-in items-start gap-3">
      <img
        src={APP_ASSETS.linhNhiMascot}
        alt="Linh Nhi"
        className="mt-0.5 h-8 w-8 shrink-0 rounded-full border border-[#E8DFCF] bg-white object-contain p-0.5"
        draggable={false}
      />
      <div className="rounded-[1.35rem] rounded-tl-md border border-[#E8DFCF]/70 bg-white px-5 py-3.5 font-sans text-[0.94rem] leading-relaxed text-[#2A2E2B] shadow-[0_2px_10px_-4px_rgba(33,77,59,0.08)]">
        {message.text}
      </div>
    </div>
  );
}

/** Typing indicator shown while the assistant is "composing" a reply. */
export function ChatTypingBubble() {
  return (
    <div className="flex w-full max-w-[720px] animate-fade-in items-start gap-3">
      <img
        src={APP_ASSETS.linhNhiMascot}
        alt="Linh Nhi"
        className="mt-0.5 h-8 w-8 shrink-0 rounded-full border border-[#E8DFCF] bg-white object-contain p-0.5"
        draggable={false}
      />
      <div className="flex items-center gap-1.5 rounded-[1.35rem] rounded-tl-md border border-[#E8DFCF]/70 bg-white px-5 py-4 shadow-[0_2px_10px_-4px_rgba(33,77,59,0.08)]">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#24533E]/50" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
