'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Puzzle,
  Sliders,
  Lock,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Check,
  Copy,
  Plus,
  Github,
  Database,
  MessageSquare,
  Workflow,
  CheckCircle2,
} from 'lucide-react';

interface WorkspaceOption {
  id: string;
  name: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  tabColor: string;
  gradient: string;
  defaultIdeaPrompt: string;
  plugins: { id: string; name: string; icon: React.ComponentType<{ className?: string }>; enabled: boolean }[];
}

const WORKSPACE_OPTIONS: WorkspaceOption[] = [
  {
    id: 'free',
    name: 'free workspace',
    tier: 'Free',
    tabColor: 'from-blue-600 to-blue-500',
    gradient: 'from-[#3c4048] via-[#24262b] to-[#16171a]',
    defaultIdeaPrompt: 'What would you like the product to do ?',
    plugins: [
      { id: 'p1', name: 'GitHub CI Autopilot', icon: Github, enabled: true },
      { id: 'p2', name: 'PostgreSQL Vector Search', icon: Database, enabled: true },
      { id: 'p3', name: 'Slack Dispatcher', icon: MessageSquare, enabled: true },
    ],
  },
  {
    id: 'growth',
    name: 'growth workspace',
    tier: 'Pro',
    tabColor: 'from-purple-600 to-indigo-500',
    gradient: 'from-[#423c4e] via-[#282430] to-[#16141a]',
    defaultIdeaPrompt: 'Automate inbound lead qualification and social media publishing',
    plugins: [
      { id: 'p4', name: 'Stripe Churn Radar', icon: Workflow, enabled: true },
      { id: 'p5', name: 'SEO Content Engine', icon: Database, enabled: true },
      { id: 'p6', name: 'Community Bot', icon: MessageSquare, enabled: true },
    ],
  },
  {
    id: 'engineering',
    name: 'dev lab workspace',
    tier: 'Pro',
    tabColor: 'from-emerald-600 to-teal-500',
    gradient: 'from-[#384640] via-[#222b27] to-[#141a17]',
    defaultIdeaPrompt: 'Review pull requests and enforce code architecture standards',
    plugins: [
      { id: 'p7', name: 'Docker Auto-Build', icon: Github, enabled: true },
      { id: 'p8', name: 'Snyk CVE Scanner', icon: Database, enabled: true },
      { id: 'p9', name: 'Linear Issue Sync', icon: Workflow, enabled: true },
    ],
  },
];

export function CustomWorkspaceSection() {
  const [activeTab, setActiveTab] = useState<'idea' | 'plugin' | 'customize'>('idea');
  const [workspaceIndex, setWorkspaceIndex] = useState(0);
  const [ideaText, setIdeaText] = useState('');
  const [copied, setCopied] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  const currentWorkspace = WORKSPACE_OPTIONS[workspaceIndex];
  const charLimit = 100;

  const handlePrev = () => {
    setWorkspaceIndex((prev) => (prev === 0 ? WORKSPACE_OPTIONS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setWorkspaceIndex((prev) => (prev === WORKSPACE_OPTIONS.length - 1 ? 0 : prev + 1));
  };

  const handleCopyUrl = async () => {
    try {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/workspace` : 'https://quton.ai/workspace';
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="custom-workspace"
      className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center justify-center select-none"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.06)_45%,transparent_70%)] blur-[90px] pointer-events-none -z-10"
      />

      {/* Section Typography: Header & Subtitle matching the Figma design */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white inline-flex items-center gap-2.5 flex-wrap justify-center">
          <span>your custom</span>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400 bg-clip-text text-transparent font-extrabold">
            Workspace
          </span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          A place to digitize and smarten up the workplace and tedious, repetitive processes.
        </p>
      </div>

      {/* Interactive Layout: Folder on Left, Card + Switcher on Right */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-14 md:gap-16">
        
        {/* LEFT COLUMN: The Custom Workspace Folder Graphic */}
        <div className="flex flex-col items-center">
          {/* Folder Graphic Container */}
          <div className="relative w-[230px] sm:w-[250px] h-[175px] sm:h-[190px] flex flex-col items-center justify-end">
            
            {/* Folder Back Tab (Blue / Accent Top-Left Tab) */}
            <div className="absolute top-0 left-0 w-[96px] sm:w-[105px] h-[32px] sm:h-[36px] rounded-t-[14px] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-md border-t border-l border-r border-blue-400/30" />
            
            {/* Folder Back Edge Extension */}
            <div className="absolute top-[8px] left-[88px] right-0 h-[24px] rounded-tr-[16px] bg-[#1a1c22] border-t border-r border-white/10" />

            {/* Folder Front Main Flap / Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWorkspace.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`relative z-10 w-full h-[155px] sm:h-[168px] rounded-[20px] bg-gradient-to-b ${currentWorkspace.gradient} border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-4 backdrop-blur-md overflow-hidden`}
              >
                {/* Subtle metallic diagonal sheen line */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,transparent_35%,rgba(255,255,255,0.03)_100%)] pointer-events-none"
                />

                {/* Quton Brand Mark in Metallic/Monochrome Center */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 opacity-55 flex items-center justify-center mb-2">
                  <Image
                    src="/assets/quton-dark.png"
                    alt="Workspace Brand"
                    width={56}
                    height={56}
                    className="object-contain filter grayscale brightness-125"
                    priority
                  />
                </div>

                {/* Workspace Name */}
                <span className="text-xs sm:text-sm font-medium tracking-tight text-zinc-400 font-sans">
                  {currentWorkspace.name}
                </span>

                {/* Free / Pro Tag */}
                {currentWorkspace.tier === 'Pro' && (
                  <span className="absolute top-3 right-3 text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    PRO
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows (< and >) */}
          <div className="flex items-center gap-7 mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition cursor-pointer shadow-md active:scale-95"
              aria-label="Previous workspace"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition cursor-pointer shadow-md active:scale-95"
              aria-label="Next workspace"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Switcher + Input Card + Bottom Launch Actions */}
        <div className="flex flex-col items-center sm:items-start w-full max-w-[360px] sm:max-w-[400px]">
          
          {/* Top Pill Switcher: Idea | Plugin | Customize */}
          <div className="w-full p-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-between gap-1 shadow-inner mb-3.5">
            {/* Idea Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('idea')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'idea'
                  ? 'bg-black text-white shadow-md border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Idea</span>
            </button>

            {/* Plugin Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('plugin')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'plugin'
                  ? 'bg-black text-white shadow-md border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Plugin</span>
            </button>

            {/* Customize Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-black text-white shadow-md border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>

          {/* Main Card Container */}
          <div className="w-full min-h-[155px] sm:min-h-[165px] rounded-[22px] sm:rounded-[26px] bg-[#141518]/90 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
            
            {/* TAB CONTENT 1: IDEA */}
            {activeTab === 'idea' && (
              <div className="flex flex-col justify-between h-full flex-1">
                {/* Textarea or Question Prompt */}
                <div className="w-full mb-3">
                  <textarea
                    rows={2}
                    maxLength={charLimit}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    placeholder={currentWorkspace.defaultIdeaPrompt}
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 resize-none outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Bottom Row Inside Card */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  {/* Your Logo Pill with Lock */}
                  <button
                    type="button"
                    onClick={() => setLogoModalOpen(!logoModalOpen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-zinc-400" />
                    <span>your logo</span>
                    <Lock className="w-2.5 h-2.5 text-zinc-500 ml-0.5" />
                  </button>

                  {/* Character Count */}
                  <span className="text-[11px] font-mono text-zinc-500">
                    {charLimit - ideaText.length}
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: PLUGIN */}
            {activeTab === 'plugin' && (
              <div className="flex flex-col justify-between h-full flex-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1 border-b border-white/5">
                  <span>MARKETPLACE PLUGINS</span>
                  <span className="text-emerald-400 font-semibold">3/3 Free Slots</span>
                </div>

                <div className="space-y-1.5">
                  {currentWorkspace.plugins.map((plugin) => {
                    const Icon = plugin.icon;
                    return (
                      <div
                        key={plugin.id}
                        className="flex items-center justify-between p-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-[11px] font-medium">{plugin.name}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/marketplace"
                  className="text-[10px] text-zinc-400 hover:text-white transition inline-flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3 text-purple-400" />
                  <span>Add from Marketplace</span>
                </Link>
              </div>
            )}

            {/* TAB CONTENT 3: CUSTOMIZE */}
            {activeTab === 'customize' && (
              <div className="flex flex-col justify-between h-full flex-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1 border-b border-white/5">
                  <span>WORKSPACE SETTINGS</span>
                  <span className="text-zinc-500 text-[10px]">Tier: {currentWorkspace.tier}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] text-zinc-300">Custom Branding & Logo</span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-400">
                      <Lock className="w-3 h-3" />
                      <span>Pro Plan</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[11px] text-zinc-300">Autonomous Agent Mesh</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500">
                  Configure custom domain and webhook endpoints in studio.
                </span>
              </div>
            )}
          </div>

          {/* Action Row Below Card: Copy URL & launch ↗ */}
          <div className="w-full flex items-center justify-end gap-3 mt-4">
            {/* Copy URL link/button */}
            <button
              type="button"
              onClick={handleCopyUrl}
              className="text-xs text-zinc-400 hover:text-white font-medium transition cursor-pointer flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <span>Copy URL</span>
              )}
            </button>

            {/* Launch Button */}
            <Link
              href={`/workspace?tier=${currentWorkspace.id}&prompt=${encodeURIComponent(ideaText || currentWorkspace.defaultIdeaPrompt)}`}
              className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-white/10 cursor-pointer active:scale-95"
            >
              <span>launch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
