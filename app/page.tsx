'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shell';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import {
  HeroPromptSection,
  BentoFeaturesSection,
  ModelBenchmarkMatrix,
  HomeCtaSection,
  HomeFooter,
} from '@/components/home';

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
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Subtle Figma Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* Aceternity Interactive Background Ripple Effect */}
      <BackgroundRippleEffect rows={10} cols={30} cellSize={54} />

      <PageContainer variant="public" maxWidth="xl">
        {/* Modular Home Sections */}
        <HeroPromptSection onLaunchChat={handleLaunchChat} />
        <BentoFeaturesSection onLaunchChat={handleLaunchChat} />
        <ModelBenchmarkMatrix onLaunchChat={handleLaunchChat} />
        <HomeCtaSection />
        <HomeFooter />
      </PageContainer>
    </div>
  );
}
