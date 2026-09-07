'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Sparkles,
  MessageSquare,
  Columns,
  Mic,
  PanelLeft,
  Settings,
  Sliders,
  ChevronDown,
  Activity,
  Zap,
  LayoutGrid,
} from 'lucide-react';
import { TabBar } from './TabBar';
import { TabItem } from './types';

export interface StudioHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  activeModel?: string;
  activeProvider?: string;
  latencyMs?: number;
  onOpenModelModal?: () => void;
  headerActions?: React.ReactNode;
  className?: string;
}

export function StudioHeader({
  onToggleSidebar,
  isSidebarOpen = true,
  activeModel = 'gemini-2.5-flash',
  activeProvider = 'gemini',
  latencyMs = 142,
  onOpenModelModal,
  headerActions,
  className = '',
}: StudioHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const studioTabs: TabItem[] = [
    { id: '/chat', label: 'Chat', icon: MessageSquare },
    { id: '/arena', label: 'Arena', icon: Columns },
    { id: '/voice', label: 'Voice', icon: Mic },
  ];

  const handleTabChange = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <header
      id="app-studio-header"
      className={`h-14 sm:h-16 flex items-center justify-between px-3 sm:px-5 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl shrink-0 z-30 select-none ${className}`}
    >
      {/* Left: Sidebar Toggle & Studio Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer shrink-0"
            title="Toggle Sidebar (⌘B)"
          >
            <PanelLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 px-1 py-1 rounded-lg group cursor-pointer shrink-0"
          title="Return to Home"
        >
          <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors leading-none">
              AUTOFLOW
            </span>
            <span className="text-[10px] font-mono text-zinc-400 leading-tight">Studio</span>
          </div>
        </Link>
      </div>

      {/* Center: Studio Switcher Tabs (Chat, Arena, Voice) - Zero Jumping */}
      <div className="flex items-center justify-center flex-1 max-w-xs sm:max-w-md mx-2">
        <TabBar
          tabs={studioTabs}
          activeTab={
            pathname.startsWith('/arena')
              ? '/arena'
              : pathname.startsWith('/voice')
              ? '/voice'
              : '/chat'
          }
          onChange={handleTabChange}
          size="sm"
          variant="segmented"
          layoutIdPrefix="studio-header-tabs"
          className="shadow-sm"
        />
      </div>

      {/* Right: Active Model Pill, Latency Badge, Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Active Model Pill */}
        <button
          type="button"
          onClick={onOpenModelModal}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left cursor-pointer transition shadow-xs"
          title="Click to Switch Engine / Model"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs font-mono font-medium text-white max-w-[85px] sm:max-w-[140px] truncate">
            {activeModel}
          </span>
          <span className="hidden md:inline text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
            {activeProvider}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
        </button>

        {/* Latency Tag */}
        <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800/80 text-[10px] font-mono text-zinc-400">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{latencyMs}ms TTFT</span>
        </div>

        {/* Settings link */}
        <Link
          href="/settings"
          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer shrink-0"
          title="Studio Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {headerActions}
      </div>
    </header>
  );
}
