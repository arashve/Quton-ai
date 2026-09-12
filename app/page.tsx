'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUp,
  ArrowRight,
  Columns,
  Mic,
  Brain,
  Globe,
  Zap,
  ChevronRight,
  ShieldCheck,
  Code,
  Lock,
  Paperclip,
  AudioLines,
  CornerDownLeft,
} from 'lucide-react';
import { PageContainer } from '@/components/shell';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

export default function LandingPortalPage() {
  const router = useRouter();
  const [heroPrompt, setHeroPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<'default' | 'compare' | 'reasoning' | 'voice'>('default');
  const [isFocused, setIsFocused] = useState(false);
  const [webSearch, setWebSearch] = useState(false);

  const placeholders: Record<string, string> = {
    default: 'Ask anything, brainstorm code, or paste architecture requirements...',
    compare: 'Enter a prompt to compare Gemini 2.5 Flash vs Pro live in dual split arena...',
    reasoning: 'Ask a complex multi-step challenge to inspect cognitive reasoning steps...',
    voice: 'Type a topic or click the mic for ultra-fast bidirectional voice streaming...',
  };

  const handleLaunchChat = (promptText?: string, modeOverride?: string) => {
    const text = (promptText !== undefined ? promptText : heroPrompt).trim();
    const mode = modeOverride || selectedMode;

    if (mode === 'compare') {
      router.push(`/arena${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }
    if (mode === 'voice') {
      router.push(`/voice${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }

    const searchParam = webSearch ? '&search=true' : '';
    const reasoningParam = mode === 'reasoning' ? '&reasoning=true' : '';

    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}${searchParam}${reasoningParam}`);
    } else {
      router.push('/chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleLaunchChat();
    }
  };

  const sampleSuggestions = [
    {
      title: 'Split Arena',
      text: 'Compare Gemini 2.5 Flash vs Pro on latency & reasoning',
      icon: Columns,
      tag: 'Arena',
      mode: 'compare' as const,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Architecture',
      text: 'Architect an ultra-low latency SSE streaming API in Node.js',
      icon: Code,
      tag: 'Code',
      mode: 'default' as const,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Deep Reasoning',
      text: 'Inspect step-by-step reasoning trace on distributed consensus',
      icon: Brain,
      tag: 'Reasoning',
      mode: 'reasoning' as const,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Voice Native',
      text: 'Explain quantum error correction step-by-step with voice',
      icon: Mic,
      tag: 'Voice',
      mode: 'voice' as const,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Aceternity Interactive Background Ripple Effect */}
      <BackgroundRippleEffect rows={10} cols={30} cellSize={54} />

      <PageContainer variant="public" maxWidth="xl">
        {/* Hero Section */}
        <section
          id="hero-prompt"
          className="relative z-10 pt-16 sm:pt-24 pb-20 px-2 sm:px-4 max-w-5xl mx-auto text-center"
        >
          {/* Subtle Ambient Aurora Mesh Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[360px] bg-gradient-to-tr from-[#254EAF]/25 via-[#8B5CF6]/20 to-[#06B6D4]/20 rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* Status Indicator Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/80 font-mono mb-8 backdrop-blur-md shadow-inner"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Real-time SSE streaming • Dual-model arena & voice native</span>
          </motion.div>

          {/* Primary Display Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]"
          >
            Intelligence at the <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              speed of thought.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-white/60 leading-relaxed mb-10"
          >
            Experience ultra-low latency AI streaming, dual-model live benchmarking, deep cognitive reasoning inspection, and hands-free voice dialogue.
          </motion.p>

          {/* ChatGPT-Style Elevated Glassmorphic Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320, delay: 0.25 }}
            className="max-w-3xl mx-auto text-left"
          >
            <div
              className={`relative rounded-[32px] p-4 sm:p-6 transition-all duration-300 backdrop-blur-2xl border ${
                isFocused
                  ? 'bg-[#151619]/95 border-white/25 shadow-[0_24px_70px_-12px_rgba(37,78,175,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-4 ring-[#254EAF]/15'
                  : 'bg-[#141518]/80 hover:bg-[#17181c]/90 border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]'
              }`}
            >
              {/* Mode Selector Segmented Control with Smooth Sliding Pill */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div
                  role="tablist"
                  aria-label="Prompt modes"
                  className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
                >
                  {[
                    { id: 'default', label: 'Fast Chat', icon: Zap },
                    { id: 'compare', label: 'Split Arena', icon: Columns },
                    { id: 'reasoning', label: 'Deep Reasoning', icon: Brain },
                    { id: 'voice', label: 'Voice Mode', icon: Mic },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        role="tab"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => setSelectedMode(mode.id as any)}
                        className={`relative min-h-[38px] flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                          isSelected ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="hero-prompt-active-mode-pill"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                            className="absolute inset-0 rounded-full bg-white/10 border border-white/15 shadow-inner"
                          />
                        )}
                        <Icon className={`w-3.5 h-3.5 relative z-10 ${isSelected ? 'text-blue-400' : 'text-white/60'}`} />
                        <span className="relative z-10">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-white/40">
                  <CornerDownLeft className="w-3 h-3" />
                  <span>Enter to send</span>
                </div>
              </div>

              {/* Textarea Input Field */}
              <div className="pt-3 pb-2">
                <textarea
                  rows={2}
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholders[selectedMode]}
                  className="w-full bg-transparent text-base sm:text-lg text-white placeholder:text-white/35 focus:outline-hidden resize-none leading-relaxed py-1 selection:bg-[#254EAF]/40"
                  aria-label="Initial prompt input"
                />
              </div>

              {/* ChatGPT Bottom Action Toolbar */}
              <div className="flex items-center justify-between pt-2">
                {/* Left Controls: Model Badge, Web Search, Attach */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Model Chip */}
                  <div
                    onClick={() => router.push('/models')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 transition cursor-pointer select-none"
                    title="Engine: Gemini 2.5 Flash"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold">Gemini 2.5 Flash</span>
                  </div>

                  {/* Web Search Toggle */}
                  <button
                    type="button"
                    onClick={() => setWebSearch(!webSearch)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      webSearch
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                    title="Toggle Web Search"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Search</span>
                  </button>

                  {/* Attachment Icon */}
                  <button
                    type="button"
                    onClick={() => handleLaunchChat()}
                    className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Attach snippet or document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Controls: Voice button & Circular ChatGPT Send button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push('/voice')}
                    className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer group"
                    title="Voice Mode"
                  >
                    <AudioLines className="w-4 h-4 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                  </button>

                  <motion.button
                    whileHover={heroPrompt.trim() ? { scale: 1.05 } : {}}
                    whileTap={heroPrompt.trim() ? { scale: 0.95 } : {}}
                    type="button"
                    disabled={!heroPrompt.trim()}
                    onClick={() => handleLaunchChat()}
                    aria-label="Send prompt"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      heroPrompt.trim()
                        ? 'bg-white text-black hover:bg-white/95 shadow-md shadow-white/20'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ChatGPT-Style Quick Suggestions Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {sampleSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={idx}
                  type="button"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLaunchChat(item.text, item.mode)}
                  className="group relative flex flex-col justify-between p-4 rounded-2xl bg-[#141518]/70 hover:bg-[#1c1d22]/90 border border-white/8 hover:border-white/20 backdrop-blur-xl text-left transition-all duration-200 shadow-lg cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 group-hover:text-white/80 font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90 group-hover:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-white/50 group-hover:text-white/70 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Bento Grid Architecture Showcase */}
        <section
          id="bento-features"
          className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-20"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-3 font-semibold">
              Core Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Designed for speed. Crafted for precision.
            </h2>
            <p className="text-base text-white/60">
              Explore the flagship modules powering the AUTOFLOW streaming engine.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: Dual-Model Split Arena (Col-span 7) */}
            <div className="md:col-span-7 rounded-3xl bg-[#1C1C1E] p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#2C2C2E] text-white">
                      <Columns className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono uppercase text-white/50 font-semibold tracking-wider">
                      Arena Engine
                    </span>
                  </div>
                  <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#2C2C2E] text-white/80 font-semibold">
                    Live Benchmarking
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Dual-model split arena
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-8">
                  Evaluate two foundation models side-by-side in real time. Benchmark Time to First Token (TTFT), tokens per second (TPS), and compare reasoning quality.
                </p>

                {/* Arena Preview Mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#000000] font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#2C2C2E] space-y-2">
                    <div className="flex justify-between text-white font-bold">
                      <span>gemini-2.5-flash</span>
                      <span className="text-emerald-400 font-semibold">142ms</span>
                    </div>
                    <div className="text-[11px] text-white/60">Throughput: 140 tok/s</div>
                    <div className="text-[11px] text-white/80 line-clamp-2">
                      &quot;Clean async pipeline configured with Server-Sent Events...&quot;
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#2C2C2E] space-y-2">
                    <div className="flex justify-between text-white font-bold">
                      <span>gemini-2.5-pro</span>
                      <span className="text-purple-400 font-semibold">280ms</span>
                    </div>
                    <div className="text-[11px] text-white/60">Throughput: 90 tok/s</div>
                    <div className="text-[11px] text-white/80 line-clamp-2">
                      &quot;Detailed architectural analysis with strict memory boundaries...&quot;
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-white/50">Compare Gemini, Groq & Ollama</span>
                <Link
                  href="/arena"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
                >
                  <span>Launch Arena</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Voice-Native Dock (Col-span 5) */}
            <div className="md:col-span-5 rounded-3xl bg-[#1C1C1E] p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#2C2C2E] text-white">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono uppercase text-white/50 font-semibold tracking-wider">
                      Voice 8
                    </span>
                  </div>
                  <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#2C2C2E] text-white/80 font-semibold">
                    Voice Native
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Docked voice assistant
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-8">
                  Hands-free speech-to-text with live audio waveform feedback and automated text-to-speech audio synthesis.
                </p>

                {/* Waveform Visualization Mockup */}
                <div className="p-5 rounded-2xl bg-[#000000] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 h-10" aria-hidden="true">
                    {[0.4, 0.85, 0.5, 1.0, 0.65, 0.9, 0.45].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h * 100}%` }}
                        className="w-2 bg-white rounded-full transition-all duration-200"
                      />
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-white">Continuous Speech</div>
                    <div className="text-[11px] text-white/50 font-mono">Web Speech API</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-white/50">Speech recognition & synthesis</span>
                <Link
                  href="/voice"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
                >
                  <span>Test Voice Mode</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: Deep Reasoning (Col-span 4) */}
            <div className="md:col-span-4 rounded-3xl bg-[#1C1C1E] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-[#2C2C2E] text-white">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-white/50 font-semibold tracking-wider">
                    Cognitive Trace
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Thought process accordion
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Full transparency into model thinking steps before generating final responses.
                </p>
                <div className="p-4 rounded-2xl bg-[#000000] font-mono text-xs text-white/80 space-y-2">
                  <div className="text-white flex items-center gap-2 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span>Thinking process (1.8s)</span>
                  </div>
                  <div className="line-clamp-2 italic text-white/50">
                    &quot;1. Analyzing constraints... 2. Deduplicating tree nodes...&quot;
                  </div>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  type="button"
                  onClick={() => handleLaunchChat('Solve this logic puzzle with deep reasoning trace')}
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
                >
                  <span>View Traces</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 4: Web Grounding & Citations (Col-span 4) */}
            <div className="md:col-span-4 rounded-3xl bg-[#1C1C1E] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-[#2C2C2E] text-white">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-white/50 font-semibold tracking-wider">
                    Web Grounding
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Live citations & sources
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Real-time web search grounded with interactive domain badges and direct reference links.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#2C2C2E] text-white/90">
                    wikipedia.org [1]
                  </span>
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#2C2C2E] text-white/90">
                    arxiv.org [2]
                  </span>
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#2C2C2E] text-white/90">
                    github.com [3]
                  </span>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  type="button"
                  onClick={() => handleLaunchChat('What are the latest breakthroughs in AI this week?')}
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
                >
                  <span>Search Live Web</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 5: Engine Switcher & Privacy (Col-span 4) */}
            <div className="md:col-span-4 rounded-3xl bg-[#1C1C1E] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-[#2C2C2E] text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-white/50 font-semibold tracking-wider">
                    Multi-Provider
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Gemini, Groq & Ollama
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Toggle between cloud-managed Google models, 450 tok/s Groq LPU, and private local Ollama instances.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                  <Lock className="w-4 h-4 text-white/50" />
                  <span>Zero telemetry storage</span>
                </div>
              </div>
              <div className="mt-6 text-right">
                <Link
                  href="/settings"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
                >
                  <span>Configure Endpoints</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Model Comparison Matrix Section */}
        <section
          id="models-matrix"
          className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-20"
        >
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Foundation engines at your fingertips
            </h2>
            <p className="text-base text-white/60">
              Choose the best balance of latency, reasoning capacity, and deployment model.
            </p>
          </div>

          <div className="rounded-3xl bg-[#1C1C1E] p-6 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-mono uppercase text-white/50 tracking-wider">
                    <th scope="col" className="pb-5 pl-4 font-semibold">Model</th>
                    <th scope="col" className="pb-5 font-semibold">Provider</th>
                    <th scope="col" className="pb-5 font-semibold">TTFT (Latency)</th>
                    <th scope="col" className="pb-5 font-semibold">Throughput</th>
                    <th scope="col" className="pb-5 font-semibold">Reasoning</th>
                    <th scope="col" className="pb-5 pr-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr className="hover:bg-[#2C2C2E] transition rounded-2xl">
                    <td className="py-4 pl-4 font-semibold text-white font-mono rounded-l-2xl">gemini-2.5-flash</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-[#2C2C2E] text-white font-mono text-xs">
                        Gemini
                      </span>
                    </td>
                    <td className="py-4 font-mono text-emerald-400 font-bold">~150ms</td>
                    <td className="py-4 font-mono text-white/90">140 tok/s</td>
                    <td className="py-4">Adaptive High</td>
                    <td className="py-4 pr-4 text-right rounded-r-2xl">
                      <button
                        type="button"
                        onClick={() => handleLaunchChat('Test gemini-2.5-flash speed')}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold cursor-pointer transition"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#2C2C2E] transition rounded-2xl">
                    <td className="py-4 pl-4 font-semibold text-white font-mono rounded-l-2xl">gemini-2.5-pro</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-[#2C2C2E] text-white font-mono text-xs">
                        Gemini
                      </span>
                    </td>
                    <td className="py-4 font-mono text-white">~280ms</td>
                    <td className="py-4 font-mono text-white/90">90 tok/s</td>
                    <td className="py-4 text-white font-semibold">Maximum Depth</td>
                    <td className="py-4 pr-4 text-right rounded-r-2xl">
                      <button
                        type="button"
                        onClick={() => handleLaunchChat('Test gemini-2.5-pro reasoning')}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold cursor-pointer transition"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#2C2C2E] transition rounded-2xl">
                    <td className="py-4 pl-4 font-semibold text-white font-mono rounded-l-2xl">llama-3.3-70b-versatile</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-[#2C2C2E] text-white font-mono text-xs">
                        Groq
                      </span>
                    </td>
                    <td className="py-4 font-mono text-emerald-400 font-bold">~180ms</td>
                    <td className="py-4 font-mono text-white font-bold">450+ tok/s</td>
                    <td className="py-4">Very High</td>
                    <td className="py-4 pr-4 text-right rounded-r-2xl">
                      <button
                        type="button"
                        onClick={() => handleLaunchChat('Test Groq Llama 3.3 generation speed')}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold cursor-pointer transition"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#2C2C2E] transition rounded-2xl">
                    <td className="py-4 pl-4 font-semibold text-white font-mono rounded-l-2xl">deepseek-r1 / qwen</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-[#2C2C2E] text-white font-mono text-xs">
                        Ollama Local
                      </span>
                    </td>
                    <td className="py-4 font-mono text-white/70">Local Device</td>
                    <td className="py-4 font-mono text-white/70">Hardware Dependent</td>
                    <td className="py-4">Fully Private</td>
                    <td className="py-4 pr-4 text-right rounded-r-2xl">
                      <Link
                        href="/settings"
                        className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs cursor-pointer font-semibold transition"
                      >
                        Setup
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Launch Studio Call to Action */}
        <section className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 py-20 text-center">
          <div className="p-10 sm:p-16 rounded-3xl bg-[#1C1C1E] text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Step into the Chat Studio
            </h2>
            <p className="max-w-xl mx-auto text-base text-white/60 leading-relaxed">
              Instant SSE streaming, side-by-side arena benchmarking, voice synthesis, and multi-session workspace are ready for you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/chat"
                className="min-h-[48px] px-7 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-black font-semibold text-base transition flex items-center gap-2 cursor-pointer"
              >
                <span>Open Chat Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/settings"
                className="min-h-[48px] px-6 py-3.5 rounded-2xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-semibold text-base transition cursor-pointer flex items-center justify-center"
              >
                Adjust Engine Settings
              </Link>
            </div>
          </div>
        </section>

        {/* Public Footer */}
        <footer className="relative z-10 py-12 px-2 sm:px-4 text-center sm:text-left">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-bold text-sm text-white">AUTOFLOW Studio</span>
              <span className="text-xs text-white/40">© 2026. All rights reserved.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/chat" className="hover:text-white transition">Chat Studio</Link>
              <Link href="/arena" className="hover:text-white transition">Arena</Link>
              <Link href="/voice" className="hover:text-white transition">Voice</Link>
              <Link href="/models" className="hover:text-white transition">Models</Link>
              <Link href="/marketplace" className="hover:text-white transition">Marketplace</Link>
              <Link href="/settings" className="hover:text-white transition">Settings</Link>
              <span className="flex items-center gap-2 text-white/80 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                All Systems Nominal
              </span>
            </div>
          </div>
        </footer>
      </PageContainer>
    </div>
  );
}
