'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar12, Mobile3 } from '@/components/reactbits';
import {
  Columns,
  Sparkles,
  Play,
  Check,
  ArrowRight,
  Clock,
  Gauge,
  ThumbsUp,
} from 'lucide-react';

interface BattleModel {
  id: string;
  name: string;
  provider: string;
  badgeColor: string;
  defaultLatency: string;
  defaultTps: string;
}

const MODELS: BattleModel[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', badgeColor: 'bg-zinc-800 text-zinc-200 border-zinc-700', defaultLatency: '145ms', defaultTps: '138 tok/s' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', badgeColor: 'bg-zinc-800 text-zinc-200 border-zinc-700', defaultLatency: '280ms', defaultTps: '88 tok/s' },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', provider: 'Groq LPU', badgeColor: 'bg-zinc-800 text-zinc-200 border-zinc-700', defaultLatency: '185ms', defaultTps: '480 tok/s' },
];

export default function ArenaTestPage() {
  const router = useRouter();
  const [modelA, setModelA] = useState<string>('gemini-2.5-flash');
  const [modelB, setModelB] = useState<string>('gemini-2.5-pro');
  const [prompt, setPrompt] = useState<string>('Compare latency and structural reasoning for real-time web agents.');
  const [isBattling, setIsBattling] = useState<boolean>(false);
  const [winner, setWinner] = useState<'A' | 'B' | null>(null);
  const [scores, setScores] = useState({ modelA: 4, modelB: 6 });

  const [responseA, setResponseA] = useState<string>(
    'Gemini 2.5 Flash prioritizes ultra-low Time-To-First-Token (~140ms) with lightweight reasoning hooks. For live interactive agent pipelines, the lower latency enables instant perceived responsiveness, streaming tokens at 135+ tok/s while retaining high comprehension on multimodal inputs.'
  );
  const [responseB, setResponseB] = useState<string>(
    'Gemini 2.5 Pro applies deeper cognitive reasoning branches (~280ms TTFT) with an expanded parameter capacity. In complex autonomous tasks, its higher contextual precision and deliberate execution plan drastically reduce edge-case errors, justifying the slight latency overhead.'
  );

  const presetTests = [
    'Write an optimal async generator for SSE streaming in Node.js',
    'Solve this logic puzzle: 5 pirates splitting 100 gold coins',
    'Explain quantum key distribution to a junior software developer',
  ];

  const handleStartBattle = () => {
    setIsBattling(true);
    setWinner(null);
    setResponseA('Streaming live tokens from ' + modelA + '...');
    setResponseB('Streaming live tokens from ' + modelB + '...');

    setTimeout(() => {
      setResponseA(
        `[${modelA}] Complete analysis generated in 148ms:\n\n1. Pipeline optimized for immediate TTFT.\n2. Throughput benchmark sustained at 136 tokens/sec.\n3. Output formatted with structured markdown and code blocks.`
      );
      setResponseB(
        `[${modelB}] Complete deep reasoning response generated in 265ms:\n\n1. Evaluated 4 algorithmic permutations.\n2. Identified memory trade-offs and verified edge constraints.\n3. Recommended resilient state isolation architecture.`
      );
      setIsBattling(false);
    }, 1200);
  };

  const handleVote = (side: 'A' | 'B') => {
    setWinner(side);
    setScores((prev) => ({
      ...prev,
      [side === 'A' ? 'modelA' : 'modelB']: prev[side === 'A' ? 'modelA' : 'modelB'] + 1,
    }));
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden bg-zinc-950 text-zinc-100 selection:bg-zinc-800 pb-24 md:pb-12">
      {/* 1. Desktop Navbar-12 */}
      <Navbar12 />

      {/* 2. Mobile Bottom Dock (Mobile-3) */}
      <Mobile3 />

      {/* Subtle Monochrome Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      {/* Page Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs mb-3">
            <Columns className="w-3.5 h-3.5 text-white" />
            <span>Interactive Test Page • Split Arena</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Model Duel & Benchmarking Arena
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Compare two AI models simultaneously with live latency, throughput speed, and interactive blind voting.
          </p>
        </div>

        {/* Arena Controls Card */}
        <div className="p-4 sm:p-6 rounded-[32px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl mb-8 space-y-4">
          {/* Model Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-200">Model A (Left Pane)</span>
                <span className="text-[10px] text-zinc-400 font-mono">Wins: {scores.modelA}</span>
              </div>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-hidden focus:border-zinc-500"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-200">Model B (Right Pane)</span>
                <span className="text-[10px] text-zinc-400 font-mono">Wins: {scores.modelB}</span>
              </div>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-hidden focus:border-zinc-500"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Duel Prompt</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt to test both models simultaneously..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-500"
              />
              <button
                type="button"
                onClick={handleStartBattle}
                disabled={isBattling}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-md cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>{isBattling ? 'Evaluating...' : 'Run Duel'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Test Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-500">Presets:</span>
            {presetTests.map((test, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(test)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
              >
                {test}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Dual Response Windows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Pane A */}
          <div
            className={`p-6 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border transition shadow-2xl flex flex-col justify-between ${
              winner === 'A' ? 'border-white bg-zinc-900/80' : 'border-zinc-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span className="font-bold text-sm text-white">{modelA}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3 h-3" /> ~145ms
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Gauge className="w-3 h-3" /> 138 tok/s
                  </span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line min-h-[140px]">
                {responseA}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleVote('A')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  winner === 'A'
                    ? 'bg-white text-zinc-950 shadow-md'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{winner === 'A' ? 'Winner Voted!' : 'Vote for Model A'}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/chat?q=${encodeURIComponent(prompt)}`)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Pane B */}
          <div
            className={`p-6 rounded-[32px] bg-zinc-900/40 backdrop-blur-xl border transition shadow-2xl flex flex-col justify-between ${
              winner === 'B' ? 'border-white bg-zinc-900/80' : 'border-zinc-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span className="font-bold text-sm text-white">{modelB}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3 h-3" /> ~280ms
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Gauge className="w-3 h-3" /> 88 tok/s
                  </span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line min-h-[140px]">
                {responseB}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleVote('B')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  winner === 'B'
                    ? 'bg-white text-zinc-950 shadow-md'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{winner === 'B' ? 'Winner Voted!' : 'Vote for Model B'}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/chat?q=${encodeURIComponent(prompt)}`)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="text-xs text-zinc-400">
            Want full multi-turn conversational arena? Open the unified Chat Studio.
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/voice"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-300 hover:text-white transition"
            >
              Test Voice Studio →
            </Link>
            <Link
              href="/chat"
              className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold transition shadow-xs"
            >
              Launch Chat Studio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
