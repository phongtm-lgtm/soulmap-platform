import { APP_ASSETS } from '../assets';

/** Nền chung cho màn intro + làm test MBTI — fixed để không mất khi chuyển câu hỏi. */
export default function MbtiTestBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FAF6EE]" />
      <img
        src={APP_ASSETS.mbtiTestBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-48 saturate-[0.82] blur-[1px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_54%_at_50%_18%,rgba(250,246,238,0.74),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_76%_64%_at_50%_48%,rgba(255,252,248,0.82),rgba(250,246,238,0.5)_55%,transparent_76%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,246,238,0.56)_0%,rgba(250,246,238,0.28)_45%,rgba(236,228,210,0.24)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(124,158,118,0.1),transparent_55%)]" />
    </div>
  );
}
