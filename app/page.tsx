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
} from 'lucide-react';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleLaunchChat();
    }
  };

  const sampleSuggestions = [
    { text: 'Compare Gemini 2.5 Flash vs Pro on latency & reasoning', icon: Columns, tag: 'Arena' },
    { text: 'Architect an ultra-low latency SSE streaming API in Node.js', icon: Code, tag: 'Architecture' },
    { text: 'Deep reasoning trace on distributed consensus algorithms', icon: Brain, tag: 'Thinking' },
    { text: 'Explain quantum error correction step-by-step with voice', icon: Mic, tag: 'Voice 8' },
  ];

  return (
    <div className="min-h-[100dvh] relative w-full overflow-x-clip bg-zinc-950 text-zinc-100 selection:bg-zinc-800 pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-[calc(env(safe-area-inset-bottom)+3rem)]">
      {/* Subtle Monochrome Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Hero Section with Prominent AI Prompt Input Box */}
      <section id="hero-prompt" className="relative z-10 pt-24 sm:pt-32 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Status Pill (Monochrome) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono mb-6 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Real-time SSE Streaming • Split Arena & Voice 8 Native</span>
        </div>

        {/* Hero Headlines (Pure High-Contrast Monochrome) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-5 leading-[1.1]">
          Intelligence at the <br className="hidden sm:inline" />
          <span className="text-zinc-300">
            Speed of Thought.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed mb-10">
          Experience ultra-low latency AI streaming, dual-model live benchmarking, deep cognitive reasoning inspection, and voice-native dialogue.
        </p>

        {/* PROMINENT AI PROMPT INPUT BOX (Strict Black & White Aesthetic) */}
        <div className="max-w-3xl mx-auto text-left relative group">
          <div className="relative rounded-[28px] bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-2xl p-3 sm:p-4 transition-all">
            {/* Mode Tabs inside Prompt Box */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80 px-2">
              <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'default', label: 'Fast Chat', icon: Zap },
                  { id: 'compare', label: 'Side-by-Side Arena', icon: Columns },
                  { id: 'reasoning', label: 'Deep Reasoning', icon: Brain },
                  { id: 'voice', label: 'Voice Mode', icon: Mic },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] font-mono text-zinc-500 hidden sm:block">
                Press ↵ Enter
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 px-2">
              <textarea
                rows={2}
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, compare models, generate architecture, or debug code..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-hidden resize-none leading-relaxed py-1"
              />

              <button
                type="button"
                onClick={() => handleLaunchChat()}
                className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition shadow-md hover:scale-102 active:scale-98 cursor-pointer"
                title="Send Prompt and Launch Chat Workspace"
              >
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-5 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2">
          {sampleSuggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleLaunchChat(item.text)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition cursor-pointer shadow-xs group"
              >
                <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="max-w-[220px] sm:max-w-none truncate">{item.text}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Bento Grid Showcase (Clean Monochrome Architecture) */}
      <section id="bento-features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-zinc-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            The Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Designed for Speed. Crafted for Precision.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            Explore the flagship modules powering the AUTOFLOW AI platform.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Bento Card 1: Split-Pane Arena (Col-span 7) */}
          <div className="md:col-span-7 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl group flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-zinc-800 text-white">
                    <Columns className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-zinc-400">Arena Engine</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Live Benchmarking
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Dual-Model Split Arena
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                Pit two foundation models side-by-side in real-time. Benchmark Time-To-First-Token (TTFT), tokens per second (TPS), and vote on the superior response.
              </p>

              {/* Arena Preview Mockup */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <div className="flex justify-between text-white font-bold">
                    <span>gemini-2.5-flash</span>
                    <span className="text-zinc-300">142ms</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">Throughput: 135 tok/s</div>
                  <div className="text-[10px] text-zinc-400 line-clamp-2">
                    &quot;Clean async pipeline configured with SSE streaming...&quot;
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <div className="flex justify-between text-white font-bold">
                    <span>gemini-2.5-pro</span>
                    <span className="text-zinc-300">290ms</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">Throughput: 85 tok/s</div>
                  <div className="text-[10px] text-zinc-400 line-clamp-2">
                    &quot;Detailed architectural analysis with memory isolation...&quot;
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Compare Gemini, Groq & Ollama</span>
              <Link
                href="/arena"
                className="flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                <span>Try Arena Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 2: Voice-First Assistant (Col-span 5) */}
          <div className="md:col-span-5 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-zinc-800 text-white">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-zinc-400">Voice 8</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Voice Native
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Docked Voice Assistant
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
                Hands-free speech-to-text with live audio waveform feedback and automated text-to-speech auto-read.
              </p>

              {/* Waveform Visualization Preview */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 h-8">
                  {[0.4, 0.8, 0.5, 0.95, 0.6, 0.85, 0.45].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h * 100}%` }}
                      className="w-1.5 bg-white rounded-full"
                    />
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">Auto-TTS Ready</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Web Speech API</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Speech-to-Text & Synthesizer</span>
              <Link
                href="/voice"
                className="flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                <span>Test Voice</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 3: Deep Reasoning (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-6 sm:p-7 shadow-2xl flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-zinc-400">Cognitive Trace</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Thought Process Accordion
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Full transparency into model thinking steps before generating final output.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-400 space-y-1">
                <div className="text-zinc-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Thinking process (1.8s)</span>
                </div>
                <div className="line-clamp-2 italic text-zinc-500">
                  &quot;1. Evaluating algorithmic constraints... 2. Deduplicating tree nodes...&quot;
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => handleLaunchChat('Solve this logic puzzle with deep reasoning trace')}
                className="text-xs font-semibold text-white hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>View Traces</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bento Card 4: Web Grounding & Citations (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-6 sm:p-7 shadow-2xl flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-white">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-zinc-400">Web Grounding</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Live Citations & Sources
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Real-time internet search grounded with clickable source badges and domain verification.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                  wikipedia.org [1]
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                  arxiv.org [2]
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                  github.com [3]
                </span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => handleLaunchChat('What are the latest breakthroughs in AI this week?')}
                className="text-xs font-semibold text-white hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Search Live</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bento Card 5: Engine Switcher & Privacy (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-6 sm:p-7 shadow-2xl flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-zinc-400">Multi-Provider</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Gemini, Groq & Ollama
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Toggle between cloud-managed Google models, 500 tok/s Groq LPU, and private local Ollama.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Zero telemetry storage</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800 text-right">
              <Link
                href="/settings"
                className="text-xs font-semibold text-white hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Configure Endpoints</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Model Comparison Matrix Table */}
      <section id="models-matrix" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-zinc-800/80">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Foundation Engines at Your Fingertips
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Choose the best balance of latency, reasoning capacity, and deployment model.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[28px] border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 font-mono text-zinc-400 text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Model</th>
                <th className="p-4">Provider</th>
                <th className="p-4">TTFT (Latency)</th>
                <th className="p-4">Throughput</th>
                <th className="p-4">Reasoning</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white">gemini-2.5-flash</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs">Gemini</span></td>
                <td className="p-4 font-mono text-white">~150ms</td>
                <td className="p-4 font-mono text-zinc-300">140 tok/s</td>
                <td className="p-4">High (Adaptive)</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleLaunchChat('Test gemini-2.5-flash speed')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white">gemini-2.5-pro</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs">Gemini</span></td>
                <td className="p-4 font-mono text-white">~280ms</td>
                <td className="p-4 font-mono text-zinc-300">90 tok/s</td>
                <td className="p-4 text-white font-semibold">Maximum Depth</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleLaunchChat('Test gemini-2.5-pro reasoning')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white">llama-3.3-70b-versatile</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs">Groq</span></td>
                <td className="p-4 font-mono text-white">~180ms</td>
                <td className="p-4 font-mono text-white font-bold">450+ tok/s</td>
                <td className="p-4">Very High</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleLaunchChat('Test Groq Llama 3.3 generation speed')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition">
                <td className="p-4 pl-6 font-semibold text-white">deepseek-r1 / qwen</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs">Ollama Local</span></td>
                <td className="p-4 font-mono text-zinc-400">Local Hardware</td>
                <td className="p-4 font-mono text-zinc-400">GPU Dependent</td>
                <td className="p-4">Full Private</td>
                <td className="p-4 pr-6 text-right">
                  <Link
                    href="/settings"
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs cursor-pointer font-medium inline-block"
                  >
                    Setup
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Launchpad Call to Action (Pure Monochrome) */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="p-8 sm:p-14 rounded-[36px] bg-zinc-900 border border-zinc-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Step into the Chat Studio
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 mb-8">
            Instant SSE streaming, model arena, voice synthesis, and multi-session workspace are ready for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/chat"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm sm:text-base transition shadow-md group flex items-center gap-2 cursor-pointer"
            >
              <span>Open Chat Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/settings"
              className="px-5 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium text-sm transition cursor-pointer"
            >
              Adjust Engine Settings
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 py-10 px-4 sm:px-8 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-bold text-sm text-white">AUTOFLOW Studio</span>
            <span className="text-xs text-zinc-500">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/chat" className="hover:text-white transition">Chat Workspace</Link>
            <Link href="/marketplace" className="hover:text-white transition">Marketplace</Link>
            <Link href="/auth" className="hover:text-white transition">Sign In</Link>
            <Link href="/settings" className="hover:text-white transition">Settings</Link>
            <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
