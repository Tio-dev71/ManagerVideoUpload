'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const result = await signIn('credentials', {
        email: normalizedEmail,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error(t('auth.login.error_credentials'));
        setLoading(false);
      } else if (result?.ok) {
        toast.success(t('auth.login.success'));
        window.location.href = callbackUrl;
      }
    } catch {
      toast.error(t('auth.login.error_generic'));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast.error(t('auth.login.error_google'));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-5 group">
          <Image 
            src="/Topify-logo.png" 
            alt="Topify Logo" 
            width={300} 
            height={80} 
            className="h-16 w-auto object-contain" 
            priority
          />
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
          {t('auth.login.title')}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          {t('auth.login.or')}{" "}
          <Link href="/register" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
            {t('auth.login.register_link')}
          </Link>
        </p>
      </div>

      <div className="card-apple p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorParam && (
            <div className="rounded-lg bg-[var(--color-error-soft)] p-3 text-sm font-medium text-[var(--color-error)] text-center">
              {errorParam === 'AccessDenied'
                ? t('auth.login.error_access')
                : t('auth.login.error_auth')}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-foreground)]">
              {t('auth.login.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="input-apple"
              required
              disabled={loading || googleLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-foreground)]">
                {t('auth.login.password')}
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                {t('auth.login.forgot_password', { defaultValue: 'Quên mật khẩu?' })}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-apple"
              disabled={loading || googleLoading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || !email.trim() || !password.trim()}
            className="btn-primary w-full flex justify-center items-center gap-2 mt-6 py-2.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('auth.login.submitting')}
              </>
            ) : (
              t('auth.login.submit')
            )}
          </button>
        </form>

        <div className="relative mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--color-card)] px-2 text-[var(--color-muted-foreground)]">{t('auth.login.or_continue')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="btn-secondary w-full flex justify-center items-center gap-2 py-2.5"
        >
          {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
          )}
          Google
        </button>

        <div className="mt-6 flex justify-center border-t border-[var(--color-border)] pt-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('auth.login.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="fixed inset-0 bg-gradient-to-br from-[#5B3DF5]/10 via-transparent to-[#5B3DF5]/5 pointer-events-none" />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          <p className="text-sm text-[var(--color-muted-foreground)]">{t('auth.login.loading')}</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
