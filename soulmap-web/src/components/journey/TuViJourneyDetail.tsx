import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Compass, MessageCircle, RefreshCw, Sparkles } from 'lucide-react';
import { APP_ASSETS } from '../../assets';
import { fetchAiReading, type AiReading } from '../../lib/aiReadingsApi';
import type { SoulMapJourney } from '../../types/journey';
import MarkdownReading, { extractPrimaryHeadings } from './MarkdownReading';

interface TuViJourneyDetailProps {
  journey: SoulMapJourney;
  onBack: () => void;
}

const READING_ID_KEY = 'soulmap_ai_reading_tuvi_id';
const READING_PENDING_KEY = 'soulmap_ai_reading_tuvi_pending';
const TUVI_ACCENT = '#A66D24';

export default function TuViJourneyDetail({ journey, onBack }: TuViJourneyDetailProps) {
  const [reading, setReading] = useState<AiReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState('');

  const loadReading = useCallback(async () => {
    const readingId = Number(localStorage.getItem(READING_ID_KEY));
    const pending = localStorage.getItem(READING_PENDING_KEY) === 'true';
    setIsPending(pending);

    if (!readingId) {
      setReading(null);
      setIsLoading(false);
      setError(pending ? null : 'Bạn cần tạo SoulMap trước khi mở hành trình Tử Vi.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setReading(await fetchAiReading(readingId));
      setIsPending(false);
    } catch {
      setError('Linh Nhi chưa thể tải bài luận giải Tử Vi lúc này. Bạn thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReading();
  }, [loadReading]);

  useEffect(() => {
    if (!isPending || reading) return;
    const timer = window.setInterval(() => {
      if (localStorage.getItem(READING_ID_KEY)) void loadReading();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [isPending, loadReading, reading]);

  const headings = useMemo(() => extractPrimaryHeadings(reading?.content || ''), [reading?.content]);

  useEffect(() => {
    if (!headings.length) return;
    setActiveHeading((current) => current || headings[0].id);
    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveHeading(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  const navigateToHeading = (id: string) => {
    setActiveHeading(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#F8F3E8] pb-16 pt-20">
      <div className="mx-auto w-full max-w-[1760px] px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)_290px]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-[1.6rem] border border-[#E4D8C4] bg-[#FFFDF8] p-4 shadow-[0_20px_60px_-48px_rgba(77,52,28,0.42)]">
              <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-[#E6DDCE] bg-white px-3.5 py-2 font-sans text-[0.84rem] font-extrabold text-[#2E332E] shadow-sm transition hover:-translate-y-0.5">
                <ArrowLeft className="h-4 w-4" />
                Quay lại Journey
              </button>

              <div className="mt-7">
                <p className="font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.15em] text-[#8E806C]">Hành trình</p>
                <h2 className="mt-1 font-display text-[2rem] font-bold text-[#A66D24]">Tử Vi</h2>
                <p className="mt-2 font-reading text-[0.9rem] leading-relaxed text-[#656A65]">Đọc sâu cấu trúc lá số, vận trình và những bài học có thể ứng dụng trong đời sống.</p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#EAD8B8] bg-[#FFF6E5] p-3.5">
                <div className="flex items-center gap-2 font-sans text-[0.8rem] font-extrabold text-[#76501E]">
                  <Sparkles className="h-4 w-4" />
                  {reading ? 'Bài luận đã sẵn sàng' : isPending ? 'Đang lập bài luận' : 'Chưa có bài luận'}
                </div>
              </div>

              {headings.length > 0 && (
                <nav className="mt-7 hidden xl:block" aria-label="Mục lục luận giải Tử Vi">
                  <p className="mb-3 font-sans text-[0.78rem] font-extrabold text-[#2E332E]">Mục lục luận giải</p>
                  <div className="space-y-1.5">
                    {headings.map((heading, index) => {
                      const active = heading.id === activeHeading;
                      return (
                        <button key={heading.id} type="button" onClick={() => navigateToHeading(heading.id)} className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left font-sans text-[0.78rem] font-semibold leading-snug transition ${active ? 'bg-[#F7E9D3] text-[#87571B]' : 'text-[#656A65] hover:bg-[#FAF6EE]'}`}>
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.67rem] font-extrabold ${active ? 'bg-[#A66D24] text-white' : 'bg-[#EFE9DB] text-[#8B8F8A]'}`}>{index + 1}</span>
                          <span>{heading.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              )}
            </section>
          </aside>

          <main className="min-w-0">
            <header className="relative min-h-[420px] overflow-hidden rounded-[1.8rem] border border-[#806839] bg-[#07111F] p-6 shadow-[0_28px_75px_-48px_rgba(7,17,31,0.8)] md:min-h-[460px] md:p-9">
              <img src="/pillars/tuvi.png" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_46%] md:object-[center_46%]" draggable={false} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,26,0.78)_0%,rgba(5,14,26,0.52)_42%,rgba(5,14,26,0.08)_70%,rgba(5,14,26,0.04)_100%)]" />
              <div className="relative z-[1] flex min-h-[368px] flex-col justify-between text-white md:min-h-[388px]">
                <span className="w-fit rounded-full border border-[#F0D59D]/45 bg-[#FFF3D4]/10 px-4 py-2 font-sans text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[#FFE5AC] backdrop-blur-sm">SoulMap Journey · Tử Vi</span>
                <div>
                  <h1 className="font-display text-[3.4rem] font-bold leading-none !text-[#F4D58D] [text-shadow:0_3px_18px_rgba(0,0,0,0.55)] md:text-[4.5rem]">Bản Đồ Tử Vi</h1>
                  <p className="mt-5 max-w-[620px] font-display text-[1.15rem] italic leading-relaxed !text-[#F8EED8] [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] md:text-[1.3rem]">“Lá số không đóng khung cuộc đời. Nó giúp bạn hiểu rõ hơn những dòng chảy bên trong mình.”</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2 font-sans text-[0.8rem] font-bold text-white/90"><BookOpen className="h-4 w-4" /> 7 bước luận giải</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2 font-sans text-[0.8rem] font-bold text-white/90"><Compass className="h-4 w-4" /> Góc nhìn cá nhân hóa</span>
                  </div>
                </div>
              </div>
            </header>

            {headings.length > 0 && (
              <div className="sticky top-16 z-20 -mx-4 mt-4 border-y border-[#E4D8C4] bg-[#F8F3E8]/95 px-4 py-3 backdrop-blur-md xl:hidden">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {headings.map((heading, index) => (
                    <button key={heading.id} type="button" onClick={() => navigateToHeading(heading.id)} className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 font-sans text-[0.78rem] font-bold ${heading.id === activeHeading ? 'border-[#A66D24] bg-[#A66D24] text-white' : 'border-[#E4D8C4] bg-[#FFFDF8] text-[#656A65]'}`}>
                      <span>{index + 1}</span>
                      {heading.label.replace(/^BƯỚC\s+\d+:\s*/i, '').replace(/^KẾT LUẬN\s*/i, 'Kết luận')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <section className="mt-6 rounded-[1.8rem] border border-[#E4D8C4] bg-[#FFFDF8] px-5 py-7 shadow-[0_24px_70px_-52px_rgba(77,52,28,0.42)] md:px-10 md:py-10">
              {(isLoading || (isPending && !reading)) && (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="relative grid h-20 w-20 place-items-center rounded-full border border-[#E4D8C4] bg-[#FFF6E5]">
                    <Compass className="h-9 w-9 animate-pulse text-[#A66D24]" />
                    <span className="absolute inset-[-7px] animate-spin rounded-full border border-dashed border-[#C8964C]" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-bold text-[#2E3E33]">Linh Nhi đang mở lá số của bạn</h2>
                  <p className="mt-3 max-w-lg font-reading leading-relaxed text-[#656A65]">Bài luận này đi qua nhiều cung và vận trình nên có thể cần thêm vài phút. Trang sẽ tự cập nhật khi nội dung sẵn sàng.</p>
                </div>
              )}

              {!isLoading && !isPending && error && (
                <div className="flex min-h-[360px] flex-col items-center justify-center px-4 text-center">
                  <Sparkles className="h-11 w-11 text-[#A66D24]" />
                  <h2 className="mt-5 font-display text-2xl font-bold text-[#2E3E33]">Hành trình Tử Vi chưa sẵn sàng</h2>
                  <p className="mt-3 max-w-lg font-reading leading-relaxed text-[#656A65]">{error}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => void loadReading()} className="inline-flex items-center gap-2 rounded-full border border-[#D7B77E] bg-[#FFF6E5] px-5 py-2.5 font-sans text-sm font-extrabold text-[#87571B]"><RefreshCw className="h-4 w-4" /> Thử tải lại</button>
                    <button type="button" onClick={onBack} className="rounded-full bg-[#2E3E33] px-5 py-2.5 font-sans text-sm font-extrabold text-white">Về danh sách Journey</button>
                  </div>
                </div>
              )}

              {!isLoading && reading && (
                <article>
                  <div className="mb-9 flex items-center gap-3 border-b border-[#E8DFCF] pb-5">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFF0D2] text-[#A66D24]"><Sparkles className="h-5 w-5" /></span>
                    <div>
                      <p className="font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[#9A8263]">Linh Nhi luận giải</p>
                      <h2 className="font-display text-[1.35rem] font-bold text-[#2E3E33]">{reading.chapterTitle || 'Luận giải Tử Vi tổng quan'}</h2>
                    </div>
                  </div>
                  <MarkdownReading content={reading.content} accentColor={TUVI_ACCENT} />
                </article>
              )}
            </section>
          </main>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-[1.6rem] border border-[#E4D8C4] bg-[#FFFDF8] p-5 shadow-[0_20px_60px_-48px_rgba(77,52,28,0.42)]">
              <div className="flex items-center gap-3">
                <img src={APP_ASSETS.linhNhiMascot} alt="Linh Nhi" className="h-16 w-16 object-contain" draggable={false} />
                <div>
                  <h3 className="font-display text-[1.45rem] font-bold text-[#A66D24]">Linh Nhi ✦</h3>
                  <p className="font-sans text-[0.8rem] text-[#656A65]">Người đồng hành cùng bạn</p>
                </div>
              </div>
              <p className="mt-4 rounded-2xl border border-[#EAD8B8] bg-[#FFF6E5] p-4 font-reading text-[0.92rem] leading-relaxed text-[#514A40]">Tử Vi là một góc nhìn để chiêm nghiệm, không phải một bản án. Điều quan trọng nhất vẫn là cách bạn lựa chọn và sống với những điều mình hiểu ra.</p>
              <div className="mt-5">
                <p className="font-sans text-[0.82rem] font-extrabold text-[#2E332E]">Có thể hỏi Linh Nhi</p>
                {['Đại vận hiện tại nên ưu tiên gì?', 'Điểm mạnh nào đáng phát triển nhất?', 'Cần lưu ý gì trong tài chính?', 'Tình cảm nên điều chỉnh ra sao?'].map((question) => (
                  <button key={question} type="button" className="mt-2 flex w-full items-center gap-2 rounded-xl border border-[#E8DFCF] bg-white px-3 py-2.5 text-left font-sans text-[0.77rem] font-semibold text-[#5C625D] transition hover:border-[#D7B77E] hover:text-[#87571B]">
                    <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#A66D24]" />
                    {question}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
