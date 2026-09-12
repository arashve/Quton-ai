'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowUp,
  ArrowRight,
  Columns,
  Mic,
  Brain,
  Globe,
  ChevronRight,
  ShieldCheck,
  Lock,
  Paperclip,
  AudioLines,
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
    compare: 'Enter a prompt to compare Gemini vs Pro live in dual split arena...',
    reasoning: 'Ask a complex multi-step challenge to inspect cognitive reasoning...',
    voice: 'Type a topic or click the mic for ultra-fast bidirectional voice...',
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

  return (
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Subtle Figma Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* Aceternity Interactive Background Ripple Effect */}
      <BackgroundRippleEffect rows={10} cols={30} cellSize={54} />

      <PageContainer variant="public" maxWidth="xl">
        {/* Hero Section */}
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
                    onClick={() => handleLaunchChat()}
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
              Explore the flagship modules powering the streaming engine.
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
                <span className="text-xs text-white/50">Compare models in real-time</span>
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
                      Voice Engine
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
                  Thought process
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
                  Live citations
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
                  Private & Secure
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Toggle between cloud-managed models, ultra-fast LPU APIs, and private local instances.
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
                    <td className="py-4 pl-4 font-semibold text-white font-mono rounded-l-2xl">llama-3.3-70b</td>
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
                        onClick={() => handleLaunchChat('Test Groq Llama generation speed')}
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
              <span className="font-bold text-sm text-white">Studio</span>
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