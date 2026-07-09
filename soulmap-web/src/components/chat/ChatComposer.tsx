import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Mic, Send } from 'lucide-react';

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
    <div className="shrink-0 bg-gradient-to-t from-[#FBF8F1] via-[#FBF8F1]/94 to-transparent pb-5 pt-4">
      <div className="mx-auto flex w-full max-w-[900px] items-end gap-2 rounded-[1.45rem] border border-[#E4DAC9] bg-[#FFFDFB]/96 px-4 py-2.5 shadow-[0_18px_45px_-32px_rgba(33,77,59,0.58)] backdrop-blur-sm transition focus-within:border-[#C8A15A]/70 focus-within:shadow-[0_18px_48px_-30px_rgba(33,77,59,0.7)]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="custom-scrollbar max-h-[120px] min-h-10 flex-1 resize-none bg-transparent px-1 py-2 font-sans text-[0.96rem] leading-relaxed text-[#24533E] outline-none placeholder:text-[#8E9089]"
        />

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent text-[#2E5D46] transition hover:border-[#D9CFBE] hover:bg-[#F7F4EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C7C69]/25"
          aria-label="Ghi âm giọng nói"
        >
          <Mic className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          aria-label="Gửi tin nhắn"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24533E]/25 ${
            canSend
              ? 'border-none bg-[#5C7C69] text-white shadow-[0_10px_20px_-12px_rgba(92,124,105,0.75)] hover:bg-[#526F5E] active:scale-90'
              : 'border-none bg-[#5C7C69] text-white shadow-[0_12px_24px_-16px_rgba(92,124,105,0.7)] opacity-90'
          }`}
        >
          <Send className="h-[17px] w-[17px]" />
        </button>
      </div>
      <p className="mx-auto mt-3 flex max-w-[900px] items-center justify-center gap-2 text-center font-sans text-[0.74rem] font-medium text-[#7A5C1C]">
        <span aria-hidden="true">▣</span>
        SoulMap AI luôn bảo mật và tôn trọng hành trình của bạn.
      </p>
    </div>
  );
}
