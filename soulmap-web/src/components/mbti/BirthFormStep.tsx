import { useEffect, useState } from 'react';
import { CircleAlert, Sparkles } from 'lucide-react';
import { APP_ASSETS } from '../../assets';

interface BirthFormStepProps {
  name: string;
  setName: (name: string) => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  birthCalendar: 'solar' | 'lunar';
  setBirthCalendar: (calendar: 'solar' | 'lunar') => void;
  birthTime: string;
  setBirthTime: (time: string) => void;
  gender: 'Nam' | 'Nữ';
  setGender: (gender: 'Nam' | 'Nữ') => void;
  onSubmit: () => void;
  onBack?: () => void;
  hasExistingSoulMap?: boolean;
  hasProfileChanges?: boolean;
}

const formatBirthDateForDisplay = (date: string) => {
  const [year, month, day] = date.split('-');

  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};

const parseBirthDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const displayValue = [day, month, year].filter(Boolean).join('/');

  if (digits.length !== 8) {
    return { displayValue, dateValue: '' };
  }

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  const parsedDate = new Date(yearNumber, monthNumber - 1, dayNumber);
  const isValidDate =
    parsedDate.getFullYear() === yearNumber &&
    parsedDate.getMonth() === monthNumber - 1 &&
    parsedDate.getDate() === dayNumber;

  return {
    displayValue,
    dateValue: isValidDate ? `${year}-${month}-${day}` : '',
  };
};

export default function BirthFormStep({
  name,
  setName,
  birthDate,
  setBirthDate,
  birthCalendar,
  setBirthCalendar,
  birthTime,
  setBirthTime,
  gender,
  setGender,
  onSubmit,
  onBack,
  hasExistingSoulMap = false,
  hasProfileChanges = false,
}: BirthFormStepProps) {
  const [birthDateDisplay, setBirthDateDisplay] = useState(() => formatBirthDateForDisplay(birthDate));
  const canSubmit = name.trim().length > 0 && birthDate.length > 0;

  useEffect(() => {
    setBirthDateDisplay(formatBirthDateForDisplay(birthDate));
  }, [birthDate]);

  return (
    <section className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] border border-[#E8DFCF]/90 bg-[#FFFCF8]/94 px-5 py-8 shadow-[0_24px_80px_-48px_rgba(33,77,59,0.45)] backdrop-blur-sm animate-fade-in sm:px-8 sm:py-10">
      <img
        src={APP_ASSETS.journey.scenery}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255,252,248,0.94),rgba(255,252,248,0.82)_55%,rgba(250,246,238,0.9)_100%)]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="text-center">
          <p className="font-sans text-sm font-semibold italic text-[#B68A2F]">✨ Bước tiếp theo</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-[#24533E] sm:text-3xl">
            Nhập ngày sinh &amp; Tử Vi
          </h2>
          <p className="mt-2 font-sans text-sm font-medium leading-relaxed text-[#5E625F]">
            Họ tên và ngày sinh là những mảnh ghép cuối để SoulMap tạo nên bức tranh dành riêng cho bạn.
          </p>
        </div>

        <div className="h-px bg-[#E8DFCF]" />

        {hasExistingSoulMap && hasProfileChanges && (
          <div className="flex gap-3 rounded-xl border border-[#D7B66E]/50 bg-[#FFF7E4] px-4 py-3 text-left">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#9B6D19]" />
            <p className="font-sans text-sm leading-relaxed text-[#71511A]">
              Bạn đang thay đổi dữ liệu nền tảng của SoulMap. Khi tạo lại, hệ thống sẽ yêu cầu quyền tái tạo.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="birth-name"
              className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-[#24533E]"
            >
              <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">person</span>
              Họ và tên
            </label>
            <input
              id="birth-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nhập họ và tên của bạn"
              autoComplete="name"
              maxLength={100}
              className="w-full rounded-xl border border-[#24533E]/10 bg-[#FFFCF8] px-4 py-3 font-sans text-sm text-[#24533E] shadow-sm placeholder:text-[#9A9F9B] focus:border-[#B68A2F] focus:outline-none focus:ring-1 focus:ring-[#B68A2F]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="birth-date"
                className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-[#24533E]"
              >
                <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">calendar_month</span>
                Ngày sinh
              </label>
              <div className="grid grid-cols-2 gap-1 rounded-full border border-[#E8DFCF] bg-[#F8F4EB]/70 p-1">
                {([
                  { value: 'solar', label: 'Dương lịch' },
                  { value: 'lunar', label: 'Âm lịch' },
                ] as const).map((calendar) => {
                  const isSelected = birthCalendar === calendar.value;
                  return (
                    <button
                      key={calendar.value}
                      type="button"
                      onClick={() => setBirthCalendar(calendar.value)}
                      className={`rounded-full px-3 py-1.5 font-sans text-xs font-bold transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? 'bg-[#24533E] text-white shadow-sm'
                          : 'text-[#5E625F] hover:text-[#24533E]'
                      }`}
                    >
                      {calendar.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <input
              id="birth-date"
              type="text"
              inputMode="numeric"
              value={birthDateDisplay}
              onChange={(event) => {
                const { displayValue, dateValue } = parseBirthDateInput(event.target.value);

                setBirthDateDisplay(displayValue);
                setBirthDate(dateValue);
              }}
              placeholder="dd/mm/yyyy"
              maxLength={10}
              autoComplete="bday"
              className="w-full rounded-xl border border-[#24533E]/10 bg-[#FFFCF8] px-4 py-3 font-sans text-sm text-[#24533E] shadow-sm focus:border-[#B68A2F] focus:outline-none focus:ring-1 focus:ring-[#B68A2F]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="birth-time"
              className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-[#24533E]"
            >
              <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">schedule</span>
              Giờ sinh
            </label>
            <select
              id="birth-time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-[#24533E]/10 bg-[#FFFCF8] px-4 py-3 font-sans text-sm text-[#24533E] shadow-sm focus:border-[#B68A2F] focus:outline-none focus:ring-1 focus:ring-[#B68A2F]"
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

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-[#24533E]">
              <span className="material-symbols-outlined text-sm font-bold text-[#B68A2F]">wc</span>
              Giới tính
            </span>
            <div className="grid grid-cols-2 gap-3">
              {(['Nam', 'Nữ'] as const).map((g) => {
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-xl border px-4 py-3 font-sans text-sm font-semibold transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'border-[#24533E] bg-[#24533E] text-white shadow-md'
                        : 'border-[#24533E]/10 bg-[#FFFCF8] text-[#5E625F] hover:border-[#B68A2F]/50'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="order-2 rounded-full border border-[#E8DFCF] bg-[#FFFCF8]/90 px-6 py-3.5 font-sans text-sm font-bold text-[#5E625F] transition hover:border-[#B68A2F]/40 hover:text-[#24533E] active:scale-[0.98] sm:order-1 sm:flex-1"
            >
              Quay lại kết quả MBTI
            </button>
          )}
          <button
            type="button"
            onClick={() => canSubmit && onSubmit()}
            disabled={!canSubmit}
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#24533E] px-8 py-3.5 font-sans text-base font-bold text-white shadow-[0_16px_32px_-18px_rgba(33,77,59,0.75)] transition hover:-translate-y-0.5 hover:bg-[#214D3B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${onBack ? 'sm:flex-[1.4]' : 'w-full'}`}
          >
            <Sparkles className="h-5 w-5" />
            {hasExistingSoulMap && !hasProfileChanges ? 'Xem SoulMap của bạn' : 'Tạo SoulMap'}
          </button>
        </div>
      </div>
    </section>
  );
}
