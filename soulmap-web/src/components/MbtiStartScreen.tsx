import {
  Brain,
  ClipboardList,
  Clock3,
  Edit3,
  LockKeyhole,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { APP_ASSETS } from '../assets';

interface MbtiStartScreenProps {
  navigateToAssessment: (direction?: 'push' | 'none') => void;
  handleManualMbtiSubmit: (mbtiType: string) => void;
}

const MBTI_TYPES = [
  'INFJ', 'INFP', 'INTJ', 'INTP',
  'ISFJ', 'ISFP', 'ISTJ', 'ISTP',
  'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
  'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
];

const infoCards = [
  { icon: ClipboardList, main: '72 Câu hỏi', sub: 'Trắc nghiệm' },
  { icon: Clock3, main: '12–15 Phút', sub: 'Thời gian' },
  { icon: Brain, main: 'Hiểu rõ', sub: 'Tính cách của bạn' },
];

export default function MbtiStartScreen({
  navigateToAssessment,
  handleManualMbtiSubmit,
}: MbtiStartScreenProps) {
  const [manualType, setManualType] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);

  const submitManualType = () => {
    if (!manualType) return;
    handleManualMbtiSubmit(manualType);
    setShowManualModal(false);
  };

  return (
    <main className="relative mt-20 min-h-[calc(100vh-5rem)] overflow-hidden bg-[#FAF6EE] text-[#24533E]">
      <img
        src={APP_ASSETS.mbtiPreparationBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="mx-auto grid w-full max-w-[1320px] flex-1 items-center justify-center gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,620px)] lg:gap-14">
          <div className="mx-auto w-full max-w-[560px] lg:mx-0">
            <h1 className="max-w-[560px] font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-1px] text-[#24533E] sm:text-[3.35rem] lg:text-[3.75rem]">
              Hãy để Linh Nhi hiểu bạn trước{' '}
              <span className="inline-block text-[0.85em]" aria-hidden="true">✨</span>
            </h1>

            <div className="mt-7 grid max-w-[540px] grid-cols-3 gap-3">
              {infoCards.map(({ icon: Icon, main, sub }) => (
                <div
                  key={main}
                  className="rounded-[1.25rem] border border-[#E8DFCF]/80 bg-[#FFFCF8]/72 px-3 py-4 text-center shadow-[0_16px_40px_-32px_rgba(36,83,62,0.55)] backdrop-blur-md"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F0D9] text-[#5E7E37]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                  <p className="mt-3 font-display text-[1.15rem] font-semibold leading-tight tracking-[-0.3px] text-[#24533E] sm:text-[1.28rem]">{main}</p>
                  <p className="mt-1 font-sans text-[0.78rem] font-medium text-[#68736E]">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 max-w-[540px] space-y-3">
              <button
                type="button"
                onClick={() => navigateToAssessment('push')}
                className="mbti-start-cta group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.35rem] px-6 py-4 font-sans text-base font-bold text-white transition hover:-translate-y-0.5 active:scale-[0.98] sm:text-[1.05rem]"
              >
                <span className="pointer-events-none absolute -left-3 bottom-0 h-12 w-12 rounded-full bg-[#7EAA5A]/35 blur-sm" aria-hidden="true" />
                <span className="pointer-events-none absolute -right-3 bottom-0 h-12 w-12 rounded-full bg-[#7EAA5A]/35 blur-sm" aria-hidden="true" />
                <span className="relative z-10">Bắt đầu làm MBTI</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="flex w-full min-h-[52px] items-center justify-center gap-3 rounded-[1.2rem] border border-[#D5CBB8] bg-[#FFFCF8]/62 px-6 font-sans text-[0.95rem] font-bold text-[#24533E] shadow-sm backdrop-blur transition hover:bg-[#FFFCF8]/85 active:scale-[0.98]"
              >
                <Edit3 className="h-5 w-5" />
                Tôi đã có kết quả MBTI
              </button>

              <p className="flex items-center justify-center gap-2 pt-1 font-sans text-[0.78rem] font-medium text-[#68736E] sm:justify-start">
                <LockKeyhole className="h-3.5 w-3.5" />
                Kết quả của bạn được bảo mật tuyệt đối
              </p>
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-end justify-center lg:min-h-0 lg:items-center lg:justify-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_54%_66%_at_55%_55%,rgba(255,226,110,0.26),transparent_72%)]" />
            <img
              src={APP_ASSETS.linhNhiMbtiMascot}
              alt="Linh Nhi"
              className="relative z-10 h-auto w-[94vw] max-w-[600px] object-contain drop-shadow-[0_32px_58px_rgba(74,92,38,0.28)] sm:max-w-[744px] lg:w-full lg:max-w-[840px]"
            />
          </div>
        </section>

      </div>

      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#214D3B]/35 px-5 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-6 shadow-[0_28px_64px_-24px_rgba(36,83,62,0.55)]"
            role="dialog"
            aria-labelledby="manual-mbti-title"
            aria-modal="true"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="manual-mbti-title" className="font-display text-2xl font-bold text-[#24533E]">
                  Nhập kết quả MBTI
                </h2>
                <p className="mt-1 font-sans text-sm text-[#68736E]">Chọn loại tính cách bạn đã biết trước đó.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DFCF] text-[#24533E] transition hover:bg-[#FAF6EE]"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="block">
              <span className="sr-only">Chọn loại MBTI của bạn</span>
              <select
                value={manualType}
                onChange={(event) => setManualType(event.target.value)}
                className="h-12 w-full rounded-[1rem] border border-[#C8D2B8] bg-[#FFFCF8] px-4 font-sans text-sm font-bold text-[#24533E] outline-none transition focus:border-[#5E7E37] focus:ring-1 focus:ring-[#5E7E37]"
              >
                <option value="">Chọn loại MBTI</option>
                {MBTI_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={submitManualType}
              disabled={!manualType}
              className="mt-4 flex w-full items-center justify-center rounded-[1rem] bg-[#24533E] px-6 py-3.5 font-sans text-base font-bold text-white transition hover:bg-[#1D4433] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Tiếp tục với kết quả này
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
