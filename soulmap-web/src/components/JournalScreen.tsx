"use client";

import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  ImagePlus,
  Info,
  Leaf,
  MoreHorizontal,
  NotebookPen,
  PenLine,
  Plus,
  Search,
  Shuffle,
  Smile,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { APP_ASSETS } from '../assets';

// ─── Types & constants ────────────────────────────────────────────────────────

interface JournalEntry {
  id: string;
  year: number;
  month: number; // 0-indexed
  day: number;
  time: string; // "10:32"
  title: string;
  body: string;
  topics: string[];
  image?: string;
  mood?: string; // emoji
}

/** Fixed "today" — aligns with the design mock (9 Th7 2026) and the app clock. */
const TODAY = { year: 2026, month: 6, day: 9 };

const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const MOODS = [
  { emoji: '😊', label: 'Vui' },
  { emoji: '😌', label: 'Bình yên' },
  { emoji: '🤔', label: 'Suy tư' },
  { emoji: '😔', label: 'Chông chênh' },
  { emoji: '😤', label: 'Áp lực' },
  { emoji: '🙏', label: 'Biết ơn' },
] as const;

const COMMON_TOPICS = ['Cảm xúc', 'Sự nghiệp', 'Mối quan hệ', 'Gia đình', 'Mục tiêu', 'Biết ơn'];

const LINH_NHI_PROMPTS = [
  'Điều gì khiến bạn hạnh phúc nhất trong tuần này?',
  'Bạn đã học được điều gì mới về bản thân mình?',
  'Điều gì bạn muốn buông bỏ để nhẹ lòng hơn?',
  'Nếu được gửi một lời nhắn cho bản thân trong tương lai, bạn sẽ nói gì?',
  'Hôm nay điều gì làm bạn mỉm cười, dù chỉ một chút?',
  'Bạn đang biết ơn điều gì ngay lúc này?',
  'Nếu ngày mai là một khởi đầu mới, bạn muốn thay đổi điều gì?',
];

const INSIGHTS = [
  'Cảm xúc của bạn đang dần ổn định hơn.',
  'Bạn thường suy nghĩ sâu về sự nghiệp.',
  'Bạn đang tập trung vào mục tiêu rõ ràng.',
];

/** Soft chip palette keyed by topic — falls back to a neutral tone. */
const TOPIC_STYLES: Record<string, string> = {
  'Cảm xúc': 'bg-[#EAF3E8] text-[#3E7A50] border-[#D2E5CE]',
  'Sự nghiệp': 'bg-[#EEEAE1] text-[#7A7E78] border-[#E1DACF]',
  'Mối quan hệ': 'bg-[#FaEbE6] text-[#C06B54] border-[#F1D7CE]',
  'Gia đình': 'bg-[#E6F1EF] text-[#3E7A78] border-[#CFE3E0]',
  'Mục tiêu': 'bg-[#EEEAE1] text-[#7A7E78] border-[#E1DACF]',
  'Biết ơn': 'bg-[#FBF0D6] text-[#B17922] border-[#EBD9AE]',
};
const DEFAULT_TOPIC_STYLE = 'bg-[#EEEAE1] text-[#7A7E78] border-[#E1DACF]';

const topicClass = (topic: string) => TOPIC_STYLES[topic] ?? DEFAULT_TOPIC_STYLE;

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'e1',
    year: 2026,
    month: 6,
    day: 9,
    time: '10:32',
    title: 'Một ngày nhiều cảm xúc',
    body: 'Hôm nay mình cảm thấy khá áp lực vì công việc. Mình nhận ra điều khiến mình mệt không phải là khối lượng công việc mà là việc không nhìn thấy ý nghĩa của nó...',
    topics: ['Cảm xúc', 'Sự nghiệp'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400',
    mood: '🤔',
  },
  {
    id: 'e2',
    year: 2026,
    month: 6,
    day: 7,
    time: '22:18',
    title: 'Biết ơn những điều nhỏ bé',
    body: 'Hôm nay mình biết ơn buổi sáng yên bình, tách cà phê ngon và cuộc trò chuyện ấm áp với một người bạn thân lâu ngày.',
    topics: ['Biết ơn'],
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=400',
    mood: '🙏',
  },
  {
    id: 'e3',
    year: 2026,
    month: 6,
    day: 5,
    time: '21:05',
    title: 'Suy nghĩ về tương lai',
    body: 'Mình đang đứng trước ngã rẽ quan trọng. Mình muốn một công việc giúp mình phát triển và tạo ra giá trị cho người khác.',
    topics: ['Sự nghiệp', 'Mục tiêu'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
    mood: '😌',
  },
  {
    id: 'e4',
    year: 2026,
    month: 6,
    day: 3,
    time: '08:15',
    title: 'Khởi đầu tuần mới nhẹ nhàng',
    body: 'Mình dậy sớm, đi dạo một vòng và hít thở không khí trong lành. Một khởi đầu chậm rãi nhưng đầy năng lượng.',
    topics: ['Mục tiêu'],
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=400',
    mood: '😊',
  },
  {
    id: 'e5',
    year: 2026,
    month: 6,
    day: 1,
    time: '20:40',
    title: 'Một buổi tối bình yên',
    body: 'Cả nhà quây quần bên bữa cơm tối. Những khoảnh khắc giản dị như vậy khiến mình thấy trân trọng hiện tại hơn.',
    topics: ['Gia đình', 'Biết ơn'],
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400',
    mood: '😌',
  },
];

// ─── Calendar helpers ───────────────────────────────────────────────────────

interface CalendarCell {
  day: number;
  currentMonth: boolean;
}

/** Build a Monday-first calendar grid (always full weeks) for the given month. */
function buildCalendar(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Mon = 0 … Sun = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = startOffset; i > 0; i -= 1) {
    cells.push({ day: daysInPrevMonth - i + 1, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, currentMonth: true });
  }
  let trailing = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: trailing, currentMonth: false });
    trailing += 1;
  }
  return cells;
}

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

// ─── Entry card ───────────────────────────────────────────────────────────────

function EntryCard({ entry, isLast }: { entry: JournalEntry; isLast: boolean }) {
  const isToday = entry.year === TODAY.year && entry.month === TODAY.month && entry.day === TODAY.day;

  return (
    <li className="relative flex gap-3 sm:gap-4">
      {/* Date column */}
      <div className="w-11 shrink-0 pt-1 text-center sm:w-12">
        <div className="font-display text-[1.4rem] font-bold leading-none text-[#214D3B]">
          {String(entry.day).padStart(2, '0')}
        </div>
        <div className="mt-0.5 font-sans text-[0.68rem] font-bold uppercase tracking-wide text-[#7A7E78]">
          Th{entry.month + 1}
        </div>
        <div className="font-sans text-[0.62rem] font-medium text-[#A69F90]">{entry.year}</div>
      </div>

      {/* Timeline rail */}
      <div className="relative flex w-3 shrink-0 justify-center">
        <span
          className={`mt-2 h-3 w-3 rounded-full border-2 ${
            isToday ? 'border-[#3E7A50] bg-[#3E7A50]' : 'border-[#CBBF9F] bg-[#FFFDF8]'
          }`}
        />
        {!isLast && <span className="absolute top-6 bottom-[-1.5rem] w-px bg-[#E3DCCD]" />}
      </div>

      {/* Card */}
      <article className="mb-6 flex-1 rounded-2xl border border-[#EAE1CF] bg-[#FFFDF8] p-3.5 shadow-[0_14px_34px_-28px_rgba(77,52,28,0.5)] transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(77,52,28,0.55)] sm:p-4">
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-sans text-[0.72rem] font-medium text-[#9A927F]">
              <Clock className="h-3 w-3" />
              <span>{entry.time}</span>
              {entry.mood && <span className="ml-0.5 text-sm leading-none">{entry.mood}</span>}
            </div>

            <h4 className="mt-1 font-display text-[1.05rem] font-bold leading-snug text-[#22251F]">
              {entry.title}
            </h4>
            <p className="mt-1 font-sans text-[0.85rem] leading-relaxed text-[#5F625E] line-clamp-3">
              {entry.body}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.topics.map((topic) => (
                <span
                  key={topic}
                  className={`rounded-full border px-2.5 py-0.5 font-sans text-[0.68rem] font-bold ${topicClass(topic)}`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {entry.image && (
            <div className="relative hidden h-[92px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:block">
              <img src={entry.image} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
          )}

          <button
            type="button"
            aria-label="Tùy chọn nhật ký"
            className="h-7 w-7 shrink-0 self-start rounded-full text-[#B4AC9C] transition-colors hover:bg-[#F1ECE1] hover:text-[#6A6E69]"
          >
            <MoreHorizontal className="mx-auto h-4 w-4" />
          </button>
        </div>
      </article>
    </li>
  );
}

// ─── Main screen ────────────────────────────────────────────────────────────

interface JournalScreenProps {
  currentUser?: { name: string; email: string } | null;
}

export default function JournalScreen({ currentUser }: JournalScreenProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [draft, setDraft] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('Tất cả');
  const [visibleCount, setVisibleCount] = useState(3);

  const [viewYear, setViewYear] = useState(TODAY.year);
  const [viewMonth, setViewMonth] = useState(TODAY.month);

  const composerRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 2000;

  // ── Calendar data ──
  const calendarCells = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);
  const entryDays = useMemo(() => {
    const set = new Set<number>();
    entries.forEach((e) => {
      if (e.year === viewYear && e.month === viewMonth) set.add(e.day);
    });
    return set;
  }, [entries, viewYear, viewMonth]);

  const goToPrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };
  const goToNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  // ── Filtered entries ──
  const filteredEntries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q);
      const matchesTopic = topicFilter === 'Tất cả' || e.topics.includes(topicFilter);
      return matchesSearch && matchesTopic;
    });
  }, [entries, searchTerm, topicFilter]);

  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEntries.length;

  // ── Actions ──
  const handleSave = () => {
    const text = draft.trim();
    if (!text) {
      composerRef.current?.focus();
      return;
    }
    const now = new Date();
    const firstLine = text.split('\n')[0];
    const title = firstLine.length > 42 ? `${firstLine.slice(0, 42).trimEnd()}…` : firstLine;
    const moodLabel = MOODS.find((m) => m.emoji === selectedMood)?.label;

    const newEntry: JournalEntry = {
      id: `e-${now.getTime()}`,
      year: TODAY.year,
      month: TODAY.month,
      day: TODAY.day,
      time: formatTime(now),
      title: title || 'Dòng nhật ký mới',
      body: text,
      topics: moodLabel ? [moodLabel] : [],
      mood: selectedMood ?? undefined,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setDraft('');
    setSelectedMood(null);
    setShowMoodPicker(false);
    setVisibleCount((c) => Math.max(c, 3) + 1);
  };

  const usePrompt = (prompt: string) => {
    setDraft((prev) => (prev.trim() ? `${prev}\n\n${prompt} ` : `${prompt} `));
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const randomPrompt = () => {
    const pick = LINH_NHI_PROMPTS[Math.floor(Math.random() * LINH_NHI_PROMPTS.length)];
    usePrompt(pick);
  };

  const monthLabel = `Tháng ${viewMonth + 1}, ${viewYear}`;

  return (
    <div className="min-h-screen bg-[#F8F4EB]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 pb-8 pt-24 lg:flex-row lg:px-6 lg:pt-28 xl:px-8 min-[1800px]:max-w-[1680px] min-[1800px]:gap-7">
        {/* ══════════════ LEFT SIDEBAR ══════════════ */}
        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-28 lg:z-20 lg:max-h-[calc(100vh-8rem)] lg:w-[256px] lg:self-start lg:overflow-y-auto lg:pb-4 custom-scrollbar min-[1800px]:w-[280px]">
          {/* Calendar */}
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8] p-4 shadow-[0_18px_45px_-34px_rgba(77,52,28,0.45)]">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#3E7A50]" />
              <h3 className="font-display text-[0.98rem] font-bold text-[#214D3B]">Lịch nhật ký</h3>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevMonth}
                aria-label="Tháng trước"
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#6A6E69] transition-colors hover:bg-[#F1ECE1]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-sans text-[0.82rem] font-bold text-[#214D3B]">{monthLabel}</span>
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Tháng sau"
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#6A6E69] transition-colors hover:bg-[#F1ECE1]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className="font-sans text-[0.62rem] font-bold uppercase text-[#A69F90]">
                  {label}
                </span>
              ))}
              {calendarCells.map((cell, index) => {
                const isToday =
                  cell.currentMonth &&
                  viewYear === TODAY.year &&
                  viewMonth === TODAY.month &&
                  cell.day === TODAY.day;
                const hasEntry = cell.currentMonth && !isToday && entryDays.has(cell.day);
                return (
                  <div key={index} className="flex justify-center">
                    <span
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full font-sans text-[0.76rem] transition-colors ${
                        isToday
                          ? 'bg-[#3E7A50] font-bold text-white shadow-[0_6px_14px_-6px_rgba(62,122,80,0.7)]'
                          : cell.currentMonth
                          ? 'font-medium text-[#4F514D] hover:bg-[#F1ECE1]'
                          : 'font-medium text-[#C7C0B0]'
                      }`}
                    >
                      {cell.day}
                      {hasEntry && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#C9A446]" />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Writing stats */}
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8] p-4 shadow-[0_18px_45px_-34px_rgba(77,52,28,0.45)]">
            <h3 className="mb-3 font-display text-[0.98rem] font-bold text-[#214D3B]">Thống kê hành trình viết</h3>
            <div className="space-y-2.5">
              {[
                { icon: CalendarDays, value: '23', label: 'Ngày đã viết' },
                { icon: Flame, value: '12', label: 'Chuỗi ngày hiện tại' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF4EA] text-[#3E7A50]">
                    <stat.icon className="h-4 w-4" />
                  </span>
                  <span className="font-display text-[1.05rem] font-bold text-[#214D3B]">{stat.value}</span>
                  <span className="font-sans text-[0.78rem] leading-snug text-[#6A6E69]">{stat.label}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E8DFCF] bg-[#FFFDF8] px-3 py-2 font-sans text-[0.76rem] font-bold text-[#3E7A50] transition-colors hover:bg-[#F3F7F0]"
            >
              Xem chi tiết
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Common topics */}
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8] p-4 shadow-[0_18px_45px_-34px_rgba(77,52,28,0.45)]">
            <h3 className="mb-3 font-display text-[0.98rem] font-bold text-[#214D3B]">Chủ đề thường viết</h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setTopicFilter((cur) => (cur === topic ? 'Tất cả' : topic))}
                  className={`rounded-full border px-3 py-1 font-sans text-[0.72rem] font-bold transition-transform hover:-translate-y-0.5 ${
                    topicFilter === topic ? 'border-[#3E7A50] bg-[#3E7A50] text-white' : topicClass(topic)
                  }`}
                >
                  {topic}
                </button>
              ))}
              <button
                type="button"
                aria-label="Thêm chủ đề"
                className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-dashed border-[#CBBF9F] text-[#9A927F] transition-colors hover:border-[#3E7A50] hover:text-[#3E7A50]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mascot encouragement */}
          <div className="relative min-h-[112px] overflow-hidden rounded-[1.5rem] border border-[#ECD9B8] bg-gradient-to-b from-[#FFF6E0] to-[#FDEFC9] p-4 shadow-[0_18px_45px_-34px_rgba(77,52,28,0.45)]">
            <div className="relative z-10 max-w-[58%]">
              <p className="font-display text-[0.92rem] font-extrabold leading-tight text-[#6D4F23]">
                Viết mỗi ngày
              </p>
              <p className="font-display text-[0.92rem] font-extrabold leading-tight text-[#6D4F23]">
                Hiểu mình mỗi ngày
              </p>
              <p className="mt-2.5 font-sans text-[0.76rem] leading-relaxed text-[#7A6A45]">
                Những dòng viết hôm nay sẽ là món quà cho tương lai.
              </p>
            </div>
            <img
              src={APP_ASSETS.linhNhiMascot}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-2 -right-6 w-36 select-none object-contain drop-shadow-[0_4px_6px_rgba(120,90,30,0.18)]"
              draggable={false}
            />
          </div>
        </aside>

        {/* ══════════════ CENTER — MAIN COLUMN ══════════════ */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-4">
            <h1 className="flex items-center gap-2 font-display text-[1.7rem] font-bold leading-tight text-[#22251F]">
              Nhật ký hành trình
              <NotebookPen className="h-5 w-5 text-[#B68A2F]" />
            </h1>
            <p className="mt-1 font-sans text-[0.92rem] text-[#6A6E69]">
              Nơi bạn lắng nghe, thấu hiểu và ghi lại hành trình phát triển của chính mình.
            </p>
          </div>

          {/* Composer */}
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8] p-5 shadow-[0_20px_50px_-38px_rgba(77,52,28,0.5)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[1.1rem] font-bold text-[#214D3B]">Hôm nay bạn muốn viết điều gì?</h2>
              <PenLine className="h-5 w-5 text-[#B68A2F]" />
            </div>

            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Hãy viết tự do về suy nghĩ, cảm xúc, điều đã xảy ra hoặc điều bạn học được hôm nay..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-[#EAE1CF] bg-[#FDFBF5] px-4 py-3 font-sans text-[0.9rem] leading-relaxed text-[#3F423E] outline-none transition-colors placeholder:text-[#A69F90] focus:border-[#CFAE61] focus:bg-[#FFFDF8]"
            />

            {/* Mood picker */}
            {showMoodPicker && (
              <div className="mt-3 flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => setSelectedMood((cur) => (cur === mood.emoji ? null : mood.emoji))}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[0.76rem] font-semibold transition-colors ${
                      selectedMood === mood.emoji
                        ? 'border-[#3E7A50] bg-[#EEF4EA] text-[#3E7A50]'
                        : 'border-[#E8DFCF] bg-[#FFFDF8] text-[#6A6E69] hover:border-[#CFAE61]'
                    }`}
                  >
                    <span className="text-base leading-none">{mood.emoji}</span>
                    {mood.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowMoodPicker((s) => !s)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[0.78rem] font-semibold transition-colors ${
                    showMoodPicker || selectedMood
                      ? 'border-[#3E7A50] bg-[#EEF4EA] text-[#3E7A50]'
                      : 'border-transparent text-[#6A6E69] hover:bg-[#F1ECE1]'
                  }`}
                >
                  {selectedMood ? <span className="text-base leading-none">{selectedMood}</span> : <Smile className="h-4 w-4" />}
                  Cảm xúc
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 font-sans text-[0.78rem] font-semibold text-[#6A6E69] transition-colors hover:bg-[#F1ECE1]"
                >
                  <ImagePlus className="h-4 w-4" />
                  Thêm ảnh
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-sans text-[0.72rem] font-medium text-[#A69F90]">
                  {draft.length}/{MAX_CHARS}
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-full bg-[#24533E] px-5 py-2.5 font-sans text-[0.82rem] font-bold text-white shadow-[0_12px_24px_-12px_rgba(33,77,59,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#1F4A37] active:translate-y-0"
                >
                  <NotebookPen className="h-4 w-4" />
                  Lưu nhật ký
                </button>
              </div>
            </div>
          </div>

          {/* Recent entries */}
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-[1.25rem] font-bold text-[#22251F]">Nhật ký gần đây</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A927F]" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setVisibleCount(3);
                    }}
                    placeholder="Tìm kiếm nhật ký..."
                    className="h-10 w-[190px] rounded-full border border-[#E8DFCF] bg-[#FFFDF8] pl-9 pr-4 font-sans text-[0.8rem] text-[#4F514D] outline-none transition-colors placeholder:text-[#A69F90] focus:border-[#CFAE61]"
                  />
                </div>
                <div className="relative">
                  <select
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value);
                      setVisibleCount(3);
                    }}
                    className="h-10 cursor-pointer appearance-none rounded-full border border-[#E8DFCF] bg-[#FFFDF8] pl-4 pr-9 font-sans text-[0.8rem] font-semibold text-[#4F514D] outline-none transition-colors focus:border-[#CFAE61]"
                  >
                    <option value="Tất cả">Tất cả</option>
                    {COMMON_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A927F]" />
                </div>
              </div>
            </div>

            {visibleEntries.length > 0 ? (
              <ul className="pl-0">
                {visibleEntries.map((entry, index) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    isLast={index === visibleEntries.length - 1}
                  />
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E1DACF] bg-[#FFFDF8]/70 px-6 py-12 text-center">
                <p className="font-sans text-[0.9rem] text-[#6A6E69]">
                  Chưa tìm thấy dòng nhật ký nào phù hợp. Hãy thử từ khóa khác nhé.
                </p>
              </div>
            )}

            {hasMore && (
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 3)}
                  className="flex items-center gap-2 rounded-full border border-[#E8DFCF] bg-[#FFFDF8] px-5 py-2.5 font-sans text-[0.82rem] font-bold text-[#4F514D] shadow-sm transition-colors hover:border-[#CFAE61] hover:text-[#214D3B]"
                >
                  Xem thêm nhật ký cũ
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </main>

        {/* ══════════════ RIGHT SIDEBAR ══════════════ */}
        <aside className="w-full shrink-0 space-y-4 lg:w-[280px] xl:w-[300px]">
          {/* Insights */}
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8] p-5 shadow-[0_18px_45px_-34px_rgba(77,52,28,0.45)]">
            <div className="mb-4 flex items-center gap-1.5">
              <h3 className="font-display text-[1rem] font-bold text-[#214D3B]">Insight từ nhật ký</h3>
              <Info className="h-3.5 w-3.5 text-[#B4AC9C]" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#EAF4E4_0%,#F3F0E4_70%)]">
                <span className="absolute inset-2 rounded-full border border-[#DCE8D3]" />
                <Sprout className="h-8 w-8 text-[#3E7A50]" />
              </div>
              <p className="mt-3 max-w-[15rem] font-sans text-[0.82rem] leading-relaxed text-[#5F625E]">
                Bạn đang trở nên nhận thức và tích cực hơn qua từng ngày.
              </p>
            </div>

            <div className="mt-4 space-y-2.5 border-t border-[#EFE9DC] pt-4">
              {INSIGHTS.map((insight) => (
                <div key={insight} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF4EA] text-[#3E7A50]">
                    <Leaf className="h-3 w-3" />
                  </span>
                  <p className="font-sans text-[0.8rem] leading-snug text-[#5F625E]">{insight}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E8DFCF] bg-[#FFFDF8] px-3 py-2.5 font-sans text-[0.78rem] font-bold text-[#3E7A50] transition-colors hover:bg-[#F3F7F0]"
            >
              Xem phân tích chi tiết
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Linh Nhi prompts */}
          <div className="rounded-[1.5rem] border border-[#E8DFCF] bg-[#FFFDF8] p-5 shadow-[0_18px_45px_-34px_rgba(77,52,28,0.45)]">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E8DFCF] bg-[#FAF6EE]">
                <img
                  src={APP_ASSETS.linhNhiMascot}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full origin-center scale-[1.45] object-cover object-center"
                  draggable={false}
                />
              </div>
              <div>
                <h3 className="font-display text-[0.98rem] font-bold leading-tight text-[#214D3B]">
                  Câu hỏi gợi ý từ Linh Nhi
                </h3>
                <p className="font-sans text-[0.74rem] text-[#8B8778]">Chọn một câu hỏi để bắt đầu viết</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {LINH_NHI_PROMPTS.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => usePrompt(prompt)}
                  className="group flex w-full items-center gap-2 rounded-xl border border-[#EEE7D8] bg-[#FDFBF5] px-3.5 py-2.5 text-left font-sans text-[0.8rem] leading-snug text-[#4F514D] transition-colors hover:border-[#CFE3CC] hover:bg-[#F3F7F0]"
                >
                  <span className="flex-1">{prompt}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#B4AC9C] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3E7A50]" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={randomPrompt}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24533E] px-3 py-2.5 font-sans text-[0.8rem] font-bold text-white shadow-[0_12px_24px_-14px_rgba(33,77,59,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#1F4A37]"
            >
              <Shuffle className="h-4 w-4" />
              Tạo câu hỏi ngẫu nhiên
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
