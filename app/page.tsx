'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { HeroPromptSection, CustomWorkspaceSection, UserPlansSection } from '@/components/home';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  { id: 'hero', title: 'AI Assistant' },
  { id: 'workspace', title: 'Custom Workspace' },
  { id: 'plans', title: 'Your Plan' },
];

export default function LandingPortalPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = down, -1 = up
  const isTransitioningRef = useRef(false);

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

  const goToSection = useCallback((nextIndex: number, forcedDirection?: number) => {
    if (nextIndex < 0 || nextIndex >= SECTIONS.length) return;
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setDirection(forcedDirection !== undefined ? forcedDirection : nextIndex > activeSection ? 1 : -1);
    setActiveSection(nextIndex);

    // Cooldown to prevent runaway scroll skips on trackpads
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 700);
  }, [activeSection]);

  // Wheel listener: No standard scroll, triggering animated spring transition
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't trigger if scroll delta is tiny
      if (Math.abs(e.deltaY) < 20) return;
      if (isTransitioningRef.current) return;

      if (e.deltaY > 0) {
        if (activeSection < SECTIONS.length - 1) {
          goToSection(activeSection + 1, 1);
        }
      } else {
        if (activeSection > 0) {
          goToSection(activeSection - 1, -1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection, goToSection]);

  // Touch Swipe gestures for mobile
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffY) < 45) return;
      if (isTransitioningRef.current) return;

      if (diffY > 0) {
        // Swiped up -> next section
        if (activeSection < SECTIONS.length - 1) {
          goToSection(activeSection + 1, 1);
        }
      } else {
        // Swiped down -> previous section
        if (activeSection > 0) {
          goToSection(activeSection - 1, -1);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, goToSection]);

  // Keyboard navigation (ArrowDown/PageDown/Space to advance, ArrowUp/PageUp to go back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (activeSection < SECTIONS.length - 1) {
          e.preventDefault();
          goToSection(activeSection + 1, 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeSection > 0) {
          e.preventDefault();
          goToSection(activeSection - 1, -1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, goToSection]);

  // Spring slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? '75%' : '-75%',
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        y: { type: 'spring', stiffness: 220, damping: 22, mass: 0.85 },
        scale: { type: 'spring', stiffness: 220, damping: 22 },
        opacity: { duration: 0.35, ease: 'easeOut' },
        filter: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? '-75%' : '75%',
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
      transition: {
        y: { type: 'spring', stiffness: 220, damping: 25, mass: 0.85 },
        scale: { duration: 0.25 },
        opacity: { duration: 0.25 },
        filter: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="bg-black min-h-screen w-full text-white relative overflow-hidden flex flex-col justify-center items-center">
      {/* Interactive Background Ripple Matrix */}
      <BackgroundRippleEffect rows={12} cols={32} cellSize={54} />

      {/* Main Centered Stage with Spring Transition */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(20px+env(safe-area-inset-bottom,0px))] pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1rem+env(safe-area-inset-right,0px))]">
        <AnimatePresence mode="wait" custom={direction}>
          {activeSection === 0 ? (
            <motion.div
              key="hero-slide"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-center max-w-5xl"
            >
              <HeroPromptSection onLaunchChat={handleLaunchChat} />
            </motion.div>
          ) : activeSection === 1 ? (
            <motion.div
              key="workspace-slide"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-center max-w-5xl"
            >
              <CustomWorkspaceSection />
            </motion.div>
          ) : (
            <motion.div
              key="plans-slide"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-center max-w-5xl"
            >
              <UserPlansSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vertical Spring Dots Indicator (Right Edge) */}
      <aside
        aria-label="Section navigation"
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 select-none"
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === idx;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => goToSection(idx)}
              aria-label={`Go to ${sec.title}`}
              className="group relative flex items-center justify-end p-2 cursor-pointer focus:outline-none"
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 px-2.5 py-1 rounded-full bg-zinc-900/90 text-zinc-300 text-[11px] font-sans border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {sec.title}
              </span>
              {/* Dot Indicator */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-6 bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </aside>

      {/* Floating Bottom Navigation Hint */}
      <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-30 flex items-center justify-center pointer-events-none">
        {activeSection === 0 ? (
          <button
            type="button"
            onClick={() => goToSection(1, 1)}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-400 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg animate-bounce"
          >
            <span>Scroll or click for Workspace</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        ) : activeSection === 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToSection(0, -1)}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-400 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>AI Prompt</span>
            </button>
            <button
              type="button"
              onClick={() => goToSection(2, 1)}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-400 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Your Plan</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => goToSection(1, -1)}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-400 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </button>
        )}
      </div>
    </div>
  );
}



