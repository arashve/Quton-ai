'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  User as UserIcon,
  Columns,
  Mic,
  Cpu,
  Store,
  BookOpen,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NavItem } from './types';

export interface PublicHeaderProps {
  className?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Voice', href: '/voice', icon: Mic },
  { name: 'Models', href: '/models', icon: Cpu },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Settings', href: '/settings', icon: Sliders },
];

export function PublicHeader({ className = '' }: PublicHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track window scroll to trigger HeroUI Pro style floating capsule transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 32) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        id="app-public-header"
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-center transition-all duration-300 pointer-events-none ${
          isScrolled
            ? 'pt-3 sm:pt-4 px-3 sm:px-6'
            : 'pt-3 sm:pt-6 px-4 sm:px-8'
        } ${className}`}
      >
        <motion.nav
          layout
          initial={false}
          animate={{
            maxWidth: isScrolled ? '52rem' : '76rem',
            borderRadius: '9999px',
            backgroundColor: isScrolled ? 'rgba(12,12,14,0.72)' : 'rgba(0,0,0,0.6)',
            boxShadow: isScrolled
              ? '0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)'
              : '0 0 0 0 transparent',
            scale: isScrolled ? 0.995 : 1,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 28, mass: 1.1 }}
          className={`pointer-events-auto flex items-center justify-between w-full transition-all duration-300 backdrop-blur-sm bg-opacity-70 ${
            isScrolled
              ? 'py-2 px-3 sm:px-5'
              : 'py-3 sm:py-3.5 px-4 sm:px-6'
          }`}
        >
          {/* Left: Brand Logo + Pro Badge (HeroUI Pro Style) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 py-1 rounded-full group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-white/90 transition-colors">
                AUTOFLOW
              </span>
              <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0A84FF] text-white">
                PRO
              </span>
            </div>
          </Link>

          {/* Center / Middle Navigation Links (Desktop) */}
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
                  className={`relative min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="public-header-active-pill"
                      className="absolute inset-0 rounded-full bg-white/10 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  {/* Hover Indicator */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="public-header-hover-pill"
                      className="absolute inset-0 rounded-full bg-white/5 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/50'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Login & Get Pro / Launch Studio Pill Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            {user ? (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs text-white/80 transition cursor-pointer"
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
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[80px] truncate text-white">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/70 hover:text-white transition cursor-pointer"
              >
                <span>Login</span>
              </Link>
            )}

            {/* Prominent White Pill CTA Button (HeroUI Pro Style) */}
            <Link
              href={user ? '/chat' : '/auth?redirect=/chat'}
              className="min-h-[38px] flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-white/90 active:scale-96 text-black text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-w-[38px] min-h-[38px] w-9 h-9 flex items-center justify-center rounded-full bg-[#2C2C2E] text-white/80 hover:text-white transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Dropdown Sheet (Apple HIG borderless elevated surface) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 sm:inset-x-6 top-20 z-50 p-5 rounded-3xl bg-[#1C1C1E] shadow-2xl md:hidden space-y-4"
          >
            <div className="flex items-center justify-between pb-3 px-1">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-semibold">
                Navigation
              </span>
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white hover:underline flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-white/60" />
                <span>{user ? user.displayName || 'Account' : 'Sign In'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[44px] flex items-center gap-2.5 p-3 rounded-2xl text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#2C2C2E] text-white/80 hover:bg-[#3A3A3C] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-white/60'}`} />
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
