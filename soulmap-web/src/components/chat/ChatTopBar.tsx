import { MoreVertical } from 'lucide-react';
import { APP_ASSETS } from '../../assets';

interface ChatTopBarProps {
  title: string;
  subtitle?: string;
  onSaveInsight?: () => void;
  onToggleContext?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onExit?: () => void;
}

/** Top navigation bar for the main chat pane — title, Linh Nhi status, Save Insight + More menu. */
export default function ChatTopBar({
  title,
  subtitle,
  onSaveInsight: _onSaveInsight,
  onToggleContext,
  onRename: _onRename,
  onDelete: _onDelete,
  onExit: _onExit,
}: ChatTopBarProps) {
  return (
    <header className="relative z-[2] flex shrink-0 items-center justify-between border-b border-[#E6DDCE] bg-[#FCF9F8]/86 px-4 py-4 backdrop-blur-xl sm:px-6 md:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <span className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#7C5730]/20 bg-[#F2E8D8] sm:block">
          <img src={APP_ASSETS.linhNhiMascot} alt="Linh Nhi" className="h-full w-full scale-[1.85] object-contain" draggable={false} />
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[1.45rem] font-semibold leading-tight text-[#173124] md:text-[1.7rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 truncate font-sans text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#6A6E69]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleContext}
          className="grid h-10 w-10 place-items-center rounded-full text-[#424844] transition hover:bg-[#F0EDED]"
          aria-label="Hiển thị ngữ cảnh"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
