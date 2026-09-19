'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { UnifiedAiInputCapsule } from './UnifiedAiInputCapsule';
import { LayoutTextFlip } from '../ui/layout-text-flip';
import { Player } from '@lordicon/react';
import ICON_PIGGY from '../../public/assets/piggy.json';
interface HeroPromptSectionProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function HeroPromptSection({ onLaunchChat }: HeroPromptSectionProps) {
  // ایجاد رفرنس برای کنترل آیکون
  const playerRef = useRef<Player>(null);

  // دستور پخش خودکار به محض لود شدن صفحه
  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);

  return (
    <section
      id="hero-prompt"
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 text-center flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Subtle Ambient Aurora Mesh Glow with completely smooth radial dropoff */}
      <div
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[920px] h-[520px] sm:h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(37,78,175,0.22)_0%,rgba(37,78,175,0.08)_42%,transparent_72%)] rounded-full blur-[90px] pointer-events-none -z-10"
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
            <span className="inline-flex pt-1 items-center justify-center -mt-1">
              <Player 
                ref={playerRef} // اتصال رفرنس به پلیر
                icon={ICON_PIGGY} 
                colorize="#737373" 
                size={20} 
                onComplete={() => playerRef.current?.playFromBeginning()} // ایجاد لوپ بی‌نهایت
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