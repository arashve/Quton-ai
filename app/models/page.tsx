'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar12, Mobile3 } from '@/components/reactbits';
import {
  Cpu,
  Zap,
  Clock,
  Gauge,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  Search,
  Filter,
} from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  provider: 'gemini' | 'groq' | 'ollama';
  providerLabel: string;
  badgeColor: string;
  ttft: string;
  throughput: string;
  contextWindow: string;
  reasoning: string;
  description: string;
  tags: string[];
}

const MODELS_DATA: ModelInfo[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    providerLabel: 'Google Gemini',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    ttft: '140 - 160ms',
    throughput: '135 - 150 tok/s',
    contextWindow: '1,048,576 tokens',
    reasoning: 'High (Adaptive Thought)',
    description: 'Next-generation multimodal workhorse with breakthrough latency and native real-time tool grounding.',
    tags: ['Ultra Low Latency', 'Multimodal', 'Production Default'],
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    providerLabel: 'Google Gemini',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    ttft: '250 - 300ms',
    throughput: '80 - 95 tok/s',
    contextWindow: '2,097,152 tokens',
    reasoning: 'Maximal (Deep Cognitive Chains)',
    description: 'Premier cognitive reasoning model designed for complex multi-step analysis, coding synthesis, and logic proofs.',
    tags: ['Deep Reasoning', '2M Context', 'Code Specialist'],
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'groq',
    providerLabel: 'Groq LPU',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ttft: '170 - 200ms',
    throughput: '450 - 520 tok/s',
    contextWindow: '131,072 tokens',
    reasoning: 'High',
    description: 'Open-weight foundation model accelerated on Groq LPU hardware for unprecedented token generation velocity.',
    tags: ['500+ tok/s', 'Groq LPU', 'High Velocity'],
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    providerLabel: 'Google Gemini',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    ttft: '180 - 220ms',
    throughput: '110 - 130 tok/s',
    contextWindow: '1,048,576 tokens',
    reasoning: 'Medium',
    description: 'Lightweight foundation model suited for high-frequency microtasks and rapid conversational utilities.',
    tags: ['Fast', 'Low Cost', 'Multimodal'],
  },
  {
    id: 'deepseek-r1:latest',
    name: 'DeepSeek R1',
    provider: 'ollama',
    providerLabel: 'Local Ollama',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    ttft: 'Hardware Dependent',
    throughput: 'Hardware Dependent',
    contextWindow: '65,536 tokens',
    reasoning: 'Deep Step-by-Step Chain',
    description: 'Fully private local reasoning model running directly on your machine with zero external telemetry.',
    tags: ['100% Private', 'Offline', 'Reasoning Chain'],
  },
];

export default function ModelsMatrixPage() {
  const router = useRouter();
  const [filterProvider, setFilterProvider] = useState<'all' | 'gemini' | 'groq' | 'ollama'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = MODELS_DATA.filter((m) => {
    const matchesProvider = filterProvider === 'all' || m.provider === filterProvider;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesProvider && matchesSearch;
  });

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden bg-zinc-950 text-zinc-100 selection:bg-purple-500/30 pb-24 md:pb-12">
      {/* 1. Desktop Navbar-12 */}
      <Navbar12 />

      {/* 2. Mobile Bottom Dock (Mobile-3) */}
      <Mobile3 />

      {/* Background Aurora Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Page Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Test Page • Model Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Foundation Engines & Benchmark Matrix
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Compare token latency, processing throughput, reasoning depths, and memory context windows across all connected providers.
          </p>
        </div>

        {/* Search & Provider Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl mb-8">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Engines' },
              { id: 'gemini', label: 'Google Gemini' },
              { id: 'groq', label: 'Groq LPU' },
              { id: 'ollama', label: 'Local Ollama' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterProvider(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  filterProvider === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name or tag..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500"
            />
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredModels.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col justify-between hover:border-white/30 transition duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                    {m.providerLabel}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">v2.5 Ready</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {m.description}
                </p>

                {/* Benchmark Metrics */}
                <div className="space-y-2 p-3 rounded-2xl bg-zinc-950/60 border border-white/10 text-xs font-mono mb-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Latency (TTFT):</span>
                    <span className="text-emerald-400 font-semibold">{m.ttft}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Throughput:</span>
                    <span className="text-purple-300 font-semibold">{m.throughput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Context Limit:</span>
                    <span className="text-cyan-300">{m.contextWindow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Reasoning:</span>
                    <span className="text-zinc-300">{m.reasoning}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/arena"
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  Arena Duel
                </Link>
                <button
                  type="button"
                  onClick={() => router.push(`/chat?prompt=Test%20and%20benchmark%20${encodeURIComponent(m.name)}`)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer shadow-md shadow-purple-600/20"
                >
                  <span>Test in Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
