import React from 'react';
import { 
  Compass, 
  Trophy, 
  BookOpen, 
  Users, 
  Zap, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User,
  Leaf,
} from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  currentUser: { name: string; email: string } | null;
  handleLogout: () => void;
  navigateToLanding: (direction?: 'push_back' | 'none') => void;
  navigateToAssessment: (direction?: 'push' | 'none') => void;
  setCurrentScreen: (screen: 'landing' | 'assessment' | 'result' | 'auth') => void;
  setTransitionDirection: (direction: 'push' | 'push_back' | 'none') => void;
}

export default function Navbar({
  isLoggedIn,
  currentUser,
  handleLogout,
  navigateToLanding,
  navigateToAssessment,
  setCurrentScreen,
  setTransitionDirection,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F8F4EB]/90 backdrop-blur-xl border-b border-[#E8DFCF]/70 shadow-[0_1px_0_rgba(232,223,207,0.6)] h-20 transition-all duration-300">
      <div className="flex justify-between items-center h-full px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => navigateToLanding('none')}
        >
          <span className="w-10 h-10 rounded-2xl bg-[#24533E]/7 flex items-center justify-center text-[#35684D] group-hover:scale-105 group-hover:bg-[#24533E]/10 transition-all duration-300">
            <Leaf className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[#24533E] text-[26px] font-bold tracking-[-0.03em]">SoulMap</span>
            <span className="hidden sm:block brand-slogan mt-1.5">
              Đồng hành <span className="brand-slogan-sep">✦</span> Thấu hiểu <span className="brand-slogan-sep">✦</span> Phát triển
            </span>
          </div>
        </div>
        
        {/* Menu Items / Active Tabs (Desktop Only) */}
        <div className="hidden md:flex items-center gap-1">
          {/* Active Tab: SoulMap */}
          <button 
            onClick={() => navigateToLanding('none')}
            className="px-4 py-2 rounded-full flex items-center gap-2 font-sans text-[13px] font-semibold text-[#24533E] bg-[#FFFDF8] border border-[#E8DFCF] shadow-sm hover:border-[#B68A2F]/40 transition-all duration-300 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#B68A2F]" />
            <span>SoulMap</span>
          </button>

          {/* Plain Tab: AI Mentor */}
          <button 
            onClick={() => {
              if (!isLoggedIn) {
                setTransitionDirection('push');
                setCurrentScreen('auth');
              } else {
                navigateToAssessment('push');
              }
            }}
            className="group flex items-center gap-2 px-4 py-2 rounded-full font-sans text-[13px] font-semibold text-[#5E625F] hover:text-[#24533E] hover:bg-[#24533E]/5 transition-all duration-300 cursor-pointer bg-transparent border-none outline-none"
          >
            <Trophy className="w-4 h-4 text-[#8C928D] group-hover:text-[#B68A2F] transition-colors" />
            <span>AI Mentor</span>
          </button>

          {/* Plain Tab: Journal */}
          <button 
            onClick={() => {
              if (!isLoggedIn) {
                setTransitionDirection('push');
                setCurrentScreen('auth');
              } else {
                navigateToAssessment('push');
              }
            }}
            className="group flex items-center gap-2 px-4 py-2 rounded-full font-sans text-[13px] font-semibold text-[#5E625F] hover:text-[#24533E] hover:bg-[#24533E]/5 transition-all duration-300 cursor-pointer bg-transparent border-none outline-none"
          >
            <BookOpen className="w-4 h-4 text-[#8C928D] group-hover:text-[#B68A2F] transition-colors" />
            <span>Journal</span>
          </button>

          {/* Plain Tab: Community */}
          <a 
            href="#testimonials"
            className="group flex items-center gap-2 px-4 py-2 rounded-full font-sans text-[13px] font-semibold text-[#5E625F] hover:text-[#24533E] hover:bg-[#24533E]/5 transition-all duration-300 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#8C928D] group-hover:text-[#B68A2F] transition-colors" />
            <span>Community</span>
          </a>
        </div>

        {/* Right Section: Profile / Login CTA */}
        <div className="flex items-center gap-4">
          {/* Soul Energy + notifications — only for signed-in travelers */}
          {isLoggedIn && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#B68A2F] fill-[#B68A2F] drop-shadow-[0_2px_4px_rgba(182,138,47,0.25)]" />
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-sans text-xs font-bold text-[#24533E]">1,250</span>
                  <span className="font-sans text-[9px] text-[#8C928D] font-medium tracking-wide">Soul Energy</span>
                </div>
              </div>
              <span className="h-5 w-px bg-[#E8DFCF] hidden sm:inline"></span>
              <div className="relative cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300">
                <Bell className="w-5 h-5 text-[#B68A2F]" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#B68A2F] rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-[#F8F4EB]">
                  8
                </span>
              </div>
              <span className="h-5 w-px bg-[#E8DFCF]"></span>
            </>
          )}

          {/* User Profile dropdown */}
          {isLoggedIn && currentUser ? (
            <div className="relative group">
              <button className="flex items-center gap-2 hover:opacity-85 transition-all duration-300 active:scale-95 cursor-pointer bg-transparent border-none outline-none">
                <div className="w-8 h-8 rounded-full bg-[#B68A2F]/10 border border-[#B68A2F]/30 flex items-center justify-center font-bold text-sm text-[#B68A2F] overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" 
                    alt={currentUser.name} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <span className="font-sans text-xs font-bold text-[#214D3B] max-w-[100px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#214D3B]/60 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#214D3B]/10 rounded-2xl shadow-xl py-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 origin-top-right">
                <div className="px-4 py-2 border-b border-[#214D3B]/5 mb-1 text-left">
                  <p className="text-[10px] font-bold text-[#B68A2F] uppercase tracking-wider">Người lữ hành</p>
                  <p className="font-sans text-xs font-bold text-[#214D3B] truncate">{currentUser.name}</p>
                  <p className="font-sans text-[10px] text-[#636A64] truncate">{currentUser.email}</p>
                </div>
                <button 
                  onClick={() => navigateToAssessment('push')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#214D3B] hover:bg-[#214D3B]/5 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none outline-none"
                >
                  <Compass className="w-3.5 h-3.5 text-[#B68A2F]" />
                  Bắt đầu bài test
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none outline-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTransitionDirection('push');
                  setCurrentScreen('auth');
                }}
                className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-[#FFFDF8] px-5 py-2.5 rounded-full bg-[#24533E] shadow-[0_8px_20px_-8px_rgba(33,77,59,0.5)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-8px_rgba(33,77,59,0.55)] active:translate-y-0 transition-all duration-300 cursor-pointer border-none outline-none"
              >
                <User className="w-4 h-4" />
                Đăng Nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
