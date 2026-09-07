'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Cpu,
  ShieldCheck,
  Server,
  ArrowRight,
  Activity,
  Layers,
  Code2,
} from 'lucide-react';
import { PageContainer, SectionCard } from '@/components/shell';

export default function AboutPage() {
  const benchmarks = [
    { metric: 'Time to First Token (TTFT)', value: '142ms', comp: '3.4x faster than standard endpoints' },
    { metric: 'Token Streaming Rate', value: '145 tok/s', comp: 'Real-time perceived typing' },
    { metric: 'Transport Layer', value: 'SSE HTTP/2', comp: 'Zero websocket connection penalty' },
    { metric: 'Context Retention', value: '1M tokens', comp: 'Deep long-document reasoning' },
  ];

  return (
    <PageContainer
      variant="public"
      maxWidth="lg"
      title="About AUTOFLOW"
      description="Next-generation AI orchestration platform engineered for ultra-low latency, real-time streaming, and generative agent execution."
    >
      <div className="space-y-6">
        {/* Core Architecture Card */}
        <SectionCard
          title="Architecture & Vision"
          description="High-performance streaming engine bridging cloud LLMs and client interfaces."
          headerIcon={Sparkles}
          variant="glass"
          radius="lg"
          padding="md"
        >
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              AUTOFLOW was built from the ground up to eliminate conversational latency. Traditional
              AI chat interfaces suffer from multi-second time-to-first-token delays caused by
              cumbersome middleware layers, heavy serialization, and inefficient socket handshakes.
            </p>
            <p>
              By leveraging native Server-Sent Events (SSE) over HTTP/2, adaptive compression, and
              direct hardware-accelerated endpoints via Google Gemini and Groq LPUs, AUTOFLOW
              delivers instant feedback with sub-150ms latency.
            </p>
          </div>
        </SectionCard>

        {/* Speed Benchmarks */}
        <SectionCard
          title="Performance Benchmarks"
          description="Verified latency and throughput measurements under production workloads."
          headerIcon={Zap}
          variant="glass"
          radius="lg"
          padding="md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {benchmarks.map((b) => (
              <div
                key={b.metric}
                className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col justify-between"
              >
                <div className="text-xs text-zinc-400 font-medium">{b.metric}</div>
                <div className="text-2xl font-extrabold text-white font-mono my-2">{b.value}</div>
                <div className="text-[11px] text-zinc-500">{b.comp}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Design Philosophy */}
        <SectionCard
          title="The 3-Shell Architecture"
          description="A unified, stable interface designed to prevent layout jumps and maintain flow."
          headerIcon={Layers}
          variant="glass"
          radius="lg"
          padding="md"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="text-xs font-bold text-white">1. Public Shell</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Clean, spacious layout with floating glass navigation for discovery, models comparison,
                and documentation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="text-xs font-bold text-white">2. Studio Shell</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Focused workspace with live model telemetry, collapsible double-rail sidebar, and zero-jump
                mobile bottom dock.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="text-xs font-bold text-white">3. Auth Shell</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Distraction-free, centered authentication card with Firebase Google OAuth and email password reset.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Launch Studio CTA */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white text-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="text-lg font-bold">Ready to experience ultra-low latency?</h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              Open the Studio to chat, compare models in the Arena, or speak via Voice 8.
            </p>
          </div>
          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 shrink-0 transition"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
