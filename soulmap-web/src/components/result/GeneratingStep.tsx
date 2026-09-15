import type { LucideIcon } from 'lucide-react';
import {
  RefreshCw,
  CheckCircle2,
  Lock,
  HelpCircle,
} from 'lucide-react';
import Button from '../ui/Button';

export interface GenerationStep {
  title: string;
  icon: LucideIcon;
}

interface GeneratingStepProps {
  generationProgress: number;
  generationPercent: number;
  generationSteps: GenerationStep[];
  isGenerationComplete: boolean;
  generationError: string | null;
  onRetry: () => void;
  onContinue: () => void;
}

/**
 * "Linh Nhi is generating your SoulMap" waiting screen.
 * Renders beneath the shared <Navbar/> (no self-drawn brand header) so the
 * familiar brand frame stays present during this trust-critical moment.
 */
export default function GeneratingStep({
  generationProgress,
  generationPercent,
  generationSteps,
  isGenerationComplete,
  generationError,
  onRetry,
  onContinue,
}: GeneratingStepProps) {
  const activeStepTitle = !isGenerationComplete
    ? generationSteps[generationProgress]?.title
    : null;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1180px] animate-fade-in items-center py-3">
      <div className="relative max-h-[calc(100vh-3rem)] min-h-[620px] w-full overflow-y-auto overflow-x-hidden rounded-[2rem] border border-[#E8DFCF]/90 bg-[#FFFCF8]/88 px-6 py-6 text-center shadow-[0_28px_90px_-46px_rgba(33,77,59,0.48)] backdrop-blur-sm md:px-8 md:py-6">
        <img
          src="/soulmap-island.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-18 blur-[1px]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_22%,rgba(255,252,248,0.86),rgba(255,252,248,0.62)_36%,rgba(250,246,238,0.78)_100%)]" />
        <div className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[420px] rounded-full bg-[#B68A2F]/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[#24533E]/10 blur-3xl" />

        <div className="relative z-10 flex min-h-[560px] flex-col items-center">
          <div className="flex w-full items-center justify-end gap-3">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-[#E8DFCF] bg-[#FFFDF8]/86 px-4 py-2 font-sans text-[0.82rem] font-bold text-[#7A6E5C] shadow-sm sm:flex"
            >
              <HelpCircle className="h-4 w-4 text-[#B68A2F]" />
              Hướng dẫn
            </button>
            <div className="flex items-center gap-2 rounded-full bg-[#FFFDF8]/70 px-2 py-1.5">
              <img
                src="/linh-nhi-mascot.png"
                alt="Linh Nhi"
                className="h-10 w-10 rounded-full object-contain"
                draggable={false}
              />
              <span className="hidden font-sans text-[0.82rem] font-bold text-[#214D3B] sm:inline">Linh Nhi</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="font-display text-[1.2rem] leading-none text-[#B68A2F]">✦</p>
            <h2 className="mt-1 font-display text-[2.5rem] font-bold leading-tight text-[#214D3B] md:text-[3.25rem]">
              {isGenerationComplete ? 'Bạn Có Thể Bắt Đầu Hành Trình' : 'Linh Nhi Đang Tạo SoulMap'}
            </h2>
            <p className="mt-2 font-sans text-[0.94rem] font-medium text-[#5E625F] md:text-[1rem]">
              {isGenerationComplete
                ? 'Hành trình «Tôi là ai» đã sẵn sàng. Bạn có thể vào Journey để khám phá.'
                : activeStepTitle
                  ? `Đang xử lý: ${activeStepTitle}. Tiến độ cập nhật theo kết quả thật từ máy chủ.`
                  : 'Tiến độ cập nhật theo kết quả thật từ máy chủ.'}
            </p>
          </div>

          <div className="mt-6 grid w-full flex-1 grid-cols-1 items-stretch gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-[#E8DFCF] bg-gradient-to-b from-[#FFFDF8]/82 to-[#F8F4EB]/72 p-5 shadow-[0_18px_44px_-34px_rgba(77,52,28,0.38)] backdrop-blur-sm">
              <div className="relative flex flex-col items-center">
                <div className="relative flex h-36 w-36 items-center justify-center md:h-40 md:w-40">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#B68A2F]/45" />
                  <div className="absolute inset-3 rounded-full bg-[#F4EFE3] shadow-inner" />
                  <div
                    className="absolute inset-3 rounded-full shadow-[0_18px_38px_-30px_rgba(33,77,59,0.8)]"
                    style={{
                      background: `conic-gradient(#24533E 0deg ${generationPercent * 3.6}deg, #E7DFD0 ${generationPercent * 3.6}deg 360deg)`,
                    }}
                  />
                  <div className="absolute inset-[24px] rounded-full bg-[#FFFDF8] shadow-[inset_0_0_0_1px_rgba(232,223,207,0.9)]" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#FFFDF8] md:h-24 md:w-24">
                    <span className="font-sans text-[1.45rem] font-extrabold leading-none text-[#24533E] md:text-[1.6rem]">
                      {generationPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex w-full items-center gap-4 rounded-[1.25rem] border border-[#E8DFCF] bg-[#FFFDF8]/82 p-4 text-left shadow-[0_12px_32px_-26px_rgba(77,52,28,0.36)]">
                <img
                  src="/linh-nhi-mascot.png"
                  alt="Linh Nhi"
                  className="h-20 w-20 shrink-0 object-contain"
                  draggable={false}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[0.98rem] font-extrabold text-[#214D3B]">
                    {isGenerationComplete ? 'Bạn có thể rời đi ngay ✨' : 'Linh Nhi đang chuẩn bị bản đồ dành riêng cho bạn ✨'}
                  </p>
                  <p className="mt-1.5 font-sans text-[0.82rem] leading-relaxed text-[#5E625F]">
                    {isGenerationComplete
                      ? 'Hành trình «Tôi là ai» đã hoàn tất. Các journey khác sẽ mở dần khi bạn sẵn sàng.'
                      : 'Mỗi bước chỉ chuyển «Hoàn tất» khi máy chủ xác nhận xong — không còn tiến độ giả.'}
                  </p>
                </div>
              </div>

              {generationError && (
                <div className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50/90 p-4 text-left">
                  <p className="font-sans text-[0.9rem] font-bold text-red-700">{generationError}</p>
                  <Button type="button" onClick={onRetry} size="md" className="mt-3">
                    Thử lại
                  </Button>
                </div>
              )}

              {isGenerationComplete && !generationError && (
                <Button type="button" onClick={onContinue} size="lg" fullWidth className="mt-5">
                  Vào Journey ngay
                </Button>
              )}
            </div>

            <div className="flex flex-col justify-center rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8]/72 p-5 text-left shadow-[0_18px_44px_-30px_rgba(77,52,28,0.42)] backdrop-blur-sm md:p-6">
              {generationSteps.map((step, idx) => {
                const isDone = generationProgress > idx;
                const isActive = generationProgress === idx && !isGenerationComplete && !generationError;
                const StepIcon = step.icon;

                return (
                  <div key={step.title} className="flex items-center gap-4 border-b border-[#E8DFCF] py-3 first:pt-0 last:border-none last:pb-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isDone ? 'bg-[#24533E]/10 text-[#24533E]' : isActive ? 'bg-[#B68A2F]/14 text-[#B17922]' : 'bg-[#E8E4DC] text-[#A7A39B]'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-sans text-[0.98rem] font-extrabold ${
                        isDone ? 'text-[#24533E]' : isActive ? 'text-[#B17922]' : 'text-[#A7A39B]'
                      }`}>
                        {idx + 1}. {step.title}
                      </p>
                    </div>
                    <div className="flex min-w-[92px] items-center justify-end gap-2">
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-[#24533E]" />
                          <span className="font-sans text-[0.82rem] font-medium text-[#5F9071]">Hoàn tất</span>
                        </>
                      ) : isActive ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin text-[#B17922]" />
                          <span className="font-sans text-[0.82rem] font-bold text-[#B17922]">Đang xử lý</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-[#B9B5AE]" />
                          <span className="font-sans text-[0.82rem] text-[#B9B5AE]">Chờ xử lý</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <p className="mt-4 text-center font-sans text-[0.78rem] text-[#7A8A7D]">
                Dữ liệu của bạn được bảo mật tuyệt đối và chỉ bạn mới có thể xem SoulMap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
