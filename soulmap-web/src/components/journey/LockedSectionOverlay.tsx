import { Lock, Sparkles } from 'lucide-react';

interface LockedSectionOverlayProps {
  accentColor: string;
  onUnlock?: () => void;
}

/**
 * Premium gate shown over a locked section's blurred body.
 * Phase 1: the CTA is a placeholder (no checkout wired yet).
 */
export default function LockedSectionOverlay({ accentColor, onUnlock }: LockedSectionOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-b from-[#FFFCF8]/55 via-[#FFFCF8]/85 to-[#FFFCF8] px-6 text-center">
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ backgroundColor: accentColor }}
      >
        <Lock className="h-6 w-6" />
      </span>
      <p className="font-display text-[1.6rem] font-bold text-[#214D3B]">Phần này còn đang khóa</p>
      <p className="max-w-[24rem] font-reading text-[0.95rem] leading-relaxed text-[#5E625F]">
        Mở khóa hành trình để đọc trọn vẹn phần này cùng những gợi ý riêng từ Linh Nhi.
      </p>
      <button
        type="button"
        onClick={onUnlock}
        className="mt-1 inline-flex items-center gap-2 rounded-full px-7 py-3 font-sans text-[0.95rem] font-extrabold text-white shadow-md transition hover:-translate-y-0.5"
        style={{ backgroundColor: accentColor }}
      >
        <Sparkles className="h-4 w-4" />
        Mở khóa hành trình
      </button>
    </div>
  );
}
