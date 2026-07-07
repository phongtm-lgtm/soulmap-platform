import { ArrowLeft, Check, Crown, Heart, Leaf, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { APP_ASSETS } from '../../assets';
import type { SoulMapJourney } from '../../types/journey';

const chapters = [
  {
    title: 'Hiểu về trái tim bạn',
    content: [
      'Trái tim bạn cần cảm giác được nhìn thấy và được tôn trọng. Bạn không yêu chỉ để có một mối quan hệ, bạn yêu để cảm thấy mình có thể là chính mình.',
      'Khi một người đủ kiên nhẫn lắng nghe, bạn sẽ mở lòng rất sâu. Nhưng nếu cảm thấy bị xem nhẹ, bạn thường lùi lại để tự bảo vệ.',
      'Điều bạn cần nhất là một nhịp yêu an toàn, rõ ràng và có sự hiện diện thật lòng.',
    ],
  },
  {
    title: 'Kiểu yêu của bạn',
    content: [
      'Bạn yêu bằng sự quan sát tinh tế. Bạn để ý những điều nhỏ, nhớ những chi tiết nhỏ và thường chăm sóc người mình thương theo cách âm thầm.',
      'Bạn không cần những lời hứa quá lớn. Bạn tin vào sự đều đặn, vào cách một người xuất hiện đúng lúc và giữ lời qua từng ngày.',
      'Kiểu yêu của bạn sâu, chậm và cần thời gian để thật sự tin tưởng.',
    ],
  },
  {
    title: 'Nhu cầu cảm xúc',
    content: [
      'Bạn cần sự rõ ràng. Không phải kiểm soát, mà là cảm giác mình không phải đoán quá nhiều về vị trí của mình trong lòng người kia.',
      'Bạn cần một người có thể nói chuyện tử tế khi có mâu thuẫn, thay vì im lặng hoặc biến mất.',
      'Khi nhu cầu cảm xúc được đáp ứng, bạn trở nên mềm mại, tin tưởng và trao đi rất nhiều yêu thương.',
    ],
  },
  {
    title: 'Người khiến bạn bình yên',
    content: [
      'Người phù hợp với bạn sẽ không phải người quá hào nhoáng. Mà là người nhất quán. Họ giữ lời. Họ biết lắng nghe. Họ không bắt bạn phải thay đổi để được yêu.',
      'Ở cạnh họ... Bạn không cần phải đoán xem hôm nay họ còn yêu mình không. Bạn chỉ đơn giản cảm nhận được điều đó.',
      'Và khi trái tim có đủ cảm giác an toàn... Bạn sẽ trở thành một người rất dịu dàng. Rất bao dung. Và yêu bằng tất cả sự chân thành.',
    ],
  },
  { title: 'Nỗi sợ trong tình yêu', content: [] },
  { title: 'Vết thương cần chữa lành', content: [] },
  { title: 'Bài học tình yêu', content: [] },
  { title: 'Xây dựng mối quan hệ lành mạnh', content: [] },
  { title: 'Tình yêu & sự nghiệp', content: [] },
  { title: 'Tình yêu & cuộc đời', content: [] },
];

interface JourneyDetailScreenProps {
  journey: SoulMapJourney;
  onBack: () => void;
}

export default function JourneyDetailScreen({ journey, onBack }: JourneyDetailScreenProps) {
  const unlockedChapters = 4;
  const [selectedChapter, setSelectedChapter] = useState(4);
  const selectedChapterData = chapters[selectedChapter - 1];
  const progress = unlockedChapters * 10;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pt-24 text-[#24533E]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="rounded-[1.75rem] border border-[#E8DFCF] bg-[#FFFCF8]/92 p-5 shadow-[0_18px_50px_-36px_rgba(33,77,59,0.35)]">
          <button onClick={onBack} className="mb-7 flex items-center gap-2 rounded-full border border-[#E8DFCF] bg-[#FFFCF8] px-4 py-2 font-sans text-sm font-bold text-[#24533E] transition hover:bg-[#FAF6EE]">
            <ArrowLeft className="h-4 w-4" />
            Quay lại Journey
          </button>

          <p className="font-sans text-xs font-extrabold uppercase tracking-wide text-[#24533E]/75">Journey</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-none" style={{ color: journey.accentColor }}>
            {journey.title} <Heart className="inline h-7 w-7 align-[-2px]" fill="currentColor" />
          </h1>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between font-sans text-xs font-extrabold text-[#24533E]">
              <span>Tiến độ Journey</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#E8DFCF]">
              <div className="h-full rounded-full bg-[#4B7E55]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#F3F1E8] px-4 py-3 font-sans text-xs font-bold text-[#4B7E55]">
            Bạn đang khám phá miễn phí 🌿
          </div>

          <div className="my-6 h-px bg-[#E8DFCF]" />
            <h2 className="mb-3 font-sans text-xs font-extrabold text-[#24533E]">Danh sách Chapter</h2>
          <div className="flex flex-col gap-1.5">
            {chapters.map((chapter, index) => {
              const chapterNo = index + 1;
              const unlocked = chapterNo <= unlockedChapters;
              const done = chapterNo < selectedChapter && unlocked;
              const active = chapterNo === selectedChapter;
              return (
                <button
                  key={chapter.title}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => setSelectedChapter(chapterNo)}
                  className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left font-sans text-xs font-bold transition-all ${active ? 'bg-[#FFECEF] text-[#F05E7B]' : unlocked ? 'text-[#24533E]/80 hover:bg-[#FAF6EE]' : 'cursor-not-allowed text-[#24533E]/45'}`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-[#F05E7B]/12 text-[#F05E7B]' : done ? 'bg-[#EEF3E8] text-[#4B7E55]' : 'bg-[#FAF6EE] text-[#8B8F8A]'}`}>
                    {active ? '✿' : <Leaf className="h-3.5 w-3.5" />}
                  </span>
                  <span className="w-4 text-center">{chapterNo}</span>
                  <span className="min-w-0 flex-1 truncate">{chapter.title}</span>
                  {done ? <Check className="h-4 w-4 text-[#4B7E55]" /> : !unlocked ? <Lock className="h-3.5 w-3.5 text-[#8B8F8A]" /> : <span className="h-2.5 w-2.5 rounded-full bg-[#F05E7B]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[1.4rem] bg-gradient-to-br from-[#F6F0DF] to-[#DDEED9] p-4 text-center">
            <div className="mx-auto mb-3 h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FFE7BA] to-[#E9FFF0] shadow-inner" />
            <p className="font-sans text-xs font-semibold leading-relaxed text-[#24533E]">Mở khóa toàn bộ Journey để nhận được toàn bộ insight và đồng hành cùng AI Mentor.</p>
            <button className="mt-4 rounded-xl bg-[#4B7E55] px-4 py-2.5 font-sans text-xs font-bold text-white shadow-sm">
              <Crown className="mr-1 inline h-3.5 w-3.5 text-[#F3C96B]" fill="currentColor" />
              Mở khóa hành trình
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="relative h-[300px] overflow-hidden rounded-[1.75rem] border border-[#F2DDE4] bg-gradient-to-br from-[#FFE0E8] via-[#FFF7EA] to-[#DCEBFF] shadow-[0_20px_60px_-38px_rgba(240,94,123,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_45%,rgba(255,105,135,0.36),transparent_18%),radial-gradient(circle_at_50%_36%,rgba(255,252,248,0.95),transparent_20%),linear-gradient(135deg,rgba(255,252,248,0.45),transparent)]" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#D7C8A2]/70 to-transparent" />
            <div className="absolute left-1/2 top-12 h-28 w-28 -translate-x-1/2 rounded-full bg-[#F05E7B]/30 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <Heart className="mx-auto h-16 w-16 text-[#F05E7B] drop-shadow-lg" fill="currentColor" />
                <p className="mt-3 font-sans text-sm font-bold text-[#F05E7B]/80">Hero image placeholder</p>
                <p className="font-sans text-xs font-medium text-[#24533E]/60">Sau này thay bằng ảnh Journey thật</p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[680px] py-5">
            <span className="inline-flex rounded-full bg-[#FFECEF] px-4 py-2 font-sans text-sm font-extrabold text-[#F05E7B]">Chapter {selectedChapter} 🌸</span>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-[#24533E]">{selectedChapterData.title}</h2>

            <article className="mt-5 rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-7 shadow-[0_18px_50px_-36px_rgba(33,77,59,0.24)]">
              <h3 className="font-display text-2xl font-bold text-[#F05E7B]">Nếu hỏi Linh Nhi...</h3>
              <div className="mt-4 space-y-4 font-sans text-[15px] font-medium leading-relaxed text-[#24533E]">
                {selectedChapterData.content.map((paragraph, index) => (
                  <p key={paragraph} className={index === selectedChapterData.content.length - 1 ? 'font-bold text-[#F05E7B]/55' : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center rounded-2xl bg-gradient-to-b from-[#FFFCF8] to-[#FFF0F4] p-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFCF8] shadow-md"><Lock className="h-5 w-5 text-[#8B8F8A]" /></div>
                <p className="mt-4 font-sans text-sm font-extrabold text-[#24533E]">🔒 Còn 8 insight chuyên sâu</p>
                <p className="mt-1 font-sans text-xs font-medium text-[#5E625F]">Mở khóa để tiếp tục khám phá hành trình này.</p>
                <button className="mt-4 rounded-xl bg-[#F05E7B] px-12 py-3 font-sans text-base font-extrabold text-white shadow-md shadow-[#F05E7B]/20">
                  <Lock className="mr-2 inline h-4 w-4" />
                  Mở khóa hành trình<br />69.000đ
                </button>
              </div>
            </article>
          </div>
        </main>

        <aside className="flex flex-col gap-5">
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-5 shadow-[0_18px_50px_-36px_rgba(33,77,59,0.22)]">
            <p className="font-sans text-sm font-semibold leading-relaxed text-[#24533E]">🌿 Mình nghĩ chương này sẽ giúp bạn hiểu rõ hơn về “{selectedChapterData.title.toLowerCase()}” và cách yêu đúng với trái tim mình.</p>
          </div>
          <img src={APP_ASSETS.linhNhiMascot} alt="Linh Nhi" className="mx-auto w-48 animate-float drop-shadow-[0_16px_24px_rgba(65,92,55,0.18)]" />

          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-5 shadow-[0_18px_50px_-36px_rgba(33,77,59,0.22)]">
            <h3 className="font-display text-xl font-bold text-[#24533E]"><Sparkles className="mr-2 inline h-5 w-5 text-[#C8A15A]" />Bạn đã đọc hết nội dung miễn phí.</h3>
            <p className="mt-3 font-sans text-sm font-medium text-[#5E625F]">Tiếp tục mở khóa để khám phá:</p>
            <ul className="mt-4 space-y-3 font-sans text-sm font-semibold text-[#5E625F]">
              {['Điều gì khiến bạn cảm thấy an toàn trong tình yêu', 'Kiểu người phù hợp với bạn', 'Những bài học bạn cần vượt qua', 'Gợi ý từ AI Mentor', 'Reflection Questions'].map((item) => (
                <li key={item} className="flex items-center gap-2"><Heart className="h-4 w-4 text-[#F05E7B]" fill="currentColor" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.25rem] border border-[#E8DFCF] bg-[#FFFCF8] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-sans text-xs font-bold text-[#5E625F]">Reflection Question (Preview)</p>
                <p className="mt-2 font-sans text-sm font-semibold text-[#24533E]/70">Sau chapter “{selectedChapterData.title}”, bạn nhận ra điều gì về mình?</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3E8]"><Lock className="h-5 w-5 text-[#4B7E55]" /></div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFCF8] p-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FFE0E8] to-[#FFF7EA]" />
              <div className="flex-1">
                <p className="font-sans text-sm font-bold text-[#24533E]">Bạn đã khám phá</p>
                <p className="font-sans text-lg font-extrabold text-[#24533E]">4 / 10 Chapter</p>
                <p className="font-sans text-sm font-bold text-[#5E625F]">Journey {journey.title}</p>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index < 4 ? 'bg-[#F05E7B]' : 'bg-[#E8DFCF]'}`} />)}
                </div>
              </div>
              <span className="font-sans text-sm font-bold text-[#24533E]">{progress}%</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
