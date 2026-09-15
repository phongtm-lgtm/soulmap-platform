import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, CircleAlert, Sparkles } from 'lucide-react';
import type { SoulMapJourney } from '../../types/journey';
import {
  fetchAiReading,
  generateIdentityJourneyReading,
  type IdentityJourneyReading,
  type IdentityJourneyRequest,
} from '../../lib/aiReadingsApi';

const READING_ID_KEY = 'soulmap_ai_reading_identity_id';
const BIRTH_INFO_KEY = 'soulmap_birth_info';

type StoredBirthInfo = {
  name?: string;
  birthDate: string;
  birthCalendar: 'solar' | 'lunar';
  birthTime: string;
  gender: 'Nam' | 'Nữ';
  timezone?: number;
  viewYear?: number;
};

function buildRequest(): IdentityJourneyRequest {
  const rawBirthInfo = localStorage.getItem(BIRTH_INFO_KEY);
  if (!rawBirthInfo) throw new Error('missing birth info');
  const birthInfo = JSON.parse(rawBirthInfo) as StoredBirthInfo;
  const [year, month, day] = birthInfo.birthDate.split('-').map(Number);
  const [hour, min] = birthInfo.birthTime.split(':').map(Number);
  const rawProfile = localStorage.getItem('soulmap_profile');
  const profile = rawProfile ? JSON.parse(rawProfile) as { type?: string } : null;

  return {
    name: birthInfo.name || 'Bạn',
    day,
    month,
    year,
    calendar: birthInfo.birthCalendar,
    gender: birthInfo.gender === 'Nam' ? 'male' : 'female',
    hour,
    min,
    timezone: birthInfo.timezone ?? 7,
    viewYear: birthInfo.viewYear ?? new Date().getFullYear(),
    mbtiType: profile?.type,
  };
}

function parseStoredReading(content: string): IdentityJourneyReading {
  const reading = JSON.parse(content) as IdentityJourneyReading;
  if (!reading.chapters?.length) throw new Error('invalid stored identity reading');
  return reading;
}

interface IdentityJourneyDetailProps {
  journey: SoulMapJourney;
  onBack: () => void;
}

export default function IdentityJourneyDetail({ journey, onBack }: IdentityJourneyDetailProps) {
  const router = useRouter();
  const [reading, setReading] = useState<IdentityJourneyReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreGenerating, setIsPreGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReading = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedId = Number(localStorage.getItem(READING_ID_KEY));
      if (savedId) {
        try {
          const storedReading = await fetchAiReading(savedId);
          setReading(parseStoredReading(storedReading.content));
          return;
        } catch {
          localStorage.removeItem(READING_ID_KEY);
        }
      }

      if (localStorage.getItem('soulmap_ai_reading_identity_pending') === 'true') {
        setIsPreGenerating(true);
        return;
      }

      setIsPreGenerating(false);
      const createdReading = await generateIdentityJourneyReading(buildRequest());
      if (!createdReading.id) throw new Error('missing identity reading id');
      localStorage.setItem(READING_ID_KEY, String(createdReading.id));
      setReading(createdReading);
    } catch {
      setReading(null);
      setError('Chưa thể tạo hành trình “Tôi là ai” lúc này. Hãy chắc rằng bạn đã tạo SoulMap trước đó rồi thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReading();
  }, [loadReading]);

  useEffect(() => {
    if (!isPreGenerating) return;
    const timer = window.setInterval(() => {
      if (localStorage.getItem('soulmap_ai_reading_identity_pending') !== 'true') void loadReading();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [isPreGenerating, loadReading]);

  return (
    <div className="mx-auto max-w-[1080px]">
      <header className="relative overflow-hidden rounded-[2rem] border border-[#C6D8C8] bg-[#24533E] p-6 text-white shadow-[0_24px_70px_-44px_rgba(33,77,59,0.5)] md:p-10">
        <img src={journey.imagePath} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" draggable={false} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(25,67,50,0.96),rgba(46,99,67,0.72))]" />
        <div className="relative">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 font-sans text-sm font-bold backdrop-blur transition hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" />
            Quay lại Journey
          </button>
          <p className="mt-10 font-sans text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-[#DCEBC9]">SoulMap Journey</p>
          <h1 className="mt-2 font-display text-[3.1rem] font-bold leading-none md:text-[4.5rem]">{reading?.journeyTitle || journey.title}</h1>
          <p className="mt-5 max-w-2xl font-reading text-lg leading-relaxed text-white/90">{reading?.tagline || 'Linh Nhi đang mở những nét riêng trong bản đồ của bạn.'}</p>
        </div>
      </header>

      <main className="mt-6 rounded-[2rem] border border-[#E8DFCF] bg-[#FFFCF8] px-5 py-7 shadow-[0_20px_60px_-44px_rgba(33,77,59,0.28)] md:px-10 md:py-10">
        {isLoading && (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D8E6D1] border-t-[#3E7A50]" />
            <h2 className="mt-6 font-display text-2xl font-bold text-[#214D3B]">Linh Nhi đang dệt hành trình của bạn</h2>
            <p className="mt-2 max-w-lg font-reading leading-relaxed text-[#5E625F]">Lá số, MBTI và giai đoạn hiện tại đang được kết nối thành một câu chuyện riêng.</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <Sparkles className="h-11 w-11 text-[#A66D24]" />
            <h2 className="mt-5 font-display text-2xl font-bold text-[#214D3B]">Hành trình Tôi là ai chưa sẵn sàng</h2>
            <p className="mt-3 max-w-lg font-reading leading-relaxed text-[#5E625F]">Bạn cần tạo SoulMap trước khi mở hành trình Tôi là ai.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => router.push('/mbti-test')} className="inline-flex items-center gap-2 rounded-full border border-[#D7B77E] bg-[#FFF6E5] px-5 py-2.5 font-sans text-sm font-extrabold text-[#87571B]">
                <Sparkles className="h-4 w-4" />
                Mở hành trình
              </button>
              <button type="button" onClick={onBack} className="rounded-full bg-[#2E3E33] px-5 py-2.5 font-sans text-sm font-extrabold text-white">Về danh sách Journey</button>
            </div>
          </div>
        )}

        {!isLoading && !error && !reading && isPreGenerating && (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D8E6D1] border-t-[#3E7A50]" />
            <h2 className="mt-5 font-display text-2xl font-bold text-[#214D3B]">Hành trình của bạn đang được hoàn thiện</h2>
            <p className="mt-2 max-w-lg font-reading leading-relaxed text-[#5E625F]">Linh Nhi đã bắt đầu đọc lá số ngay khi bạn mở khóa SoulMap. Bản đọc sẽ tự hiện ra khi hoàn tất.</p>
          </div>
        )}

        {!isLoading && reading && (
          <>
            <p className="mx-auto max-w-3xl text-center font-reading text-[1.08rem] leading-relaxed text-[#4C534D]">{reading.coreNarrative}</p>
            <div className="mt-10 space-y-6">
              {reading.chapters.map((chapter) => (
                <article key={chapter.order} className="rounded-[1.5rem] border border-[#E8DFCF] bg-white p-5 md:p-7">
                  <div className="flex items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3E7A50] font-sans text-sm font-extrabold text-white">{chapter.order}</span>
                    <h2 className="font-display text-[1.8rem] font-bold leading-tight text-[#214D3B] md:text-[2.1rem]">{chapter.title}</h2>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <section className="rounded-2xl border border-[#CEE0C8] bg-[#F4F8EF] p-4">
                      <p className="flex items-center gap-2 font-sans text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-[#326443]"><Check className="h-4 w-4" /> {chapter.strength.title}</p>
                      <p className="mt-3 font-reading leading-relaxed text-[#405245]">{chapter.strength.content}</p>
                    </section>
                    <section className="rounded-2xl border border-[#F0D9C3] bg-[#FFF7ED] p-4">
                      <p className="flex items-center gap-2 font-sans text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-[#9A5D24]"><CircleAlert className="h-4 w-4" /> {chapter.watchOut.title}</p>
                      <p className="mt-3 font-reading leading-relaxed text-[#5B5044]">{chapter.watchOut.content}</p>
                    </section>
                  </div>
                </article>
              ))}
            </div>
            <footer className="mt-8 rounded-[1.5rem] border border-[#D5E1CA] bg-[#F4F8EF] p-6 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[#3E7A50]" />
              <p className="mx-auto mt-3 max-w-3xl font-reading text-lg leading-relaxed text-[#405245]">{reading.closing}</p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
