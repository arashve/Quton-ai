'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Play,
  Settings,
  Plus,
  ArrowRight,
  Layers,
  Cpu,
  Activity,
  Zap,
  Boxes,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PageContainer, SectionCard, ButtonGroup } from '@/components/shell';

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<'agents' | 'pipelines' | 'telemetry'>('agents');

  const agents = [
    {
      id: 'agent-1',
      name: 'Real-time Web Researcher',
      status: 'Ready',
      engine: 'gemini-2.5-flash',
      tools: ['Web Search', 'HTML Scraper', 'Fact Checker'],
      runs: 142,
    },
    {
      id: 'agent-2',
      name: 'Full-Stack Code Synthesizer',
      status: 'Active',
      engine: 'gemini-2.5-pro',
      tools: ['AST Parser', 'Linter', 'Git Committer'],
      runs: 89,
    },
    {
      id: 'agent-3',
      name: 'Voice Telephony Assistant',
      status: 'Standby',
      engine: 'gemini-2.5-flash',
      tools: ['Audio STT', 'Real-time TTS', 'Interrupt Detector'],
      runs: 310,
    },
  ];

  return (
    <PageContainer
      variant="studio"
      maxWidth="xl"
      title="Studio Workspace"
      description="Orchestrate autonomous agent pipelines, monitor execution graphs, and inspect live inference telemetry."
      headerAction={
        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span>Open Chat Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Workspace Filter ButtonGroup */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <ButtonGroup
            items={[
              { id: 'agents', label: 'Agent Fleet', icon: Bot },
              { id: 'pipelines', label: 'Pipelines', icon: Layers },
              { id: 'telemetry', label: 'Inference Telemetry', icon: Activity },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as any)}
            size="sm"
          />

          <button
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy New Agent</span>
          </button>
        </div>

        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <SectionCard
                key={agent.id}
                title={agent.name}
                description={`Engine: ${agent.engine}`}
                headerIcon={Bot}
                badge={
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                    {agent.status}
                  </span>
                }
                radius="lg"
                padding="md"
              >
                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                      Enabled Tools
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.tools.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs">
                    <span className="text-zinc-500 font-mono">{agent.runs} Executions</span>
                    <Link
                      href={`/chat?agent=${encodeURIComponent(agent.name)}`}
                      className="inline-flex items-center gap-1 text-white hover:underline font-semibold"
                    >
                      <span>Run Agent</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        )}

        {activeTab === 'pipelines' && (
          <SectionCard
            title="Active Execution Graph"
            description="Visual pipeline representing message flow, vector embeddings, and streaming SSE tokens."
            headerIcon={Layers}
            radius="lg"
            padding="md"
          >
            <div className="p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
                  User Prompt Input
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-purple-300">
                  Tool Intent Classifier
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-300">
                  Gemini 2.5 Flash LPU
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300">
                  SSE Stream Yield
                </div>
              </div>
              <p className="text-xs text-zinc-400 max-w-md pt-2">
                Pipeline is operating at optimal nominal latency (142ms average TTFT across 5,000 requests).
              </p>
            </div>
          </SectionCard>
        )}

        {activeTab === 'telemetry' && (
          <SectionCard
            title="Real-time Inference Telemetry"
            description="System-wide token throughput and latency distribution metrics."
            headerIcon={Activity}
            radius="lg"
            padding="md"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-xs text-zinc-400">Current TTFT</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">142ms</div>
                <div className="text-[11px] text-emerald-400 mt-1">● 99.4% SLA compliance</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-xs text-zinc-400">Peak Streaming Speed</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">154 tok/s</div>
                <div className="text-[11px] text-zinc-400 mt-1">Google Cloud HTTP/2 SSE</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-xs text-zinc-400">Memory Pressure</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">18%</div>
                <div className="text-[11px] text-zinc-400 mt-1">Client DOM buffer stable</div>
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}
