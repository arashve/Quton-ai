'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Navbar12, Mobile3 } from '@/components/reactbits';
import {
  Sparkles,
  ArrowLeft,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/chat';

  const {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedDomain(text);
      setTimeout(() => setCopiedDomain(null), 2500);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setIsOperationNotAllowed(false);
      setIsUnauthorizedDomain(false);
      await signInWithGoogle();
      router.push(redirectUrl);
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        setIsUnauthorizedDomain(true);
        setErrorMsg(
          'دامنه این سایت در لیست دامنه‌های مجاز پروژه فایربیس ثبت نشده است.'
        );
      } else if (err?.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        setErrorMsg(
          'ورود با گوگل در کنسول فایربیس (بخش Authentication > Sign-in method) هنوز فعال نشده است.'
        );
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setIsOperationNotAllowed(false);
      setIsUnauthorizedDomain(false);
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        router.push(redirectUrl);
      } else {
        await signUpWithEmail(email, password, name.trim() || undefined);
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      }
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        setErrorMsg(
          'روش Email/Password در کنسول فایربیس فعال نشده است. لطفاً آن را در کنسول فایربیس فعال کنید.'
        );
      } else {
        let msg = err?.message || 'Authentication failed';
        if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
          msg = 'Invalid email or password.';
        } else if (err?.code === 'auth/email-already-in-use') {
          msg = 'An account with this email already exists.';
        } else if (err?.code === 'auth/weak-password') {
          msg = 'Password should be at least 6 characters.';
        }
        setErrorMsg(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated
  if (user && !loading) {
    return (
      <div className="max-w-md w-full mx-auto p-6 sm:p-8 rounded-[32px] bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-white font-bold text-xl overflow-hidden">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
          )}
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Authenticated</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {user.displayName || 'Welcome Back'}
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">{user.email}</p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => router.push(redirectUrl)}
            className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Chat Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => signOutUser()}
            className="w-full py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'qutonbot.vercel.app';

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Auth Card */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-white text-zinc-950 mx-auto flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-zinc-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === 'signin' ? 'Sign in to AUTOFLOW' : 'Create an Account'}
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in with your Google account or email to access your Studio and manage models.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setIsOperationNotAllowed(false);
              setIsUnauthorizedDomain(false);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setIsOperationNotAllowed(false);
              setIsUnauthorizedDomain(false);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>

            {/* Unauthorized Domain Guide */}
            {isUnauthorizedDomain && (
              <div className="pt-2.5 border-t border-zinc-800 space-y-2.5 text-zinc-300">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <span className="font-semibold text-white block">راه‌اندازی دامنه‌های مجاز در فایربیس:</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    برای فعال شدن ورود با گوگل، باید دو دامنه زیر در کنسول فایربیس اضافه شوند:
                  </p>
                  
                  {/* Vercel Domain */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                    <code className="font-mono text-[11px] text-zinc-200">qutonbot.vercel.app</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('qutonbot.vercel.app')}
                      className="inline-flex items-center gap-1 text-[11px] text-white hover:underline cursor-pointer shrink-0 font-sans"
                    >
                      {copiedDomain === 'qutonbot.vercel.app' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>کپی</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Current runtime domain if different */}
                  {currentDomain !== 'qutonbot.vercel.app' && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                      <code className="font-mono text-[11px] text-zinc-200 break-all">{currentDomain}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentDomain)}
                        className="inline-flex items-center gap-1 text-[11px] text-white hover:underline cursor-pointer shrink-0 font-sans"
                      >
                        {copiedDomain === currentDomain ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-400 leading-normal">
                    مسیر: <span className="text-zinc-200 font-mono">Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains &gt; Add domain</span>
                  </p>
                </div>
              </div>
            )}

            {/* Operation Not Allowed Guide */}
            {isOperationNotAllowed && (
              <div className="pt-2.5 border-t border-zinc-800 space-y-1 text-[11px] text-zinc-400">
                <p className="text-white font-medium">فعال‌سازی در کنسول فایربیس:</p>
                <p>
                  به مسیر <span className="font-mono text-zinc-200">Firebase Console &gt; Authentication &gt; Sign-in method</span> بروید و روش‌های <strong>Google</strong> و <strong>Email/Password</strong> را فعال (Enable) کنید.
                </p>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Real Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-white font-medium text-xs sm:text-sm transition flex items-center justify-center gap-3 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {/* Flat monochrome Google vector icon */}
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.887C18.2 16.48 15.61 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.65 0 3.03.63 4.155 1.635l3.12-3.12C17.58 2.76 15.12 2 12.24 2 6.72 2 2.24 6.48 2.24 12s4.48 10 10 10c5.76 0 9.6-4.05 9.6-9.765 0-.69-.06-1.35-.18-1.95H12.24z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase">or with email</span>
          <div className="flex-1 h-[1px] bg-zinc-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Your Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-zinc-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-zinc-400 font-medium">Password</label>
              {mode === 'signup' && (
                <span className="text-zinc-500 text-[11px]">Min. 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
            ) : mode === 'signin' ? (
              <>
                <span>Sign In with Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-[100dvh] relative w-full overflow-x-hidden bg-zinc-950 text-zinc-100 selection:bg-zinc-800 flex flex-col justify-between pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-[calc(env(safe-area-inset-bottom)+3rem)]">
      {/* 1. Desktop Navbar-12 */}
      <Navbar12 />

      {/* Background Subtle Monochrome Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </Link>
        </div>

        <Suspense fallback={<div className="text-zinc-500 text-xs">Loading Auth...</div>}>
          <AuthContent />
        </Suspense>
      </main>

      {/* Floating Mobile Dock */}
      <Mobile3 />
    </div>
  );
}
