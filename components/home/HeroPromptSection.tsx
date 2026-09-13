'use client';

import React from 'react';
import { motion } from 'motion/react';
import { UnifiedAiInputCapsule } from './UnifiedAiInputCapsule';

interface HeroPromptSectionProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function HeroPromptSection({ onLaunchChat }: HeroPromptSectionProps) {
  return (
    <section
      id="hero-prompt"
      className="relative z-10 pt-20 sm:pt-32 pb-24 px-4 max-w-4xl mx-auto text-center"
    >
      {/* Subtle Ambient Aurora Mesh Glow with completely smooth radial dropoff */}
      <div
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] sm:w-[920px] h-[520px] sm:h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(37,78,175,0.22)_0%,rgba(37,78,175,0.08)_42%,transparent_72%)] rounded-full blur-[90px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Primary Display Typography */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-3xl sm:text-5xl font-medium tracking-tight text-white/90 mb-10 sm:mb-14 leading-tight"
      >
        What should we work on ?
      </motion.h1>

      {/* The Standalone Unified AI Input Capsule Component with Dedicated Stable Bounding Slot */}
      <div className="w-full min-h-[280px] sm:min-h-[290px] flex flex-col items-center justify-start">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300, delay: 0.15 }}
          className="w-full"
        >
          <UnifiedAiInputCapsule
            onSendMessage={(text) => onLaunchChat(text)}
          />
        </motion.div>
      </div>
    </section>
  );
}
