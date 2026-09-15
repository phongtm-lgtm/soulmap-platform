import {
  Sparkles,
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
  MessageCircle,
} from 'lucide-react';
import type { PersonalityProfile } from '../../types';
import Button from '../ui/Button';

interface SoulMapRevealProps {
  profile: PersonalityProfile;
  chatHistory: { sender: 'user' | 'assistant'; text: string }[];
  onOpenAiChat: () => void;
}

const MASCOT_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ';

function getElementColorClass(element: string) {
  switch (element) {
    case 'Mộc': return { bg: 'bg-[#E2F0D9]', text: 'text-[#385723]', border: 'border-[#385723]/30' };
    case 'Hỏa': return { bg: 'bg-[#FCE4D6]', text: 'text-[#C65911]', border: 'border-[#C65911]/30' };
    case 'Kim': return { bg: 'bg-[#FFF2CC]', text: 'text-[#7F6000]', border: 'border-[#7F6000]/30' };
    case 'Thủy': return { bg: 'bg-[#DDEBF7]', text: 'text-[#1F4E79]', border: 'border-[#1F4E79]/30' };
    default: return { bg: 'bg-[#EAEAEA]', text: 'text-[#3F3F3F]', border: 'border-[#3F3F3F]/30' };
  }
}

/**
 * The "Core Archetype" reveal card shown at resultStep === 'full_map' when no
 * specific journey is selected. This is the app's strongest layout — treat it
 * as the reference for other "profile" cards.
 */
export default function SoulMapReveal({ profile, chatHistory, onOpenAiChat }: SoulMapRevealProps) {
  const elementColor = getElementColorClass(profile.element);

  return (
    <>
      {/* Header Title with sparkles */}
      <div className="text-center max-w-[800px] mx-auto flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-[#B68A2F]/10 border border-[#B68A2F]/20 flex items-center justify-center text-[#B68A2F] animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] block mt-1">Khải Huyền Bản Đồ Tâm Hồn</span>
        <h1 className="font-display text-3xl md:text-5xl text-[#24533E] font-semibold leading-tight">
          Bản Đồ Nội Tâm Của Bạn Đã Sẵn Sàng
        </h1>
        <p className="body-text text-[#5E625F] max-w-[640px]">
          Tinh tú hội tụ, khoa học định hình. Dưới đây là bức tranh toàn cảnh về thế giới nội tâm sâu thẳm của bạn được dệt nên bởi thuật toán SoulMap.
        </p>
      </div>

      {/* Core Archetype Showcase Card */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-[#B68A2F]/30 shadow-2xl relative overflow-hidden text-left bg-gradient-to-br from-[#F8F4EB] via-[#FFFCF8] to-[#24533E]/5 animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#B68A2F]/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left side: Mascot Card with elements */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-3xl bg-[#F8F4EB] border border-[#24533E]/8 shadow-lg">
            <div className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5 shadow-sm ${elementColor.bg} ${elementColor.text} border ${elementColor.border}`}>
              {profile.element === 'Mộc' && <Trees className="w-4 h-4" />}
              {profile.element === 'Hỏa' && <Flame className="w-4 h-4 animate-pulse" />}
              {profile.element === 'Kim' && <CloudLightning className="w-4 h-4" />}
              {profile.element === 'Thủy' && <Droplet className="w-4 h-4" />}
              {profile.element === 'Thổ' && <Mountain className="w-4 h-4" />}
              Mệnh ngũ hành: {profile.element}
            </div>

            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-[#24533E]/10 to-[#B68A2F]/10 flex items-center justify-center p-1.5 mb-4 border border-[#B68A2F]/20">
              <div className="w-full h-full rounded-full bg-[#FFFCF8] overflow-hidden shadow-inner flex items-center justify-center p-2">
                <img
                  src={MASCOT_URL}
                  alt="Linh Nhi Mascot Element"
                  className="w-full h-full object-contain animate-float"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h3 className="font-display text-2xl font-semibold text-[#24533E] mb-1">{profile.type}</h3>
            <p className="font-sans text-xs font-semibold text-[#B68A2F] uppercase tracking-wider mb-4">
              {profile.mbtiMatch}
            </p>

            <div className="w-full bg-[#eae8e4] h-px my-3"></div>

            <div className="flex justify-around w-full text-xs font-sans text-[#5E625F]">
              <div>
                <p className="text-[11px] uppercase font-bold text-[#5E625F]/60 mb-0.5">Tử Vi Hộ Mệnh</p>
                <span className="font-bold text-[#24533E]">{profile.zodiac}</span>
              </div>
              <div className="w-px bg-[#eae8e4]"></div>
              <div>
                <p className="text-[11px] uppercase font-bold text-[#5E625F]/60 mb-0.5">Năng lượng chính</p>
                <span className="font-bold text-[#24533E]">{profile.element} Thượng Đẳng</span>
              </div>
            </div>
          </div>

          {/* Right side: Persona text Description & Pillars details */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] mb-1 block">Hình Mẫu Linh Hồn</span>
              <h2 className="font-display text-3xl font-semibold text-[#24533E] leading-snug mb-3">
                {profile.name}
              </h2>
              <h4 className="font-serif text-[#24533E] text-base italic font-semibold mb-3">
                &quot;{profile.title}&quot;
              </h4>
              <p className="body-text text-[#5E625F]">
                {profile.description}
              </p>
            </div>

            <div className="w-full bg-[#24533E]/5 h-px"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                  <User className="w-4 h-4 text-[#B68A2F]" />
                  Trụ Cột Tôi Là Ai
                </h5>
                <p className="body-text-sm text-[#5E625F]">{profile.pillars.identity}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                  <Briefcase className="w-4 h-4 text-[#B68A2F]" />
                  Trụ Cột Sự Nghiệp
                </h5>
                <p className="body-text-sm text-[#5E625F]">{profile.pillars.career}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                  <Heart className="w-4 h-4 text-[#B68A2F]" />
                  Trụ Cột Tình Yêu
                </h5>
                <p className="body-text-sm text-[#5E625F]">{profile.pillars.love}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFCF8]/60 border border-[#24533E]/5">
                <h5 className="font-display font-semibold text-sm text-[#24533E] flex items-center gap-1.5 mb-1.5">
                  <Globe className="w-4 h-4 text-[#B68A2F]" />
                  Trụ Cột Cuộc Đời
                </h5>
                <p className="body-text-sm text-[#5E625F]">{profile.pillars.life}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Advice & AI Companion Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in">
        {/* Left Side: Suggestions / Advice Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 md:p-8 text-left border border-[#24533E]/8 shadow-lg flex flex-col gap-6 h-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B68A2F] block mb-1">Chỉ Dẫn Phát Triển</span>
              <h3 className="font-display text-2xl font-semibold text-[#24533E]">
                Lời khuyên dành riêng cho bạn
              </h3>
              <div className="w-12 h-0.5 bg-[#B68A2F]/40 mt-3"></div>
            </div>

            <div className="flex flex-col gap-4">
              {profile.advice.map((adv, index) => (
                <div key={index} className="flex gap-3 items-start group">
                  <div className="w-6 h-6 rounded-full bg-[#24533E]/5 flex items-center justify-center text-[#24533E] font-sans font-bold text-xs flex-shrink-0 mt-0.5 group-hover:bg-[#B68A2F] group-hover:text-white transition-all duration-300">
                    {index + 1}
                  </div>
                  <p className="body-text-sm text-[#5E625F]">{adv}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#24533E]/5 border border-[#24533E]/10 flex flex-col gap-2 mt-auto text-left relative overflow-hidden">
              <Quote className="w-12 h-12 text-[#24533E]/5 absolute -right-2 -bottom-2" />
              <p className="body-text-xs text-[#24533E] italic">
                &quot;Hành trình ngàn dặm bắt đầu bằng một bước chân đầu tiên thấu hiểu bản thể toàn vẹn. Hãy kiên nhẫn bồi đắp ngọc quý trong tim bạn.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Launcher card for the dedicated AI Chat page */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card flex h-full min-h-[480px] flex-col justify-between gap-6 rounded-3xl border border-[#24533E]/8 p-6 text-left shadow-lg md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#B68A2F]/30 bg-[#FFFCF8] p-1 shadow-sm">
                <img
                  src={MASCOT_URL}
                  alt="Linh Nhi"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-[#24533E]">AI Mentor Linh Nhi</h4>
                <span className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang trực tuyến
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-[#24533E]/8 bg-[#FFFCF8]/60 p-5">
              {chatHistory.slice(-2).map((msg, index) => (
                <p
                  key={index}
                  className={`body-text-sm line-clamp-2 ${
                    msg.sender === 'user' ? 'text-right text-[#24533E]/70' : 'text-left text-[#24533E]'
                  }`}
                >
                  {msg.sender === 'assistant' ? '“' : ''}
                  {msg.text}
                  {msg.sender === 'assistant' ? '”' : ''}
                </p>
              ))}
            </div>

            <p className="body-text-sm text-[#5E625F]">
              Trò chuyện chi tiết hơn với Linh Nhi trong không gian riêng, tập trung hoàn toàn vào cuộc hội thoại của bạn.
            </p>

            <Button type="button" onClick={onOpenAiChat} size="lg" className="mt-auto w-fit">
              <MessageCircle className="h-4 w-4" />
              Mở cuộc trò chuyện
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
