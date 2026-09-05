'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Pin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sliders,
  FolderKanban,
  FileText,
  Sun,
  Moon,
  X,
  Download,
  Bell,
  Check,
  CheckCheck,
  Users,
  Activity,
  Cpu,
  Zap,
  Bot,
  Layers,
  ShieldCheck,
  Circle,
  Clock,
  LayoutGrid,
} from 'lucide-react';
import type { ChatSession } from '../Chat';

export interface WorkspaceMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isAiAgent: boolean;
  status: 'online' | 'busy' | 'idle';
  currentActivity: string;
  latencyMs?: number;
  modelBadge?: string;
}

export interface ShellNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'stream' | 'model' | 'export' | 'system';
}

export interface AppShell9Props {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsLibraryOpen: (open: boolean) => void;
  onOpenModelModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProjectsModal: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onExportChat: (format: 'json' | 'md') => void;
  activeModel?: string;
  userEmail?: string;
}

const DEFAULT_MEMBERS: WorkspaceMember[] = [
  {
    id: 'agent_core',
    name: 'AutoFlow Core',
    role: 'Orchestrator Agent',
    avatar: 'A',
    isAiAgent: true,
    status: 'online',
    currentActivity: 'Streaming SSE completions',
    latencyMs: 142,
    modelBadge: '120B OSS',
  },
  {
    id: 'agent_research',
    name: 'Deep Research',
    role: 'Web Grounding Agent',
    avatar: 'R',
    isAiAgent: true,
    status: 'online',
    currentActivity: 'Live documentation indexer',
    latencyMs: 198,
    modelBadge: 'Gemini 2.5',
  },
  {
    id: 'agent_synth',
    name: 'Code Synthesizer',
    role: 'AST & Component Generator',
    avatar: 'C',
    isAiAgent: true,
    status: 'idle',
    currentActivity: 'Standing by for wireframes',
    latencyMs: 165,
    modelBadge: 'TypeScript',
  },
  {
    id: 'user_self',
    name: 'Elite Developer',
    role: 'Workspace Lead',
    avatar: 'U',
    isAiAgent: false,
    status: 'online',
    currentActivity: 'Active in chat session',
  },
];

const INITIAL_NOTIFICATIONS: ShellNotification[] = [
  {
    id: 'notif_1',
    title: 'SSE Stream Completed',
    description: 'Generated 482 tokens with 142ms TTFT over Groq Cloud.',
    time: '2m ago',
    read: false,
    type: 'stream',
  },
  {
    id: 'notif_2',
    title: 'High-Throughput Model Active',
    description: 'openai/gpt-oss-120b ready with ultra-low latency.',
    time: '15m ago',
    read: false,
    type: 'model',
  },
  {
    id: 'notif_3',
    title: 'Local Ollama Bridge Ready',
    description: 'Endpoint http://localhost:11434 verified for offline inference.',
    time: '1h ago',
    read: true,
    type: 'system',
  },
];

export const AppShell9: React.FC<AppShell9Props> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  setIsSearchOpen,
  setIsLibraryOpen,
  onOpenModelModal,
  onOpenAuthModal,
  onOpenProjectsModal,
  theme,
  toggleTheme,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onExportChat,
  activeModel = 'openai/gpt-oss-120b',
  userEmail = 'vafaeea.h7066@gmail.com',
}) => {
  // State
  const [activeWorkspace, setActiveWorkspace] = useState('AutoFlow AI Workspace');
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [pinnedSessionIds, setPinnedSessionIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<ShellNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const togglePinSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const pinnedSessions = useMemo(
    () => sessions.filter((s) => pinnedSessionIds.includes(s.id)),
    [sessions, pinnedSessionIds]
  );

  const unpinnedSessions = useMemo(
    () => sessions.filter((s) => !pinnedSessionIds.includes(s.id)),
    [sessions, pinnedSessionIds]
  );

  // 1. Slim Leftmost Icon & Presence Rail (Width: 64px)
  const slimRail = (
    <div className="w-16 h-full flex flex-col items-center justify-between py-3 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/90 dark:bg-zinc-950 flex-shrink-0 z-30 select-none">
      {/* Top Section: Workspace App Logo & Primary Actions */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Workspace Brand Squircle */}
        <div
          id="app-shell-brand-icon"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:scale-105 transition-transform relative group"
          title="Toggle Navigation Inset Panel"
        >
          <Sparkles className="w-5 h-5" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-100 dark:border-zinc-950" />
        </div>

        <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-1" />

        {/* Quick New Interaction */}
        <button
          id="app-shell-rail-new-chat"
          type="button"
          onClick={() => {
            onNewChat();
            if (isMobileOpen) setIsMobileOpen(false);
          }}
          className="w-10 h-10 rounded-xl bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center transition cursor-pointer group relative"
          title="New Interaction (⌘N)"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {/* Tooltip */}
          <span className="absolute left-14 px-2 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[11px] whitespace-nowrap font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
            New Chat
          </span>
        </button>

        {/* Search Command Dialog Trigger */}
        <button
          id="app-shell-rail-search"
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer group relative"
          title="Search Conversations (⌘K)"
        >
          <Search className="w-4 h-4" />
          <span className="absolute left-14 px-2 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[11px] whitespace-nowrap font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
            Search (⌘K)
          </span>
        </button>

        {/* Templates & Specs */}
        <button
          id="app-shell-rail-templates"
          type="button"
          onClick={onOpenProjectsModal}
          className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer group relative"
          title="Architectural Specs & Templates"
        >
          <FolderKanban className="w-4 h-4" />
          <span className="absolute left-14 px-2 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[11px] whitespace-nowrap font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
            Specs & Templates
          </span>
        </button>

        {/* Model Config & Engines */}
        <button
          id="app-shell-rail-models"
          type="button"
          onClick={onOpenModelModal}
          className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer group relative"
          title="Inference Engines & Model Selection"
        >
          <Sliders className="w-4 h-4" />
          <span className="absolute left-14 px-2 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[11px] whitespace-nowrap font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
            Engine Config
          </span>
        </button>
      </div>

      {/* Middle Section: Active Inference Engine Indicator & Quick Navigation */}
      <div className="flex flex-col items-center gap-3 my-auto w-full py-3">
        {/* Pinned / Starred Quick Shortcut */}
        {pinnedSessions.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
            }}
            className="w-10 h-10 rounded-xl text-amber-500 hover:bg-amber-500/10 flex items-center justify-center transition cursor-pointer group relative"
            title={`${pinnedSessions.length} Pinned Sessions`}
          >
            <Pin className="w-4 h-4 fill-amber-500/20" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-black font-bold text-[9px] flex items-center justify-center">
              {pinnedSessions.length}
            </span>
            <span className="absolute left-14 px-2 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[11px] whitespace-nowrap font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
              Pinned ({pinnedSessions.length})
            </span>
          </button>
        )}

        {/* Real-time SSE Connection Status Capsule */}
        <div
          className="flex flex-col items-center gap-1.5 py-2 px-1 rounded-2xl bg-zinc-200/50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 group cursor-default relative"
          title="SSE Stream Connection: Ultra-Low Latency Active"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] font-mono uppercase font-bold tracking-tighter text-zinc-400 dark:text-zinc-500 rotate-90 my-2">
            LIVE
          </span>

          {/* Tooltip */}
          <div className="absolute left-14 top-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 min-w-[150px] text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SSE Pipeline Live</span>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
              Sub-50ms chunk delivery ready
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Notifications Feed, Theme & User Account */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* Notifications Feed Trigger */}
        <div className="relative" ref={notificationsRef}>
          <button
            id="app-shell-notifications-toggle"
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer relative"
            title="Activity & Notifications Feed"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Notifications Feed Popover */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 10 }}
                className="absolute bottom-0 left-14 w-80 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Notifications Feed
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Read</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-[10px] text-zinc-400 hover:text-red-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 no-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl transition text-left flex flex-col gap-1 ${
                        n.read
                          ? 'bg-zinc-50 dark:bg-zinc-950/50'
                          : 'bg-zinc-100 dark:bg-zinc-800/80 border-l-2 border-zinc-900 dark:border-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {n.title}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                        {n.description}
                      </p>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="py-6 text-center text-xs text-zinc-400">
                      All caught up! No active notifications.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Switcher Button */}
        <button
          id="app-shell-theme-btn"
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar */}
        <button
          id="app-shell-profile-btn"
          type="button"
          onClick={onOpenAuthModal}
          className="w-10 h-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-xs cursor-pointer hover:ring-2 hover:ring-zinc-400 transition"
          title="Account & Auth"
        >
          E
        </button>
      </div>
    </div>
  );

  // 2. Expandable Inset Sidebar (Width: 260px)
  const insetPanel = (
    <div className="flex flex-col h-full w-[260px] bg-zinc-50/80 dark:bg-zinc-900/60 border-r border-zinc-200/80 dark:border-zinc-800/80 select-none overflow-hidden text-zinc-800 dark:text-zinc-200">
      {/* Workspace Switcher Header */}
      <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2 relative">
        <div className="flex flex-col min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center justify-between text-left group cursor-pointer"
          >
            <span className="text-xs font-bold text-zinc-950 dark:text-white truncate">
              {activeWorkspace}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-transform ml-1 flex-shrink-0" />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Enterprise Pro</span>
          </div>
        </div>

        {/* Panel Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition cursor-pointer"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Workspace Menu Dropdown */}
        <AnimatePresence>
          {isWorkspaceMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-14 left-3 right-3 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 flex flex-col gap-1 text-xs"
            >
              {[
                { name: 'AutoFlow AI Workspace', type: 'Production Team' },
                { name: 'Research Lab', type: 'Agent Sandbox' },
                { name: 'Local Ollama Studio', type: 'Offline Cluster' },
              ].map((ws) => (
                <button
                  key={ws.name}
                  type="button"
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-left transition flex flex-col ${
                    activeWorkspace === ws.name
                      ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-950 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="font-semibold">{ws.name}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{ws.type}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Action Button */}
      <div className="p-3 space-y-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <button
          id="app-shell-new-chat-btn"
          type="button"
          onClick={() => {
            onNewChat();
            if (isMobileOpen) setIsMobileOpen(false);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Interaction</span>
        </button>

        {/* Quick Search */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full py-1.5 px-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800/70 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between gap-2 transition cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search history...</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            ⌘K
          </span>
        </button>
      </div>

      {/* AI Credit Usage Card (React Bits Pro App Shell 9 Feature) */}
      <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="p-3 rounded-2xl bg-zinc-200/50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Credit Quota</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
              74%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500"
              style={{ width: '74%' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
            <span>74,200 / 100K tokens</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">SSE Ready</span>
          </div>
        </div>
      </div>

      {/* Nav Content: Pinned Chats & Recent Conversations */}
      <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto space-y-4 no-scrollbar">
        {/* Pinned Chats */}
        {pinnedSessions.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Pin className="w-3 h-3 text-amber-500" />
              <span>Pinned ({pinnedSessions.length})</span>
            </div>
            <div className="space-y-1">
              {pinnedSessions.map((session) => {
                const isSelected = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      if (isMobileOpen) setIsMobileOpen(false);
                    }}
                    className={`p-2 rounded-xl flex items-center justify-between gap-2 transition-colors group cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-xs truncate">{session.title || 'Untitled Session'}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => togglePinSession(session.id, e)}
                        className="p-1 rounded text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        title="Unpin"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Recent Interactions
            </span>
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
            >
              All ({sessions.length})
            </button>
          </div>

          <div className="space-y-1">
            {unpinnedSessions.slice(0, 15).map((session) => {
              const isSelected = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center justify-between gap-2 transition-colors group cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                    <span className="text-xs truncate">{session.title || 'Untitled Session'}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => togglePinSession(session.id, e)}
                      className="p-1 rounded text-zinc-400 hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      title="Pin"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {sessions.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                No active conversations. Type a message below to begin!
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Inset Footer: Export & Specs Shortcut */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-950/40 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onExportChat('md')}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
          title="Export Thread to Markdown"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export MD</span>
        </button>

        <span className="text-[10px] font-mono text-zinc-400">v2.5 Shell 9</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Inset App Shell Sidebar (Double Rail: Slim + Inset) */}
      <aside className="hidden md:flex h-full flex-shrink-0 z-20">
        {slimRail}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {insetPanel}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Mobile Drawer (Combines Slim Rail & Inset Panel into sliding sheet) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Content Sheet */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative flex h-full z-10 shadow-2xl"
            >
              {slimRail}
              {insetPanel}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Re-export alias for seamless drop-in
export const AppSidebar = AppShell9;
