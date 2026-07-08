import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Mic, Paperclip, Send } from 'lucide-react';

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
  placeholder = 'Hãy chia sẻ điều bạn đang suy nghĩ...',
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea up to a comfortable max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="shrink-0 border-t border-[#E8DFCF]/80 bg-[#F8F6F1] px-6 pb-6 pt-4 md:px-10">
      <div className="mx-auto flex max-w-[720px] items-end gap-2 rounded-[1.75rem] border border-[#E8DFCF] bg-white px-3 py-2.5 shadow-[0_16px_40px_-28px_rgba(33,77,59,0.28)] transition focus-within:border-[#C8A15A]/60">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#8B9088] transition hover:bg-[#24533E]/6 hover:text-[#24533E]"
          aria-label="Đính kèm tệp"
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent py-2 font-sans text-[0.94rem] leading-relaxed text-[#24533E] outline-none placeholder:text-[#A59C8C]"
        />

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#8B9088] transition hover:bg-[#24533E]/6 hover:text-[#24533E]"
          aria-label="Ghi âm giọng nói"
        >
          <Mic className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          aria-label="Gửi tin nhắn"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
            canSend
              ? 'bg-[#24533E] text-white shadow-[0_10px_20px_-10px_rgba(33,77,59,0.55)] hover:bg-[#1D4433] active:scale-90'
              : 'cursor-not-allowed bg-[#E8DFCF] text-[#B4AC9B]'
          }`}
        >
          <Send className="h-[17px] w-[17px]" />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-[720px] text-center font-sans text-[0.68rem] text-[#A59C8C]">
        Linh Nhi có thể đưa ra thông tin chưa chính xác. Hãy kiểm chứng những điều quan trọng.
      </p>
    </div>
  );
}
