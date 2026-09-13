'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowUp,
  Columns,
  Brain,
  Globe,
  Paperclip,
  AudioLines,
  Library,
  Blocks,
  Monitor,
  Folder,
  ChevronDown,
  Plus,
} from 'lucide-react';

interface HeroPromptSectionProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function HeroPromptSection({ onLaunchChat }: HeroPromptSectionProps) {
  const router = useRouter();
  const [heroPrompt, setHeroPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<'default' | 'compare' | 'reasoning' | 'voice'>('default');
  const [isFocused, setIsFocused] = useState(false);
  const [webSearch, setWebSearch] = useState(false);

  const placeholders: Record<string, string> = {
    default: 'Ask anything, brainstorm code, or paste architecture requirements...',
    compare: 'Enter a prompt to compare Gemini vs Pro live in dual split arena...',
    reasoning: 'Ask a complex multi-step challenge to inspect cognitive reasoning...',
    voice: 'Type a topic or click the mic for ultra-fast bidirectional voice...',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onLaunchChat(heroPrompt, selectedMode);
    }
  };

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
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', damping: 28, stiffness: 300, delay: 0.15 }}
  className="relative w-full max-w-3xl mx-auto text-left flex flex-col gap-2"
>
  {/* Main Input Area */}
  <div
    className={`flex flex-col justify-between w-full min-h-[140px] rounded-[24px] p-5 transition-colors duration-200 ${
      isFocused ? 'bg-[#242424]' : 'bg-[#1E1E1E] hover:bg-[#222222]'
    }`}
  >
    <textarea
      rows={2}
      value={heroPrompt}
      onChange={(e) => setHeroPrompt(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      placeholder="Work on anything"
      className="w-full flex-grow bg-transparent text-lg text-white/90 placeholder:text-white/40 focus:outline-none resize-none selection:bg-white/20"
    />

    {/* Bottom Row of Main Input */}
    <div className="flex items-center justify-between mt-4">
      <button 
        type="button"
        className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Add attachment"
      >
        <Plus className="w-6 h-6" strokeWidth={2} />
      </button>

      <button 
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <span>GPT-6 Astra Extra High</span>
        <ChevronDown className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  </div>

  {/* Secondary Floating Toolbar */}
  <div className="flex items-center justify-between w-full bg-[#1E1E1E] rounded-xl px-4 py-2.5">
    {/* Left Side Actions */}
    <div className="flex items-center gap-6">
      <button className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-white/90 transition-colors cursor-pointer">
        <Folder className="w-4 h-4" strokeWidth={2} />
        Project
      </button>
      <button className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-white/90 transition-colors cursor-pointer">
        <Library className="w-4 h-4" strokeWidth={2} />
        Files
      </button>
      <button className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-white/90 transition-colors cursor-pointer">
        {/* Placeholder for the colorful 'M' icon, using Blocks for now */}
        <div className="flex items-center justify-center w-4 h-4 text-blue-400">
            <Blocks className="w-4 h-4" strokeWidth={2.5} />
        </div>
        Plugins
      </button>
    </div>

    {/* Right Side Action */}
    <button className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-white/90 transition-colors cursor-pointer">
      <Monitor className="w-4 h-4" strokeWidth={2} />
      Open desktop app
    </button>
  </div>
</motion.div>
    </section>
  );
}
