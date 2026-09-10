'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Inbox,
  Calendar,
  BarChart2,
  Search,
  X,
  ArrowUpRight,
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  href: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: '1', title: 'Renewal pipeline', category: 'Saved view', href: '/chat?q=Renewal%20pipeline' },
  { id: '2', title: 'Invoice 4192', category: 'Billing', href: '/marketplace' },
  { id: '3', title: 'Ana Reyes', category: 'Teammate', href: '/chat?q=Ana%20Reyes' },
  { id: '4', title: 'Chat Studio • استودیو چت', category: 'Workspace', href: '/chat' },
  { id: '5', title: 'Agent Marketplace • مارکت‌پلیس', category: 'Extensions', href: '/marketplace' },
  { id: '6', title: 'Model Arena • مقایسه مدل‌ها', category: 'Benchmark', href: '/arena' },
  { id: '7', title: 'Engines Matrix • ماتریس موتورها', category: 'Models', href: '/models' },
  { id: '8', title: 'Voice 8 Studio • استودیو صوتی', category: 'Audio', href: '/voice' },
  { id: '9', title: 'System Settings • تنظیمات سیستم', category: 'Config', href: '/settings' },
];

export function Mobile3() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Tuned Spring Physics (snappy, organic, no bounce jitter)
  const springTransition = {
    type: 'spring' as const,
    stiffness: 440,
    damping: 32,
    mass: 0.8,
  };

  // Auto-focus input when search mode activates
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isSearching]);

  // Keyboard shortcut: Escape to exit search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearching) {
        setIsSearching(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearching]);

  // 4 Primary Navigation Icons (matching Home, Inbox, Calendar, BarChart2)
  const navItems = [
    { id: 'home', icon: Home, href: '/', label: 'Home', isActive: pathname === '/' },
    { id: 'inbox', icon: Inbox, href: '/chat', label: 'Inbox', isActive: pathname.startsWith('/chat') },
    { id: 'calendar', icon: Calendar, href: '/arena', label: 'Calendar', isActive: pathname.startsWith('/arena') },
    { id: 'stats', icon: BarChart2, href: '/models', label: 'Stats', isActive: pathname.startsWith('/models') },
  ];

  const filteredResults = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 4);

  const handleSelectResult = (href: string) => {
    setIsSearching(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      {/* 1. Backdrop Overlay (fades in to focus attention on search) */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsSearching(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. Floating Dock Container (Fixed near bottom) */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden flex flex-col items-center justify-end px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pointer-events-none">
        <div className="w-full max-w-[360px] flex flex-col items-center pointer-events-auto">
          
          {/* 3. Search Results Panel (Fades & slides up above the search bar) */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full mb-3 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.18)] p-1.5 overflow-hidden"
              >
                <div className="divide-y divide-zinc-100">
                  {filteredResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-900 tracking-tight">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
                          {item.category}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-700 transition-colors" />
                      </div>
                    </button>
                  ))}

                  {filteredResults.length === 0 && (
                    <div className="px-4 py-5 text-center text-xs text-zinc-400">
                      موردی یافت نشد • No records found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. Morphing Dock Container (Solid white pill, soft distinct shadow, spring physics) */}
          <motion.div
            layout
            transition={springTransition}
            className={`overflow-hidden bg-white border border-zinc-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.14)] ${
              isSearching
                ? 'w-full rounded-full px-4 py-2'
                : 'rounded-full p-1.5 max-w-fit mx-auto'
            }`}
          >
            {isSearching ? (
              /* Expanded State: Full-Width Search Input Bar */
              <motion.div
                key="search-input-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 w-full"
              >
                <Search className="w-4 h-4 text-zinc-400 shrink-0 stroke-[2]" />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredResults[0]) {
                      handleSelectResult(filteredResults[0].href);
                    }
                  }}
                  placeholder="Search accounts, views, invoices"
                  className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-1"
                />

                <button
                  type="button"
                  onClick={() => {
                    setIsSearching(false);
                    setQuery('');
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </motion.div>
            ) : (
              /* Initial State: 5 Evenly Spaced Icons (Home, Inbox, Calendar, BarChart2, Search) */
              <motion.div
                key="dock-icons-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.isActive;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="relative w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer"
                      aria-label={item.label}
                    >
                      {/* Dark/black pill active background with spring layout animation */}
                      {active && (
                        <motion.div
                          layoutId="mobile3-active-pill"
                          className="absolute inset-0 rounded-full bg-zinc-950 shadow-sm"
                          transition={springTransition}
                        />
                      )}

                      <Icon
                        className={`relative z-10 w-4 h-4 transition-colors ${
                          active
                            ? 'text-white stroke-[2.2]'
                            : 'text-zinc-700 hover:text-zinc-950 stroke-[1.8]'
                        }`}
                      />
                    </Link>
                  );
                })}

                {/* 5th Icon: Search Icon Button (triggers the morphing expansion) */}
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-700 hover:text-zinc-950 transition cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 stroke-[1.8]" />
                </button>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
}

