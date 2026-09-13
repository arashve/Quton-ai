'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUp,
  Columns,
  Brain,
  Globe,
  Paperclip,
  AudioLines,
} from 'lucide-react';

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

      {/* The Stacked Layered Input Box */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300, delay: 0.15 }}
        className="relative w-full max-w-2xl mx-auto text-left"
      >
        {/* Bottom Shadow / Layer (Darker, offset downwards) */}
        <div className="absolute left-4 right-4 top-8 -bottom-5 rounded-[28px] sm:rounded-[32px] bg-[#141415] shadow-2xl pointer-events-none" />

        {/* Top Main Input Layer */}
        <div
          className={`relative z-10 flex flex-col justify-between w-full min-h-[160px] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 transition-all duration-300 ${
            isFocused
              ? 'bg-[#29292B] border border-white/10 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.15)] ring-2 ring-white/5'
              : 'bg-[#262628] border border-transparent shadow-[0_18px_45px_rgba(0,0,0,0.6)] hover:bg-[#28282A]'
          }`}
        >
          {/* Textarea Input Field */}
          <textarea
            rows={3}
            value={heroPrompt}
            onChange={(e) => setHeroPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[selectedMode]}
            className="w-full flex-grow bg-transparent text-lg sm:text-xl text-white placeholder:text-white/30 focus:outline-hidden resize-none leading-relaxed selection:bg-[#254EAF]/40"
            aria-label="Initial prompt input"
          />

          {/* Bottom Action Toolbar inside the Box */}
          <div className="flex items-end justify-between pt-4 mt-auto border-t border-white/5">
            {/* Left Controls: Modes and Tools */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* Web Search Toggle */}
              <button
                type="button"
                onClick={() => setWebSearch(!webSearch)}
                className={`p-2 sm:px-3 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  webSearch
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
                title="Toggle Web Search"
              >
                <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Mode Toggles */}
              {[
                { id: 'compare', icon: Columns, title: 'Split Arena' },
                { id: 'reasoning', icon: Brain, title: 'Deep Reason' },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(isSelected ? 'default' : (mode.id as any))}
                    className={`p-2 sm:px-3 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                    title={mode.title}
                  >
                    <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">{mode.title}</span>
                  </button>
                );
              })}

              <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />

              {/* Attachment & Voice Icons */}
              <button
                type="button"
                className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition cursor-pointer"
                title="Attach snippet"
              >
                <Paperclip className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={() => router.push('/voice')}
                className="p-2 rounded-full text-white/40 hover:text-cyan-400 hover:bg-white/5 transition cursor-pointer"
                title="Voice Dialogue"
              >
                <AudioLines className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right Control: The Distinctive Blue Button from Figma */}
            <div className="flex items-center pl-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => onLaunchChat(heroPrompt, selectedMode)}
                aria-label="Send prompt"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-colors cursor-pointer group"
              >
                <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
