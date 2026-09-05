'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  FolderKanban,
  FileText,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  X,
  Pin,
  Download,
  Terminal,
  Cpu,
  Share2,
} from 'lucide-react';
import type { ChatSession } from '../Chat';

interface AppSidebarProps {
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
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
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
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState('AutoFlow AI');
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [pinnedSessionIds, setPinnedSessionIds] = useState<string[]>([]);

  const togglePinSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const pinnedSessions = sessions.filter((s) => pinnedSessionIds.includes(s.id));

  const sidebarContent = (
    <div className="flex flex-col h-full w-full select-none text-[var(--text-primary)]">
      {/* 1. Header & Workspace Switcher */}
      <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2 relative">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <button
                id="sidebar-workspace-switcher"
                type="button"
                onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                className="flex items-center justify-between text-left group cursor-pointer"
              >
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {activeWorkspace}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-transform ml-1 flex-shrink-0" />
              </button>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Pro v2.4</span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button on Desktop */}
        <button
          id="sidebar-collapse-toggle-btn"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          id="sidebar-mobile-close-btn"
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Workspace Dropdown */}
        <AnimatePresence>
          {isWorkspaceMenuOpen && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-14 left-3 right-3 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 flex flex-col gap-1 text-xs"
            >
              {[
                { name: 'AutoFlow AI', type: 'Primary Workspace' },
                { name: 'Research Lab', type: 'Agent Studio' },
                { name: 'Developer Sandbox', type: 'Local Ollama & Test' },
              ].map((ws) => (
                <button
                  key={ws.name}
                  type="button"
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-left transition flex flex-col ${
                    activeWorkspace === ws.name
                      ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-950 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="font-medium">{ws.name}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{ws.type}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Primary Actions: New Chat & Quick Search */}
      <div className="p-3 space-y-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <button
          id="reactbits-sidebar-new-chat-btn"
          type="button"
          onClick={() => {
            onNewChat();
            if (isMobileOpen) setIsMobileOpen(false);
          }}
          className={`w-full py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
            isCollapsed ? 'px-2' : 'px-3.5'
          }`}
          title="Start a new interaction (⌘N)"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>New Interaction</span>}
        </button>

        {!isCollapsed && (
          <button
            id="reactbits-sidebar-search-btn"
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-900 dark:hover:bg-zinc-800/90 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between gap-2 transition cursor-pointer border border-zinc-200/60 dark:border-zinc-800/60"
            title="Search conversations (⌘K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search chats...</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              ⌘K
            </span>
          </button>
        )}
      </div>

      {/* 3. Navigation Sections (Scrollable) */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-4">
        {/* Pinned Chats Section */}
        {pinnedSessions.length > 0 && (
          <div>
            {!isCollapsed && (
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <Pin className="w-3 h-3 rotate-45 text-amber-500" />
                <span>Pinned ({pinnedSessions.length})</span>
              </div>
            )}
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
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                    title={session.title}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-xs truncate">{session.title || 'New Interaction'}</span>
                      )}
                    </div>
                    {!isCollapsed && (
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Chats */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Recent Conversations
              </span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
              >
                View all ({sessions.length})
              </button>
            </div>
          )}

          <div className="space-y-1">
            {sessions.slice(0, 15).map((session) => {
              const isSelected = session.id === currentSessionId;
              const isPinned = pinnedSessionIds.includes(session.id);
              if (isPinned) return null;

              return (
                <div
                  key={session.id}
                  id={`app-sidebar-item-${session.id}`}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center justify-between gap-2 transition-colors group cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-200/80 dark:bg-zinc-800/90 text-zinc-950 dark:text-white font-medium'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title={session.title}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-xs truncate">{session.title || 'New Interaction'}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => togglePinSession(session.id, e)}
                        className="p-1 rounded text-zinc-400 hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        title="Pin to top"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {sessions.length === 0 && !isCollapsed && (
              <div className="px-3 py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                No active archives. Start a new prompt!
              </div>
            )}
          </div>
        </div>

        {/* Workspace Tools & Extensions */}
        <div>
          {!isCollapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Workspace Tools
            </div>
          )}
          <div className="space-y-1 text-xs">
            <button
              id="sidebar-btn-templates"
              type="button"
              onClick={onOpenProjectsModal}
              className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Architecture Specs & Starter Templates"
            >
              <FolderKanban className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              {!isCollapsed && <span>Templates & Specs</span>}
            </button>

            <button
              id="sidebar-btn-model-config"
              type="button"
              onClick={onOpenModelModal}
              className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Inference Engines & Model Selection"
            >
              <Sliders className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              {!isCollapsed && <span>Inference & Models</span>}
            </button>

            <button
              id="sidebar-btn-export-chat"
              type="button"
              onClick={() => onExportChat('md')}
              className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Export Current Thread as Markdown"
            >
              <Download className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              {!isCollapsed && <span>Export Thread (MD)</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Footer: User Profile & Quick Settings */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-950/50">
        <div className="flex items-center justify-between gap-2">
          {/* User Profile Tile */}
          <div
            id="sidebar-user-profile-tile"
            onClick={onOpenAuthModal}
            className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 transition cursor-pointer min-w-0 flex-1 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Profile & Cloud Account"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-xs font-bold flex-shrink-0">
              E
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  Elite Developer
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  Pro Active
                </span>
              </div>
            )}
          </div>

          {/* Theme Switcher Button */}
          <button
            id="sidebar-theme-toggle"
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition cursor-pointer flex-shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop App Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-full bg-[var(--panel-bg)] border-r border-zinc-200/80 dark:border-zinc-800/80 z-20 transition-all duration-250 ease-in-out ${
          isCollapsed ? 'w-[68px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation (Sheet) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Scrim / Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-[280px] h-full bg-[var(--panel-bg)] z-10 shadow-2xl flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
