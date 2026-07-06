import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { Question, SOULMAP_QUESTIONS } from '../types';

interface AssessmentScreenProps {
  currentQuestionIndex: number;
  selectedOption: 'A' | 'B' | null;
  handleSelectOption: (option: 'A' | 'B') => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  navigateToLanding: (direction?: 'push_back' | 'none') => void;
  getLinhNhiDialogue: () => string;
}

export default function AssessmentScreen({
  currentQuestionIndex,
  selectedOption,
  handleSelectOption,
  handlePrevQuestion,
  handleNextQuestion,
  navigateToLanding,
  getLinhNhiDialogue,
}: AssessmentScreenProps) {
  const currentQuestion = SOULMAP_QUESTIONS[currentQuestionIndex];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Fixed Header with navigation, progress tracker */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbf9f5]/80 backdrop-blur-md border-b border-[#214D3B]/10 shadow-sm shadow-[#214D3B]/5 h-20">
        <div className="flex justify-between items-center h-full px-6 max-w-[1200px] mx-auto w-full">
          {/* Brand Logo */}
          <div className="font-display text-2xl font-semibold text-[#214D3B] flex items-center gap-2 cursor-pointer" onClick={() => navigateToLanding('push_back')}>
            <span className="material-symbols-outlined text-[#B68A2F] text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <span className="tracking-wide">SoulMap</span>
          </div>

          {/* Exit Button: 'Thoát bài test' with transition='push_back' */}
          <button 
            onClick={() => navigateToLanding('push_back')}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#214D3B]/20 rounded-full font-sans font-semibold text-xs text-[#214D3B] hover:bg-[#214D3B]/5 transition-all duration-300 active:scale-95"
          >
            Thoát bài test
            <span className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>
      </nav>

      {/* Main Grid Content */}
      <main className="flex-grow pt-28 pb-16 max-w-[1200px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Interactive Assessment Card */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          
          {/* Question Glass Card */}
          <div className="glass-card rounded-[2rem] p-8 md:p-10 shadow-lg border border-[#214D3B]/8 text-left relative overflow-hidden flex flex-col gap-8">
            
            {/* Section tag, numerical identifier and progress bar */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#214D3B]/5 pb-6">
              <div>
                <h2 className="font-display text-3xl font-semibold text-[#214D3B]">
                  Câu {currentQuestionIndex + 1} / {SOULMAP_QUESTIONS.length}
                </h2>
              </div>
              {/* Custom thin glowing progress bar */}
              <div className="w-full sm:w-1/3 bg-[#eae8e4] rounded-full h-1.5 overflow-hidden relative">
                <div 
                  className="bg-[#B68A2F] h-full rounded-full transition-all duration-500 shadow-md shadow-[#B68A2F]/30"
                  style={{ width: `${((currentQuestionIndex + 1) / SOULMAP_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </header>

            {/* Question Statement */}
            <h3 className="font-display text-2xl text-[#214D3B] font-medium leading-relaxed">
              {currentQuestion.questionText}
            </h3>

            {/* Options List */}
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                return (
                  <button 
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`group rounded-2xl p-5 flex items-center text-left transition-all duration-300 active:scale-[0.99] border cursor-pointer ${
                      isSelected 
                        ? 'bg-white border-[#B68A2F] shadow-md shadow-[#B68A2F]/10' 
                        : 'bg-white/50 border-[#214D3B]/10 hover:border-[#B68A2F]/50 hover:bg-white'
                    }`}
                  >
                    {/* Selector Badge (A/B) */}
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-sans font-bold text-sm mr-4 transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#B68A2F] border-[#B68A2F] text-white shadow-sm'
                        : 'border-[#214D3B]/10 text-[#214D3B] group-hover:bg-[#B68A2F] group-hover:border-[#B68A2F] group-hover:text-white'
                    }`}>
                      {opt.key}
                    </div>
                    <span className="body-text text-[#636A64] flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Row */}
            <div className="flex items-center justify-between pt-4 border-t border-[#214D3B]/5 mt-2">
              <button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-300 ${
                  currentQuestionIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-[#636A64]/50'
                    : 'text-[#214D3B] hover:bg-[#214D3B]/5'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Câu trước
              </button>

              {/* 'Câu tiếp theo' with transition='none' */}
              <button 
                onClick={handleNextQuestion}
                disabled={!selectedOption}
                className={`bg-[#214D3B] text-white hover:bg-[#1a3c34] active:scale-95 px-8 py-3.5 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-md ${
                  !selectedOption ? 'opacity-40 cursor-not-allowed shadow-none' : ''
                }`}
              >
                {currentQuestionIndex === SOULMAP_QUESTIONS.length - 1 ? 'Khám phá kết quả' : 'Câu tiếp theo'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Tip Card */}
          <div className="flex gap-4 items-start p-5 bg-[#B68A2F]/5 border border-[#B68A2F]/10 rounded-2xl text-left shadow-sm">
            <Sparkles className="w-6 h-6 text-[#B68A2F] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-sans font-bold text-xs text-[#214D3B] uppercase tracking-wider block mb-1">Mẹo nhỏ từ SoulMap</span>
              <p className="body-text-sm text-[#636A64] italic">
                &quot;Đừng quá suy nghĩ về việc câu trả lời nào là &apos;đúng&apos;. Hãy chọn phương án đầu tiên hiện ra trong tâm trí bạn - đó chính là tiếng nói chân thực nhất của thế giới nội tại.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Visual & Badges */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full lg:sticky lg:top-28 lg:self-start">
          {/* Illustration Block with floating Linh Nhi mascot */}
          <div className="relative w-full aspect-[5/4] max-h-[360px] rounded-[2rem] overflow-hidden shadow-xl border border-[#214D3B]/10">
            {/* Scenic Background image representing the mystical forest */}
            <img 
              alt="Mystical journey atmosphere" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] brightness-[0.88] hover:grayscale-0 transition-all duration-1000" 
              src="/journey/journey-scenery.png"
            />

            {/* Linh Nhi mascot + speech bubble */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-end gap-3 z-20">
              <div className="glass-card p-3.5 rounded-2xl rounded-br-none shadow-xl border border-[#B68A2F]/20 max-w-[220px] text-left">
                <p className="body-text-xs text-[#214D3B] leading-relaxed">
                  {getLinhNhiDialogue()} 🌿
                </p>
              </div>
              <div className="relative w-24 sm:w-28 max-w-[120px] mascot-glow animate-float pointer-events-none">
                <img 
                  alt="Linh Nhi Mascot" 
                  className="w-full h-auto drop-shadow-[0_20px_36px_rgba(33,77,59,0.35)]" 
                  src="/linh-nhi-mascot.png"
                />
              </div>
            </div>

            {/* Dark Forest Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#214D3B]/50 via-[#214D3B]/10 to-transparent z-10"></div>
          </div>

          {/* Trust/Advantage Badges Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group hover:border-[#214D3B]/25 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[#214D3B] text-2xl mb-1.5 group-hover:scale-110 transition-transform font-bold">science</span>
              <h4 className="font-display font-semibold text-[#214D3B] text-sm">Khoa học</h4>
              <p className="text-[10px] text-[#636A64]/80 mt-0.5 font-sans">Dựa trên mô hình MBTI danh tiếng</p>
            </div>

            <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group hover:border-[#214D3B]/25 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[#214D3B] text-2xl mb-1.5 group-hover:scale-110 transition-transform font-bold">lock</span>
              <h4 className="font-display font-semibold text-[#214D3B] text-sm">Bảo mật</h4>
              <p className="text-[10px] text-[#636A64]/80 mt-0.5 font-sans">Dữ liệu cá nhân ẩn danh 100%</p>
            </div>

            <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group hover:border-[#214D3B]/25 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[#214D3B] text-2xl mb-1.5 group-hover:scale-110 transition-transform font-bold">psychology</span>
              <h4 className="font-display font-semibold text-[#214D3B] text-sm">Thấu hiểu</h4>
              <p className="text-[10px] text-[#636A64]/80 mt-0.5 font-sans">Phân tích sâu sắc về tâm lý học</p>
            </div>

            <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group hover:border-[#214D3B]/25 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[#214D3B] text-2xl mb-1.5 group-hover:scale-110 transition-transform font-bold">moving</span>
              <h4 className="font-display font-semibold text-[#214D3B] text-sm">Phát triển</h4>
              <p className="text-[10px] text-[#636A64]/80 mt-0.5 font-sans">Lời khuyên nâng tầm chất lượng sống</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer space */}
      <footer className="w-full py-12 mt-auto bg-[#214D3B] text-white">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-4 max-w-[1200px] mx-auto text-xs text-white/70 font-sans">
          <div className="font-display text-xl text-white font-semibold">SoulMap</div>
          <div>© 2026 SoulMap. Embark on your mystical journey.</div>
          <div className="flex gap-6">
            <a className="hover:text-white hover:underline transition-all" href="#">Privacy Policy</a>
            <a className="hover:text-white hover:underline transition-all" href="#">Terms of Service</a>
            <a className="hover:text-white hover:underline transition-all" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
