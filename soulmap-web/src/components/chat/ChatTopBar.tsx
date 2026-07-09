import { ChevronDown } from 'lucide-react';

interface ChatTopBarProps {
  title: string;
  subtitle?: string;
  onSaveInsight: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

/** Top navigation bar for the main chat pane — title, Linh Nhi status, Save Insight + More menu. */
export default function ChatTopBar({
  title,
  subtitle: _subtitle,
  onSaveInsight: _onSaveInsight,
  onRename: _onRename,
  onDelete: _onDelete,
}: ChatTopBarProps) {
  return (
    <header className="flex h-[136px] shrink-0 items-start justify-between px-10 pb-6 pt-8">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 truncate font-display text-[1.55rem] font-extrabold leading-tight tracking-[-0.03em] text-[#101612]">
          {title}
          <ChevronDown className="mt-1 h-4 w-4 text-[#111613]" />
        </h1>
      </div>
    </header>
  );
}
