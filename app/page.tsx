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
  Gauge,
  Layers,
  Lock,
} from 'lucide-react';
import { PageContainer } from '@/components/shell';

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
    <PageContainer variant="public" maxWidth="xl">
      {/* Background Subtle Monochrome Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      {/* Hero Section with Apple Liquid Glass Prompt Container */}
      <section
        id="hero-prompt"
        className="relative z-10 pt-12 sm:pt-20 pb-16 px-2 sm:px-4 max-w-5xl mx-auto text-center"
      >
        {/* Status Pill Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 font-mono mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Real-time SSE streaming • Dual-model arena & voice native</span>
        </div>

        {/* Hero Display Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-5 leading-[1.08]">
          Intelligence at the <br className="hidden sm:inline" />
          <span className="text-zinc-300">speed of thought.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed mb-10">
          Experience ultra-low latency AI streaming, dual-model live benchmarking, deep cognitive reasoning inspection, and hands-free voice dialogue.
        </p>

        {/* Liquid Glass Prompt Box */}
        <div className="max-w-3xl mx-auto text-left relative group">
          <div className="relative rounded-[32px] bg-zinc-900/70 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 sm:p-5 transition-all duration-300 hover:border-white/25">
            {/* Mode Selector Segmented Control */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 px-1">
              <div
                role="tablist"
                aria-label="Prompt modes"
                className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0"
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
                      className={`min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-zinc-950 shadow-sm'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-zinc-400 hidden sm:block pr-2">
                Press ↵ Enter to launch
              </div>
            </div>

            {/* Input Field & Submit Button */}
            <div className="flex items-end gap-3 px-1 pt-1">
              <textarea
                rows={2}
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, benchmark models, generate architecture, or debug code..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-400 focus:outline-hidden resize-none leading-relaxed py-1 font-sans"
                aria-label="Initial prompt input"
              />

              <button
                type="button"
                onClick={() => handleLaunchChat()}
                aria-label="Send prompt and launch chat studio"
                className="shrink-0 min-w-[48px] min-h-[48px] w-12 h-12 rounded-2xl bg-white hover:bg-zinc-200 active:scale-95 text-zinc-950 flex items-center justify-center transition-all shadow-md cursor-pointer"
              >
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-6 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2">
          {sampleSuggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleLaunchChat(item.text)}
                className="min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition cursor-pointer shadow-xs group"
              >
                <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="max-w-[240px] sm:max-w-none truncate">{item.text}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-semibold">
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
        className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-16 border-t border-zinc-800/80"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Designed for speed. Crafted for precision.
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 mt-2">
            Explore the flagship modules powering the AUTOFLOW streaming engine.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Dual-Model Split Arena (Col-span 7) */}
          <div className="md:col-span-7 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-xl group flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-white/10 text-white">
                    <Columns className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                    Arena Engine
                  </span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-200 border border-zinc-700 font-semibold">
                  Live Benchmarking
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Dual-model split arena
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                Evaluate two foundation models side-by-side in real time. Benchmark Time to First Token (TTFT), tokens per second (TPS), and compare reasoning quality.
              </p>

              {/* Arena Preview Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5">
                  <div className="flex justify-between text-white font-bold">
                    <span>gemini-2.5-flash</span>
                    <span className="text-emerald-400 font-semibold">142ms</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">Throughput: 140 tok/s</div>
                  <div className="text-[11px] text-zinc-300 line-clamp-2">
                    &quot;Clean async pipeline configured with Server-Sent Events...&quot;
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5">
                  <div className="flex justify-between text-white font-bold">
                    <span>gemini-2.5-pro</span>
                    <span className="text-purple-400 font-semibold">280ms</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">Throughput: 90 tok/s</div>
                  <div className="text-[11px] text-zinc-300 line-clamp-2">
                    &quot;Detailed architectural analysis with strict memory boundaries...&quot;
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Compare Gemini, Groq & Ollama</span>
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
          <div className="md:col-span-5 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-white/10 text-white">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                    Voice 8
                  </span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-200 border border-zinc-700 font-semibold">
                  Voice Native
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Docked voice assistant
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                Hands-free speech-to-text with live audio waveform feedback and automated text-to-speech audio synthesis.
              </p>

              {/* Waveform Visualization Mockup */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 h-9" aria-hidden="true">
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
                  <div className="text-[11px] text-zinc-400 font-mono">Web Speech API</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Speech recognition & synthesis</span>
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
          <div className="md:col-span-4 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                  Cognitive Trace
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Thought process accordion
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                Full transparency into model thinking steps before generating final responses.
              </p>
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1.5">
                <div className="text-zinc-200 flex items-center gap-2 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span>Thinking process (1.8s)</span>
                </div>
                <div className="line-clamp-2 italic text-zinc-400">
                  &quot;1. Analyzing constraints... 2. Deduplicating tree nodes...&quot;
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800/80 text-right">
              <button
                type="button"
                onClick={() => handleLaunchChat('Solve this logic puzzle with deep reasoning trace')}
                className="min-h-[44px] inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                <span>View Traces</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Web Grounding & Citations (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-white">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                  Web Grounding
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Live citations & sources
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                Real-time web search grounded with interactive domain badges and direct reference links.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-200">
                  wikipedia.org [1]
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-200">
                  arxiv.org [2]
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-200">
                  github.com [3]
                </span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800/80 text-right">
              <button
                type="button"
                onClick={() => handleLaunchChat('What are the latest breakthroughs in AI this week?')}
                className="min-h-[44px] inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                <span>Search Live Web</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: Engine Switcher & Privacy (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                  Multi-Provider
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Gemini, Groq & Ollama
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                Toggle between cloud-managed Google models, 450 tok/s Groq LPU, and private local Ollama instances.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Zero telemetry storage</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800/80 text-right">
              <Link
                href="/settings"
                className="min-h-[44px] inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                <span>Configure Endpoints</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Model Comparison Matrix Table */}
      <section
        id="models-matrix"
        className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-12 border-t border-zinc-800/80"
      >
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Foundation engines at your fingertips
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1.5">
            Choose the best balance of latency, reasoning capacity, and deployment model.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/90 font-mono text-zinc-300 text-xs uppercase tracking-wider">
                <th scope="col" className="p-4 pl-6 font-semibold">Model</th>
                <th scope="col" className="p-4 font-semibold">Provider</th>
                <th scope="col" className="p-4 font-semibold">TTFT (Latency)</th>
                <th scope="col" className="p-4 font-semibold">Throughput</th>
                <th scope="col" className="p-4 font-semibold">Reasoning</th>
                <th scope="col" className="p-4 pr-6 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white font-mono">gemini-2.5-flash</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">
                    Gemini
                  </span>
                </td>
                <td className="p-4 font-mono text-emerald-400 font-bold">~150ms</td>
                <td className="p-4 font-mono text-zinc-200">140 tok/s</td>
                <td className="p-4">Adaptive High</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    type="button"
                    onClick={() => handleLaunchChat('Test gemini-2.5-flash speed')}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white font-mono">gemini-2.5-pro</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">
                    Gemini
                  </span>
                </td>
                <td className="p-4 font-mono text-white">~280ms</td>
                <td className="p-4 font-mono text-zinc-200">90 tok/s</td>
                <td className="p-4 text-white font-semibold">Maximum Depth</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    type="button"
                    onClick={() => handleLaunchChat('Test gemini-2.5-pro reasoning')}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white font-mono">llama-3.3-70b-versatile</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">
                    Groq
                  </span>
                </td>
                <td className="p-4 font-mono text-emerald-400 font-bold">~180ms</td>
                <td className="p-4 font-mono text-white font-bold">450+ tok/s</td>
                <td className="p-4">Very High</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    type="button"
                    onClick={() => handleLaunchChat('Test Groq Llama 3.3 generation speed')}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white font-mono">deepseek-r1 / qwen</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">
                    Ollama Local
                  </span>
                </td>
                <td className="p-4 font-mono text-zinc-300">Local Device</td>
                <td className="p-4 font-mono text-zinc-300">Hardware Dependent</td>
                <td className="p-4">Fully Private</td>
                <td className="p-4 pr-6 text-right">
                  <Link
                    href="/settings"
                    className="min-h-[40px] inline-flex items-center px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs cursor-pointer font-semibold transition"
                  >
                    Setup
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Launch Studio Call to Action */}
      <section className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 py-16 text-center">
        <div className="p-8 sm:p-14 rounded-[36px] bg-zinc-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Step into the Chat Studio
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-300 mb-8 leading-relaxed">
            Instant SSE streaming, side-by-side arena benchmarking, voice synthesis, and multi-session workspace are ready for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/chat"
              className="min-h-[48px] px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm sm:text-base transition shadow-md group flex items-center gap-2 cursor-pointer"
            >
              <span>Open Chat Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/settings"
              className="min-h-[48px] px-5 py-3.5 rounded-2xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-sm transition cursor-pointer flex items-center justify-center"
            >
              Adjust Engine Settings
            </Link>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 py-10 px-2 sm:px-4 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-bold text-sm text-white">AUTOFLOW Studio</span>
            <span className="text-xs text-zinc-400">© 2026. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/chat" className="hover:text-white transition">Chat Studio</Link>
            <Link href="/arena" className="hover:text-white transition">Arena</Link>
            <Link href="/voice" className="hover:text-white transition">Voice</Link>
            <Link href="/models" className="hover:text-white transition">Models</Link>
            <Link href="/marketplace" className="hover:text-white transition">Marketplace</Link>
            <Link href="/settings" className="hover:text-white transition">Settings</Link>
            <span className="flex items-center gap-1.5 text-zinc-200 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              All Systems Nominal
            </span>
          </div>
        </div>
      </footer>
    </PageContainer>
  );
}
