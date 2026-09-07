'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/shell';

function AuthPageContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/chat';
  const paramMode = searchParams.get('mode');
  const initialMode: 'signin' | 'signup' | 'forgot' =
    paramMode === 'signup' || paramMode === 'forgot' ? paramMode : 'signin';

  return <AuthCard redirectUrl={redirectUrl} initialMode={initialMode} />;
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-xs text-zinc-500 font-mono">
          Loading Authentication Shell...
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
