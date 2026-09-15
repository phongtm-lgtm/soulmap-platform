import React, { useEffect, useRef } from 'react';
import { AlertCircle, ArrowLeft, Leaf, Loader2 } from 'lucide-react';

interface GoogleAuthScreenProps {
  authError: string;
  setAuthError: (error: string) => void;
  authSuccessMsg: string;
  setAuthSuccessMsg: (message: string) => void;
  isAuthLoading: boolean;
  setIsAuthLoading: (loading: boolean) => void;
  handleGoogleSignIn: (credential: string) => void;
  navigateToLanding: (direction?: 'push_back' | 'none') => void;
}

interface GooglePromptMomentNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          prompt: (listener?: (notification: GooglePromptMomentNotification) => void) => void;
        };
      };
    };
  }
}

export default function GoogleAuthScreen({
  authError,
  setAuthError,
  authSuccessMsg,
  setAuthSuccessMsg,
  isAuthLoading,
  setIsAuthLoading,
  handleGoogleSignIn,
  navigateToLanding,
}: GoogleAuthScreenProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleInitialized = useRef(false);

  useEffect(() => {
    if (!googleClientId) return;

    const initializeGoogle = () => {
      if (!window.google || googleInitialized.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => handleGoogleSignIn(credential),
      });
      googleInitialized.current = true;
    };

    const existingScript = document.getElementById('google-identity-services');
    if (existingScript) {
      initializeGoogle();
      existingScript.addEventListener('load', initializeGoogle);
      return () => existingScript.removeEventListener('load', initializeGoogle);
    }

    const script = document.createElement('script');
    script.id = 'google-identity-services';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);
    return () => script.removeEventListener('load', initializeGoogle);
  }, [googleClientId, handleGoogleSignIn]);

  const startGoogleSignIn = () => {
    setAuthError('');
    setAuthSuccessMsg('');

    if (!googleClientId) {
      setAuthError('Đăng nhập Google chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
      return;
    }
    if (!window.google || !googleInitialized.current) {
      setAuthError('Google đang được tải. Vui lòng thử lại sau giây lát.');
      return;
    }

    setIsAuthLoading(true);
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
        setIsAuthLoading(false);
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#F8F4EB]">
      <nav className="fixed top-0 z-50 h-20 w-full border-b border-[#E8DFCF]/70 bg-[#F8F4EB]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-6">
          <button onClick={() => navigateToLanding('push_back')} className="flex items-center gap-2 font-display text-2xl font-semibold text-[#214D3B]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#24533E]/7 text-[#35684D]"><Leaf className="w-5 h-5" /></span>
            SoulMap
          </button>
          <button onClick={() => navigateToLanding('push_back')} className="flex items-center gap-2 rounded-full border border-[#E8DFCF] px-5 py-2.5 text-xs font-semibold text-[#5E625F]">
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại trang chủ
          </button>
        </div>
      </nav>
      <main className="flex flex-grow items-center justify-center px-6 pb-20 pt-32">
        <div className="flex w-full max-w-md flex-col gap-6 rounded-[2.5rem] border border-[#E8DFCF] bg-[#FFFDF9] p-8 text-center shadow-2xl md:p-10">
          <div className="flex flex-col items-center gap-2 border-b border-[#E8DFCF]/50 pb-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B68A2F]/20 bg-[#B68A2F]/10 text-[#B68A2F]"><Leaf className="w-6 h-6" /></span>
            <h1 className="font-display text-3xl font-bold tracking-wide text-[#214D3B]">Chào Bạn Lữ Hành</h1>
            <p className="body-text-sm italic text-[#5E625F]">Đăng nhập bằng Google để lưu hành trình SoulMap của bạn.</p>
          </div>
          {authError && <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs font-medium text-red-700"><AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />{authError}</div>}
          {authSuccessMsg && <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-xs font-medium text-emerald-700"><Loader2 className="mt-0.5 w-4 h-4 shrink-0 animate-spin" />{authSuccessMsg}</div>}
          <button type="button" onClick={startGoogleSignIn} disabled={isAuthLoading} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E8DFCF] px-4 py-3 text-sm font-semibold text-[#214D3B] transition-colors hover:bg-[#35684D]/5 disabled:cursor-not-allowed disabled:opacity-60">
            <GoogleIcon />
            {isAuthLoading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
          </button>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 5.04c1.61 0 3.06.55 4.2 1.64l3.15-3.15C17.45 1.68 14.93 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.92-2.75 3.48-4.51 6.76-4.51z" /><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.45c-.28 1.48-1.11 2.74-2.36 3.58l3.66 2.84c2.14-1.98 3.38-4.89 3.38-8.57z" /><path fill="#FBBC05" d="M5.24 14.55c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.39 6.96C.5 8.74 0 10.74 0 12.8s.5 4.06 1.39 5.84l3.85-2.99z" /><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.11.74-2.52 1.18-4.3 1.18-3.28 0-5.84-1.76-6.76-4.51L1.39 16.8c1.98 3.89 5.96 6.56 10.61 6.56z" /></svg>;
}
