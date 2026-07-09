import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import type { AppScreen } from '../types';

interface AuthScreenProps {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (password: string) => void;
  authConfirmPassword: string;
  setAuthConfirmPassword: (password: string) => void;
  authName: string;
  setAuthName: (name: string) => void;
  authError: string;
  setAuthError: (error: string) => void;
  authSuccessMsg: string;
  setAuthSuccessMsg: (msg: string) => void;
  isAuthLoading: boolean;
  setIsAuthLoading: (loading: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  agreeTerms: boolean;
  setAgreeTerms: (agree: boolean) => void;
  handleAuthSubmit: (e: React.FormEvent) => void;
  navigateToLanding: (direction?: 'push_back' | 'none') => void;
  setCurrentScreen: (screen: AppScreen) => void;
  setTransitionDirection: (direction: 'push' | 'push_back' | 'none') => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentUser: (user: { name: string; email: string } | null) => void;
}

export default function AuthScreen({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authConfirmPassword,
  setAuthConfirmPassword,
  authName,
  setAuthName,
  authError,
  setAuthError,
  authSuccessMsg,
  setAuthSuccessMsg,
  isAuthLoading,
  setIsAuthLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  agreeTerms,
  setAgreeTerms,
  handleAuthSubmit,
  navigateToLanding,
  setCurrentScreen,
  setTransitionDirection,
  setIsLoggedIn,
  setCurrentUser,
}: AuthScreenProps) {
  const router = useRouter();

  const goToJourneysAfterAuth = () => {
    setAuthSuccessMsg('');
    router.push('/journeys');
    setCurrentScreen('four_journeys');
    setTransitionDirection('push');
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#F8F4EB]">
      {/* Decorative background image blurred */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200" 
          alt="Starry Celestial Background" 
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4EB]/90 via-[#F8F4EB]/80 to-[#FFFDF9]/60 z-0 pointer-events-none"></div>
      {/* Subtle Warm Sunlight glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-[#B68A2F]/10 via-[#B68A2F]/3 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#35684D]/8 via-[#35684D]/2 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#F8F4EB]/80 backdrop-blur-md border-b border-[#E8DFCF] h-20">
        <div className="flex justify-between items-center h-full px-6 max-w-[1200px] mx-auto w-full">
          <div className="font-display text-2xl font-semibold text-[#214D3B] flex items-center gap-2 cursor-pointer" onClick={() => navigateToLanding('push_back')}>
            <span className="material-symbols-outlined text-[#B68A2F] text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <span className="tracking-wide">SoulMap</span>
          </div>
          <button 
            onClick={() => navigateToLanding('push_back')}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#E8DFCF] rounded-full font-sans font-semibold text-xs text-[#5E625F] hover:bg-[#35684D]/5 hover:text-[#214D3B] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại trang chủ
          </button>
        </div>
      </nav>

      {/* Main Auth Form Container */}
      <main className="flex-grow pt-32 pb-20 px-6 w-full flex items-center justify-center relative z-10">
        <div className="w-full max-w-md bg-[#FFFDF9] border border-[#E8DFCF] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col gap-6 text-left animate-fade-in">
          {/* Decorative top-right golden crest */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B68A2F]/5 to-transparent rounded-full pointer-events-none"></div>

          {/* Header and Branding */}
          <div className="text-center flex flex-col items-center gap-2 border-b border-[#E8DFCF]/50 pb-5">
            <div className="w-12 h-12 rounded-full bg-[#B68A2F]/10 border border-[#B68A2F]/20 flex items-center justify-center text-[#B68A2F] mb-1">
              <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-[#214D3B] tracking-wide">
              {authMode === 'login' ? 'Chào Bạn Lữ Hành' : 'Khởi Tạo Hành Trình'}
            </h1>
            <p className="body-text-sm text-[#5E625F] italic">
              {authMode === 'login' 
                ? 'Đăng nhập để thấu suốt bản đồ nội tâm của bạn.' 
                : 'Đăng ký tài khoản để bắt đầu hành trình tự sự tâm hồn.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#F8F4EB] p-1 rounded-full border border-[#E8DFCF] relative">
            <button 
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
                setAuthSuccessMsg('');
              }}
              className={`flex-1 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-[#35684D] text-[#FFFDF9] shadow-md' 
                  : 'text-[#5E625F] hover:text-[#214D3B]'
              }`}
            >
              Đăng nhập
            </button>
            <button 
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
                setAuthSuccessMsg('');
              }}
              className={`flex-1 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 cursor-pointer ${
                authMode === 'register' 
                  ? 'bg-[#35684D] text-[#FFFDF9] shadow-md' 
                  : 'text-[#5E625F] hover:text-[#214D3B]'
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {/* Error & Success Messages */}
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-sans font-medium flex items-start gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              <span>{authError}</span>
            </div>
          )}
          {authSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-xs font-sans font-medium flex items-start gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5 animate-spin">autorenew</span>
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Interactive Form */}
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            
            {/* Full name input (Only in register mode) */}
            {authMode === 'register' && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="font-sans text-xs font-bold text-[#214D3B] uppercase tracking-wider">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-[#5E625F]/50" />
                  </div>
                  <input 
                    type="text"
                    required
                    disabled={isAuthLoading}
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#FFFDF9] border border-[#E8DFCF] hover:border-[#B68A2F]/50 focus:border-[#35684D] focus:ring-2 focus:ring-[#35684D]/10 rounded-2xl py-3 pl-11 pr-4 font-sans text-sm text-[#214D3B] transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-bold text-[#214D3B] uppercase tracking-wider">Địa chỉ email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#5E625F]/50" />
                </div>
                <input 
                  type="email"
                  required
                  disabled={isAuthLoading}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="luhanh@soulmap.vn"
                  className="w-full bg-[#FFFDF9] border border-[#E8DFCF] hover:border-[#B68A2F]/50 focus:border-[#35684D] focus:ring-2 focus:ring-[#35684D]/10 rounded-2xl py-3 pl-11 pr-4 font-sans text-sm text-[#214D3B] transition-all outline-none"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-sans text-xs font-bold text-[#214D3B] uppercase tracking-wider">Mật khẩu</label>
                {authMode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setAuthError('Tính năng quên mật khẩu đang được liên kết chòm sao hộ mệnh của bạn! Vui lòng liên hệ Linh Nhi.')}
                    className="text-[11px] font-sans font-semibold text-[#B68A2F] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#5E625F]/50" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isAuthLoading}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFFDF9] border border-[#E8DFCF] hover:border-[#B68A2F]/50 focus:border-[#35684D] focus:ring-2 focus:ring-[#35684D]/10 rounded-2xl py-3 pl-11 pr-10 font-sans text-sm text-[#214D3B] transition-all outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5E625F]/50 hover:text-[#214D3B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input (Only in register mode) */}
            {authMode === 'register' && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="font-sans text-xs font-bold text-[#214D3B] uppercase tracking-wider">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-[#5E625F]/50" />
                  </div>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    disabled={isAuthLoading}
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FFFDF9] border border-[#E8DFCF] hover:border-[#B68A2F]/50 focus:border-[#35684D] focus:ring-2 focus:ring-[#35684D]/10 rounded-2xl py-3 pl-11 pr-10 font-sans text-sm text-[#214D3B] transition-all outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5E625F]/50 hover:text-[#214D3B] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Terms and Conditions checkbox (Only in register mode) */}
            {authMode === 'register' && (
              <label className="flex items-start gap-2.5 mt-1 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  disabled={isAuthLoading}
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E8DFCF] text-[#35684D] focus:ring-[#35684D]/20 cursor-pointer"
                />
                <span className="font-sans text-xs text-[#5E625F] leading-tight text-left">
                  Tôi đồng ý với <strong className="text-[#214D3B] hover:underline">Điều khoản dịch vụ</strong> và <strong className="text-[#214D3B] hover:underline">Chính sách bảo mật</strong> của SoulMap.
                </span>
              </label>
            )}

            {/* Submit button with magical cosmic loading states */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-[#35684D] hover:bg-[#214D3B] text-[#FFFDF9] disabled:opacity-75 py-3.5 rounded-full font-sans font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#35684D]/15 cursor-pointer mt-2"
            >
              {isAuthLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFFDF9] border-t-transparent rounded-full animate-spin"></div>
                  {authMode === 'login' ? 'Đang thấu suốt tinh tú...' : 'Đang dệt sơ đồ mệnh...'}
                </>
              ) : (
                <>
                  {authMode === 'login' ? 'Đăng nhập vào SoulMap' : 'Khởi tạo SoulMap của tôi'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest or Skip Mode Option */}
          <div className="flex flex-col items-center gap-4 border-t border-[#E8DFCF]/50 pt-5">
            <span className="font-sans text-[11px] text-[#5E625F]/50 uppercase tracking-widest font-bold">Hoặc tiếp tục với</span>
            
            {/* Social Login Icons Grid */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <button 
                type="button"
                onClick={() => {
                  setIsAuthLoading(true);
                  setAuthError('');
                  setTimeout(() => {
                    setIsAuthLoading(false);
                    const userObj = { name: 'Google Explorer', email: 'explorer@google.com' };
                    localStorage.setItem('soulmap_logged_in', 'true');
                    localStorage.setItem('soulmap_user', JSON.stringify(userObj));
                    setIsLoggedIn(true);
                    setCurrentUser(userObj);
                    setAuthSuccessMsg('Đăng nhập bằng Google thành công!');
                    setTimeout(() => {
                      goToJourneysAfterAuth();
                    }, 1200);
                  }, 1500);
                }}
                className="flex items-center justify-center py-2.5 px-4 border border-[#E8DFCF] hover:border-[#B68A2F]/50 bg-[#FFFDF9] rounded-2xl hover:bg-[#35684D]/5 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.61 0 3.06.55 4.2 1.64l3.15-3.15C17.45 1.68 14.93 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.92-2.75 3.48-4.51 6.76-4.51z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.45c-.28 1.48-1.11 2.74-2.36 3.58l3.66 2.84c2.14-1.98 3.38-4.89 3.38-8.57z"/>
                  <path fill="#FBBC05" d="M5.24 14.55c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.39 6.96C.5 8.74 0 10.74 0 12.8s.5 4.06 1.39 5.84l3.85-2.99z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.11.74-2.52 1.18-4.3 1.18-3.28 0-5.84-1.76-6.76-4.51L1.39 16.8c1.98 3.89 5.96 6.56 10.61 6.56z"/>
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsAuthLoading(true);
                  setAuthError('');
                  setTimeout(() => {
                    setIsAuthLoading(false);
                    const userObj = { name: 'Apple Explorer', email: 'explorer@apple.com' };
                    localStorage.setItem('soulmap_logged_in', 'true');
                    localStorage.setItem('soulmap_user', JSON.stringify(userObj));
                    setIsLoggedIn(true);
                    setCurrentUser(userObj);
                    setAuthSuccessMsg('Đăng nhập bằng Apple thành công!');
                    setTimeout(() => {
                      goToJourneysAfterAuth();
                    }, 1200);
                  }, 1500);
                }}
                className="flex items-center justify-center py-2.5 px-4 border border-[#E8DFCF] hover:border-[#B68A2F]/50 bg-[#FFFDF9] rounded-2xl hover:bg-[#35684D]/5 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.05 0-1.39-.63-2.59-.63-1.22 0-1.59.61-2.59.65-1.03.04-2.22-.99-3.21-1.95-2.02-1.96-3.56-5.54-3.56-8.9 0-5.32 3.46-8.15 6.87-8.15 1.08 0 2.1.67 2.76.67.65 0 1.89-.81 3.2-.81 1.37 0 2.63.49 3.46 1.45-1.73 1.04-2.89 2.94-2.89 5.2 0 2.77 1.54 4.58 3.63 5.44-1.22 3.44-4.22 6.8-5.7 6.8zm-2.89-18.17c1.33-1.61 2.22-3.85 1.97-6.11-1.95.08-4.32 1.3-5.72 2.93-1.2 1.39-2.25 3.67-1.96 5.88 2.18.17 4.38-1.09 5.71-2.7z"/>
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsAuthLoading(true);
                  setAuthError('');
                  setTimeout(() => {
                    setIsAuthLoading(false);
                    const userObj = { name: 'Facebook Explorer', email: 'explorer@facebook.com' };
                    localStorage.setItem('soulmap_logged_in', 'true');
                    localStorage.setItem('soulmap_user', JSON.stringify(userObj));
                    setIsLoggedIn(true);
                    setCurrentUser(userObj);
                    setAuthSuccessMsg('Đăng nhập bằng Facebook thành công!');
                    setTimeout(() => {
                      goToJourneysAfterAuth();
                    }, 1200);
                  }, 1500);
                }}
                className="flex items-center justify-center py-2.5 px-4 border border-[#E8DFCF] hover:border-[#B68A2F]/50 bg-[#FFFDF9] rounded-2xl hover:bg-[#35684D]/5 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            {/* Continue as Guest button */}
            <button 
              type="button"
              onClick={() => {
                setCurrentScreen('landing');
                setTransitionDirection('push_back');
              }}
              className="font-sans text-xs font-bold text-[#35684D] hover:text-[#214D3B] hover:underline cursor-pointer bg-transparent border-none outline-none"
            >
              Tiếp tục trải nghiệm ẩn danh
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
