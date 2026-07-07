import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Sparkles,
} from 'lucide-react';
import MbtiTestBackground from './MbtiTestBackground';
import LinhNhiMessage from './LinhNhiMessage';
import { SOULMAP_QUESTIONS } from '../types';

interface AssessmentScreenProps {
  currentQuestionIndex: number;
  selectedOption: 'A' | 'B' | null;
  handleSelectOption: (option: 'A' | 'B') => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  getLinhNhiDialogue: () => string;
  onSaveProgress: () => void;
}

const TOTAL_QUESTIONS = 72;

export default function AssessmentScreen({
  currentQuestionIndex,
  selectedOption,
  handleSelectOption,
  handlePrevQuestion,
  handleNextQuestion,
  getLinhNhiDialogue,
  onSaveProgress,
}: AssessmentScreenProps) {
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const currentQuestion = SOULMAP_QUESTIONS[currentQuestionIndex];
  const displayIndex = currentQuestionIndex + 1;
  const progress = (displayIndex / TOTAL_QUESTIONS) * 100;
  const progressPercent = Math.round(progress);

  const handleSaveProgress = () => {
    onSaveProgress();
    setSaveHint('Đã lưu tiến độ!');
    window.setTimeout(() => setSaveHint(null), 2200);
  };

  return (
    <div className="relative z-[1] min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <MbtiTestBackground />

      <main className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-5 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="flex flex-col rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8]/82 p-6 shadow-[0_18px_50px_-38px_rgba(33,77,59,0.35)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-sans text-xs font-extrabold text-[#214D3B]">
              <Sparkles className="h-4 w-4 text-[#4B7E55]" />
              Tiến trình bài test
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={handleSaveProgress}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFCF] bg-[#FFFCF8]/88 px-3 py-2 font-sans text-[11px] font-bold text-[#24533E] shadow-sm transition hover:border-[#3F7A58]/40 hover:bg-[#FFFCF8]"
              >
                <Bookmark className="h-3.5 w-3.5 text-[#4B7E55]" />
                Lưu
              </button>
              {saveHint && (
                <span className="absolute right-0 top-9 whitespace-nowrap font-sans text-[10px] font-bold text-[#3F7A58]">
                  {saveHint}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <p className="font-display text-[2.35rem] font-bold leading-none tracking-tight text-[#214D3B]">
              {displayIndex}
              <span className="mx-1 text-[#8C928D]/70">/</span>
              <span className="text-[#8C928D]/85">{TOTAL_QUESTIONS}</span>
            </p>
            <p className="mt-2 font-sans text-xs font-semibold text-[#5E625F]">
              Hoàn thành {progressPercent}%
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E8E6D9]">
              <div
                className="h-full rounded-full bg-[#3F7A58] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="my-7 h-px bg-[#E8DFCF]" />

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#4B7E55]" />
            <div>
              <p className="font-sans text-xs font-medium text-[#5E625F]">Thời gian ước tính</p>
              <p className="font-sans text-sm font-extrabold text-[#214D3B]">15 – 20 phút</p>
            </div>
          </div>

          <div className="mt-8">
            <LinhNhiMessage variant="tip" message={getLinhNhiDialogue()} />
          </div>

          <p className="mt-auto pt-8 text-center font-sans text-[10px] font-medium leading-relaxed text-[#8C928D]">
            Mỗi lựa chọn sẽ giúp Linh Nhi hiểu bạn thêm một chút ✨
          </p>
        </aside>

        <section className="rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8]/88 p-5 shadow-[0_18px_50px_-38px_rgba(33,77,59,0.32)] backdrop-blur-xl sm:p-7 md:p-8">
          <p className="font-sans text-sm font-extrabold text-[#214D3B]">
            Câu {displayIndex} / {TOTAL_QUESTIONS}
          </p>

          <h1 className="mx-auto mt-6 max-w-[580px] text-center font-display text-xl font-bold leading-snug text-[#1F5A43] md:text-2xl">
            {currentQuestion.questionText}
          </h1>

          <div className="mx-auto mt-6 grid max-w-[560px] grid-cols-1 gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.key;

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(opt.key)}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.99] ${
                    isSelected
                      ? 'border-[#2F6B4D] bg-[#F0F7F2] shadow-[0_8px_24px_-18px_rgba(33,77,59,0.35)]'
                      : 'border-[#E8DFCF] bg-[#FFFCF8] hover:border-[#3F7A58]/50 hover:bg-[#FAF6EE]'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-sm font-extrabold transition-colors ${
                      isSelected ? 'bg-[#2F6B4D] text-white' : 'bg-[#EDE9DF] text-[#5E625F]'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <p className="font-sans text-sm font-medium leading-relaxed text-[#263D36]">
                    {opt.text}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-7 flex w-full max-w-[560px] items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`relative flex min-w-[160px] flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#24533E] px-5 py-3.5 font-sans text-sm font-bold text-white shadow-[0_14px_26px_-16px_rgba(33,77,59,0.65)] transition-all duration-300 hover:bg-[#214D3B] active:scale-95 sm:min-w-[190px] ${
                currentQuestionIndex === 0 ? 'cursor-not-allowed opacity-40 shadow-none hover:bg-[#24533E]' : ''
              }`}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
              <ArrowLeft className="h-4 w-4" />
              Quay lại câu trước
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`relative flex min-w-[160px] flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#24533E] px-5 py-3.5 font-sans text-sm font-bold text-white shadow-[0_14px_26px_-16px_rgba(33,77,59,0.65)] transition-all duration-300 hover:bg-[#214D3B] active:scale-95 sm:min-w-[190px] ${
                !selectedOption ? 'cursor-not-allowed opacity-40 shadow-none hover:bg-[#24533E]' : ''
              }`}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
              {currentQuestionIndex === SOULMAP_QUESTIONS.length - 1 ? 'Khám phá kết quả' : 'Câu tiếp theo'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
