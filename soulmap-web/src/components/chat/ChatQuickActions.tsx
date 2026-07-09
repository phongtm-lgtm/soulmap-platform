import { BookMarked, Compass, Sparkles, Target } from 'lucide-react';

export interface QuickAction {
  label: string;
  prompt: string;
  icon: typeof Sparkles;
}

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { label: 'Phân tích sâu hơn', prompt: 'Hãy phân tích sâu hơn về điều này giúp tôi.', icon: Sparkles },
  { label: 'Gợi ý nghề phù hợp', prompt: 'Gợi ý cho tôi những nghề nghiệp phù hợp với bản thân.', icon: Compass },
  { label: 'Lưu vào Journal', prompt: 'Hãy lưu cuộc trò chuyện này vào Journal của tôi.', icon: BookMarked },
  { label: 'Đặt mục tiêu', prompt: 'Giúp tôi đặt mục tiêu cụ thể cho 3 tháng tới.', icon: Target },
];

interface ChatQuickActionsProps {
  actions?: QuickAction[];
  onSelect: (prompt: string) => void;
}

/** Pill-shaped suggestion chips shown beneath the latest assistant reply. */
export default function ChatQuickActions({ actions = DEFAULT_QUICK_ACTIONS, onSelect }: ChatQuickActionsProps) {
  return (
    <div className="mt-8 flex w-full max-w-[820px] flex-wrap justify-center gap-2 md:gap-3 md:pl-16">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onSelect(action.prompt)}
            className="inline-flex items-center gap-2 rounded-full border border-[#D9CFBE] bg-[#F7F4EC] px-4 py-2.5 font-sans text-[0.78rem] font-bold text-[#2E5D46] shadow-[0_8px_20px_-18px_rgba(33,77,59,0.45)] transition hover:-translate-y-0.5 hover:border-[#CBBFAE] hover:bg-[#FBF8F1] hover:shadow-[0_12px_24px_-18px_rgba(33,77,59,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C7C69]/25 active:translate-y-0 md:px-5 md:py-3 md:text-[0.84rem]"
          >
            <Icon className="h-3.5 w-3.5 text-[#B68A2F]" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
