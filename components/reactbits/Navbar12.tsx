'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
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
  Store,
  User as UserIcon,
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
  { name: 'Split Arena', href: '/arena', icon: Columns },
  { name: 'Voice Studio', href: '/voice', icon: Mic },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Models', href: '/models', icon: Cpu },
  { name: 'Settings', href: '/settings', icon: Sliders },
];

export function Navbar12() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Glass Pill Navbar (Desktop & Tablet) - Strict Monochrome Aesthetic */}
      <header className="fixed left-0 right-0 z-50 flex justify-center px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pointer-events-none">
        <motion.nav
          initial={{ y: -24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-zinc-950/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 shadow-2xl max-w-5xl w-full"
        >
          {/* Brand Wordmark & Monochrome Icon */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white text-zinc-950 p-0.5 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-zinc-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                AUTOFLOW
              </span>
              <span className="hidden lg:inline-block text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
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
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-xs backdrop-blur-md -z-10"
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

                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons: Auth & Studio Launch */}
          <div className="flex items-center gap-2 pr-1">
            {user ? (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition cursor-pointer"
                title="Account Settings"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Account'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href={user ? '/chat' : '/auth?redirect=/chat'}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3 h-3 text-zinc-950" />
            </Link>

            {/* Mobile menu toggle for tablet/small screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
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
            className="fixed inset-x-4 top-20 z-50 p-4 rounded-[32px] bg-zinc-950 backdrop-blur-2xl border border-zinc-800 shadow-2xl md:hidden space-y-2"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 px-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Navigation</span>
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white hover:underline flex items-center gap-1"
              >
                <UserIcon className="w-3 h-3" />
                <span>{user ? user.displayName || 'Profile' : 'Sign In'}</span>
              </Link>
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
                        ? 'bg-white text-zinc-950 border-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
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
