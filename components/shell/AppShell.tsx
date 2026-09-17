'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { PublicHeader } from './PublicHeader';
import { StudioHeader } from './StudioHeader';
import { StudioSidebar } from './StudioSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppShellProps, ShellVariant } from './types';

export function AppShell({
  children,
  variant,
  showStudioSidebar = false,
  studioSidebarContent,
  hideMobileNav = false,
  hideHeader = false,
  headerActions,
  className = '',
}: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Determine active shell variant
  const activeVariant: ShellVariant =
    variant ||
    (pathname.startsWith('/auth')
      ? 'auth'
      : pathname.startsWith('/chat') ||
        pathname.startsWith('/arena') ||
        pathname.startsWith('/voice') ||
        pathname.startsWith('/workspace')
      ? 'studio'
      : 'public');

  const isChatRoute = pathname === '/chat';
  const showHeader = !hideHeader && !(activeVariant === 'studio' && isChatRoute);

  return (
    <div
      id="app-shell-root"
      // در اینجا bg-transparent استفاده می‌کنیم تا جلوی بلور شدن بک‌گراند را نگیرد
      className={`relative min-h-screen min-h-[100dvh] w-full bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-zinc-950 ${className}`}
    >
      {/* Aurora Glassmorphic Glow Meshes in Background - اینها باید تا بالا بروند */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] dark:bg-purple-600/15" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-cyan-600/10 blur-[130px] dark:bg-cyan-600/10" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-zinc-600/10 blur-[100px]" />
      </div>

      {/* 1. PUBLIC SHELL */}
      {activeVariant === 'public' && (
        <div className="flex flex-col min-h-screen min-h-[100dvh] w-full">
          {showHeader && <PublicHeader />}
          <main className="flex-1 w-full flex flex-col">{children}</main>
          {!hideMobileNav && <MobileBottomNav />}
        </div>
      )}

      {/* 2. STUDIO SHELL */}
      {activeVariant === 'studio' && (
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
          {showHeader && (
            <StudioHeader
              onToggleSidebar={
                showStudioSidebar ? () => setIsSidebarCollapsed((prev) => !prev) : undefined
              }
              isSidebarOpen={!isSidebarCollapsed}
              headerActions={headerActions}
            />
          )}

          <div className="flex flex-1 w-full h-full overflow-hidden">
            {showStudioSidebar &&
              (studioSidebarContent || (
                <StudioSidebar
                  isCollapsed={isSidebarCollapsed}
                  setIsCollapsed={setIsSidebarCollapsed}
                  isMobileOpen={isMobileSidebarOpen}
                  setIsMobileOpen={setIsMobileSidebarOpen}
                />
              ))}

            <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
              {children}
            </main>
          </div>

          {!hideMobileNav && <MobileBottomNav />}
        </div>
      )}

      {/* 3. AUTH SHELL */}
      {activeVariant === 'auth' && (
        <div className="flex flex-col min-h-[100dvh] w-full">
          {/* هدر اصلاح شده: padding را در یک div داخلی گذاشتم تا کل هدر تا بالای ناچ کشیده شود */}
          <header className="fixed top-0 left-0 right-0 w-full z-50 border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl">
             <div className="flex items-center justify-between px-6 h-16 pt-[env(safe-area-inset-top,0px)] box-content">
                <Link
                  href="/"
                  className="flex items-center gap-2 group text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to AUTOFLOW</span>
                </Link>

                <Link href="/" className="flex items-center gap-2">
                  <BrandMark theme="dark" compact showWordmark />
                </Link>

                <div className="w-20" />
             </div>
          </header>

          {/* محتوا را هل دادیم پایین تا زیر هدر fixed گیر نکند */}
          <main className="flex-1 flex items-center justify-center p-4 mt-[calc(4rem+env(safe-area-inset-top,0px))]">
            {children}
          </main>

          {/* Minimal bottom brand footnote */}
          <footer className="py-4 text-center text-xs text-zinc-600 font-mono pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            Quton AI Engine • Ultra-Low Latency Inference
          </footer>
        </div>
      )}
    </div>
  );
}