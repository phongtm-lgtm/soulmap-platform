import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  User, 
  Briefcase, 
  Heart, 
  Globe, 
  Trees, 
  Flame, 
  CloudLightning, 
  Droplet, 
  Mountain, 
  Quote, 
  Send, 
  Compass, 
  ArrowRight 
} from 'lucide-react';
import { PersonalityProfile } from '../types';

interface ResultScreenProps {
  profile: PersonalityProfile;
  resultStep: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map';
  setResultStep: (step: 'mbti_summary' | 'birth_form' | 'generating' | 'reveal' | 'full_map') => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  birthTime: string;
  setBirthTime: (time: string) => void;
  gender: 'Nam' | 'Nữ' | 'Khác';
  setGender: (gender: 'Nam' | 'Nữ' | 'Khác') => void;
  generationProgress: number;
  setGenerationProgress: React.Dispatch<React.SetStateAction<number>>;
  zoomMap: boolean;
  setZoomMap: (zoom: boolean) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  chatHistory: { sender: 'user' | 'assistant'; text: string }[];
  isTyping: boolean;
  navigateToAssessment: (direction?: 'push' | 'none') => void;
  navigateToLanding: (direction?: 'push_back' | 'none') => void;
  handleSendMessage: (textToSend?: string) => void;
}

export default function ResultScreen({
  profile,
  resultStep,
  setResultStep,
  birthDate,
  setBirthDate,
  birthTime,
  setBirthTime,
  gender,
  setGender,
  generationProgress,
  setGenerationProgress,
  zoomMap,
  setZoomMap,
  chatInput,
  setChatInput,
  chatHistory,
  isTyping,
  navigateToAssessment,
  navigateToLanding,
  handleSendMessage,
}: ResultScreenProps) {

  const getElementColorClass = (element: string) => {
    switch(element) {
      case 'Mộc': return { bg: 'bg-[#E2F0D9]', text: 'text-[#385723]', border: 'border-[#385723]/30', fill: '#385723' };
      case 'Hỏa': return { bg: 'bg-[#FCE4D6]', text: 'text-[#C65911]', border: 'border-[#C65911]/30', fill: '#C65911' };
      case 'Kim': return { bg: 'bg-[#FFF2CC]', text: 'text-[#7F6000]', border: 'border-[#7F6000]/30', fill: '#7F6000' };
      case 'Thủy': return { bg: 'bg-[#DDEBF7]', text: 'text-[#1F4E79]', border: 'border-[#1F4E79]/30', fill: '#1F4E79' };
      default: return { bg: 'bg-[#EAEAEA]', text: 'text-[#3F3F3F]', border: 'border-[#3F3F3F]/30', fill: '#3F3F3F' };
    }
  };

  const getMbtiVietnameseLabel = (mbtiType: string) => {
    switch (mbtiType) {
      case 'INFJ': return 'Người Cố Vấn';
      case 'ENFP': return 'Nhà Khai Phá';
      case 'INTJ': return 'Nhà Thiết Kế';
      case 'INFP': return 'Người Hòa Giải';
      default: return 'Người Tìm Kiếm';
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#F8F4EB]">
      {/* Immersive Magical Landscape Background with soft blurring */}
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600" 
          alt="Magical Forest background" 
          className="w-full h-full object-cover filter blur-[4px]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F8F4EB]/90 via-[#F8F4EB]/70 to-[#FFFDF9]/40 z-0 pointer-events-none"></div>
      {/* Subtle Warm Sunlight glow in top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#B68A2F]/12 via-[#B68A2F]/4 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#F8F4EB]/80 backdrop-blur-md border-b border-[#E8DFCF] h-20">
        <div className="flex justify-between items-center h-full px-6 max-w-[1200px] mx-auto w-full">
          <div 
            className="font-display text-2xl font-semibold text-[#214D3B] flex items-center gap-2 cursor-pointer" 
            onClick={() => navigateToLanding('push_back')}
          >
            <span className="material-symbols-outlined text-[#B68A2F] text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <span className="tracking-wide">SoulMap</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigateToAssessment('none')}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#E8DFCF] rounded-full font-sans font-semibold text-xs text-[#5E625F] hover:bg-[#35684D]/5 hover:text-[#214D3B] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B68A2F]" />
              Làm lại bài test
            </button>
            <button 
              onClick={() => navigateToLanding('push_back')}
              className="bg-[#35684D] text-[#FFFDF9] hover:bg-[#214D3B] active:scale-95 px-6 py-2.5 rounded-full font-sans font-semibold text-xs transition-all duration-300 shadow-md shadow-[#35684D]/10 cursor-pointer"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </nav>

      {/* Main Results Container */}
      <main className="flex-grow pt-28 pb-20 max-w-[1200px] mx-auto px-6 w-full flex flex-col justify-center">
        {resultStep === 'mbti_summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch w-full animate-fade-in relative z-10">
            {/* Left Column: MBTI Result Card */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="bg-[#FFFDF9] border border-[#E8DFCF] rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col gap-6 text-left">
                {/* Floating light ray effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#B68A2F]/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Top Badge */}
                <div className="inline-flex self-start items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#35684D]/5 border border-[#35684D]/10 font-sans text-xs font-bold uppercase tracking-widest text-[#B68A2F] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B68A2F] animate-pulse" />
                  ✨ KẾT QUẢ MBTI CỦA BẠN
                </div>

                {/* Elegant Title & Subtitle with Decorative Golden Ornaments */}
                <div className="flex items-center justify-between gap-4 border-b border-[#E8DFCF]/50 pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-[#B68A2F] opacity-75 font-serif text-2xl font-light select-none">✦</span>
                      <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#214D3B] leading-none">
                        {profile.type}
                      </h1>
                      <span className="text-[#B68A2F] opacity-75 font-serif text-2xl font-light select-none">✦</span>
                    </div>
                    <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#B68A2F] mt-1 italic">
                      {getMbtiVietnameseLabel(profile.type)}
                    </h2>
                  </div>
                  
                  {/* Decorative golden crest */}
                  <div className="w-14 h-14 rounded-full bg-[#B68A2F]/10 border border-[#B68A2F]/20 flex items-center justify-center text-[#B68A2F] shadow-inner flex-shrink-0">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                  </div>
                </div>

                {/* Short personality summary */}
                <p className="body-text text-[#5E625F] italic">
                  Bạn là người sâu sắc, giàu lòng trắc ẩn và luôn tìm kiếm ý nghĩa trong mọi điều. Bạn sở hữu trực giác mạnh, khả năng lắng nghe và mong muốn tạo ra giá trị tích cực cho những người xung quanh.
                </p>

                {/* Information Panel */}
                <div className="bg-[#35684D]/5 border border-[#E8DFCF] rounded-2xl p-5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#B68A2F]/10 flex items-center justify-center text-[#B68A2F] flex-shrink-0 mt-0.5">
                    <span className="font-serif text-sm font-bold">✨</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-serif text-[#214D3B] text-base font-semibold">
                      Đây mới là một phần bức tranh về bạn.
                    </p>
                    <p className="body-text-sm text-[#5E625F]">
                      SoulMap sẽ kết hợp MBTI với lá số Tử Vi để tạo nên bản đồ nội tâm hoàn chỉnh dành riêng cho bạn.
                    </p>
                  </div>
                </div>

                {/* Large visually dominant CTA */}
                <button
                  onClick={() => setResultStep('birth_form')}
                  className="w-full bg-[#35684D] hover:bg-[#214D3B] text-[#FFFDF9] hover:shadow-lg hover:shadow-[#35684D]/20 active:scale-[0.98] py-4 rounded-full font-sans font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                >
                  Tiếp tục: Nhập thông tin sinh →
                </button>
              </div>
            </div>

            {/* Right Column: Fantasy illustration with AI mascot */}
            <div className="lg:col-span-5 flex flex-col justify-between relative min-h-[480px]">
              {/* Decorative Landscape Elements: Mountains, Forest, Waterfalls, sunlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#214D3B]/5 to-transparent rounded-[2.5rem] border border-[#E8DFCF] overflow-hidden shadow-inner flex items-center justify-center p-6">
                {/* SVG Vector Landscape illustration of magical forest, waterfalls, mountains, soft sunlight */}
                <svg viewBox="0 0 400 400" className="w-full h-full opacity-60 z-0 pointer-events-none mix-blend-multiply">
                  {/* Soft Magical Sun / Sunlight */}
                  <circle cx="280" cy="120" r="70" fill="url(#sunGlow)" opacity="0.8" />
                  
                  {/* Distant Mountains */}
                  <path d="M 0,260 L 120,150 L 220,220 L 320,130 L 400,200 L 400,400 L 0,400 Z" fill="#E8DFCF" opacity="0.6" />
                  <path d="M 50,280 L 180,180 L 290,260 L 400,160 L 400,400 L 50,400 Z" fill="#D3C7B2" opacity="0.8" />
                  
                  {/* Forest Silhouette (Tops of Pine Trees) */}
                  <path d="M 10,290 L 30,270 L 50,290 M 40,295 L 60,275 L 80,295 M 100,290 L 120,260 L 140,290 M 160,285 L 180,265 L 200,285 M 240,290 L 260,270 L 280,290" stroke="#35684D" strokeWidth="3" fill="none" opacity="0.5" />
                  
                  {/* River / Waterfall flowing path */}
                  <path d="M 180,200 Q 150,270 200,320 T 140,400" fill="none" stroke="#A9C7BD" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                  <path d="M 180,200 Q 150,270 200,320 T 140,400" fill="none" stroke="#FFFDF9" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" opacity="0.8" className="animate-pulse" />

                  {/* SVG definitions */}
                  <defs>
                    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#B68A2F" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#F8F4EB" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Floating Particle Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute w-2 h-2 rounded-full bg-[#B68A2F]/30 blur-xs top-1/4 left-1/3 animate-ping duration-[3s]"></div>
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-[#B68A2F]/40 top-1/2 left-2/3 animate-pulse duration-[2s]"></div>
                  <div className="absolute w-3 h-3 rounded-full bg-[#35684D]/20 blur-xs top-1/3 right-1/4 animate-bounce duration-[4s]"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-[#B68A2F]/30 top-3/4 left-1/2 animate-pulse duration-[3.5s]"></div>
                </div>
              </div>

              {/* Character Frame & Speech Bubble placed at bottom right */}
              <div className="relative z-10 flex flex-col items-end gap-4 mt-auto p-6 w-full">
                {/* Speech Bubble */}
                <div className="bg-[#FFFDF9] border border-[#E8DFCF] rounded-3xl p-5 shadow-lg max-w-[340px] text-left relative animate-fade-in">
                  {/* Little speech bubble tail */}
                  <div className="absolute bottom-[-8px] right-8 w-4 h-4 bg-[#FFFDF9] border-r border-b border-[#E8DFCF] rotate-45"></div>
                  <p className="body-text-sm text-[#5E625F]">
                    &quot;Mình đã phân tích xong MBTI của bạn rồi! <br />
                    Bây giờ hãy nhập thông tin sinh để AI tạo lá số Tử Vi và hoàn thiện SoulMap nhé! 🌿&quot;
                  </p>
                </div>

                {/* Cute Mascot Linh Nhi */}
                <div className="flex items-center gap-3 self-end mr-2">
                  <div className="relative group">
                    {/* Soft glowing effect */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#B68A2F]/30 to-[#35684D]/30 blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    {/* Mascot bubble containing avatar */}
                    <div className="relative w-28 h-28 rounded-full bg-[#FFFDF9] border-2 border-[#B68A2F]/40 p-1 flex items-center justify-center overflow-hidden shadow-md">
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                        alt="Linh Nhi AI Mascot" 
                        className="w-full h-full object-contain animate-float"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  
                  {/* Cute Badge for Linh Nhi */}
                  <div className="flex flex-col text-right">
                    <span className="font-serif font-bold text-[#214D3B] text-base">Linh Nhi</span>
                    <span className="font-sans text-xs font-semibold text-[#B68A2F]">Vệ Thần Bản Đồ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {resultStep === 'birth_form' && (
          <div className="max-w-xl mx-auto w-full flex flex-col gap-8 animate-fade-in py-6">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-[#B68A2F]/30 shadow-2xl relative overflow-hidden text-left bg-gradient-to-br from-[#fbf9f5] via-white to-[#214D3B]/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#B68A2F]/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col gap-6">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] block mb-1">KIẾN TẠO THIÊN MỆNH</span>
                  <h2 className="font-display text-3xl font-semibold text-[#214D3B]">Nhập Thông Tin Sinh</h2>
                  <p className="font-serif text-sm text-[#636A64] mt-2">Dữ liệu dùng để sinh lá số Tử Vi &amp; xác định Ngũ Hành hộ mệnh</p>
                </div>

                <div className="w-full h-px bg-[#214D3B]/10 my-1"></div>

                {/* Inputs */}
                <div className="flex flex-col gap-5">
                  {/* Birth Date */}
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#214D3B] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">calendar_month</span>
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-white border border-[#214D3B]/10 focus:border-[#B68A2F] rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#B68A2F] text-[#214D3B] shadow-sm"
                    />
                  </div>

                  {/* Birth Hour */}
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#214D3B] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">schedule</span>
                      Giờ sinh
                    </label>
                    <select
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full bg-white border border-[#214D3B]/10 focus:border-[#B68A2F] rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#B68A2F] text-[#214D3B] shadow-sm cursor-pointer"
                    >
                      <option value="00:00">00:00 - 01:00 (Giờ Tý)</option>
                      <option value="02:00">01:00 - 03:00 (Giờ Sửu)</option>
                      <option value="04:00">03:00 - 05:00 (Giờ Dần)</option>
                      <option value="06:00">05:00 - 07:00 (Giờ Mão)</option>
                      <option value="08:00">07:00 - 09:00 (Giờ Thìn)</option>
                      <option value="10:00">09:00 - 11:00 (Giờ Tỵ)</option>
                      <option value="12:00">11:00 - 13:00 (Giờ Ngọ)</option>
                      <option value="14:00">13:00 - 15:00 (Giờ Mùi)</option>
                      <option value="16:00">15:00 - 17:00 (Giờ Thân)</option>
                      <option value="18:00">17:00 - 19:00 (Giờ Dậu)</option>
                      <option value="20:00">19:00 - 21:00 (Giờ Tuất)</option>
                      <option value="22:00">21:00 - 23:00 (Giờ Hợi)</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#214D3B] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">wc</span>
                      Giới tính
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Nam', 'Nữ', 'Khác'] as const).map((g) => {
                        const isSel = gender === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`py-3 px-4 rounded-xl font-sans text-sm font-semibold transition-all duration-200 active:scale-95 border ${
                              isSel
                                ? 'bg-[#214D3B] border-[#214D3B] text-white shadow-md'
                                : 'bg-white border-[#214D3B]/10 text-[#636A64] hover:border-[#B68A2F]/50 hover:bg-white'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-[#214D3B]/10 my-1"></div>

                {/* Trigger Generation Button */}
                <button
                  onClick={() => {
                    setResultStep('generating');
                    setGenerationProgress(0);
                    let cur = 0;
                    const t = setInterval(() => {
                      cur += 1;
                      setGenerationProgress(cur);
                      if (cur >= 6) {
                        clearInterval(t);
                        setTimeout(() => {
                          setResultStep('reveal');
                          setZoomMap(false);
                        }, 1000);
                      }
                    }, 1200);
                  }}
                  className="bg-[#B68A2F] text-white hover:bg-[#9a7324] hover:shadow-lg hover:shadow-[#B68A2F]/20 active:scale-95 py-4 rounded-full font-sans font-bold text-base transition-all duration-300 text-center w-full shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  AI tạo SoulMap
                </button>
              </div>
            </div>
          </div>
        )}

        {resultStep === 'generating' && (
          <div className="max-w-xl mx-auto w-full flex flex-col gap-8 animate-fade-in py-6">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-[#B68A2F]/30 shadow-2xl relative overflow-hidden text-center bg-gradient-to-br from-[#fbf9f5] via-white to-[#214D3B]/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#B68A2F]/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col gap-8 items-center">
                {/* Header */}
                <div>
                  <h2 className="font-display text-3xl font-semibold text-[#214D3B]">AI Đang Kiến Tạo SoulMap</h2>
                  <p className="font-serif text-sm text-[#636A64] mt-2">Vui lòng chờ giây lát để thuật toán hợp nhất dữ liệu của bạn...</p>
                </div>

                {/* Progress Loader Sphere */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#B68A2F]/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-[#B68A2F] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <Compass className="w-12 h-12 text-[#214D3B] animate-pulse" />
                </div>

                {/* Steps list */}
                <div className="w-full flex flex-col gap-3.5 max-w-sm text-left bg-white/40 p-6 rounded-2xl border border-[#214D3B]/5">
                  {[
                    "MBTI",
                    "Tử Vi",
                    "Phân tích",
                    "Xây dựng Core Self",
                    "Tạo 4 Journey",
                    "Khởi tạo AI Mentor"
                  ].map((step, idx) => {
                    const isDone = generationProgress > idx;
                    const isActive = generationProgress === idx;
                    return (
                      <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#214D3B]/5 last:border-none transition-all duration-300">
                        <span className={`font-sans text-sm font-semibold transition-colors duration-300 ${
                          isDone ? 'text-[#214D3B]' : isActive ? 'text-[#B68A2F] font-bold animate-pulse' : 'text-[#636A64]/40'
                        }`}>
                          {idx + 1}. {step}
                        </span>
                        <div className="flex items-center justify-center w-5 h-5">
                          {isDone ? (
                            <span className="material-symbols-outlined text-[#214D3B] text-base font-bold bg-[#214D3B]/10 rounded-full p-0.5 animate-bounce">check</span>
                          ) : isActive ? (
                            <RefreshCw className="w-4 h-4 text-[#B68A2F] animate-spin" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-[#636A64]/20"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {resultStep === 'reveal' && (
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center gap-8 py-6 text-center relative overflow-hidden min-h-[640px]">
            {/* Heading Banner */}
            <div className="relative z-20 flex flex-col items-center gap-3 animate-fade-in">
              <p className="body-text-sm text-[#636A64] italic">Đây mới là phần thưởng lớn dành cho hành trình thấu suốt bản thân</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-[#214D3B] animate-pulse">
                ✨ SoulMap của bạn đã hoàn thành
              </h1>
            </div>

            {/* Map Zoom Wrapper */}
            <div className="relative w-full max-w-[540px] aspect-[4/3] flex items-center justify-center my-6 z-10">
              {/* Animated Linh Nhi Mascot Overlay appearing dramatically on top of or next to the map */}
              <div 
                className={`absolute bottom-0 right-[-30px] w-48 z-20 transition-all duration-[1200ms] ${
                  zoomMap ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
              >
                <div className="relative">
                  {/* Speech Bubble */}
                  <div className="absolute -top-24 -left-36 w-52 glass-card p-3 rounded-2xl rounded-br-none shadow-2xl border border-[#B68A2F]/30 text-left bg-white/95">
                    <p className="body-text-xs text-[#214D3B]">
                      Chào lữ hành! 🌿 Linh Nhi đã hợp nhất MBTI và Tử Vi thành công. Hãy chạm để thấu suốt bản đồ nhé! ✨
                    </p>
                  </div>
                  
                  {/* Linh Nhi Mascot */}
                  <img 
                    src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                    alt="Linh Nhi Mascot" 
                    className="w-full drop-shadow-2xl animate-float"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Primary Button */}
            <button
              onClick={() => setResultStep('full_map')}
              className="relative z-20 bg-[#214D3B] text-white hover:bg-[#1a3c34] hover:shadow-xl hover:shadow-[#214D3B]/20 active:scale-95 px-10 py-4.5 rounded-full font-sans font-bold text-base transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#B68A2F]" />
              Khám Phá Bản Đồ Nội Tâm Chi Tiết
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {resultStep === 'full_map' && (
          <>
            {/* Header Title with sparkles */}
            <div className="text-center max-w-[800px] mx-auto flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#B68A2F]/10 border border-[#B68A2F]/20 flex items-center justify-center text-[#B68A2F] animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] block mt-1">Khải Huyền Bản Đồ Tâm Hồn</span>
              <h1 className="font-display text-3xl md:text-5xl text-[#214D3B] font-semibold leading-tight">
                Bản Đồ Nội Tâm Của Bạn Đã Sẵn Sàng
              </h1>
              <p className="body-text text-[#636A64] max-w-[640px]">
                Tinh tú hội tụ, khoa học định hình. Dưới đây là bức tranh toàn cảnh về thế giới nội tâm sâu thẳm của bạn được dệt nên bởi thuật toán SoulMap.
              </p>
            </div>

            {/* Core Archetype Showcase Card */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-[#B68A2F]/30 shadow-2xl relative overflow-hidden text-left bg-gradient-to-br from-[#fbf9f5] via-white to-[#214D3B]/5 animate-fade-in">
              {/* Background abstract layout */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#B68A2F]/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                {/* Left side: Mascot Card with elements */}
                <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-3xl bg-[#fbf9f5] border border-[#214D3B]/8 shadow-lg">
                  {/* Energy Badge */}
                  <div className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5 shadow-sm ${getElementColorClass(profile.element).bg} ${getElementColorClass(profile.element).text} border ${getElementColorClass(profile.element).border}`}>
                    {profile.element === 'Mộc' && <Trees className="w-4 h-4" />}
                    {profile.element === 'Hỏa' && <Flame className="w-4 h-4 animate-pulse" />}
                    {profile.element === 'Kim' && <CloudLightning className="w-4 h-4" />}
                    {profile.element === 'Thủy' && <Droplet className="w-4 h-4" />}
                    {profile.element === 'Thổ' && <Mountain className="w-4 h-4" />}
                    Mệnh ngũ hành: {profile.element}
                  </div>

                  {/* Character Illustration Frame */}
                  <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-[#214D3B]/10 to-[#B68A2F]/10 flex items-center justify-center p-1.5 mb-4 border border-[#B68A2F]/20">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden shadow-inner flex items-center justify-center p-2">
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                        alt="Linh Nhi Mascot Element" 
                        className="w-full h-full object-contain animate-float"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Badges details */}
                  <h3 className="font-display text-2xl font-semibold text-[#214D3B] mb-1">{profile.type}</h3>
                  <p className="font-sans text-xs font-semibold text-[#B68A2F] uppercase tracking-wider mb-4">
                    {profile.mbtiMatch}
                  </p>

                  <div className="w-full bg-[#eae8e4] h-px my-3"></div>

                  <div className="flex justify-around w-full text-xs font-sans text-[#636A64]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#636A64]/60 mb-0.5">Tử Vi Hộ Mệnh</p>
                      <span className="font-bold text-[#214D3B]">{profile.zodiac}</span>
                    </div>
                    <div className="w-px bg-[#eae8e4]"></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#636A64]/60 mb-0.5">Năng lượng chính</p>
                      <span className="font-bold text-[#214D3B]">{profile.element} Thượng Đẳng</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Persona text Description & Pillars details */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] mb-1 block">Hình Mẫu Linh Hồn</span>
                    <h2 className="font-display text-3xl font-semibold text-[#214D3B] leading-snug mb-3">
                      {profile.name}
                    </h2>
                    <h4 className="font-serif text-[#214D3B] text-base italic font-semibold mb-3">
                      &quot;{profile.title}&quot;
                    </h4>
                    <p className="body-text text-[#636A64]">
                      {profile.description}
                    </p>
                  </div>

                  <div className="w-full bg-[#214D3B]/5 h-px"></div>

                  {/* 4 Pillars Details in Accordion or Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/60 border border-[#214D3B]/5">
                      <h5 className="font-display font-semibold text-sm text-[#214D3B] flex items-center gap-1.5 mb-1.5">
                        <User className="w-4 h-4 text-[#B68A2F]" />
                        Trụ Cột Tôi Là Ai
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.identity}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/60 border border-[#214D3B]/5">
                      <h5 className="font-display font-semibold text-sm text-[#214D3B] flex items-center gap-1.5 mb-1.5">
                        <Briefcase className="w-4 h-4 text-[#B68A2F]" />
                        Trụ Cột Sự Nghiệp
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.career}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/60 border border-[#214D3B]/5">
                      <h5 className="font-display font-semibold text-sm text-[#214D3B] flex items-center gap-1.5 mb-1.5">
                        <Heart className="w-4 h-4 text-[#B68A2F]" />
                        Trụ Cột Tình Yêu
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.love}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/60 border border-[#214D3B]/5">
                      <h5 className="font-display font-semibold text-sm text-[#214D3B] flex items-center gap-1.5 mb-1.5">
                        <Globe className="w-4 h-4 text-[#B68A2F]" />
                        Trụ Cột Cuộc Đời
                      </h5>
                      <p className="body-text-sm text-[#636A64]">
                        {profile.pillars.life}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Advice & AI Companion Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in">
              {/* Left Side: Suggestions / Advice Cards (4 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glass-card rounded-3xl p-6 md:p-8 text-left border border-[#214D3B]/8 shadow-lg flex flex-col gap-6 h-full">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] block mb-1">Chỉ Dẫn Phát Triển</span>
                    <h3 className="font-display text-2xl font-semibold text-[#214D3B]">
                      Lời khuyên dành riêng cho bạn
                    </h3>
                    <div className="w-12 h-0.5 bg-[#B68A2F]/40 mt-3"></div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {profile.advice.map((adv, index) => (
                      <div key={index} className="flex gap-3 items-start group">
                        <div className="w-6 h-6 rounded-full bg-[#214D3B]/5 flex items-center justify-center text-[#214D3B] font-sans font-bold text-xs flex-shrink-0 mt-0.5 group-hover:bg-[#B68A2F] group-hover:text-white transition-all duration-300">
                          {index + 1}
                        </div>
                        <p className="body-text-sm text-[#636A64]">
                          {adv}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Motivational Quote */}
                  <div className="p-4 rounded-2xl bg-[#214D3B]/5 border border-[#214D3B]/10 flex flex-col gap-2 mt-auto text-left relative overflow-hidden">
                    <Quote className="w-12 h-12 text-[#214D3B]/5 absolute -right-2 -bottom-2" />
                    <p className="body-text-xs text-[#214D3B] italic">
                      &quot;Hành trình ngàn dặm bắt đầu bằng một bước chân đầu tiên thấu hiểu bản thể toàn vẹn. Hãy kiên nhẫn bồi đắp ngọc quý trong tim bạn.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive AI Companion chat with Linh Nhi (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="glass-card rounded-3xl border border-[#214D3B]/8 shadow-lg flex flex-col h-full overflow-hidden min-h-[480px]">
                  
                  {/* Chat Header */}
                  <div className="px-6 py-4 bg-[#214D3B]/5 border-b border-[#214D3B]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[#B68A2F]/40 bg-white overflow-hidden shadow-sm flex items-center justify-center p-0.5">
                        <img 
                          src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                          alt="Linh Nhi Chat Avatar" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-semibold text-sm text-[#214D3B]">AI Mentor Linh Nhi</h4>
                        <span className="flex items-center gap-1 text-[9px] font-sans text-emerald-700 font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Đang trực tuyến
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-sans text-[#636A64] bg-[#214D3B]/5 px-2.5 py-1 rounded-full border border-[#214D3B]/8">
                      Cố vấn Bản đồ Nội tâm
                    </span>
                  </div>

                  {/* Chat Messages Body */}
                  <div className="flex-grow p-6 overflow-y-auto max-h-[300px] flex flex-col gap-4 custom-scrollbar bg-white/20">
                    {chatHistory.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 max-w-[85%] ${
                          msg.sender === 'user' ? 'self-end flex-row-reverse text-right' : 'self-start text-left'
                        }`}
                      >
                        {msg.sender === 'assistant' && (
                          <div className="w-8 h-8 rounded-full border border-[#B68A2F]/30 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 mt-1">
                            <img 
                              src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                              alt="Linh Nhi Chat Small Avatar" 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className={`p-4 rounded-2xl shadow-sm body-text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-[#214D3B] text-white rounded-br-none' 
                            : 'bg-white border border-[#214D3B]/8 text-[#214D3B] rounded-bl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-start gap-3 self-start text-left max-w-[85%]">
                        <div className="w-8 h-8 rounded-full border border-[#B68A2F]/30 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 mt-1">
                          <img 
                            src="https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ" 
                            alt="Linh Nhi Typing" 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-[#214D3B]/8 text-[#214D3B] rounded-bl-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#214D3B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-[#214D3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-[#214D3B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preset Quick Questions */}
                  <div className="px-6 py-3 border-t border-[#214D3B]/5 bg-[#fbf9f5]/30 flex flex-wrap gap-2 justify-start items-center">
                    <span className="text-[10px] font-bold uppercase text-[#636A64]/70 mr-1">Chủ đề gợi ý:</span>
                    {[
                      { text: "Lời khuyên sự nghiệp cho tôi?", action: "Cho tôi xin lời khuyên phát triển sự nghiệp." },
                      { text: "Tình duyên của tôi thế nào?", action: "Đường tình duyên của tôi cần lưu ý gì?" },
                      { text: "Năng lượng Ngũ hành & Tử Vi?", action: "Lá số Tử Vi và bản mệnh ngũ hành của tôi mang năng lượng gì?" }
                    ].map((p, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSendMessage(p.action)}
                        className="text-[11px] font-semibold text-[#214D3B] bg-white border border-[#214D3B]/10 hover:border-[#B68A2F] hover:bg-[#214D3B]/5 px-3 py-1.5 rounded-full transition-all active:scale-95 duration-150 cursor-pointer"
                      >
                        {p.text}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input Footer */}
                  <div className="p-4 bg-white border-t border-[#214D3B]/10 flex gap-3 items-center">
                    <input 
                      type="text"
                      placeholder="Hỏi Linh Nhi bất kỳ điều gì về bản đồ của bạn..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-grow bg-[#fbf9f5] border border-[#214D3B]/10 focus:border-[#B68A2F] rounded-full px-5 py-3 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#B68A2F] text-[#214D3B]"
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      className="w-12 h-12 rounded-full bg-[#214D3B] hover:bg-[#1a3c34] text-white flex items-center justify-center shadow-md active:scale-90 transition-all duration-150 cursor-pointer flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
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
