'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  Zap,
  Store,
  Bell,
  Sun,
  Moon,
  CheckCheck,
  Download,
} from 'lucide-react';
import { StudioSession } from './types';
import { useAuth } from '@/context/AuthContext';
import { UserProfilePopup } from './UserProfilePopup';
import { DitherShader } from '@/components/ui/dither-shader';

export interface StudioSidebarProps {
  sessions?: StudioSession[];
  currentSessionId?: string;
  onSelectSession?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteSession?: (id: string, e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onOpenModelModal?: () => void;
  onOpenSearch?: () => void;
  userEmail?: string;
  className?: string;
}

export function StudioSidebar({
  sessions = [],
  currentSessionId = '',
  onSelectSession = () => {},
  onNewChat = () => {},
  onDeleteSession = () => {},
  isCollapsed = false,
  setIsCollapsed = () => {},
  isMobileOpen = false,
  setIsMobileOpen = () => {},
  onOpenModelModal,
  onOpenSearch,
  className = '',
}: StudioSidebarProps) {
  const { user } = useAuth();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState('AutoFlow Production');
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const pinnedSessions = useMemo(
    () => sessions.filter((s) => pinnedIds.includes(s.id)),
    [sessions, pinnedIds]
  );

  const unpinnedSessions = useMemo(
    () => sessions.filter((s) => !pinnedIds.includes(s.id)),
    [sessions, pinnedIds]
  );

  // Slim 64px Leftmost Rail
  const slimRail = (
    <div className="w-16 h-full flex flex-col items-center justify-between py-3 border-r border-zinc-800/80 bg-zinc-950 flex-shrink-0 z-30 select-none">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-3 w-full">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:scale-105 transition-transform"
          title="Toggle Navigation Inset"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-zinc-800 my-1" />

        <button
          type="button"
          onClick={onNewChat}
          className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 flex items-center justify-center transition cursor-pointer"
          title="New Interaction"
        >
          <Plus className="w-4 h-4" />
        </button>

        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer"
            title="Search Conversations"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <Link
          href="/marketplace"
          className="w-10 h-10 rounded-xl text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 flex items-center justify-center transition cursor-pointer"
          title="Agent Marketplace"
        >
          <Store className="w-4 h-4" />
        </Link>

        {onOpenModelModal && (
          <button
            type="button"
            onClick={onOpenModelModal}
            className="w-10 h-10 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer"
            title="Model Engines"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Middle Rail Status */}
      <div className="flex flex-col items-center gap-2 my-auto w-full py-2">
        <div
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-2xl bg-zinc-900/60 border border-zinc-800/60"
          title="SSE Pipeline Connected"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 rotate-90 my-1">
            LIVE
          </span>
        </div>
      </div>

      {/* Bottom Rail Actions */}
      <div className="flex flex-col items-center gap-2 w-full">
        <Link
          href="/settings"
          className="w-10 h-10 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition cursor-pointer"
          title="Settings"
        >
          <Sliders className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={() => setIsProfilePopupOpen(true)}
          className="w-9 h-9 rounded-xl overflow-hidden bg-white text-zinc-950 flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs hover:ring-2 hover:ring-blue-500 transition"
          title={user?.displayName || user?.email || 'Account'}
        >
          {user?.photoURL ? (
            <DitherShader
              src={user.photoURL}
              gridSize={1}
              ditherMode="bayer"
              colorMode="duotone"
              primaryColor="#254EAF"
              secondaryColor="#4d6cb3"
              threshold={0.45}
              className="w-full h-full object-cover"
            />
          ) : (
            (user?.displayName || user?.email || 'A')[0].toUpperCase()
          )}
        </button>
      </div>
    </div>
  );

  // Inset 260px Panel
  const insetPanel = (
    <div className="flex flex-col h-full w-[260px] bg-zinc-900/60 border-r border-zinc-800/80 select-none overflow-hidden text-zinc-200">
      {/* Workspace Switcher */}
      <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between gap-2 relative">
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center justify-between w-full text-left group cursor-pointer"
          >
            <span className="text-xs font-bold text-white truncate">{activeWorkspace}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-white transition-transform shrink-0" />
          </button>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Real-time Workspace</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer shrink-0"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full py-2 px-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Interaction</span>
        </button>
      </div>

      {/* Sessions Nav List */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-3 no-scrollbar">
        {/* Pinned */}
        {pinnedSessions.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <Pin className="w-3 h-3 text-amber-400" />
              <span>Pinned ({pinnedSessions.length})</span>
            </div>
            <div className="space-y-0.5">
              {pinnedSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSession(s.id)}
                  className={`p-2 rounded-xl flex items-center justify-between gap-2 transition cursor-pointer text-xs group ${
                    s.id === currentSessionId
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="truncate">{s.title || 'Untitled Session'}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => togglePin(s.id, e)}
                      className="p-1 rounded text-amber-400 hover:bg-zinc-700"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onDeleteSession(s.id, e)}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        <div>
          <div className="px-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Recent Interactions
          </div>
          <div className="space-y-0.5">
            {unpinnedSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`p-2 rounded-xl flex items-center justify-between gap-2 transition cursor-pointer text-xs group ${
                  s.id === currentSessionId
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                  <span className="truncate">{s.title || 'Untitled Session'}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => togglePin(s.id, e)}
                    className="p-1 rounded text-zinc-400 hover:text-amber-400 hover:bg-zinc-700"
                    title="Pin"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(s.id, e)}
                    className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-zinc-500">
                No active conversations yet.
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Quota Card */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-zinc-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Token Quota</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">74%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '74%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex h-full flex-shrink-0 z-20 ${className}`}>
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

      {/* Mobile Sheet Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
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

      <UserProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
      />
    </>
  );
}
