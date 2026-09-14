'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { ScopedHomePresentation } from '@/components/home';

export default function LandingPortalPage() {
  const router = useRouter();

  const handleLaunchChat = (promptText?: string, modeOverride?: string) => {
    const text = (promptText || '').trim();
    const mode = modeOverride || 'default';

    if (mode === 'compare') {
      router.push(`/arena${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }
    if (mode === 'voice') {
      router.push(`/voice${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }

    const reasoningParam = mode === 'reasoning' ? '&reasoning=true' : '';

    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}${reasoningParam}`);
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="bg-black h-[100dvh] w-full text-white relative overflow-hidden">
      {/* Interactive Background Ripple Matrix */}
      <BackgroundRippleEffect rows={10} cols={30} cellSize={54} />

      {/* Scope-by-Scope Animated Fullpage Presentation */}
      <ScopedHomePresentation onLaunchChat={handleLaunchChat} />
    </div>
  );
}

