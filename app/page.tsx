'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';
import { PageContainer } from '@/components/shell';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

export default function LandingPortalPage() {
  const router = useRouter();
  const [heroPrompt, setHeroPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<'default' | 'compare' | 'reasoning' | 'voice'>('default');

  const handleLaunchChat = (promptText?: string) => {
    const text = (promptText !== undefined ? promptText : heroPrompt).trim();
    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}`);
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
    { text: 'Compare Gemini 2.5 Flash vs Pro on latency & reasoning', icon: Columns, tag: 'Arena' },
    { text: 'Architect an ultra-low latency SSE streaming API in Node.js', icon: Code, tag: 'Architecture' },
    { text: 'Inspect step-by-step reasoning trace on distributed consensus', icon: Brain, tag: 'Reasoning' },
    { text: 'Explain quantum error correction step-by-step with voice', icon: Mic, tag: 'Voice 8' },
  ];

  return (
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Aceternity Interactive Background Ripple Effect */}
      <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />

      <PageContainer variant="public" maxWidth="xl" className="pointer-events-none">
        {/* Hero Section */}
        <section
          id="hero-prompt"
          className="relative z-10 pt-16 sm:pt-24 pb-20 px-2 sm:px-4 max-w-5xl mx-auto text-center pointer-events-none select-none"
        >
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1C1C1E] text-xs text-white/80 font-mono mb-8 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Real-time SSE streaming • Dual-model arena & voice native</span>
          </div>

          {/* Primary Display Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08] pointer-events-none">
            Intelligence at the <br className="hidden sm:inline" />
            <span className="text-white/60">speed of thought.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/60 leading-relaxed mb-12 pointer-events-none">
            Experience ultra-low latency AI streaming, dual-model live benchmarking, deep cognitive reasoning inspection, and hands-free voice dialogue.
          </p>

          {/* Solid Elevated Surface Prompt Box */}
          <div className="max-w-3xl mx-auto text-left pointer-events-auto select-text">
            <div className="rounded-3xl bg-[#1C1C1E] p-6 sm:p-8 space-y-5 shadow-2xl border border-white/5">
              {/* Mode Selector Segmented Control */}
              <div className="flex items-center justify-between">
                <div
                  role="tablist"
                  aria-label="Prompt modes"
                  className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
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
                        className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-white text-black'
                            : 'bg-[#2C2C2E] text-white/70 hover:text-white hover:bg-[#3A3A3C]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-mono text-white/40 hidden sm:block">
                  Press ↵ Enter
                </div>
              </div>

              {/* Input Field & Submit Button */}
              <div className="flex items-end gap-4 pt-2">
                <textarea
                  rows={2}
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything, benchmark models, generate architecture, or debug code..."
                  className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-hidden resize-none leading-relaxed py-1"
                  aria-label="Initial prompt input"
                />

                <button
                  type="button"
                  onClick={() => handleLaunchChat()}
                  aria-label="Send prompt and launch chat studio"
                  className="shrink-0 min-w-[48px] min-h-[48px] w-12 h-12 rounded-2xl bg-white hover:bg-white/90 active:scale-95 text-black flex items-center justify-center transition cursor-pointer"
                >
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="mt-8 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            {sampleSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLaunchChat(item.text)}
                  className="min-h-[44px] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs text-white/80 hover:text-white transition cursor-pointer border border-white/5"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                  <span className="max-w-[260px] sm:max-w-none truncate">{item.text}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#2C2C2E] text-white/70 font-semibold">
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bento Grid Architecture Showcase */}
        <section
          id="bento-features"
          className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-20 pointer-events-auto"
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
