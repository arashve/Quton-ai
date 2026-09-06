'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chat } from '@/components/Chat';

function ChatWorkspace() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('q') || searchParams.get('prompt') || undefined;

  return (
    <main className="min-h-[100dvh] relative w-full h-[100dvh] overflow-hidden bg-[var(--page-bg)] transition-colors duration-200">
      <Chat initialPrompt={initialPrompt} />
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] w-full flex items-center justify-center bg-zinc-950 text-white font-mono text-xs">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>Connecting to AUTOFLOW Engine...</span>
          </div>
        </div>
      }
    >
      <ChatWorkspace />
    </Suspense>
  );
}
