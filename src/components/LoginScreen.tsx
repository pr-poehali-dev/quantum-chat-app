import { useEffect, useRef } from 'react';
import { loginWithGoogle } from '@/lib/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'filled_blue',
              size: 'large',
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
              width: 280
            }
          );
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await loginWithGoogle(response.credential);
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-5xl mx-auto mb-6">
            ⚛️
          </div>
          <h1 className="text-4xl font-bold mb-2">Quantum Chat</h1>
          <p className="text-muted-foreground text-lg">
            Безопасный мессенджер для общения в реальном времени
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Добро пожаловать!</h2>
            <p className="text-sm text-muted-foreground text-center">
              Войдите с помощью Google, чтобы начать общение
            </p>
          </div>

          <div className="flex justify-center">
            <div ref={googleButtonRef}></div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Продолжая, вы соглашаетесь с использованием сквозного шифрования для защиты ваших сообщений
            </p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              🔒 Сквозное шифрование
            </span>
            <span className="flex items-center gap-2">
              ⚡ Мгновенная доставка
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
