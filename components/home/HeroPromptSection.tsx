'use client';

import React from 'react';
import { motion } from 'motion/react';
import { UnifiedAiInputCapsule } from './UnifiedAiInputCapsule';
import { LayoutTextFlip } from '../ui/layout-text-flip';
import { Player } from '@lordicon/react';
import ICON_PIGGY from '../../public/assets/piggy.json';
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
  <div>
        <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row text-3xl font-extrabold tracking-tight">
          <LayoutTextFlip
            text="Time to "
            words={[
              "let the AI cook ", 
              "stop doomscrolling ", 
              "outsource your life", 
              "let the agent carry"
            ]}
            duration={4000}
          />
        </motion.div>
        
        {/* اصلاح تگ p برای تراز شدن دقیق متن و آیکون متحرک */}
        <div className="mt-4 mb-10 flex flex-col items-center justify-center gap-1 text-base font-medium text-neutral-500 dark:text-neutral-400">
          <span>Stop doing things manually like an NPC.</span>
          <span className="flex items-center gap-1.5">
            Build your agent now 
            {/* 2. کامپوننت Player جایگزین ترفند قبلی شد */}
            <span className="inline-flex items-center justify-center -mt-1">
              <Player 
                icon={ICON_PIGGY} 
                colorize="#737373" /* کد رنگ برابر با neutral-500 */
                size={26} 
                loop={true} 
                autoPlay={true}
              />
            </span>
          </span>
        </div>
      </div>
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
