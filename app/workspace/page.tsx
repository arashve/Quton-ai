'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
  Palette,
  Clock,
  Globe,
  User,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react';
import { PageContainer, SectionCard, ButtonGroup } from '@/components/shell';
import { WorkspaceLaunchSetup } from '@/components/workspace/WorkspaceLaunchSetup';
import {
  WorkspaceLaunchConfig,
  getWorkspaceLaunchConfig,
  AURORA_PRESETS_META,
  AVATAR_PRESETS,
  TIMEZONE_OPTIONS,
} from '@/lib/workspaceLaunchStorage';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const setupParam = searchParams.get('setup');
  const planParam = searchParams.get('plan');

  const [config, setConfig] = useState<WorkspaceLaunchConfig>(() => {
    const loaded = getWorkspaceLaunchConfig();
    if (planParam === 'Free' || planParam === 'Pro') {
      return { ...loaded, plan: planParam };
    }
    return loaded;
  });
  const [showSetup, setShowSetup] = useState<boolean>(() => setupParam === 'true');
  const [activeTab, setActiveTab] = useState<'agents' | 'pipelines' | 'telemetry'>('agents');
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Listen to updates from localStorage/custom event
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
      }
    };
    window.addEventListener('workspace-config-updated', handleUpdate);
    return () => window.removeEventListener('workspace-config-updated', handleUpdate);
  }, []);

  // Update clock based on timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: config.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setCurrentTimeStr(timeFormatter.format(new Date()));
      } catch {
        const now = new Date();
        setCurrentTimeStr(
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [config.timezone]);

  const auroraMeta = AURORA_PRESETS_META[config.auroraPreset] || AURORA_PRESETS_META['nebula-purple'];
  const avatarPresetObj = AVATAR_PRESETS.find((p) => p.id === config.avatarPreset);
  const timezoneObj = TIMEZONE_OPTIONS.find((t) => t.id === config.timezone);

  const agents = [
    {
      id: 'agent-1',
      name: `${config.fullName?.split(' ')[0] || 'Autonomous'} Web Researcher`,
      status: 'Ready',
      engine: config.agentEngine || 'gemini-2.5-flash',
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
    <div className="relative min-h-screen">
      {/* Background Aurora Mesh Glows based on Pro Customization */}
      {config.uiCustomizationMode === 'custom' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div
            className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full ${auroraMeta.blob1} blur-[140px] opacity-70`}
          />
          <div
            className={`absolute top-1/2 right-10 w-[500px] h-[500px] rounded-full ${auroraMeta.blob2} blur-[160px] opacity-60`}
          />
          <div
            className={`absolute bottom-10 left-1/3 w-[550px] h-[550px] rounded-full ${auroraMeta.blob3} blur-[180px] opacity-50`}
          />
        </div>
      )}

      {/* SETUP VIEW (When launched or clicked) */}
      <AnimatePresence mode="wait">
        {showSetup ? (
          <motion.div
            key="setup-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="py-6 px-4 sm:px-8"
          >
            <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSetup(false)}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-2 transition cursor-pointer"
              >
                <span>← Back to Active Workspace</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span>Active Mode:</span>
                <strong className="text-zinc-300 capitalize">{config.plan} Tier</strong>
              </div>
            </div>

            <WorkspaceLaunchSetup
              onComplete={(updated) => {
                setConfig(updated);
                setShowSetup(false);
              }}
              onCancel={() => setShowSetup(false)}
              isModal={false}
            />
          </motion.div>
        ) : (
          /* WORKSPACE MAIN VIEW */
          <motion.div
            key="workspace-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PageContainer
              variant="studio"
              maxWidth="xl"
              title={config.workspaceName || 'Studio Workspace'}
              description="Orchestrate autonomous agent pipelines, monitor execution graphs, and inspect live inference telemetry."
              headerAction={
                <div className="flex items-center gap-2.5">
                  {/* Launch Setup / Customize UI Button */}
                  <button
                    type="button"
                    onClick={() => setShowSetup(true)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>Workspace Setup & UI</span>
                    {config.plan === 'Pro' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>

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
                
                {/* User Config Profile HUD Banner (Apple-Grade Borderless) */}
                <div
                  className={`rounded-[28px] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
                    config.uiCustomizationMode === 'custom' && config.glassStyle === 'frosted'
                      ? 'bg-[#18181c]/80 backdrop-blur-3xl'
                      : 'bg-[#18181c]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* User Avatar */}
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#26262b] flex items-center justify-center shadow-md">
                      {config.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={config.avatarUrl}
                          alt="Profile Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : avatarPresetObj ? (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${avatarPresetObj.gradient} flex items-center justify-center text-2xl`}
                        >
                          <span>{avatarPresetObj.iconText}</span>
                        </div>
                      ) : (
                        <span className="text-base font-bold font-mono text-white">
                          {config.fullName?.substring(0, 2).toUpperCase() || 'SR'}
                        </span>
                      )}
                    </div>

                    {/* Name, Role and Domain */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {config.fullName || 'Sam Rivera'}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            config.plan === 'Pro'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {config.plan} Plan
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {config.jobTitle || 'Product Engineer'} •{' '}
                        <span className="text-zinc-300 font-medium">
                          {config.workspaceName || 'Autonomous Cloud Lab'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right Status Chips: Timezone, UI Preset & Engine */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Timezone Chip */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#141416] flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-zinc-300 font-medium">
                        {timezoneObj?.label.split(' ')[0] || 'Berlin'}
                      </span>
                      {currentTimeStr && (
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {currentTimeStr}
                        </span>
                      )}
                    </div>

                    {/* Pro Theme Badge */}
                    {config.plan === 'Pro' && config.uiCustomizationMode === 'custom' && (
                      <div className="px-3 py-1.5 rounded-xl bg-[#141416] flex items-center gap-2 text-xs">
                        <div
                          className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${auroraMeta.previewGlow}`}
                        />
                        <span className="text-zinc-300 font-mono text-[11px]">
                          {auroraMeta.name}
                        </span>
                      </div>
                    )}

                    {/* Engine Badge */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#141416] flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px]">{config.agentEngine}</span>
                    </div>

                    {/* Re-trigger Setup Link */}
                    <button
                      type="button"
                      onClick={() => setShowSetup(true)}
                      className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition cursor-pointer"
                    >
                      Change Setup
                    </button>
                  </div>
                </div>

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

                {/* Tab 1: Agent Fleet */}
                {activeTab === 'agents' && (
                  <div
                    className={`grid grid-cols-1 ${
                      config.uiDensity === 'compact' ? 'md:grid-cols-4 gap-3' : 'md:grid-cols-3 gap-5'
                    }`}
                  >
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
                            <span className="text-zinc-500 font-mono">
                              {agent.runs} Executions
                            </span>
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

                {/* Tab 2: Pipelines */}
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
                        Pipeline configured for {config.workspaceName || 'Autonomous Lab'} with {config.agentEngine}.
                      </p>
                    </div>
                  </SectionCard>
                )}

                {/* Tab 3: Telemetry */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
