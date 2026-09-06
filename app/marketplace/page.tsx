'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar12, Mobile3 } from '@/components/reactbits';
import {
  Store,
  Search,
  Bot,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
  Inbox,
  Filter,
} from 'lucide-react';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'installed'>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden bg-zinc-950 text-zinc-100 selection:bg-zinc-800 pb-24 md:pb-12 flex flex-col justify-between">
      {/* Background Subtle Monochrome Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      {/* 1. Desktop Navbar-12 */}
      <Navbar12 />

      {/* 2. Main Marketplace Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs mb-3 shadow-xs">
            <Store className="w-3.5 h-3.5 text-white" />
            <span>Extensions & Skills • Agent Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Agent Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Discover, add, and deploy specialized autonomous agents directly to your Chat Studio.
          </p>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-[28px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl mb-8">
          {/* Tabs: Explore vs Installed */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
              }`}
            >
              Explore Agents
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('installed')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'installed'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
              }`}
            >
              Added to My Studio (0)
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search marketplace agents..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-500"
            />
          </div>
        </div>

        {/* DELIBERATE CLEAN EMPTY STATE (Requested: "فعلا ایجنت نداشته باشه صفحه خالی باشه تا بعد بگم چه ایجنت هایی بزاریم توش") */}
        <div className="rounded-[36px] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-2xl my-8">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-400 mx-auto flex items-center justify-center mb-5 shadow-xs">
            <Bot className="w-8 h-8 text-white stroke-[1.7]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
            {activeTab === 'explore'
              ? 'No Agents Listed in Marketplace Yet'
              : 'No Custom Agents Installed'}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto mb-6">
            {activeTab === 'explore'
              ? 'The agent catalog is currently empty while we prepare the official collection. Once custom agents are added, you will be able to install them with a single click to run inside your Chat Studio.'
              : 'You have not added any external marketplace agents to your workspace yet. When you add agents, their tools, prompts, and autonomous hooks will appear in your Studio.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition shadow-md cursor-pointer"
            >
              <span>Launch Default Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs transition cursor-pointer"
            >
              <span>Manage Models & Keys</span>
            </Link>
          </div>
        </div>
      </main>

      {/* 3. Floating Mobile Bottom Dock */}
      <Mobile3 />
    </div>
  );
}
