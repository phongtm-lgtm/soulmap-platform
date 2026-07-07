import { ArrowRight, Bot, BookOpen, Check, Leaf, RotateCcw, Sparkles, Star, UserRound } from 'lucide-react';
import { APP_ASSETS } from '../../assets';
import type { PersonalityProfile } from '../../types';
import { getMbtiArchetypeLabel, getMbtiHighlights, getMbtiShortDescription } from './mbtiSummaryData';

interface MbtiSummaryStepProps {
  profile: PersonalityProfile;
  onContinue: () => void;
  onRetake: () => void;
}

const AXIS_CONFIG = [
  { left: 'Hướng ngoại', leftLetter: 'E', right: 'Hướng nội', rightLetter: 'I', strength: 72 },
  { left: 'Thực tế', leftLetter: 'S', right: 'Trực giác', rightLetter: 'N', strength: 65 },
  { left: 'Lý trí', leftLetter: 'T', right: 'Cảm xúc', rightLetter: 'F', strength: 58 },
  { left: 'Linh hoạt', leftLetter: 'P', right: 'Nguyên tắc', rightLetter: 'J', strength: 75 },
] as const;

function getAxisValues(mbtiType: string) {
  return AXIS_CONFIG.map((axis) => {
    const activeLeft = mbtiType.includes(axis.leftLetter);
    const activeRight = mbtiType.includes(axis.rightLetter);
    const leftValue = activeLeft ? axis.strength : 100 - axis.strength;
    const rightValue = activeRight ? axis.strength : 100 - axis.strength;

    return {
      ...axis,
      leftValue,
      rightValue,
      activeLetter: activeLeft ? axis.leftLetter : axis.rightLetter,
    };
  });
}

export default function MbtiSummaryStep({ profile, onContinue, onRetake }: MbtiSummaryStepProps) {
  const mbtiType = profile.type.toUpperCase();
  const axes = getAxisValues(mbtiType);
  const highlights = getMbtiHighlights(mbtiType);

  return (
    <section className="relative min-h-screen w-full px-4 pb-8 pt-24 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[28px] border border-[#D8DED3]/80 bg-[#FFFCF8]/74 p-4 shadow-[0_22px_70px_rgba(33,77,59,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.08fr_0.9fr]">
            <div className="flex flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8E7D4] bg-[#F7FBF4] px-4 py-2 font-sans text-sm font-bold text-[#315F44]">
                <Sparkles className="h-4 w-4 text-[#C8A15A]" />
                MBTI của bạn đã sẵn sàng!
              </div>

              <div className="mt-7">
                <h1 className="mbti-summary-type font-display font-bold text-[#0E4A31]">
                  {mbtiType}
                </h1>
                <p className="mt-2 font-display text-3xl font-semibold text-[#244D39]">
                  {getMbtiArchetypeLabel(mbtiType)}
                </p>
                <div className="mt-4 flex max-w-xs items-center gap-2 text-[#C8A15A]">
                  <span className="h-px flex-1 bg-[#D7E2D1]" />
                  <Sparkles className="h-4 w-4" />
                  <span className="h-px flex-1 bg-[#D7E2D1]" />
                </div>
              </div>

              <div className="mt-5 flex max-w-md items-start gap-4 rounded-xl border border-[#C8DCC4] bg-[#F9FCF7] px-5 py-4 font-sans text-sm font-semibold leading-relaxed text-[#3D4C42]">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#2F7351]" />
                <span>{getMbtiShortDescription(mbtiType)}</span>
              </div>

              <div className="mt-8 rounded-[22px] border border-[#DFE5DB] bg-[#FFFCF8]/62 p-5 shadow-[0_12px_30px_rgba(33,77,59,0.04)]">
                <h2 className="mb-4 font-display text-xl font-semibold text-[#244D39]">Đặc điểm nổi bật</h2>
                <div className="space-y-4">
                  {axes.map((axis) => (
                    <div key={axis.leftLetter} className="grid grid-cols-[34px_1fr_34px] items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${axis.activeLetter === axis.leftLetter ? 'border-[#B7D9B5] bg-[#F3FAEF] text-[#24533E]' : 'border-[#E4E8DF] bg-[#FFFCF8]/80 text-[#5B725F]'}`}>
                        {axis.leftLetter}
                      </span>
                      <div>
                        <div className="mb-2 flex justify-between font-sans text-xs font-semibold text-[#526056]">
                          <span>{axis.left} {axis.leftValue}%</span>
                          <span>{axis.right} {axis.rightValue}%</span>
                        </div>
                        <div className="relative h-2 rounded-full bg-[#DEE5DD]">
                          <span className="absolute left-0 top-0 h-full rounded-full bg-[#8DBB8E]" style={{ width: `${axis.leftValue}%` }} />
                          <span className="absolute right-0 top-0 h-full rounded-full bg-[#C9D8C9]" style={{ width: `${axis.rightValue}%` }} />
                          <span className="absolute top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D9E7D7] bg-[#FFFCF8] text-[#24533E] shadow-[0_4px_14px_rgba(33,77,59,0.14)]" style={{ left: `${axis.leftValue}%` }}>
                            <Leaf className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${axis.activeLetter === axis.rightLetter ? 'border-[#B7D9B5] bg-[#F3FAEF] text-[#24533E]' : 'border-[#E4E8DF] bg-[#FFFCF8]/80 text-[#5B725F]'}`}>
                        {axis.rightLetter}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-end gap-5 pt-3">
              <div className="relative flex min-h-[300px] items-end justify-center">
                <div className="absolute bottom-8 h-64 w-64 rounded-full bg-[#EAF3E7]" />
                <div className="absolute right-0 top-0 max-w-[270px] rounded-2xl border border-[#BFD8BD] bg-[#FFFCF8]/76 px-5 py-4 font-sans text-sm font-semibold leading-relaxed text-[#244D39] shadow-sm backdrop-blur-xl">
                  Tuyệt vời! Mình đã hiểu bạn hơn rồi. Giờ hãy cùng tạo SoulMap nhé! <span className="text-[#2F7351]">♥</span>
                </div>
                <img
                  src={APP_ASSETS.linhNhiMbtiMascot}
                  alt="Mascot Linh Nhi"
                  className="relative z-10 h-auto w-full max-w-[300px] object-contain drop-shadow-[0_18px_28px_rgba(36,83,62,0.16)] sm:max-w-[340px]"
                />
              </div>

              <div className="rounded-[22px] border border-[#DFE5DB] bg-[#FFFCF8]/68 p-5 shadow-[0_12px_30px_rgba(33,77,59,0.04)]">
                <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-[#244D39]">
                  <Sparkles className="h-5 w-5 text-[#C8A15A]" />
                  Điểm nổi bật của bạn
                </h2>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-[#435046]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F7351] text-white shadow-sm">
                        <Leaf className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-sans text-xs font-semibold italic leading-relaxed text-[#5D725F]">
                  Linh Nhi sẽ giúp bạn khám phá sâu hơn những điểm mạnh này trong SoulMap.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#D8DED3]/80 bg-[#FFFCF8]/82 p-5 text-center shadow-[0_22px_70px_rgba(33,77,59,0.08)] backdrop-blur-xl lg:p-6">
          <h2 className="flex items-center justify-center gap-2 font-display text-2xl font-semibold text-[#24533E]">
            <Sparkles className="h-4 w-4 text-[#C8A15A]" />
            Bước tiếp theo
            <Sparkles className="h-4 w-4 text-[#C8A15A]" />
          </h2>
          <p className="mt-2 font-sans text-sm font-medium text-[#677267]">Chỉ còn 1 bước nữa thôi!</p>

          <div className="mt-7 space-y-0 text-left">
            <div className="grid grid-cols-[48px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#BFE0BE] bg-[#DFF7D8] text-[#24533E] shadow-[0_0_18px_rgba(91,217,101,0.25)]">
                  <Leaf className="h-5 w-5" />
                </span>
                <span className="h-8 border-l border-dashed border-[#C8D1C4]" />
              </div>
              <div className="pt-1.5">
                <div className="font-sans text-base font-bold text-[#24533E]">MBTI</div>
                <div className="mt-1 flex items-center gap-1 font-sans text-xs text-[#2F8A57]"><Check className="h-3.5 w-3.5" /> Hoàn thành</div>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8DFCF] bg-[#FFFCF8] text-[#C8A15A] shadow-sm">
                  <Star className="h-5 w-5" />
                </span>
                <span className="h-8 border-l border-dashed border-[#C8D1C4]" />
              </div>
              <div className="pt-1.5">
                <div className="font-sans text-base font-bold text-[#24533E]">Ngày sinh</div>
                <div className="mt-1 font-sans text-xs font-semibold text-[#C8A15A]">Chỉ cần ngày sinh</div>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DDE7DA] bg-[#FFFCF8] text-[#24533E] shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
              </div>
              <div className="pt-1.5">
                <div className="font-sans text-base font-bold text-[#24533E]">SoulMap</div>
                <div className="mt-1 font-sans text-xs text-[#6B746C]">Bản đồ nội tâm của bạn</div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E8DFCF] bg-[#FFFCF8] p-4 text-left shadow-[0_12px_30px_rgba(33,77,59,0.05)]">
            <p className="mb-4 font-sans text-xs font-bold text-[#526056]">Sau khi mở khóa, bạn sẽ nhận được:</p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F3E4] text-[#24533E]"><UserRound className="h-4 w-4" /></span>
                <div>
                  <div className="font-sans text-sm font-bold text-[#24533E]">Bức tranh tổng quan về bạn</div>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#667167]">Kết nối MBTI và lá số để thấu hiểu bản thân từ nhiều góc nhìn.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F3E4] text-[#24533E]"><BookOpen className="h-4 w-4" /></span>
                <div>
                  <div className="font-sans text-sm font-bold text-[#24533E]">Khám phá 4 hành trình</div>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#667167]">Hiểu sâu bản thân, sự nghiệp, tình yêu và cuộc đời</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F3E4] text-[#24533E]"><Bot className="h-4 w-4" /></span>
                <div>
                  <div className="font-sans text-sm font-bold text-[#24533E]">AI Mentor cá nhân</div>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#667167]">Linh Nhi luôn đồng hành và thấu hiểu bạn</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-5">
            <button
              type="button"
              onClick={onContinue}
              className="relative z-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#24533E] to-[#1D6B43] px-7 py-4 font-sans text-sm font-bold text-white shadow-[0_12px_24px_rgba(36,83,62,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(36,83,62,0.32)] active:translate-y-0"
            >
              Mở khóa SoulMap
              <Sparkles className="h-4 w-4 text-[#F6D98A]" />
              <ArrowRight className="h-5 w-5" />
            </button>
            <img
              src={APP_ASSETS.linhNhiMbtiMascot}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -top-9 z-20 w-24 drop-shadow-[0_10px_18px_rgba(36,83,62,0.18)]"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn làm lại bài test MBTI? Kết quả hiện tại sẽ được thay thế sau khi hoàn thành bài test mới.')) {
                onRetake();
              }
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D9D8CA] bg-[#FFFCF8]/45 px-7 py-3.5 font-sans text-sm font-bold text-[#315F44] transition hover:bg-[#FFFCF8]/70"
          >
            <RotateCcw className="h-4 w-4" />
            Làm lại bài test
          </button>
        </aside>
      </div>
    </section>
  );
}
