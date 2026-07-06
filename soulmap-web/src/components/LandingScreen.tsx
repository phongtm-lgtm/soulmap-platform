import React from 'react';
import { 
  ArrowRight, 
  User, 
  Briefcase, 
  Heart, 
  Globe, 
  Star,
  Play,
  Leaf,
  Send,
  Sparkles,
  ShieldCheck,
  Compass,
  TrendingUp,
  Lock
} from 'lucide-react';

interface LandingScreenProps {
  isLoggedIn: boolean;
  setTransitionDirection: (direction: 'push' | 'push_back' | 'none') => void;
  setCurrentScreen: (screen: 'landing' | 'assessment' | 'result' | 'auth') => void;
  navigateToAssessment: (direction?: 'push' | 'none') => void;
}

const LINH_NHI_AVATAR =
  'https://lh3.googleusercontent.com/aida/AP1WRLvd66sPGu4H_1tGLFdCvf9aR0bDPYKAnrAsSuzrivZLFixhLtUiFXVuFWy08e04uor7tG8oCmc8yDUZdmvCj78rHlpezlPKeKaIstq5LBwI-PBoxczVa9ScHf9z2Bc-zSR_Km1wFIT42hCYX9tC2kJFLYXxpvuruTjSjuZkB4N8MQ5RAxayl0mb30SGtFvM8aLYm9W-Rd-w2-RfMXX4fCT_7t7jKWgt2koKFGsT1-rNINBqWkZumemW6wQ';

const demoChat: { sender: 'user' | 'assistant'; text: string }[] = [
  {
    sender: 'assistant',
    text: 'Chào bạn, mình là Linh Nhi. Bản đồ nội tâm của bạn vừa hé lộ vài điều thú vị đấy. Bạn muốn mình bắt đầu từ đâu?',
  },
  {
    sender: 'user',
    text: 'Dạo này mình khá phân vân về hướng đi sự nghiệp.',
  },
  {
    sender: 'assistant',
    text: 'Mình hiểu cảm giác đó. Với bản mệnh Mộc và năng lượng trực giác mạnh, bạn hợp với những vai trò sáng tạo và dẫn dắt. Mình cùng nhau nhìn kỹ hơn nhé?',
  },
  {
    sender: 'user',
    text: 'Nghe hay đấy, mình muốn nghe thêm.',
  },
];

const journeySteps = [
  {
    n: 1,
    title: 'Chia sẻ thông tin',
    desc: 'Bắt đầu bằng việc chia sẻ những nét tính cách cốt lõi và các xu hướng hành vi tự nhiên.',
    tag: 'Tự nhiên & an toàn',
    tagIcon: ShieldCheck,
  },
  {
    n: 2,
    title: 'AI kiến tạo SoulMap',
    desc: 'Hệ thống thông thái phân tích sâu, đúc kết mô hình MBTI tương sinh Ngũ hành của riêng bạn.',
    tag: 'AI cá nhân hóa',
    tagIcon: Sparkles,
  },
  {
    n: 3,
    title: 'Linh Nhi dẫn dắt',
    desc: 'Mascot AI hóa thân làm người đồng hành, diễn giải chi tiết từng địa danh bản đồ nội tâm.',
    tag: 'Thấu hiểu & đồng hành',
    tagIcon: Heart,
  },
  {
    n: 4,
    title: 'Khám phá Journey',
    desc: 'Thực hiện các bài viết tự sự (journaling), đối thoại cùng AI và hoàn thành thử thách phát triển ngày.',
    tag: 'Trải nghiệm & chuyển hóa',
    tagIcon: Compass,
  },
  {
    n: 5,
    title: 'Ghi nhớ & phát triển',
    desc: 'Hệ thống tự động cập nhật bản đồ năng lượng khi bạn trưởng thành qua từng chặng đời.',
    tag: 'Tiến bộ & bền vững',
    tagIcon: TrendingUp,
  },
];

const pillars = [
  {
    icon: User,
    title: 'Tôi là ai',
    desc: 'Khám phá tâm hồn qua lăng kính MBTI hiện đại và lá số Tử Vi cổ điển để thấu suốt bản chất thực sự bên trong.',
    image: '/pillars/pillar-self.png',
    decor: '/pillars/decor-leaf.png',
    number: 1,
  },
  {
    icon: Briefcase,
    title: 'Sự nghiệp',
    desc: 'Định vị nghề nghiệp tối ưu dựa trên tài năng thiên bẩm, ngũ hành bản mệnh và nhận diện các cơ hội phát triển ẩn mình.',
    image: '/pillars/pillar-career.png',
    decor: '/pillars/decor-leaf.png',
    number: 2,
  },
  {
    icon: Heart,
    title: 'Tình yêu',
    desc: 'Thấu hiểu sâu sắc cách thức bạn liên kết, biểu đạt cảm xúc và tìm kiếm mảnh ghép tâm giao đồng điệu năng lượng.',
    image: '/pillars/pillar-love.png',
    decor: '/pillars/decor-blossom.png',
    number: 3,
  },
  {
    icon: Globe,
    title: 'Cuộc đời',
    desc: 'Nhìn nhận bức tranh toàn cảnh về những giai đoạn thăng trầm, sứ mệnh cuộc đời và các đại vận quan trọng của bản thân.',
    image: '/pillars/pillar-life.png',
    decor: '/pillars/decor-leaf.png',
    number: 4,
  },
];

export default function LandingScreen({
  isLoggedIn,
  setTransitionDirection,
  setCurrentScreen,
  navigateToAssessment,
}: LandingScreenProps) {
  return (
    <div className="relative isolate flex flex-col min-h-screen landing-bg overflow-hidden">
      {/* CSS-only botanical decoration layer (behind all content, edges & corners) */}
      <div className="botanical-layer hidden sm:block" aria-hidden="true">
        {/* Top-left corner cluster */}
        <span className="leaf leaf-lg top-[-34px] left-[-40px] rotate-[28deg]"></span>
        <span className="leaf leaf-md top-[54px] left-[-28px] rotate-[62deg]"></span>
        <span className="leaf leaf-sm top-[130px] left-[26px] rotate-[10deg]"></span>
        <span className="glow-dot w-16 h-16 top-[90px] left-[70px]"></span>

        {/* Mid-left edge cluster */}
        <span className="leaf leaf-md top-[46%] left-[-40px] rotate-[-18deg]"></span>
        <span className="leaf leaf-sm top-[52%] left-[14px] rotate-[38deg]"></span>
        <span className="glow-dot w-12 h-12 top-[48%] left-[40px]"></span>

        {/* Top-right edge cluster */}
        <span className="leaf leaf-md top-[110px] right-[-30px] rotate-[-52deg]"></span>
        <span className="leaf leaf-sm top-[70px] right-[30px] rotate-[-14deg]"></span>
        <span className="glow-dot w-16 h-16 top-[150px] right-[64px]"></span>

        {/* Mid / bottom-right corner cluster */}
        <span className="leaf leaf-lg bottom-[-40px] right-[-44px] rotate-[-136deg]"></span>
        <span className="leaf leaf-md bottom-[70px] right-[-26px] rotate-[-100deg]"></span>
        <span className="leaf leaf-sm bottom-[140px] right-[30px] rotate-[-160deg]"></span>
        <span className="glow-dot w-14 h-14 bottom-[110px] right-[80px]"></span>

        {/* Bottom-left corner accent */}
        <span className="leaf leaf-md bottom-[-30px] left-[-30px] rotate-[128deg]"></span>
        <span className="glow-dot w-12 h-12 bottom-[60px] left-[60px]"></span>
      </div>

      {/* Hero — map + overlays share one coordinate stage */}
      <section className="hero-section relative w-full overflow-hidden lg:min-h-[min(820px,88vh)] -mt-10">
        <div className="hero-map-scrim" aria-hidden="true"></div>

        <div className="relative z-20 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_5fr] items-center gap-12 lg:gap-6 overflow-visible">

            {/* LEFT — narrative (3) */}
            <div className="w-full overflow-visible relative z-30 flex flex-col items-start gap-6 md:gap-7 text-left lg:pr-4">
              {/* Big Display Title */}
              <h1 className="hero-title font-bold text-[38px] sm:text-[46px] md:text-[52px] relative z-30 max-w-none">
                Khám phá<br />
                bản đồ nội tâm<br />
                <span className="hero-title-line-last">
                  được <span className="hero-highlight">tạo riêng</span> cho bạn.
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="body-lead max-w-full">
                SoulMap kết hợp khoa học tính cách <span className="text-[#24533E] font-semibold">MBTI</span>, chiều sâu tinh tú của <span className="text-[#24533E] font-semibold">Tử Vi</span> cổ xưa, trợ lý thông thái <span className="text-[#24533E] font-semibold">AI Mentor</span> và phương pháp <span className="text-[#24533E] font-semibold">Journaling</span> giúp bạn khai phóng vận mệnh, thấu suốt tình yêu và sự nghiệp.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-1">
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      setTransitionDirection('push');
                      setCurrentScreen('auth');
                    } else {
                      navigateToAssessment('push');
                    }
                  }}
                  className="btn-primary px-9 py-4 rounded-full flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  Bắt đầu hành trình
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Social Proof Counter */}
              <div className="flex items-center gap-4 mt-1">
                <div className="flex -space-x-3 overflow-hidden">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F8F4EB]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" alt="User 1" referrerPolicy="no-referrer" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F8F4EB]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="User 2" referrerPolicy="no-referrer" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F8F4EB]" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120" alt="User 3" referrerPolicy="no-referrer" />
                </div>
                <p className="font-sans text-sm font-medium text-[#5E625F]">
                  Hơn <span className="text-[#24533E] font-bold">50.000+</span> người đang khám phá SoulMap mỗi ngày.
                </p>
              </div>
            </div>

            {/* RIGHT — SoulMap stage */}
            <div className="hero-map-column relative w-full min-w-0 mt-8 lg:mt-0" aria-label="Bản đồ SoulMap">
              <div className="hero-map-stage animate-float-slow">
                <img
                  src="/soulmap-island.webp"
                  alt="Bản đồ SoulMap"
                  className="hero-map-image"
                  draggable={false}
                />
                <div className="hero-map-fog" aria-hidden="true"></div>

                {/* Glowing particles */}
                <span className="particle w-2.5 h-2.5 top-[22%] left-[54%] animate-twinkle"></span>
                <span className="particle w-1.5 h-1.5 top-[46%] left-[80%] animate-twinkle" style={{ animationDelay: '-1.4s' }}></span>
                <span className="particle w-1.5 h-1.5 top-[68%] left-[40%] animate-twinkle" style={{ animationDelay: '-2.6s' }}></span>
                <span className="particle w-2 h-2 top-[34%] left-[24%] animate-twinkle" style={{ animationDelay: '-3.4s' }}></span>
                <span className="particle w-1 h-1 top-[78%] left-[66%] animate-twinkle" style={{ animationDelay: '-0.8s' }}></span>

                {/* Core Self — center crystal */}
                <div className="hero-map-marker top-[44%] left-1/2 -translate-x-1/2 animate-float-slow" style={{ animationDelay: '-1s' }}>
                  <div className="core-tag">
                    <span className="core-title">Core Self</span>
                    <span className="core-sub">Trái tim cốt lõi</span>
                  </div>
                </div>

                {/* Journey 1 — horizontal line ← left */}
                <div
                  className="hero-map-marker journey-anchor top-[12%] left-[5%] animate-float-slow z-20"
                  style={{ '--stem-len': '56px' } as React.CSSProperties}
                >
                  <div className="journey-callout journey-callout--left">
                    <span className="journey-callout__anchor" aria-hidden="true" />
                    <span className="journey-callout__line" aria-hidden="true" />
                    <div className="journey-pill">
                      <span className="pill-icon"><User className="w-3.5 h-3.5" /></span>
                      <span><span className="pill-eyebrow">Journey 1</span><span className="pill-title">Tôi là ai</span></span>
                    </div>
                  </div>
                </div>

                {/* Journey 2 — diagonal ↖ up-left */}
                <div
                  className="hero-map-marker journey-anchor top-[14%] left-[58%] animate-float-slow z-20"
                  style={{
                    '--stem-len': '58px',
                    '--stem-angle': '-138deg',
                    '--pill-x': '-46px',
                    '--pill-y': '-40px',
                    animationDelay: '-2s',
                  } as React.CSSProperties}
                >
                  <div className="journey-callout journey-callout--angled">
                    <span className="journey-callout__anchor" aria-hidden="true" />
                    <span className="journey-callout__line" aria-hidden="true" />
                    <div className="journey-callout__pill-wrap">
                      <div className="journey-pill">
                        <span className="pill-icon"><Briefcase className="w-3.5 h-3.5" /></span>
                        <span><span className="pill-eyebrow">Journey 2</span><span className="pill-title">Sự nghiệp</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journey 3 — diagonal ↘ down-right */}
                <div
                  className="hero-map-marker journey-anchor top-[75%] left-[30%] animate-float-slow z-20"
                  style={{
                    '--stem-len': '60px',
                    '--stem-angle': '48deg',
                    '--pill-x': '42px',
                    '--pill-y': '48px',
                    animationDelay: '-4s',
                  } as React.CSSProperties}
                >
                  <div className="journey-callout journey-callout--angled">
                    <span className="journey-callout__anchor" aria-hidden="true" />
                    <span className="journey-callout__line" aria-hidden="true" />
                    <div className="journey-callout__pill-wrap">
                      <div className="journey-pill">
                        <span className="pill-icon"><Heart className="w-3.5 h-3.5" /></span>
                        <span><span className="pill-eyebrow">Journey 3</span><span className="pill-title">Tình yêu</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journey 4 — diagonal ↘ down-right (steeper) */}
                <div
                  className="hero-map-marker journey-anchor top-[70%] left-[73%] animate-float-slow z-20"
                  style={{
                    '--stem-len': '64px',
                    '--stem-angle': '32deg',
                    '--pill-x': '38px',
                    '--pill-y': '56px',
                    animationDelay: '-3s',
                  } as React.CSSProperties}
                >
                  <div className="journey-callout journey-callout--angled">
                    <span className="journey-callout__anchor" aria-hidden="true" />
                    <span className="journey-callout__line" aria-hidden="true" />
                    <div className="journey-callout__pill-wrap">
                      <div className="journey-pill">
                        <span className="pill-icon"><Globe className="w-3.5 h-3.5" /></span>
                        <span><span className="pill-eyebrow">Journey 4</span><span className="pill-title">Cuộc đời</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linh Nhi chat bubble — beside mascot, top-right */}
                <div className="hero-map-marker top-[0%] left-[67%] max-w-[248px] chat-bubble text-left animate-float-slow z-30" style={{ animationDelay: '-5s' }}>
                  <p className="font-sans text-[13px] leading-[1.65] text-[#214D3B] m-0">
                    <span className="block font-semibold text-[#24533E] text-[14px] mb-1.5">
                      Mình là Linh Nhi.
                    </span>
                    <span className="block text-[#5E625F]">
                      Mình sẽ luôn{' '}
                      <strong className="text-[#24533E] font-semibold">đồng hành với bạn.</strong>

                    </span>
                  </p>
                </div>

                {/* Linh Nhi mascot — top-right of map */}
                <div className="hero-map-marker top-[17%] left-[83%] right-auto w-[28%] max-w-[190px] animate-float pointer-events-none z-30">
                  <div className="relative mascot-glow">
                    <img
                      src="/linh-nhi-mascot.png"
                      alt="Linh Nhi — AI Mentor"
                      className="w-full h-auto drop-shadow-[0_26px_44px_rgba(33,77,59,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pillars" className="landing-section bg-[#fbf9f5]/50 border-t border-[#214D3B]/5">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="text-center landing-section-header">
            <h2 className="font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-1px] text-[#214D3B] font-semibold">Các trụ cột hành trình</h2>
            <p className="body-text text-[#5E625F] mt-3 max-w-xl mx-auto">Bốn hành trình cốt lõi giúp bạn khám phá, thấu hiểu và phát triển toàn diện.</p>
            <div className="w-16 h-0.5 bg-[#B68A2F]/40 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 lg:gap-x-6">
            {pillars.map(({ icon: Icon, title, desc, image, number, decor }) => (
              <article key={number} className="pillar-card group">
                <img
                  src={decor}
                  alt=""
                  aria-hidden="true"
                  className="pillar-decor pillar-decor--tl"
                  draggable={false}
                />
                <div className="pillar-icon">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="pillar-title">{title}</h3>
                <p className="pillar-desc">{desc}</p>
                <div className="pillar-image-wrap">
                  <img src={image} alt={title} className="pillar-image" draggable={false} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section — winding journey trail */}
      <section id="how-it-works" className="landing-section bg-white border-t border-[#214D3B]/5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="text-center landing-section-header">
            <h2 className="font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-1px] text-[#214D3B] font-semibold">Hành trình cùng SoulMap</h2>
            <p className="body-text text-[#5E625F] mt-3">Từng bước khám phá thế giới nội tâm sâu thẳm của bạn</p>
            <div className="w-16 h-0.5 bg-[#B68A2F]/40 mx-auto mt-4"></div>
          </div>

          <div className="journey-track">
            <svg
              className="journey-trail"
              viewBox="0 0 1000 130"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M 0 62 C 50 62 70 48 100 48 C 170 48 230 84 300 84 C 370 84 430 40 500 40 C 580 40 630 84 700 84 C 780 84 850 48 900 48 C 950 48 975 56 1000 56" />
            </svg>

            <img
              src="/journey/journey-start.png"
              alt=""
              aria-hidden="true"
              className="journey-decor journey-decor--start"
              draggable={false}
            />
            <img
              src="/journey/journey-goal.png"
              alt=""
              aria-hidden="true"
              className="journey-decor journey-decor--goal"
              draggable={false}
            />

            <div className="journey-steps">
              {journeySteps.map(({ n, title, desc, tag, tagIcon: TagIcon }) => (
                <div key={n} className="journey-step group">
                  <div className="journey-node-wrap">
                    <div className="journey-node">
                      <span className="journey-node-num">{n}</span>
                    </div>
                  </div>
                  <h4 className="journey-step-title">{title}</h4>
                  <p className="journey-step-desc">{desc}</p>
                  <span className="journey-chip">
                    <TagIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="journey-banner">
            <div className="journey-banner-icon">
              <Leaf className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div className="journey-banner-text">
              <p className="journey-banner-lead">Đây không chỉ là một hành trình, mà là một kết nối bền vững với chính bạn.</p>
              <p className="journey-banner-sub">SoulMap luôn ở đây, đồng hành cùng bạn trên mọi nẻo đường cuộc sống.</p>
            </div>
            <img
              src="/journey/journey-scenery.png"
              alt=""
              aria-hidden="true"
              className="journey-banner-scenery"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* Chat Demo Section — trò chuyện cùng Linh Nhi */}
      <section id="chat-demo" className="landing-section bg-[#fbf9f5]/60 border-t border-[#214D3B]/5">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">

            {/* LEFT — narrative */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.14em] text-[#B68A2F] mb-4">
                <Sparkles className="w-4 h-4" />
                Linh Nhi
              </span>
              <h2 className="font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-1px] text-[#214D3B] font-semibold">
                Trò chuyện cùng người<br className="hidden md:block" /> bạn đồng hành thấu cảm
              </h2>
              <p className="body-text text-[#5E625F] mt-5 max-w-lg mx-auto lg:mx-0">
                Linh Nhi không chỉ đọc bản đồ nội tâm của bạn, mà còn lắng nghe, thấu hiểu và dẫn dắt bạn qua từng ngã rẽ của sự nghiệp, tình yêu và cuộc đời — bất cứ khi nào bạn cần.
              </p>
              <div className="w-16 h-0.5 bg-[#B68A2F]/40 mx-auto lg:mx-0 mt-6"></div>
            </div>

            {/* RIGHT — simulated chat window */}
            <div className="glass-card rounded-3xl border border-[#214D3B]/8 shadow-lg flex flex-col overflow-hidden">

              {/* Chat Header */}
              <div className="px-6 py-4 bg-[#214D3B]/5 border-b border-[#214D3B]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#B68A2F]/40 bg-white overflow-hidden shadow-sm flex items-center justify-center p-0.5">
                    <img
                      src={LINH_NHI_AVATAR}
                      alt="Linh Nhi"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-display font-semibold text-sm text-[#214D3B]">Linh Nhi</h4>
                    <span className="flex items-center gap-1 text-[9px] font-sans text-emerald-700 font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Đang trực tuyến
                    </span>
                  </div>
                </div>

              </div>

              {/* Chat Messages Body */}
              <div className="p-6 flex flex-col gap-4 bg-white/20">
                {demoChat.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end flex-row-reverse text-right' : 'self-start text-left'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full border border-[#B68A2F]/30 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 mt-1">
                        <img
                          src={LINH_NHI_AVATAR}
                          alt="Linh Nhi"
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

                {/* Typing indicator */}
                <div className="flex items-start gap-3 self-start text-left max-w-[85%]">
                  <div className="w-8 h-8 rounded-full border border-[#B68A2F]/30 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 mt-1">
                    <img
                      src={LINH_NHI_AVATAR}
                      alt="Linh Nhi"
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
              </div>

              {/* Chat Input Footer (decorative) */}
              <div className="p-4 bg-white border-t border-[#214D3B]/10 flex gap-3 items-center">
                <div className="flex-grow bg-[#fbf9f5] border border-[#214D3B]/10 rounded-full px-5 py-3 text-sm font-sans text-[#636A64]/70 select-none">
                  Hỏi Linh Nhi bất kỳ điều gì về bản đồ của bạn...
                </div>
                <span className="w-12 h-12 rounded-full bg-[#214D3B] text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <Send className="w-5 h-5" />
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="landing-section bg-[#fbf9f5] border-t border-[#214D3B]/5">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="text-center landing-section-header">
            <h2 className="font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-1px] text-[#214D3B] font-semibold">Chia sẻ từ người lữ hành</h2>
            <div className="w-16 h-0.5 bg-[#B68A2F]/40 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass-card p-8 rounded-3xl text-left hover:border-[#214D3B]/20 transition-all duration-300 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex text-[#B68A2F] gap-0.5 mb-4">
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                </div>
                <p className="body-text text-[#636A64] italic mb-6">
                  &quot;SoulMap như một tấm gương soi chiếu thấu suốt tâm hồn. Những phản hồi từ AI Linh Nhi đã giúp tôi vượt qua cuộc khủng hoảng lựa chọn hướng đi công việc một cách thong dong hơn.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-[#214D3B]/5 pt-4">
                <img className="h-11 w-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" alt="Minh Thư" referrerPolicy="no-referrer" />
                <div>
                  <h5 className="font-display text-[#214D3B] font-semibold text-sm">Minh Thư</h5>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card p-8 rounded-3xl text-left hover:border-[#214D3B]/20 transition-all duration-300 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex text-[#B68A2F] gap-0.5 mb-4">
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                </div>
                <p className="body-text text-[#636A64] italic mb-6">
                  &quot;Tôi đặc biệt yêu thích sự kết hợp nhuần nhuyễn giữa phương pháp khoa học của phương Tây và huyền học năng lượng tinh tú phương Đông. Thiết kế giao diện thực sự sang trọng, tinh tế.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-[#214D3B]/5 pt-4">
                <img className="h-11 w-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" alt="Hoàng Long" referrerPolicy="no-referrer" />
                <div>
                  <h5 className="font-display text-[#214D3B] font-semibold text-sm">Hoàng Long</h5>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card p-8 rounded-3xl text-left hover:border-[#214D3B]/20 transition-all duration-300 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex text-[#B68A2F] gap-0.5 mb-4">
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                  <Star className="w-4 h-4 fill-[#B68A2F]" />
                </div>
                <p className="body-text text-[#636A64] italic mb-6">
                  &quot;AI Linh Nhi như một người bạn tri âm tri kỷ thầm lặng luôn túc trực lắng nghe. Cách tư vấn của Linh Nhi vô cùng ngọt ngào, thấu cảm, bám sát các phương pháp trị liệu tinh thần hiện đại.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-[#214D3B]/5 pt-4">
                <img className="h-11 w-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Khánh Vy" referrerPolicy="no-referrer" />
                <div>
                  <h5 className="font-display text-[#214D3B] font-semibold text-sm">Khánh Vy</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="w-full py-12 bg-[#214D3B] text-white mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1.5">
              <span className="w-9 h-9 rounded-xl bg-[#B68A2F]/15 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#B68A2F]" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-white">SoulMap</span>
                <span className="font-sans text-[10px] text-white/50 tracking-[0.12em] mt-1">Đồng hành • Thấu hiểu • Phát triển</span>
              </div>
            </div>
            <p className="text-xs text-white/60 font-sans">
              © 2026 SoulMap. Embark on your mystical journey to self-discovery.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-xs font-medium text-white/80">
            <a href="#" className="hover:text-[#B68A2F] transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-[#B68A2F] transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-[#B68A2F] transition-colors">Liên hệ hành trình</a>
            <a href="#" className="hover:text-[#B68A2F] transition-colors">Cẩm nang sức khỏe</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
