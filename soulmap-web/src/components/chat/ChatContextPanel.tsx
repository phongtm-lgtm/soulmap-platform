import { BookOpen, ChevronRight, Compass, Gem, NotebookPen, Sparkles } from 'lucide-react';

const REFERENCES = [
  { title: 'MBTI', icon: Compass },
  { title: 'Tử Vi', icon: Sparkles },
  { title: 'Nhật ký', icon: NotebookPen },
];

const SUGGESTIONS = [
  'Khám phá động lực làm việc',
  'Phân tích mối quan hệ',
  'Định hướng năm nay',
];

interface ChatContextPanelProps {
  onSelectSuggestion: (prompt: string) => void;
}

export default function ChatContextPanel({ onSelectSuggestion }: ChatContextPanelProps) {
  return (
    <aside className="relative z-[2] hidden h-full w-[280px] shrink-0 overflow-y-auto border-l border-[#E6DDCE] bg-[#FFFDF8]/92 px-4 py-7 backdrop-blur-xl custom-scrollbar xl:block">
      <section className="rounded-2xl border border-[#EEE7DD] bg-white/72 p-5 shadow-[0_16px_36px_-32px_rgba(23,49,36,0.55)]">
        <div>
          <h2 className="font-display text-[1rem] font-semibold leading-tight text-[#173124]">
            Linh Nhi đang tham chiếu
          </h2>
        </div>

        <div className="mt-4 divide-y divide-[#EEE7DD]">
          {REFERENCES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                className="group flex w-full items-center gap-3 py-3 text-left transition hover:text-[#7C5730]"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center text-[#7C5730]">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-sm font-semibold text-[#22251F]">{item.title}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-[#424844] transition group-hover:translate-x-0.5 group-hover:text-[#7C5730]" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8 space-y-4 px-4">
        <h3 className="font-display text-[1.2rem] font-semibold text-[#173124]">Gợi ý hôm nay</h3>
        <div className="space-y-3">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSelectSuggestion(suggestion)}
              className="group flex w-full items-start gap-3 text-left font-sans text-sm leading-relaxed text-[#424844] transition hover:text-[#7C5730]"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7C5730]" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      </section>

      <Gem className="absolute bottom-8 right-5 h-10 w-10 text-[#E7D4AA]/80" />
    </aside>
  );
}
