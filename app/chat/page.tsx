'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Chat } from '@/components/Chat';
import { Sparkles, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ChatWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const initialPrompt = searchParams.get('q') || searchParams.get('prompt') || undefined;
  const initialAgent = searchParams.get('agent') || undefined;

  // Enforce authentication to launch Chatbot
  useEffect(() => {
    if (!loading && !user) {
      let target = '/chat';
      const params = new URLSearchParams();
      if (initialPrompt) params.set('q', initialPrompt);
      if (initialAgent) params.set('agent', initialAgent);
      const qs = params.toString();
      if (qs) target += `?${qs}`;
      router.replace(`/auth?redirect=${encodeURIComponent(target)}`);
    }
  }, [user, loading, router, initialPrompt, initialAgent]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white font-mono text-xs">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900 shadow-xl">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Verifying Studio Credentials...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const target = initialPrompt ? `/chat?q=${encodeURIComponent(initialPrompt)}` : '/chat';
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
        <div className="max-w-sm w-full p-8 rounded-[32px] bg-zinc-900/90 border border-zinc-800 shadow-2xl text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-zinc-800 text-white mx-auto flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Authentication Required</h2>
            <p className="text-xs text-zinc-400 mt-1.5">
              You must sign in to your account before launching the Chat Studio.
            </p>
          </div>
          <Link
            href={`/auth?redirect=${encodeURIComponent(target)}`}
            className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative w-full h-screen overflow-hidden bg-[var(--page-bg)] transition-colors duration-200">
      <Chat initialPrompt={initialPrompt} initialAgent={initialAgent} />
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white font-mono text-xs">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Connecting to AUTOFLOW Engine...</span>
          </div>
        </div>
      }
    >
      <ChatWorkspace />
    </Suspense>
  );
}
