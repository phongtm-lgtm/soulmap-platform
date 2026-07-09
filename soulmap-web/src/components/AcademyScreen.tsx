"use client";

import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Flame,
  Heart,
  Leaf,
  LayoutGrid,
  Mail,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';

interface AcademyScreenProps {
  currentUser: { name: string; email: string } | null;
}

interface AcademyArticle {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  tone: string;
}

const ARTICLES: AcademyArticle[] = [
  {
    title: '7 thói quen nhỏ giúp bạn sống tích cực và hạnh phúc hơn mỗi ngày',
    excerpt: 'Những thay đổi nhỏ mỗi ngày có thể mang lại kết quả lớn lao cho cuộc sống và tâm trạng của bạn.',
    category: 'Phát triển bản thân',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=640',
    date: '09/07/2026',
    readTime: '8 phút đọc',
    tone: 'green',
  },
  {
    title: 'Hiểu về cung Mệnh trong Tử Vi và ảnh hưởng đến cuộc đời bạn',
    excerpt: 'Cung Mệnh là cốt lõi của lá số Tử Vi. Hiểu về Cung Mệnh giúp bạn định hướng đúng đắn hơn.',
    category: 'Tử vi & Phong thủy',
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=640',
    date: '09/07/2026',
    readTime: '10 phút đọc',
    tone: 'violet',
  },
  {
    title: '5 cách xây dựng mối quan hệ lành mạnh và hạnh phúc lâu dài',
    excerpt: 'Một mối quan hệ bền vững được xây dựng từ sự thấu hiểu, tôn trọng và cùng nhau phát triển.',
    category: 'Tình yêu & Mối quan hệ',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=640',
    date: '08/07/2026',
    readTime: '7 phút đọc',
    tone: 'rose',
  },
  {
    title: 'Tìm ra công việc phù hợp với bản thân qua 5 bước đơn giản',
    excerpt: 'Công việc phù hợp không chỉ mang lại thu nhập mà còn giúp bạn cảm thấy ý nghĩa và hạnh phúc.',
    category: 'Sự nghiệp',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=640',
    date: '07/07/2026',
    readTime: '7 phút đọc',
    tone: 'blue',
  },
];

const POPULAR = [
  'Cách biết bạn đang đi đúng hướng trong cuộc sống',
  'Giải mã chỉ số MBTI của bạn qua từng khía cạnh',
  'Những dấu hiệu cho thấy bạn cần thay đổi công việc',
  'Năm 2026 - Xu hướng vận hạn 12 con giáp',
  'Làm thế nào để buông bỏ những điều không còn phù hợp?',
];

const CATEGORIES = [
  { label: 'Tất cả', icon: LayoutGrid, active: true },
  { label: 'Phát triển bản thân', icon: Leaf },
  { label: 'Tình yêu & Mối quan hệ', icon: Heart },
  { label: 'Sự nghiệp', icon: BriefcaseBusiness },
  { label: 'Tử vi & Phong thủy', icon: Star },
  { label: 'MBTI & Tính cách', icon: UserRound },
];

const TAGS = ['# phát triển bản thân', '# tích cực', '# hạnh phúc', '# tử vi 2026', '# MBTI', '# tình yêu', '# sự nghiệp', '# cân bằng cuộc sống'];

const chipTone: Record<string, string> = {
  green: 'bg-[#EAF3E8] text-[#3E7A50]',
  violet: 'bg-[#EEEAF8] text-[#6A5AA8]',
  rose: 'bg-[#FBEDEA] text-[#C06655]',
  blue: 'bg-[#EAF1FA] text-[#4C6E9C]',
};

function ArticleCard({ article }: { article: AcademyArticle }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E9E0D1] bg-[#FFFDF8] shadow-[0_16px_38px_-30px_rgba(77,52,28,0.58)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(77,52,28,0.62)]">
      <div className="relative h-44 overflow-hidden sm:h-48 lg:h-44 xl:h-48">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3F31]/20 to-transparent" />
      </div>

      <div className="p-4 sm:p-5">
        <span className={`inline-flex rounded-full px-3 py-1 font-sans text-[0.72rem] font-bold ${chipTone[article.tone]}`}>
          {article.category}
        </span>
        <h3 className="mt-3 line-clamp-2 font-display text-[1.03rem] font-bold leading-snug text-[#22251F]">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 font-sans text-[0.86rem] leading-relaxed text-[#676B66]">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#EFE7DA] pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80"
              alt="Linh Nhi"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-[#F4E7D0]"
            />
            <div className="min-w-0 leading-tight">
              <p className="font-sans text-[0.75rem] font-bold text-[#214D3B]">Linh Nhi</p>
              <p className="truncate font-sans text-[0.68rem] text-[#969083]">{article.date} · {article.readTime}</p>
            </div>
          </div>
          <button className="shrink-0 rounded-full p-1.5 text-[#8C928D] transition-colors hover:bg-[#F1ECE1] hover:text-[#24533E]" aria-label="Lưu bài viết">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AcademyScreen({ currentUser: _currentUser }: AcademyScreenProps) {
  return (
    <main className="min-h-screen bg-[#FBF9F5] px-4 pb-10 pt-24 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0">
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.label}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 font-sans text-[0.82rem] font-bold shadow-sm transition-all ${
                    category.active
                      ? 'border-[#24533E] bg-[#24533E] text-white shadow-[0_12px_24px_-16px_rgba(33,77,59,0.7)]'
                      : 'border-[#E8DFCF] bg-[#FFFDF8] text-[#4F5A52] hover:border-[#D8CDBB] hover:text-[#24533E]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${category.active ? 'text-[#F5D58E]' : 'text-[#7B8A80]'}`} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 px-1">
            <h2 className="font-display text-[1.35rem] font-bold tracking-[-0.03em] text-[#214D3B] sm:text-[1.55rem]">Bài học mới nhất</h2>
            <button className="hidden items-center gap-2 font-sans text-[0.82rem] font-bold text-[#4F5A52] transition-colors hover:text-[#24533E] sm:inline-flex">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ARTICLES.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </div>

        </section>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-[#E9E0D1] bg-[#FFFDF8] p-5 shadow-[0_18px_46px_-36px_rgba(77,52,28,0.58)]">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-[#24533E]">
              <Flame className="h-4 w-4 fill-[#F0A23A] text-[#F0A23A]" />
              Bài học phổ biến
            </h3>
            <div className="mt-4 space-y-4">
              {POPULAR.map((title, index) => (
                <article key={title} className="flex gap-3">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                    <img src={ARTICLES[index % ARTICLES.length].image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 font-sans text-[0.82rem] font-bold leading-snug text-[#30362F]">{title}</h4>
                    <p className="mt-1 font-sans text-[0.7rem] font-medium text-[#9A927F]">{12.4 - index * 1.8 > 5 ? (12.4 - index * 1.8).toFixed(1) : '5.2'}K lượt đọc</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E9E0D1] bg-[#FFFDF8] p-5 shadow-[0_18px_46px_-36px_rgba(77,52,28,0.5)]">
            <h3 className="font-display text-base font-bold text-[#24533E]">Chủ đề thịnh hành</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button key={tag} className="rounded-full bg-[#EEF4EA] px-3 py-1.5 font-sans text-[0.72rem] font-bold text-[#477053] transition-colors hover:bg-[#DFECDD]">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#E9E0D1] bg-[#FFFDF8] p-5 shadow-[0_18px_46px_-36px_rgba(77,52,28,0.5)]">
            <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-[#E8F3E5] blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-[#24533E]">Nhận bài học mới nhất</h3>
                <p className="mt-2 font-sans text-[0.82rem] leading-5 text-[#626861]">Đăng ký nhận những bài học chất lượng mỗi nhất từ SoulMap.</p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EDF5EB] text-[#24533E]">
                <Mail className="h-6 w-6" />
              </span>
            </div>
            <div className="relative mt-4 flex gap-2 rounded-full border border-[#E8DFCF] bg-white p-1.5">
              <input type="email" placeholder="Nhập email của bạn..." className="min-w-0 flex-1 bg-transparent px-3 font-sans text-[0.82rem] text-[#214D3B] outline-none placeholder:text-[#B5ADA0]" />
              <button className="shrink-0 rounded-full bg-[#24533E] px-4 py-2 font-sans text-[0.78rem] font-bold text-white shadow-[0_12px_22px_-14px_rgba(33,77,59,0.75)]">
                Đăng ký
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
