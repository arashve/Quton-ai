'use client';

import React from 'react';
import Link from 'next/link';
import {
  Columns,
  Mic,
  Brain,
  Globe,
  ChevronRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface BentoFeaturesSectionProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function BentoFeaturesSection({ onLaunchChat }: BentoFeaturesSectionProps) {
  return (
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
              onClick={() => onLaunchChat('Solve this logic puzzle with deep reasoning trace', 'reasoning')}
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
              onClick={() => onLaunchChat('What are the latest breakthroughs in AI this week?')}
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
  );
}
