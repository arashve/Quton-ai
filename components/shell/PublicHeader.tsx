'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';

import {
  ArrowRight,
  Menu,
  X,
  User as UserIcon,
  Mic,
  Cpu,
  Store,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BrandMark } from '@/components/BrandMark';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { DitherShader } from '@/components/ui/dither-shader';
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
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ۱. دریافت پیوسته موقعیت اسکرول
  const { scrollY } = useScroll();

  // ۲. اعمال افکت فنری (Spring) برای نرم کردن مقادیر خام اسکرول
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 150, // سختی فنر (هرچه کمتر، نرم‌تر و کندتر)
    damping: 25,    // مقاومت (جلوگیری از لرزش و نوسان بیش از حد)
    mass: 0.5       // جرم (وزن انیمیشن)
  });

  // ۳. استفاده از smoothScrollY به جای scrollY در useTransform
  const navMaxWidth = useTransform(smoothScrollY, [0, 60], ['76rem', '52rem']);
  const navBg = useTransform(smoothScrollY, [0, 60], ['rgba(0,0,0,0.5)', 'rgba(12,12,14,0.85)']);
  const navScale = useTransform(smoothScrollY, [0, 60], [1, 0.995]);
  const navBoxShadow = useTransform(smoothScrollY, [0, 60], [
    '0 0 0 0 rgba(0,0,0,0)',
    '0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)'
  ]);
  const navPadding = useTransform(smoothScrollY, [0, 60], ['14px 24px', '8px 16px']);

  return (
    <>
      <header
        id="app-public-header"
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-center pointer-events-none pt-4 px-4 sm:px-6 ${className}`}
      >
        <motion.nav
          // اعمال مستقیم مقادیر پویا به جای استفاده از className های شرطی
          style={{
            maxWidth: navMaxWidth,
            backgroundColor: navBg,
            scale: navScale,
            boxShadow: navBoxShadow,
            padding: navPadding,
            borderRadius: '9999px',
          }}
          className="pointer-events-auto flex items-center justify-between w-full backdrop-blur-md"
        >
          {/* Left: Brand Logo + Pro Badge */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full group cursor-pointer shrink-0"
          >
            <BrandMark theme="dark" compact className="group-hover:scale-[1.02] transition-transform duration-300" />
            <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#254EAF] text-white">
              BETA
            </span>
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
                      transition={{ type: 'spring', stiffness: 560, damping: 20, mass: 0.8 }}
                    />
                  )}

                  {/* Hover Indicator */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="public-header-hover-pill"
                      className="absolute inset-0 rounded-full bg-white/5 -z-10"
                      transition={{ type: 'spring', stiffness: 560, damping: 20, mass: 0.8 }}
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
              <>
                {/* User Profile with Dither Shader */}
                {user.photoURL ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                  <DitherShader
  src={user.photoURL}
  ditherMode="halftone" // تغییر به هالف‌تون
  gridSize={2} // کمی درشت‌تر برای دیده شدن افکت
  colorMode="duotone"
  primaryColor="#1e3a5f" // رنگ تیره شما
  secondaryColor="#f0e68c" // رنگ روشن شما
  contrast={1.2} // افزایش کنتراست برای وضوح چهره
  threshold={0.5} 
  className="w-full h-full rounded-full overflow-hidden" // گرد کردن عکس پروفایل
/>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs border border-white/20">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}

                {/* User Name Text (Hidden on Mobile) */}
                <span className="hidden sm:inline max-w-[80px] truncate text-white text-xs">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
              </>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/70 hover:text-white transition cursor-pointer"
              >
                <span>Login</span>
              </Link>
            )}

            {/* Prominent White Pill CTA Button with Hover Border Gradient */}
            <Link href={user ? '/chat' : '/auth?redirect=/chat'} className="w-fit">
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white text-black text-xs font-bold whitespace-nowrap"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </HoverBorderGradient>
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

      {/* Mobile Dropdown Sheet - Enhanced with Glassmorphism */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 560, damping: 24, mass: 0.8 }}
            className="fixed inset-x-3 sm:inset-x-6 top-24 z-50 p-5 rounded-3xl bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 shadow-2xl md:hidden space-y-4"
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
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-[#2C2C2E]/60 text-white/80 hover:bg-[#3A3A3C] hover:text-white'
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