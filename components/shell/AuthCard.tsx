'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  KeyRound,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TabBar } from './TabBar';
import { TabItem } from './types';

export interface AuthCardProps {
  redirectUrl?: string;
  className?: string;
}

export function AuthCard({ redirectUrl, className = '' }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetRedirect = redirectUrl || searchParams.get('redirect') || '/chat';

  const {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signOutUser,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const authTabs: TabItem[] = [
    { id: 'signin', label: 'Sign In' },
    { id: 'signup', label: 'Create Account' },
    { id: 'forgot', label: 'Reset' },
  ];

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
      router.push(targetRedirect);
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        setIsUnauthorizedDomain(true);
        setErrorMsg('دامنه این سایت در لیست دامنه‌های مجاز فایربیس ثبت نشده است.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        setErrorMsg('ورود با گوگل در کنسول فایربیس فعال نشده است.');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setIsOperationNotAllowed(false);
      setIsUnauthorizedDomain(false);

      if (mode === 'forgot') {
        await sendPasswordReset(email.trim());
        setSuccessMsg('Password reset link sent to your email! Please check your inbox.');
        return;
      }

      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
        router.push(targetRedirect);
      } else {
        await signUpWithEmail(email.trim(), password, name.trim() || undefined);
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push(targetRedirect);
        }, 800);
      }
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        setErrorMsg('روش احراز هویت در کنسول فایربیس فعال نشده است.');
      } else {
        let msg = err?.message || 'Authentication error';
        if (
          err?.code === 'auth/invalid-credential' ||
          err?.code === 'auth/wrong-password' ||
          err?.code === 'auth/user-not-found'
        ) {
          msg = 'Invalid email or password.';
        } else if (err?.code === 'auth/email-already-in-use') {
          msg = 'An account with this email already exists.';
        } else if (err?.code === 'auth/weak-password') {
          msg = 'Password must be at least 6 characters.';
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
      <div
        className={`max-w-md w-full mx-auto p-6 sm:p-8 rounded-[32px] bg-zinc-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl text-center space-y-6 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-white font-bold text-xl overflow-hidden">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
          )}
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
            onClick={() => router.push(targetRedirect)}
            className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Chat Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => signOutUser()}
            className="w-full py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  const currentDomain =
    typeof window !== 'undefined' ? window.location.hostname : 'qutonbot.vercel.app';

  return (
    <div
      className={`max-w-md w-full mx-auto p-6 sm:p-8 rounded-[32px] bg-zinc-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6 ${className}`}
    >
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex justify-center">
          <BrandMark theme="dark" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {mode === 'signin'
            ? 'Sign in to Quton'
            : mode === 'signup'
            ? 'Create an Account'
            : 'Reset Your Password'}
        </h1>
        <p className="text-xs text-zinc-400">
          {mode === 'forgot'
            ? 'Enter your email to receive a password reset link'
            : 'Access high-speed inference, split arena, and saved workflows'}
        </p>
      </div>

      {/* Mode Switcher TabBar */}
      <div className="flex justify-center">
        <TabBar
          tabs={authTabs}
          activeTab={mode}
          onChange={(tab) => {
            setMode(tab as any);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          size="sm"
          variant="segmented"
          layoutIdPrefix="auth-card-mode"
          className="w-full justify-around"
        />
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>

          {/* Unauthorized Domain Guide */}
          {isUnauthorizedDomain && (
            <div className="pt-2 border-t border-zinc-800 space-y-2 text-zinc-300">
              <span className="font-semibold text-white block text-[11px]">
                افزودن دامنه در کنسول فایربیس:
              </span>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <code className="font-mono text-[11px] text-zinc-200">{currentDomain}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentDomain)}
                  className="inline-flex items-center gap-1 text-[11px] text-white hover:underline cursor-pointer"
                >
                  {copiedDomain === currentDomain ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedDomain === currentDomain ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google OAuth (only for signin and signup) */}
      {mode !== 'forgot' && (
        <>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-white font-medium text-xs sm:text-sm transition flex items-center justify-center gap-3 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887C18.2 16.48 15.61 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.65 0 3.03.63 4.155 1.635l3.12-3.12C17.58 2.76 15.12 2 12.24 2 6.72 2 2.24 6.48 2.24 12s4.48 10 10 10c5.76 0 9.6-4.05 9.6-9.765 0-.69-.06-1.35-.18-1.95H12.24z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-zinc-800" />
            <span className="text-[11px] font-mono text-zinc-500 uppercase">or with email</span>
            <div className="flex-1 h-[1px] bg-zinc-800" />
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
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

        {mode !== 'forgot' && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-zinc-400 font-medium">Password</label>
              {mode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                >
                  Forgot?
                </button>
              ) : (
                <span className="text-zinc-500 text-[11px]">Min. 6 chars</span>
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
        )}

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
          ) : mode === 'signup' ? (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              <span>Send Reset Instructions</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
