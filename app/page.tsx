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
  Sliders,
  Check,
  Trophy,
  Volume2,
  Code,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Layers,
  Terminal,
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
    <div className="min-h-screen relative w-full overflow-x-hidden bg-zinc-950 text-zinc-100 selection:bg-purple-500/30">
      {/* 1. Aurora Background Glowing Meshes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full bg-purple-600/15 blur-3xl animate-pulse duration-1000" />
        <div className="absolute top-1/4 -right-24 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute top-2/3 -left-20 w-[650px] h-[650px] rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-[700px] h-[700px] rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-50" />
      </div>

      {/* 2. Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-zinc-950/60 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition duration-200">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                AUTOFLOW
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                STUDIO v2.5
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <a
              href="#hero-prompt"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Prompt Box
            </a>
            <a
              href="#bento-features"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Capabilities
            </a>
            <a
              href="#arena-preview"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Split Arena
            </a>
            <a
              href="#models-matrix"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Models
            </a>
            <Link
              href="/settings"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Actions & Launch Button */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/settings"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition shadow-xs"
              title="Global Settings"
            >
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-[11px]">Settings</span>
            </Link>

            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-purple-600/25 group cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section with Prominent AI Prompt Input Box */}
      <section id="hero-prompt" className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-md text-xs text-purple-300 font-mono mb-6 shadow-xs animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time SSE Streaming • Split Arena & Voice 8 Native</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-5 leading-[1.1]">
          Intelligence at the <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
            Speed of Thought.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed mb-10">
          Experience ultra-low latency AI streaming, dual-model live benchmarking, deep cognitive reasoning inspection, and voice-native dialogue.
        </p>

        {/* PROMINENT AI PROMPT INPUT BOX (Requested by User) */}
        <div className="max-w-3xl mx-auto text-left relative group">
          <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-purple-600/40 via-cyan-500/40 to-pink-500/40 blur-xl opacity-40 group-hover:opacity-75 transition duration-500" />
          
          <div className="relative rounded-[32px] bg-zinc-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl p-3 sm:p-4 transition-all">
            {/* Mode Tabs inside Prompt Box */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-2">
              <div className="flex items-center gap-1.5 text-xs">
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
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] font-mono text-zinc-500 hidden sm:block">
                Press ↵ Enter to launch
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
                className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white flex items-center justify-center transition shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 cursor-pointer"
                title="Send Prompt and Launch Chat Workspace"
              >
                <ArrowUp className="w-5 h-5 font-bold" />
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition cursor-pointer backdrop-blur-md shadow-xs group"
              >
                <Icon className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="max-w-[220px] sm:max-w-none truncate">{item.text}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-400">
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Bento Grid Showcase (Aurora Glassmorphic Architecture) */}
      <section id="bento-features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-2">
            The Aurora Architecture
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
          <div className="md:col-span-7 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/15 p-6 sm:p-8 relative overflow-hidden shadow-2xl group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Columns className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-purple-300">AI Chat 7 Feature</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
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
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-white/10 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1.5">
                  <div className="flex justify-between text-purple-300 font-bold">
                    <span>gemini-2.5-flash</span>
                    <span className="text-emerald-400">142ms</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Throughput: 135 tok/s</div>
                  <div className="text-[10px] text-zinc-300 line-clamp-2">
                    &quot;Clean async pipeline configured with SSE streaming...&quot;
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
                  <div className="flex justify-between text-cyan-300 font-bold">
                    <span>gemini-2.5-pro</span>
                    <span className="text-cyan-400">290ms</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Throughput: 85 tok/s</div>
                  <div className="text-[10px] text-zinc-300 line-clamp-2">
                    &quot;Detailed architectural analysis with memory isolation...&quot;
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Compare Gemini, Groq & Ollama</span>
              <button
                type="button"
                onClick={() => handleLaunchChat('Compare Gemini 2.5 Flash vs Pro on latency')}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                <span>Try Arena Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 2: Voice-First Assistant (Col-span 5) */}
          <div className="md:col-span-5 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/15 p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-rose-300">AI Chat 8 Feature</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30">
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
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 h-8">
                  {[0.4, 0.8, 0.5, 0.95, 0.6, 0.85, 0.45].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h * 100}%` }}
                      className="w-1.5 bg-gradient-to-t from-rose-500 to-purple-400 rounded-full animate-pulse"
                    />
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-rose-300">Auto-TTS Enabled</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Web Speech API</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Speech-to-Text & Auto-Read</span>
              <button
                type="button"
                onClick={() => handleLaunchChat('Hello AUTOFLOW, tell me about yourself in voice mode')}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <span>Test Voice</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 3: Deep Reasoning (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-amber-300">Cognitive Trace</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Thought Process Accordion
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Full transparency into model thinking steps before generating final output.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/10 font-mono text-[10px] text-zinc-400 space-y-1">
                <div className="text-amber-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Thinking process (1.8s)</span>
                </div>
                <div className="line-clamp-2 italic text-zinc-500">
                  &quot;1. Evaluating algorithmic constraints... 2. Deduplicating tree nodes...&quot;
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-right">
              <button
                type="button"
                onClick={() => handleLaunchChat('Solve this logic puzzle with deep reasoning trace')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer inline-flex items-center gap-1"
              >
                <span>View Traces</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bento Card 4: Web Grounding & Citations (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-cyan-300">Web Grounding</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Live Citations & Sources
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Real-time internet search grounded with clickable source badges and domain verification.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  wikipedia.org [1]
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  arxiv.org [2]
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  github.com [3]
                </span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-right">
              <button
                type="button"
                onClick={() => handleLaunchChat('What are the latest breakthroughs in AI this week?')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer inline-flex items-center gap-1"
              >
                <span>Search Live</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bento Card 5: Engine Switcher & Privacy (Col-span 4) */}
          <div className="md:col-span-4 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase text-indigo-300">Multi-Provider</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Gemini, Groq & Ollama
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Toggle between cloud-managed Google models, 500 tok/s Groq LPU, and private local Ollama.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Zero telemetry storage</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-right">
              <Link
                href="/settings"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer inline-flex items-center gap-1"
              >
                <span>Configure Endpoints</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Model Comparison Matrix Table */}
      <section id="models-matrix" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Foundation Engines at Your Fingertips
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Choose the best balance of latency, reasoning capacity, and deployment model.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-mono text-zinc-400 text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Model</th>
                <th className="p-4">Provider</th>
                <th className="p-4">TTFT (Latency)</th>
                <th className="p-4">Throughput</th>
                <th className="p-4">Reasoning</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 pl-6 font-semibold text-white">gemini-2.5-flash</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs">Gemini</span></td>
                <td className="p-4 font-mono text-emerald-400">~150ms</td>
                <td className="p-4 font-mono">140 tok/s</td>
                <td className="p-4">High (Adaptive)</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleLaunchChat('Test gemini-2.5-flash speed')}
                    className="px-3 py-1 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs cursor-pointer font-medium"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 pl-6 font-semibold text-white">gemini-2.5-pro</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs">Gemini</span></td>
                <td className="p-4 font-mono text-cyan-400">~280ms</td>
                <td className="p-4 font-mono">90 tok/s</td>
                <td className="p-4 text-purple-300 font-semibold">Maximum Depth</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleLaunchChat('Test gemini-2.5-pro reasoning')}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer font-medium"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 pl-6 font-semibold text-white">llama-3.3-70b-versatile</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs">Groq</span></td>
                <td className="p-4 font-mono text-amber-400">~180ms</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">450+ tok/s</td>
                <td className="p-4">Very High</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleLaunchChat('Test Groq Llama 3.3 generation speed')}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer font-medium"
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 pl-6 font-semibold text-white">deepseek-r1 / qwen</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs">Ollama Local</span></td>
                <td className="p-4 font-mono text-zinc-400">Local Hardware</td>
                <td className="p-4 font-mono text-zinc-400">GPU Dependent</td>
                <td className="p-4">Full Private</td>
                <td className="p-4 pr-6 text-right">
                  <Link
                    href="/settings"
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer font-medium inline-block"
                  >
                    Setup
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Launchpad Call to Action */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="p-8 sm:p-14 rounded-[36px] bg-gradient-to-b from-purple-900/30 to-zinc-950 border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Step into the Chat Studio
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 mb-8">
            Instant SSE streaming, model arena, voice synthesis, and multi-session workspace are ready for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/chat"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm sm:text-base transition shadow-xl shadow-purple-600/30 group flex items-center gap-2 cursor-pointer"
            >
              <span>Open Chat Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/settings"
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-sm transition cursor-pointer"
            >
              Adjust Engine Settings
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 px-4 sm:px-8 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-sm text-white">AUTOFLOW Studio</span>
            <span className="text-xs text-zinc-500">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/chat" className="hover:text-white transition">Chat Workspace</Link>
            <Link href="/settings" className="hover:text-white transition">Settings</Link>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
