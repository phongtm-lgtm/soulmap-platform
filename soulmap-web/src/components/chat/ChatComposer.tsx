import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Mic, Paperclip, ArrowUp } from 'lucide-react';

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/** Sticky bottom composer — large rounded textarea, attachment/voice icons, circular send button. */
export default function ChatComposer({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Trò chuyện với Linh Nhi...',
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea up to a comfortable max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, 120);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="shrink-0 bg-gradient-to-t from-[#FCF9F8] via-[#FCF9F8]/94 to-transparent pb-5 pt-4">
      <div className="mx-auto flex w-full max-w-[760px] items-end gap-2 rounded-full border border-[#C2C8C2] bg-white px-4 py-2 shadow-sm backdrop-blur-sm transition focus-within:ring-1 focus-within:ring-[#7C5730]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="custom-scrollbar max-h-[120px] min-h-10 flex-1 resize-none bg-transparent px-1 py-2 font-sans text-[0.96rem] leading-relaxed text-[#173124] outline-none placeholder:italic placeholder:font-light placeholder:text-[#8E9089]"
        />

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent text-[#424844] transition hover:bg-[#F0EDED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5730]/25"
          aria-label="Ghi âm giọng nói"
        >
          <Mic className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent text-[#424844] transition hover:bg-[#F0EDED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5730]/25"
          aria-label="Đính kèm tệp"
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          aria-label="Gửi tin nhắn"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24533E]/25 ${
            canSend
              ? 'border-none bg-[#173124] text-white hover:scale-105 active:scale-90 cursor-pointer'
              : 'border-none bg-[#EEE7DD] text-[#B5ADA0] cursor-not-allowed'
          }`}
        >
          <ArrowUp className="h-[17px] w-[17px]" />
        </button>
      </div>
      <p className="mx-auto mt-3 flex max-w-[760px] items-center justify-center gap-2 text-center font-sans text-[0.72rem] font-medium text-[#7A5C1C]">
        <span aria-hidden="true">▣</span>
        SoulMap AI luôn bảo mật và tôn trọng hành trình của bạn.
      </p>
    </div>
  );
}
