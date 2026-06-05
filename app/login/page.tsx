'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import { Play, Loader2, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const isVerify = searchParams.get('verify') === 'true';
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const authError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn('email', {
        email: email.trim().toLowerCase(),
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === 'AccessDenied') {
          setError('This email is not authorized. Ask your admin to add you.');
        } else {
          setError(`Email failed to send (${result.error}). Please check SMTP configuration in .env.`);
        }
      } else {
        setSent(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      {/* Background subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 pointer-events-none" />

      <div className="relative w-full max-w-[420px] animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-5">
            <Image src="/tiodevlogo.png" alt="AutoReel Logo" width={64} height={64} className="rounded-2xl shadow-lg object-cover" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-foreground)]">
            AutoReel Lite
          </h1>
          <p className="mt-2 text-[var(--color-muted-foreground)] text-[15px] leading-relaxed">
            Auto-post videos to Reels & Shorts
          </p>
        </div>

        {/* Card */}
        <div className="card-apple p-8">
          {isVerify || sent ? (
            /* Success / Verify state */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="text-[var(--color-muted-foreground)] text-[15px] leading-relaxed">
                We sent a magic link to{' '}
                <span className="font-medium text-[var(--color-foreground)]">
                  {email || 'your email'}
                </span>
                . Click the link to sign in.
              </p>
              <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-[13px] text-amber-700">
                  <strong>Dev mode:</strong> Check your terminal console for the magic link.
                </p>
              </div>
            </div>
          ) : (
            /* Login form */
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-1">Sign in</h2>
              <p className="text-[var(--color-muted-foreground)] text-sm mb-6">
                Enter your email to receive a magic link
              </p>

              {(error || authError) && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-[13px] text-red-600">
                    {error || (authError === 'AccessDenied'
                      ? 'This email is not authorized. Ask your admin to add you.'
                      : 'An error occurred. Please try again.')}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="input-apple"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-[15px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted-foreground)]">
            <Zap className="w-3.5 h-3.5" />
            <span>Powered by Tiodev</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-muted-foreground)]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
