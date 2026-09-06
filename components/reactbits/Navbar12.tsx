'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageSquare,
  Columns,
  Mic,
  Cpu,
  Sliders,
  ArrowRight,
  Menu,
  X,
  Zap,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/', icon: Sparkles },
  { name: 'Chat Studio', href: '/chat', icon: MessageSquare },
  { name: 'Split Arena', href: '/arena', icon: Columns, tag: 'Battle' },
  { name: 'Voice Studio', href: '/voice', icon: Mic, tag: 'Live' },
  { name: 'Models', href: '/models', icon: Cpu },
  { name: 'Settings', href: '/settings', icon: Sliders },
];

export function Navbar12() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Glass Pill Navbar (Desktop & Tablet) */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-zinc-950/75 dark:bg-zinc-900/75 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-purple-950/30 max-w-5xl w-full"
        >
          {/* Brand Wordmark & Animated Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-purple-200 transition-colors">
                AUTOFLOW
              </span>
              <span className="hidden lg:inline-block text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Layout Animated Indicator */}
          <div className="hidden md:flex items-center gap-1 relative">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isHovered = hoveredPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredPath(item.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {/* Active Indicator (Navbar-12 signature) */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar12-active-indicator"
                      className="absolute inset-0 rounded-full bg-white/15 dark:bg-white/10 border border-white/20 shadow-xs backdrop-blur-md -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover Pill */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navbar12-hover-pill"
                      className="absolute inset-0 rounded-full bg-white/5 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                  {item.tag && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      {item.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 pr-1">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>v2.5 Ready</span>
            </div>

            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            {/* Mobile menu toggle for tablet/small screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Staggered Full-Screen / Dropdown Overlay (Mobile/Tablet view for Navbar-12) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-50 p-4 rounded-[32px] bg-zinc-950/95 backdrop-blur-2xl border border-white/15 shadow-2xl md:hidden space-y-2"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 px-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Navigation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                ReactBits Navbar-12
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? 'bg-purple-600/20 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
