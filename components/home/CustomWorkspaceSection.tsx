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
import ParticleText from '../ParticleText';

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
      className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.06)_45%,transparent_70%)] blur-[90px] pointer-events-none -z-10"
      />

      {/* Section Typography: Header & Subtitle matching the Figma design */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 w-full">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-3 max-w-full">
          <span className="leading-none mt-1 shrink-0">your custom</span>
          
          <div className="relative flex items-center justify-center h-[34px] sm:h-[48px] md:h-[60px] w-[130px] sm:w-[220px] md:w-[280px] mt-1 sm:mt-2.5 shrink-0">
            <ParticleText
              text="Workspace"
              particleSize={2.2}
              density={4}
              color="#f8fafc"
              highlightColor="#8b5cf6"
              scatter={190}
              gatherDuration={1500}
              stagger={100}
              pointerRepel={30}
              repelRadius={70}
              idleDrift={0.1}
              trigger="mount"
              fontSize="100%"
              fontWeight={800}
              fontFamily="inherit"
              glow={false}
            />
          </div>
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          A place to digitize and smarten up the workplace and tedious, repetitive processes.
        </p>
      </div>

      {/* Interactive Layout: Folder on Left, Card + Switcher on Right */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-14 md:gap-16">
        
        {/* LEFT COLUMN: The Custom Workspace Folder Graphic */}
       <div className="flex flex-col items-center">
          {/* Folder Image Container */}
          <div className="relative w-[230px] sm:w-[260px] h-[175px] sm:h-[195px] flex flex-col items-center justify-center">

            {/* Folder Front Main Flap / Body */}
         <AnimatePresence mode="wait">
              <motion.div
                key={currentWorkspace.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.25, type: 'spring', damping: 20 }}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
              >
                {/* 
                  فقط کافیه عکس Component 11 رو تو پوشه public/assets بذاری.
                  کلاس hue-rotate رنگ آبی رو به بنفش (growth) و سبز (engineering) شیفت میده.
                */}
             <Image
  src="/assets/folder-free.svg" /* <--- پسوند رو به svg تغییر بده */
  alt="Workspace"
  fill
  unoptimized /* <--- این رو برای SVG حتماً اضافه کن */
  className={`object-contain drop-shadow-2xl transition-all duration-700 ease-in-out ${
    currentWorkspace.id === 'growth' ? 'hue-rotate-[60deg]' :
    currentWorkspace.id === 'engineering' ? '-hue-rotate-[60deg]' :
    ''
  }`}
  priority
/>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Navigation Arrows (< and >) */}
         <div className="flex items-center gap-7 mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition cursor-pointer shadow-md active:scale-95 z-10"
              aria-label="Previous workspace"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition cursor-pointer shadow-md active:scale-95 z-10"
              aria-label="Next workspace"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Switcher + Input Card + Bottom Launch Actions */}
        <div className="flex flex-col items-center sm:items-start w-full max-w-[360px] sm:max-w-[420px]">
          
          {/* Top Pill Switcher: Idea | Plugin | Customize */}
          <div className="w-full p-1.5 rounded-full bg-[#1a1a1a] flex items-center justify-between gap-1 mb-4">
            {/* Idea Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('idea')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'idea'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Idea</span>
            </button>

            {/* Plugin Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('plugin')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'plugin'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Plugin</span>
            </button>

            {/* Customize Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>

          {/* Main Card Container (Flat & Matte style) */}
          <div className="w-full h-[160px] sm:h-[175px] rounded-[24px] bg-[#1a1a1a] p-5 flex flex-col justify-between relative">
            
            {/* TAB CONTENT 1: IDEA */}
            {activeTab === 'idea' && (
              <div className="flex flex-col justify-between h-full flex-1">
                {/* Textarea or Question Prompt */}
                <div className="w-full mb-2 flex-1">
                  <textarea
                    rows={3}
                    maxLength={charLimit}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    placeholder={currentWorkspace.defaultIdeaPrompt}
                    className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-600 resize-none outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Bottom Row Inside Card (No border, clean look) */}
                <div className="flex items-center justify-between mt-auto">
                  {/* Your Logo Pill with conditional Lock */}
                  <button
                    type="button"
                    onClick={() => setLogoModalOpen(!logoModalOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-[11px] font-medium text-zinc-400 transition cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-zinc-500" />
                    <span>your logo</span>
                    {/* قفل فقط در حالتی که tier برابر Free باشد نمایش داده می‌شود */}
                    {currentWorkspace.tier === 'Free' && (
                      <Lock className="w-3 h-3 text-zinc-500 ml-0.5" />
                    )}
                  </button>

                  {/* Character Count */}
                  <span className="text-[11px] font-mono text-zinc-600">
                    {charLimit - ideaText.length}
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: PLUGIN */}
            {activeTab === 'plugin' && (
              <div className="flex flex-col justify-between h-full flex-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-2">
                  <span>MARKETPLACE PLUGINS</span>
                  <span className="text-zinc-400 font-semibold">3/3 Free Slots</span>
                </div>

                <div className="space-y-1.5">
                  {currentWorkspace.plugins.map((plugin) => {
                    const Icon = plugin.icon;
                    return (
                      <div
                        key={plugin.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#242424] text-xs text-zinc-300"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-[11px] font-medium">{plugin.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Active</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: CUSTOMIZE */}
            {activeTab === 'customize' && (
              <div className="flex flex-col justify-between h-full flex-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-2">
                  <span>WORKSPACE SETTINGS</span>
                  <span className="text-zinc-600 text-[10px]">Tier: {currentWorkspace.tier}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#242424]">
                    <span className="text-[11px] text-zinc-300">Custom Branding & Logo</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Lock className="w-3 h-3" />
                      <span>Pro Plan</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#242424]">
                    <span className="text-[11px] text-zinc-300">Autonomous Agent Mesh</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Row Below Card: Copy URL & launch ↗ */}
          <div className="w-full flex items-center justify-end gap-5 mt-5">
            {/* Copy URL link/button */}
            <button
              type="button"
              onClick={handleCopyUrl}
              className="text-[11px] font-bold text-zinc-500 hover:text-white transition cursor-pointer flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-300" />
                  <span className="text-zinc-300">Copied!</span>
                </>
              ) : (
                <span>Copy URL</span>
              )}
            </button>

            {/* Launch Button (Matching Figma: White Pill, Black Text, Icon on Right) */}
            <Link
              href={`/workspace?tier=${currentWorkspace.id}&prompt=${encodeURIComponent(ideaText || currentWorkspace.defaultIdeaPrompt)}`}
              className="px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>launch</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
