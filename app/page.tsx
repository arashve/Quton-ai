'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shell';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { HeroPromptSection, CustomWorkspaceSection } from '@/components/home';

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
    <div className="bg-black min-h-screen w-full text-white relative overflow-x-clip">
      {/* Interactive Background Ripple Matrix */}
      <BackgroundRippleEffect rows={12} cols={32} cellSize={54} />

      <PageContainer variant="public" maxWidth="xl">
        {/* Section 1: AI Prompt Input & Conversation Core */}
        <HeroPromptSection onLaunchChat={handleLaunchChat} />

        {/* Section 2: Exact Custom Workspace Section from User Design */}
        <CustomWorkspaceSection />
      </PageContainer>
    </div>
  );
}


