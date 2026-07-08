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
    <div className="flex w-full max-w-[720px] flex-wrap gap-2 pl-11">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onSelect(action.prompt)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFCF] bg-white px-4 py-2 font-sans text-[0.8rem] font-semibold text-[#24533E] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C8A15A]/60 hover:bg-[#C8A15A]/8 active:translate-y-0"
          >
            <Icon className="h-3.5 w-3.5 text-[#B68A2F]" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
