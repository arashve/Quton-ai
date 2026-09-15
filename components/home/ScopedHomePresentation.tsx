'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Layers,
  BarChart3,
  Rocket,
  MousePointer,
  ArrowRight,
} from 'lucide-react';
import { HeroPromptSection } from './HeroPromptSection';
import { NeuralVisualizerScope } from './NeuralVisualizerScope';
import { BentoFeaturesSection } from './BentoFeaturesSection';
import { ModelBenchmarkMatrix } from './ModelBenchmarkMatrix';
import { HomeCtaSection } from './HomeCtaSection';
import { HomeFooter } from './HomeFooter';

interface ScopedHomePresentationProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

const SCOPES = [
  {
    id: 'hero',
    number: '01',
    name: 'Prompt Core',
    subtitle: 'Autonomous AI Input',
    icon: Sparkles,
  },
  {
    id: 'neural',
    number: '02',
    name: 'Neural Shader',
    subtitle: 'Real-time WebGL Engine',
    icon: Zap,
  },
  {
    id: 'bento',
    number: '03',
    name: 'Architecture',
    subtitle: 'Modular Flagship Bento',
    icon: Layers,
  },
  {
    id: 'benchmarks',
    number: '04',
    name: 'Benchmarks',
    subtitle: 'Latency & Throughput Matrix',
    icon: BarChart3,
  },
  {
    id: 'launch',
    number: '05',
    name: 'Ignition',
    subtitle: 'Launch Studio & Ecosystem',
    icon: Rocket,
  },
];

// Scope transition animation variants
const scopeVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
    filter: 'blur(10px)',
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    filter: 'blur(10px)',
    transition: {
      duration: 0.45,
      ease: [0.32, 0.72, 0, 1],
    },
  }),
};

// Child elements stagger animation
export const scopeChildVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
};

export function ScopedHomePresentation({ onLaunchChat }: ScopedHomePresentationProps) {
  const [currentScope, setCurrentScope] = useState(0);
  const [direction, setDirection] = useState(1);
  const isAnimatingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartYRef = useRef(0);

  // Navigate to a specific scope
  const goToScope = useCallback(
    (targetIndex: number, forcedDirection?: number) => {
      if (targetIndex < 0 || targetIndex >= SCOPES.length) return;
      if (targetIndex === currentScope) return;

      const newDir = forcedDirection !== undefined ? forcedDirection : targetIndex > currentScope ? 1 : -1;
      setDirection(newDir);
      setCurrentScope(targetIndex);

      // Lock animation during transition to avoid rapid skipping
      isAnimatingRef.current = true;
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 700);
    },
    [currentScope]
  );

  const nextScope = useCallback(() => {
    if (currentScope < SCOPES.length - 1) {
      goToScope(currentScope + 1, 1);
    }
  }, [currentScope, goToScope]);

  const prevScope = useCallback(() => {
    if (currentScope > 0) {
      goToScope(currentScope - 1, -1);
    }
  }, [currentScope, goToScope]);

  // Wheel event handler with inner scroll detection & cooldown
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If currently in animation cooldown, prevent default to avoid jitter
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      // Check if inside inner scrollable area and if it hasn't reached its boundary
      const currentScrollable = scrollableRefs.current[currentScope];
      if (currentScrollable) {
        const { scrollTop, scrollHeight, clientHeight } = currentScrollable;
        const isScrollable = scrollHeight > clientHeight + 4;

        if (isScrollable) {
          // Scrolling down inside container
          if (e.deltaY > 0) {
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;
            if (!isAtBottom) {
              // Let the inner element scroll naturally!
              return;
            }
          }
          // Scrolling up inside container
          else if (e.deltaY < 0) {
            const isAtTop = scrollTop <= 8;
            if (!isAtTop) {
              // Let the inner element scroll naturally!
              return;
            }
          }
        }
      }

      // If wheel delta is significant, trigger scope switch
      if (Math.abs(e.deltaY) > 20) {
        e.preventDefault();
        if (e.deltaY > 0) {
          nextScope();
        } else {
          prevScope();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentScope, nextScope, prevScope]);

  // Touch swipe support (mobile/tablets)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartYRef.current - touchEndY;

      // Check inner scrollable area bounds
      const currentScrollable = scrollableRefs.current[currentScope];
      if (currentScrollable) {
        const { scrollTop, scrollHeight, clientHeight } = currentScrollable;
        const isScrollable = scrollHeight > clientHeight + 4;
        if (isScrollable) {
          if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - 8) return;
          if (deltaY < 0 && scrollTop > 8) return;
        }
      }

      // Threshold: 45px swipe
      if (Math.abs(deltaY) > 45) {
        if (deltaY > 0) {
          nextScope();
        } else {
          prevScope();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentScope, nextScope, prevScope]);

  // Keyboard navigation listener (ArrowUp, ArrowDown, PageUp, PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing into an input or textarea
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || target?.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'j') {
        e.preventDefault();
        nextScope();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'k') {
        e.preventDefault();
        prevScope();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToScope(0, -1);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToScope(SCOPES.length - 1, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextScope, prevScope, goToScope]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden select-none"
    >
      {/* Scope Container Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={SCOPES[currentScope].id}
          custom={direction}
          variants={scopeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center pt-16 sm:pt-20 pb-16 px-3 sm:px-6"
        >
          {/* Scrollable inner viewport if content is taller than screen height on compact devices */}
          <div
            ref={(el) => {
              scrollableRefs.current[currentScope] = el;
            }}
            className="w-full h-full max-h-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start sm:justify-center py-4 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Scope 0: Hero Prompt Core */}
            {currentScope === 0 && (
              <div className="w-full max-w-5xl my-auto">
                <HeroPromptSection onLaunchChat={onLaunchChat} />
              </div>
            )}

            {/* Scope 1: Neural Shader Visualizer */}
            {currentScope === 1 && (
              <div className="w-full max-w-6xl my-auto">
                <NeuralVisualizerScope onLaunchChat={onLaunchChat} />
              </div>
            )}

            {/* Scope 2: Bento Flagship Architecture */}
            {currentScope === 2 && (
              <div className="w-full max-w-7xl my-auto py-2">
                <BentoFeaturesSection onLaunchChat={onLaunchChat} />
              </div>
            )}

            {/* Scope 3: Real-Time Model Benchmark Matrix */}
            {currentScope === 3 && (
              <div className="w-full max-w-7xl my-auto py-2">
                <ModelBenchmarkMatrix onLaunchChat={onLaunchChat} />
              </div>
            )}

            {/* Scope 4: Chat Studio Ignition & Ecosystem Footer */}
            {currentScope === 4 && (
              <div className="w-full max-w-5xl my-auto flex flex-col justify-center">
                <HomeCtaSection />
                <div className="w-full mt-2 border-t border-white/10 pt-4">
                  <HomeFooter />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Vertical Scope Indicator Dock (Desktop): Minimal Icon-Only Floating Rail */}
      <aside
        aria-label="Scope Navigation Rail"
        className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 p-1.5 rounded-full bg-zinc-950/70 backdrop-blur-2xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)]"
      >
        {SCOPES.map((scope, idx) => {
          const isActive = currentScope === idx;
          const Icon = scope.icon;

          return (
            <button
              key={scope.id}
              type="button"
              onClick={() => goToScope(idx)}
              className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
              title={`${scope.number} • ${scope.name}`}
              aria-label={`${scope.number} - ${scope.name}`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-black' : 'group-hover:scale-110'}`} />

              {/* Minimal floating pill tooltip on hover towards the left */}
              <span className="absolute right-full mr-3 px-2.5 py-1 rounded-xl bg-zinc-900/95 text-white text-[11px] font-mono tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none border border-white/15 shadow-xl flex items-center gap-1.5">
                <span className="text-zinc-400 font-bold">{scope.number}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{scope.name}</span>
              </span>
            </button>
          );
        })}
      </aside>

      {/* Floating Bottom Scoped Navigation HUD */}
      <nav
        aria-label="Scoped Page Controls"
        className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex items-center justify-center pointer-events-none px-4"
      >
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/15 shadow-2xl text-xs font-mono">
          {/* Previous Scope Button */}
          <button
            type="button"
            onClick={prevScope}
            disabled={currentScope === 0}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
            aria-label="Previous scope"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Scope Counter & Progress */}
          <div className="flex items-center gap-2 px-2 border-x border-white/10">
            <span className="text-white font-bold">{SCOPES[currentScope].number}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/50">05</span>
            <span className="hidden sm:inline text-white/40 text-[11px] ml-1">
              ({SCOPES[currentScope].name})
            </span>
          </div>

          {/* Next Scope Button */}
          <button
            type="button"
            onClick={nextScope}
            disabled={currentScope === SCOPES.length - 1}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
            aria-label="Next scope"
          >
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>

          {/* Quick Indicator Dot for Mobile */}
          <div className="md:hidden flex items-center gap-1 pl-1">
            {SCOPES.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentScope ? 'w-4 bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
