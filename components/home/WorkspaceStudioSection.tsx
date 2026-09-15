'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Bot,
  Plus,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Terminal,
  Activity,
  Github,
  Database,
  MessageSquare,
  Figma,
  CreditCard,
  FileText,
  Workflow,
  Cpu,
  RefreshCw,
  Play,
  Sliders,
  Shield,
  Search,
} from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  stats: string;
  status: 'active' | 'standby';
  isFree: boolean;
}

interface DomainPreset {
  id: string;
  label: string;
  workspaceName: string;
  agentName: string;
  agentRole: string;
  agentEngine: string;
  defaultExtensions: Extension[];
}

const DOMAIN_PRESETS: DomainPreset[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    workspaceName: 'Autonomous Cloud Engineering Lab',
    agentName: 'Nova-DevSecOps',
    agentRole: 'Lead Autonomous Systems & CI Engineer',
    agentEngine: 'gemini-2.5-pro',
    defaultExtensions: [
      {
        id: 'ext-gh',
        name: 'GitHub CI & PR Autopilot',
        category: 'DevOps',
        description: 'Auto-reviews code, runs regression tests, and merges verified branches.',
        icon: Github,
        iconBg: 'bg-zinc-800 text-white',
        iconColor: 'text-white',
        stats: '1,420 PRs Triaged',
        status: 'active',
        isFree: true,
      },
      {
        id: 'ext-pg',
        name: 'PostgreSQL & Vector Memory',
        category: 'Database',
        description: 'Semantic vector search and natural-language SQL schema indexing.',
        icon: Database,
        iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        iconColor: 'text-blue-400',
        stats: '84k Queries/mo',
        status: 'active',
        isFree: true,
      },
      {
        id: 'ext-slack',
        name: 'Slack Team Dispatcher',
        category: 'Sync',
        description: 'Dispatches real-time incident reports and automated sprint summaries.',
        icon: MessageSquare,
        iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        iconColor: 'text-emerald-400',
        stats: 'Sub-90ms Relay',
        status: 'active',
        isFree: true,
      },
    ],
  },
  {
    id: 'growth',
    label: 'Marketing & Growth',
    workspaceName: 'Omni-Channel Growth Intelligence',
    agentName: 'Astra-Growth',
    agentRole: 'AI Acquisition & Conversion Strategist',
    agentEngine: 'gemini-2.5-flash',
    defaultExtensions: [
      {
        id: 'ext-stripe',
        name: 'Stripe Revenue & Churn Radar',
        category: 'Analytics',
        description: 'Monitors LTV, flags churn risks, and triggers retention offers.',
        icon: CreditCard,
        iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        iconColor: 'text-purple-400',
        stats: '$2.4M Analyzed',
        status: 'active',
        isFree: true,
      },
      {
        id: 'ext-content',
        name: 'SEO & Copy Optimization Hub',
        category: 'Content',
        description: 'Generates high-ranking organic content and A/B test variations.',
        icon: FileText,
        iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        iconColor: 'text-amber-400',
        stats: '99.2% Rank Score',
        status: 'active',
        isFree: true,
      },
      {
        id: 'ext-comms',
        name: 'Community Discord & Slack Bot',
        category: 'Community',
        description: 'Engages inbound leads and answers technical documentation questions.',
        icon: MessageSquare,
        iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        iconColor: 'text-cyan-400',
        stats: '24/7 Response Rate',
        status: 'active',
        isFree: true,
      },
    ],
  },
  {
    id: 'design',
    label: 'Product & Design',
    workspaceName: 'Design Systems & UX Forge',
    agentName: 'Iris-UX',
    agentRole: 'Design Token & Interaction Architect',
    agentEngine: 'gemini-2.5-pro',
    defaultExtensions: [
      {
        id: 'ext-figma',
        name: 'Figma Token & Asset Bridge',
        category: 'Design',
        description: 'Syncs Figma variables directly into Tailwind CSS and React components.',
        icon: Figma,
        iconBg: 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
        iconColor: 'text-pink-400',
        stats: '340 Components',
        status: 'active',
        isFree: true,
      },
      {
        id: 'ext-docs',
        name: 'PRD & Spec Documenter',
        category: 'Product',
        description: 'Synthesizes customer interview recordings into technical specifications.',
        icon: FileText,
        iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        iconColor: 'text-emerald-400',
        stats: 'Instant PRD Drafts',
        status: 'active',
        isFree: true,
      },
      {
        id: 'ext-code',
        name: 'Component Code Exporter',
        category: 'Frontend',
        description: 'Transpiles wireframes into accessible Next.js and Tailwind code.',
        icon: Github,
        iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        iconColor: 'text-blue-400',
        stats: 'Zero Manual Boilerplate',
        status: 'active',
        isFree: true,
      },
    ],
  },
];

// Available Marketplace items to add/swap
const MARKETPLACE_CATALOG: Extension[] = [
  {
    id: 'ext-jira',
    name: 'Jira & Linear Auto-Triage',
    category: 'Management',
    description: 'Auto-prioritizes bug reports and drafts sprint retrospectives.',
    icon: Workflow,
    iconBg: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    iconColor: 'text-indigo-400',
    stats: '5x Sprint Velocity',
    status: 'active',
    isFree: true,
  },
  {
    id: 'ext-sec',
    name: 'Snyk & CVE Security Shield',
    category: 'Security',
    description: 'Autonomous container vulnerability scanner and auto-patcher.',
    icon: Shield,
    iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    iconColor: 'text-rose-400',
    stats: 'Zero-Day Audit',
    status: 'active',
    isFree: true,
  },
];

export function WorkspaceStudioSection() {
  const [selectedDomain, setSelectedDomain] = useState('engineering');
  const activePreset = DOMAIN_PRESETS.find((p) => p.id === selectedDomain) || DOMAIN_PRESETS[0];

  const [activeExtensions, setActiveExtensions] = useState<Extension[]>(activePreset.defaultExtensions);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  // When domain changes, reset extensions
  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    const found = DOMAIN_PRESETS.find((p) => p.id === domainId);
    if (found) {
      setActiveExtensions(found.defaultExtensions);
      setSimStep(0);
      setIsSimulating(false);
    }
  };

  // Run simulated agent-extension execution pipeline
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 1000);
    setTimeout(() => setSimStep(3), 2200);
    setTimeout(() => {
      setSimStep(4);
      setTimeout(() => setIsSimulating(false), 1200);
    }, 3400);
  };

  // Toggle extension status
  const toggleExtension = (id: string) => {
    setActiveExtensions((prev) =>
      prev.map((ext) =>
        ext.id === id
          ? { ...ext, status: ext.status === 'active' ? 'standby' : 'active' }
          : ext
      )
    );
  };

  return (
    <section
      id="workspace-studio-section"
      className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      {/* Background Aurora Mesh Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.16)_0%,rgba(6,182,212,0.08)_45%,transparent_70%)] blur-[100px] pointer-events-none -z-10"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-medium mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AUTONOMOUS WORKSPACE STUDIO</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3"
        >
          Build Your Intelligent AI Workspace
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Turn daily operations into automated workflows. Equip your profession with specialized
          marketplace extensions and a dedicated autonomous agent.
        </motion.p>

        {/* Free Plan Callout Chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300">
            <strong className="text-white font-semibold">Free Plan:</strong> 1 Active Workspace + 3 Free Marketplace Extensions
          </span>
        </motion.div>
      </div>

      {/* Domain Selection Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {DOMAIN_PRESETS.map((domain) => {
          const isSelected = selectedDomain === domain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => handleDomainChange(domain.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-white text-zinc-950 shadow-lg shadow-white/10 scale-105'
                  : 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Glassmorphic Workspace Cockpit */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full rounded-[28px] sm:rounded-[36px] bg-zinc-950/60 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 sm:p-7 md:p-8 relative overflow-hidden"
      >
        {/* Subtle interior glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)] pointer-events-none -z-0"
        />

        {/* Workspace Top Meta Bar */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
              <Briefcase className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {activePreset.workspaceName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold">
                  ● Workspace 1 of 1 (Free)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Domain: <span className="text-zinc-200 font-medium">{activePreset.label}</span> • Environment ID:{' '}
                <span className="font-mono text-zinc-400">ws-{selectedDomain}-prod</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 text-purple-400 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating Pipeline...' : 'Test Agent Execution'}</span>
            </button>

            <Link
              href="/workspace"
              className="px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bento Grid: 2 Columns (Dedicated Agent Persona on Left, 3/3 Extensions Rack on Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          
          {/* Column 1: Dedicated Autonomous Agent Card (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-[24px] sm:rounded-[28px] bg-white/[0.03] border border-white/10 p-5 sm:p-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>DEDICATED AUTONOMOUS AGENT</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono font-bold">
                  {activePreset.agentEngine}
                </span>
              </div>

              {/* Agent Identity Box */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-mono font-bold text-sm">
                    {activePreset.agentName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{activePreset.agentName}</h4>
                    <p className="text-xs text-zinc-400">{activePreset.agentRole}</p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Telemetry</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Continuous Loop
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Active Context</span>
                    <span className="text-white font-semibold mt-0.5 block">128k Tokens</span>
                  </div>
                </div>
              </div>

              {/* Live Agent Execution Simulation Console */}
              <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    Agent Event Stream
                  </span>
                  <span className="text-[10px] text-emerald-400">200 OK</span>
                </div>

                <div className="space-y-1.5 text-[11px] min-h-[90px] flex flex-col justify-center">
                  {simStep === 0 && (
                    <p className="text-zinc-500 italic">
                      Ready. Click &quot;Test Agent Execution&quot; to simulate real-time coordination across your 3 extensions.
                    </p>
                  )}
                  {simStep >= 1 && (
                    <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-300">
                      <span className="text-purple-400 font-bold">[Trigger]</span> User event received. Agent formulating task plan...
                    </motion.p>
                  )}
                  {simStep >= 2 && (
                    <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-cyan-300">
                      <span className="text-cyan-400 font-bold">[Extension]</span> {activeExtensions[0]?.name}: Dispatched query payload.
                    </motion.p>
                  )}
                  {simStep >= 3 && (
                    <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-amber-300">
                      <span className="text-amber-400 font-bold">[Extension]</span> {activeExtensions[1]?.name}: Synthesizing state response.
                    </motion.p>
                  )}
                  {simStep >= 4 && (
                    <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-300">
                      <span className="text-emerald-400 font-bold">[Success]</span> Workflow completed in 184ms. Notification dispatched.
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade Note */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Multi-Agent Mesh available on Pro</span>
              </span>
              <Link href="/pricing" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                View Plans
              </Link>
            </div>
          </div>

          {/* Column 2: Marketplace Extensions Rack - Free Plan: 3 Slots (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[24px] sm:rounded-[28px] bg-white/[0.03] border border-white/10 p-5 sm:p-6">
            <div>
              {/* Header with Slot Counter */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Marketplace Extension Slots</h4>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Connect specialized tools to automate your profession.
                  </p>
                </div>

                {/* Free Slot Progress Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-white/10 text-xs font-mono">
                  <span className="text-zinc-400">Free Slots:</span>
                  <span className="text-emerald-400 font-bold">3 / 3 Active</span>
                  <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden ml-1">
                    <div className="w-full h-full bg-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Active Extension Slots List */}
              <div className="space-y-3">
                {activeExtensions.map((ext, idx) => {
                  const Icon = ext.icon;
                  const isActive = ext.status === 'active';

                  return (
                    <motion.div
                      key={ext.id}
                      layout
                      className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${ext.iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-zinc-500 uppercase">Slot {idx + 1}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition">
                              {ext.name}
                            </h5>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 font-mono">
                              {ext.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 max-w-md">{ext.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <span className="text-[11px] font-mono text-zinc-400">{ext.stats}</span>

                        <button
                          type="button"
                          onClick={() => toggleExtension(ext.id)}
                          className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-500 hover:text-white border border-zinc-700'
                          }`}
                        >
                          {isActive ? '● Enabled' : '○ Standby'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Locked Slot 4 Preview (Visualizing Plan Expansion) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950/40 border border-dashed border-white/10 flex items-center justify-between gap-3 text-zinc-500">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-zinc-600">Slot 4</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-xs sm:text-sm font-semibold text-zinc-400">
                          Custom Webhook & API Extension
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-mono font-bold">
                          PRO TIER
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Upgrade your plan to unlock unlimited extension slots and custom private plugins.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/marketplace"
                    className="shrink-0 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <span>Browse Store</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Footer Information */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Extensions run in isolated secure sandboxes with zero data-leakage guarantees.</span>
              </div>

              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 text-white hover:text-purple-300 font-bold transition shrink-0"
              >
                <span>Explore 100+ Marketplace Extensions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Plan Comparison Summary Banner */}
        <div className="relative z-10 mt-6 p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
              ★
            </div>
            <div>
              <div className="text-xs font-bold text-white">Need multiple workspaces or team collaboration?</div>
              <div className="text-[11px] text-zinc-400">
                Pro & Enterprise tiers offer unlimited workspaces, dedicated GPUs, and multi-agent coordination.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link
              href="/workspace"
              className="px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
            >
              Create Free Workspace
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
