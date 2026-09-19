'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { HeroPromptSection, CustomWorkspaceSection, UserPlansSection } from '@/components/home';
import { Sparkles, Layers, CreditCard } from 'lucide-react';

const SECTIONS = [
  { id: 'hero-section', title: 'AI Assistant', icon: Sparkles },
  { id: 'workspace-section', title: 'Custom Workspace', icon: Layers },
  { id: 'plans-section', title: 'Your Plan', icon: CreditCard },
];

export default function LandingPortalPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);

  const handleLaunchChat = (promptText?: string, modeOverride?: string) => {
    const text = (promptText || '').trim();
    const mode = modeOverride || 'default';

    if (mode === 'compare') {
      router.push(`/arena${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }
    if (mode === 'voice') {
      router.push(`/voice${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }

    const reasoningParam = mode === 'reasoning' ? '&reasoning=true' : '';

    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}${reasoningParam}`);
    } else {
      router.push('/chat');
    }
  };

  const scrollToSection = useCallback((sectionId: string, index: number) => {
    setActiveSection(index);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Monitor which section is in scope during continuous smooth scrolling
  useEffect(() => {
    const sectionIds = SECTIONS.map((s) => s.id);

    const updateActiveSectionOnScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // If scrolled to the very bottom, activate the last section
      if (window.scrollY + winHeight >= docHeight - 40) {
        setActiveSection(SECTIONS.length - 1);
        return;
      }

      // If at the very top, activate first section
      if (window.scrollY < 120) {
        setActiveSection(0);
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true });
    updateActiveSectionOnScroll();

    // IntersectionObserver for responsive viewport boundaries
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(index);
              }
            });
          },
          {
            root: null,
            rootMargin: '-25% 0px -45% 0px',
            threshold: 0.1,
          }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => {
      window.removeEventListener('scroll', updateActiveSectionOnScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="bg-black min-h-screen w-full max-w-full overflow-x-hidden text-white relative flex flex-col items-center selection:bg-white selection:text-black">
      {/* Background Matrix - Fluid full-bleed layer behind the notch and navigation */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden max-w-full opacity-60">
        <BackgroundRippleEffect rows={12} cols={24} cellSize={48} />
      </div>

      {/* Subtle Aurora Ambient Radial Lights */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden max-w-full"
      >
        <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/8 blur-[130px]" />
      </div>

      {/* Main Continuous Scrolling Container
          Designed for iPhone X / WebKit full-bleed safe area:
          - Content starts with top spacing so it sits below floating header on load
          - As user scrolls, content seamlessly passes under the top notch and under the floating bars
          - Ample bottom safe padding ensures content can be read comfortably above the floating bottom dock
      */}
      <div className="w-full max-w-full overflow-x-hidden flex flex-col items-center pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4.5rem))] pb-[max(6.5rem,calc(env(safe-area-inset-bottom,0px)+5.5rem))] px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
        
        {/* Section 1: AI Assistant & Prompt Section */}
        <section
          id="hero-section"
          className="w-full max-w-5xl flex items-center justify-center py-8 sm:py-16 md:py-20 scroll-mt-24"
        >
          <HeroPromptSection onLaunchChat={handleLaunchChat} />
        </section>

        {/* Section 2: Custom Workspace Section */}
        <section
          id="workspace-section"
          className="w-full max-w-5xl flex items-center justify-center py-12 sm:py-20 md:py-28 scroll-mt-24"
        >
          <CustomWorkspaceSection />
        </section>

        {/* Section 3: User Plans Section */}
        <section
          id="plans-section"
          className="w-full max-w-5xl flex items-center justify-center py-12 sm:py-20 md:py-28 scroll-mt-24"
        >
          <UserPlansSection />
        </section>
      </div>

      {/* Floating 3-Icon Side Navigation Dock
          When content is in scope of each section, its icon turns pure white!
      */}
      <aside
        aria-label="Scope Section Navigation"
        className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center select-none"
      >
        <div className="p-1 sm:p-2 rounded-full bg-zinc-950/50 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col items-center gap-1.5 sm:gap-2">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSection === idx;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id, idx)}
                aria-label={`Scroll to ${sec.title}`}
                className={`group relative p-2 sm:p-3 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-white/20 text-white shadow-[0_0_16px_rgba(255,255,255,0.45)] ring-1 ring-white/30 scale-105'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {/* Floating Tooltip displaying section name */}
                <span className="hidden sm:block absolute right-12 px-3 py-1 rounded-full bg-zinc-900/90 text-zinc-200 text-[11px] font-sans border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl backdrop-blur-md">
                  {sec.title}
                </span>

                {/* Section Icon: Turns pure WHITE when active in scope */}
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-colors duration-300 ${
                    isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />

                {/* Subtle active pill indicator on right edge */}
                {isActive && (
                  <motion.div
                    layoutId="active-scope-dot"
                    className="absolute right-0.5 w-1 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}



