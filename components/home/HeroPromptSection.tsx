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
      {/* Subtle Ambient Aurora Mesh Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[360px] bg-gradient-to-tr from-[#254EAF]/20 via-[#8B5CF6]/10 to-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none -z-10"
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
      <div className="w-full min-h-[220px] sm:min-h-[230px] flex flex-col items-center justify-start">
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
