'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  User as UserIcon,
  Cpu,
  Store,
  Sliders,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NavItem } from './types';

export interface PublicHeaderProps {
  className?: string;
}

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/', icon: Sparkles },
  { name: 'Models', href: '/models', icon: Cpu },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Settings', href: '/settings', icon: Sliders },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function PublicHeader({ className = '' }: PublicHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        id="app-public-header"
        className={`fixed top-0 inset-x-0 z-40 h-16 sm:h-18 flex items-center justify-center px-4 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] pointer-events-none ${className}`}
      >
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-5xl w-full"
        >
          {/* Brand Wordmark & Icon */}
          <Link
            href="/"
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-zinc-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                AUTOFLOW
              </span>
              <span className="hidden lg:inline-block text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {PUBLIC_NAV_ITEMS.map((item) => {
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
                    isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="public-header-active-indicator"
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-xs backdrop-blur-md -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  {/* Hover Pill */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="public-header-hover-pill"
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

          {/* Right Actions: Auth Pill & Launch Studio Button */}
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
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3 h-3 text-zinc-950" />
            </Link>

            {/* Mobile Menu Toggle for Tablet/Small Viewports */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile/Tablet Dropdown Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-4 top-20 z-50 p-4 rounded-[28px] bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl md:hidden space-y-2"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 px-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Menu
              </span>
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white hover:underline flex items-center gap-1"
              >
                <UserIcon className="w-3 h-3" />
                <span>{user ? user.displayName || 'Account' : 'Sign In'}</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
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
