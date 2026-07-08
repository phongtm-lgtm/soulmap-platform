import { useState } from 'react';
import { Bookmark, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
  subtitle = 'Linh Nhi AI',
  onSaveInsight,
  onRename,
  onDelete,
}: ChatTopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#E8DFCF]/80 bg-[#F8F6F1]/85 px-6 backdrop-blur-sm md:px-10">
      <div className="min-w-0">
        <h1 className="truncate font-display text-[1.15rem] font-bold leading-tight text-[#24533E]">
          {title}
        </h1>
        <p className="mt-0.5 flex items-center gap-1.5 font-sans text-[0.78rem] font-medium text-[#8B9088]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSaveInsight}
          className="inline-flex items-center gap-2 rounded-full border border-[#E8DFCF] bg-[#FFFDF8] px-4 py-2 font-sans text-[0.8rem] font-bold text-[#24533E] shadow-sm transition hover:border-[#C8A15A]/60 hover:bg-[#C8A15A]/8"
        >
          <Bookmark className="h-4 w-4 text-[#B68A2F]" />
          <span className="hidden sm:inline">Lưu Insight</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#5E625F] transition hover:bg-[#24533E]/6"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Thêm tùy chọn"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-44 overflow-hidden rounded-xl border border-[#E8DFCF] bg-[#FFFDF8] py-1.5 shadow-[0_18px_40px_-20px_rgba(33,77,59,0.4)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRename?.();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 font-sans text-[0.82rem] font-semibold text-[#24533E] transition hover:bg-[#24533E]/5"
                >
                  <Pencil className="h-4 w-4 text-[#B68A2F]" />
                  Đổi tên
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete?.();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 font-sans text-[0.82rem] font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa hội thoại
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
