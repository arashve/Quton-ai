'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageSquare,
  Columns,
  Mic,
  Cpu,
  Sliders,
  Search,
  X,
  ArrowUp,
  Zap,
  Brain,
  Code,
  Globe,
  CornerDownLeft,
} from 'lucide-react';

export function Mobile3() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when morphing sheet opens
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isExpanded]);

  const handleSearchSubmit = (text?: string) => {
    const q = (text !== undefined ? text : searchQuery).trim();
    setIsExpanded(false);
    if (q) {
      router.push(`/chat?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/chat');
    }
  };

  const quickShortcuts = [
    { title: 'Split Arena', href: '/arena', desc: 'Benchmark two models side-by-side', icon: Columns, color: 'text-purple-400 bg-purple-500/20' },
    { title: 'Voice 8 Studio', href: '/voice', desc: 'Audio waves & speech-to-text', icon: Mic, color: 'text-rose-400 bg-rose-500/20' },
    { title: 'Model Matrix', href: '/models', desc: 'TTFT, throughput & context benchmarks', icon: Cpu, color: 'text-cyan-400 bg-cyan-500/20' },
    { title: 'System Settings', href: '/settings', desc: 'API keys, temperatures & models', icon: Sliders, color: 'text-amber-400 bg-amber-500/20' },
  ];

  const suggestedPrompts = [
    { label: 'Compare Gemini 2.5 Flash vs Pro', query: 'Compare Gemini 2.5 Flash vs Pro on latency' },
    { label: 'Deep reasoning trace on consensus algorithms', query: 'Deep reasoning trace on distributed consensus algorithms' },
    { label: 'Explain quantum computing simply with voice', query: 'Explain quantum computing simply' },
  ];

  return (
    <>
      {/* Dim backdrop when Mobile-3 sheet is morph-expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Expanded Search & Navigation Panel (Above Dock) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-3 bottom-20 z-50 rounded-[32px] bg-zinc-900/95 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl md:hidden max-h-[80vh] overflow-y-auto space-y-4"
          >
            {/* Header & Close Pill */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ReactBits Mobile-3</div>
                  <div className="text-[10px] text-zinc-400">Morphing search & navigation sheet</div>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Close search sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Full-width Search Input Field */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                placeholder="Ask AUTOFLOW or jump to destination..."
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-zinc-950/80 border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-purple-500 transition"
              />
              <button
                onClick={() => handleSearchSubmit()}
                className="absolute right-2 top-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer"
                title="Send Prompt"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Destination Shortcut Tiles */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2 px-1">
                Shortcut Destinations
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickShortcuts.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={idx}
                      href={s.href}
                      onClick={() => setIsExpanded(false)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1.5 rounded-xl ${s.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-white truncate">{s.title}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">{s.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2 px-1">
                Suggested Prompts
              </div>
              <div className="space-y-1.5">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSearchSubmit(p.query)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-zinc-300 hover:text-white transition flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2">{p.label}</span>
                    <CornerDownLeft className="w-3 h-3 text-zinc-500 group-hover:text-purple-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock (Mobile-3 Component) */}
      <nav
        id="mobile3-floating-dock"
        className="fixed bottom-3 inset-x-4 z-40 md:hidden max-w-sm mx-auto"
      >
        <motion.div
          layout
          className="flex items-center justify-around px-3 py-2 rounded-[32px] bg-zinc-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-purple-950/40"
        >
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[48px] min-h-[44px] transition cursor-pointer relative ${
              pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label="Home"
          >
            {pathname === '/' && (
              <motion.div
                layoutId="mobile3-active-pill"
                className="absolute inset-0 rounded-2xl bg-white/10 border border-white/15 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Sparkles className={`w-5 h-5 ${pathname === '/' ? 'text-purple-400' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">Home</span>
          </Link>

          {/* 2. Split Arena (Test Page 1) */}
          <Link
            href="/arena"
            className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[48px] min-h-[44px] transition cursor-pointer relative ${
              pathname === '/arena' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label="Arena"
          >
            {pathname === '/arena' && (
              <motion.div
                layoutId="mobile3-active-pill"
                className="absolute inset-0 rounded-2xl bg-white/10 border border-white/15 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Columns className={`w-5 h-5 ${pathname === '/arena' ? 'text-purple-400' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">Arena</span>
          </Link>

          {/* 3. MORPHING SEARCH TRIGGER (Mobile-3 Signature Element) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center justify-center p-2.5 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-label="Open Search and Shortcuts"
            title="Tap to search and open quick navigation"
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* 4. Voice Studio (Test Page 2) */}
          <Link
            href="/voice"
            className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[48px] min-h-[44px] transition cursor-pointer relative ${
              pathname === '/voice' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label="Voice"
          >
            {pathname === '/voice' && (
              <motion.div
                layoutId="mobile3-active-pill"
                className="absolute inset-0 rounded-2xl bg-white/10 border border-white/15 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Mic className={`w-5 h-5 ${pathname === '/voice' ? 'text-rose-400' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">Voice</span>
          </Link>

          {/* 5. Chat Studio */}
          <Link
            href="/chat"
            className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[48px] min-h-[44px] transition cursor-pointer relative ${
              pathname.startsWith('/chat') ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label="Chat Studio"
          >
            {pathname.startsWith('/chat') && (
              <motion.div
                layoutId="mobile3-active-pill"
                className="absolute inset-0 rounded-2xl bg-white/10 border border-white/15 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <MessageSquare className={`w-5 h-5 ${pathname.startsWith('/chat') ? 'text-cyan-400' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">Chat</span>
          </Link>
        </motion.div>
      </nav>
    </>
  );
}
