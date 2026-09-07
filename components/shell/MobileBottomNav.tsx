'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageSquare,
  Columns,
  Mic,
  LayoutGrid,
  Store,
  Sliders,
  HelpCircle,
  Info,
  X,
  User as UserIcon,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Primary 4 anchors + 1 More trigger
  const primaryTabs = [
    { id: 'home', label: 'Home', href: '/', icon: Sparkles, isActive: pathname === '/' },
    { id: 'chat', label: 'Chat', href: '/chat', icon: MessageSquare, isActive: pathname === '/chat' },
    // Arena removed: merged into Chat Studio
    { id: 'voice', label: 'Voice', href: '/voice', icon: Mic, isActive: pathname === '/voice' },
  ];

  const moreItems = [
    { name: 'Models & Engines', href: '/models', icon: LayoutGrid, desc: 'Compare latency & specs' },
    { name: 'Agent Marketplace', href: '/marketplace', icon: Store, desc: 'Add community AI agents' },
    { name: 'System Settings', href: '/settings', icon: Sliders, desc: 'API keys & preferences' },
    { name: 'About AUTOFLOW', href: '/about', icon: Info, desc: 'Platform & speed specs' },
    { name: 'Help & Docs', href: '/help', icon: HelpCircle, desc: 'Guides & keyboard shortcuts' },
  ];

  const isMoreActive =
    pathname === '/models' ||
    pathname === '/marketplace' ||
    pathname === '/settings' ||
    pathname === '/about' ||
    pathname === '/help';

  const filteredItems = searchQuery.trim()
    ? moreItems.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : moreItems;

  return (
    <>
      {/* 1. Modal Drawer for "More" sections */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 w-full rounded-t-[32px] bg-zinc-950 border-t border-zinc-800 p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] shadow-2xl space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
                    Platform Navigation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, tools, docs..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-500"
                />
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-1 gap-2 max-h-[45vh] overflow-y-auto pr-1">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer ${
                        active
                          ? 'bg-white text-zinc-950 border-white font-semibold'
                          : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-200 hover:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          active ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{item.name}</div>
                        <div
                          className={`text-[11px] truncate ${
                            active ? 'text-zinc-600' : 'text-zinc-400'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Account / Sign In Pill */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <Link
                  href="/auth"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user ? user.displayName || user.email || 'My Account' : 'Sign In to AUTOFLOW'}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    router.push('/chat');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white text-zinc-950 text-xs font-bold shadow-xs cursor-pointer hover:bg-zinc-200"
                >
                  Open Studio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Persistent, stable fixed bottom bar (Rock Solid - Zero Jumping) */}
      <nav
        id="app-mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className={`fixed inset-x-0 bottom-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 h-[calc(var(--shell-bottom-nav-height,4.25rem)+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] px-3 flex items-center justify-around select-none transition-none shadow-2xl ${className}`}
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[54px] rounded-2xl transition-colors cursor-pointer ${
                active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="mobile-bottom-nav-active-pill"
                  className="absolute inset-0 -z-10 rounded-2xl bg-white/10 border border-white/10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2] text-white' : 'stroke-[1.7]'}`} />
              <span className={`text-[10px] tracking-tight mt-0.5 font-medium ${active ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* 5th Anchor: More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[54px] rounded-2xl transition-colors cursor-pointer ${
            isMoreActive || isMoreOpen ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Open More Options"
        >
          {(isMoreActive || isMoreOpen) && (
            <motion.div
              layoutId="mobile-bottom-nav-active-pill"
              className="absolute inset-0 -z-10 rounded-2xl bg-white/10 border border-white/10"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <LayoutGrid
            className={`w-5 h-5 ${
              isMoreActive || isMoreOpen ? 'stroke-[2.2] text-white' : 'stroke-[1.7]'
            }`}
          />
          <span
            className={`text-[10px] tracking-tight mt-0.5 font-medium ${
              isMoreActive || isMoreOpen ? 'font-bold' : ''
            }`}
          >
            More
          </span>
        </button>
      </nav>
    </>
  );
}
