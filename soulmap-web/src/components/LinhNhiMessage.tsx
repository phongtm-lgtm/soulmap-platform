import { Lightbulb } from 'lucide-react';
import { APP_ASSETS } from '../assets';

type LinhNhiVariant = 'tip' | 'mini';

interface LinhNhiMessageProps {
  message: string;
  variant?: LinhNhiVariant;
  title?: string;
  className?: string;
}

/** Linh Nhi + lời nhắn — chỉ 2 dạng: tip (hộp text) hoặc mini (avatar nhỏ + bubble). */
export default function LinhNhiMessage({
  message,
  variant = 'tip',
  title = 'Linh Nhi nhắn bạn',
  className = '',
}: LinhNhiMessageProps) {
  if (variant === 'mini') {
    return (
      <div className={`flex items-start gap-2.5 ${className}`}>
        <img
          src={APP_ASSETS.linhNhiMascot}
          alt=""
          aria-hidden="true"
          className="h-9 w-9 shrink-0 rounded-full border border-[#E8DFCF] bg-[#FAF6EE] object-cover p-0.5"
        />
        <div className="rounded-2xl rounded-tl-sm border border-[#E8DFCF] bg-[#FFFCF8]/95 px-3.5 py-2.5">
          <p className="font-sans text-xs font-medium leading-relaxed text-[#214D3B]/82">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-[#EDE6D4] bg-[#FFFCF8]/90 p-4 ${className}`}>
      <div className="mb-2 flex items-center gap-2 font-sans text-xs font-bold text-[#214D3B]">
        <Lightbulb className="h-4 w-4 text-[#C8A15A]" />
        {title}
      </div>
      <p className="font-sans text-xs font-medium leading-relaxed text-[#214D3B]/80 sm:text-sm">{message}</p>
    </div>
  );
}
