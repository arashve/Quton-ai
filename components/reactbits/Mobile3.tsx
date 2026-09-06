'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  MessageSquare,
  Calendar,
  BarChart2,
  Search,
  X,
  Sliders,
  Mic,
  Columns,
  Cpu,
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  href: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: '1', title: 'Chat Studio', category: 'Workspace', href: '/chat' },
  { id: '2', title: 'Split Arena', category: 'Benchmark', href: '/arena' },
  { id: '3', title: 'Voice 8 Studio', category: 'Audio', href: '/voice' },
  { id: '4', title: 'Model Matrix', category: 'Engines', href: '/models' },
  { id: '5', title: 'System Settings', category: 'Config', href: '/settings' },
  { id: '6', title: 'Gemini 2.5 Pro', category: 'Model', href: '/chat?prompt=Benchmark%20Gemini%202.5%20Pro' },
  { id: '7', title: 'Llama 3.3 70B', category: 'Groq LPU', href: '/chat?prompt=Test%20Llama%203.3' },
];

export function Mobile3() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when search bar morphs open
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearching]);

  const navItems = [
    { id: 'home', icon: Home, href: '/', label: 'Home', isActive: pathname === '/' },
    { id: 'chat', icon: MessageSquare, href: '/chat', label: 'Chat', isActive: pathname.startsWith('/chat') },
    { id: 'arena', icon: Calendar, href: '/arena', label: 'Arena', isActive: pathname.startsWith('/arena') },
    { id: 'models', icon: BarChart2, href: '/models', label: 'Models', isActive: pathname.startsWith('/models') },
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
      {/* Dim overlay when search is active */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearching(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 inset-x-4 z-50 md:hidden flex flex-col items-center justify-end pointer-events-none">
        <div className="w-full max-w-sm pointer-events-auto">
          {/* SEARCH RESULTS PANEL (Renders directly above search bar like video frame 00:03-00:06) */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-2 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
              >
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl transition cursor-pointer group"
                    >
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                        {item.category}
                      </span>
                    </button>
                  ))}
                  {filteredResults.length === 0 && (
                    <div className="px-3.5 py-4 text-center text-xs text-zinc-400">
                      No results found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MORPHING DOCK / SEARCH BAR (Direct 1:1 match with pro.reactbits.dev/docs/app-ui/mobile/mobile-3 video) */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            className={`w-full overflow-hidden transition-colors shadow-2xl ${
              isSearching
                ? 'rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2'
                : 'rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 px-2 py-1.5 max-w-fit mx-auto'
            }`}
          >
            {isSearching ? (
              /* Expanded Search Field */
              <div className="flex items-center gap-2.5 w-full">
                <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 ml-0.5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredResults[0]) {
                      handleSelectResult(filteredResults[0].href);
                    } else if (e.key === 'Escape') {
                      setIsSearching(false);
                    }
                  }}
                  placeholder="Search accounts, views, invoices"
                  className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden py-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (query) {
                      setQuery('');
                    } else {
                      setIsSearching(false);
                    }
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Collapsed 5-Item Floating Pill Dock */
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.isActive;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="relative w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer"
                      aria-label={item.label}
                    >
                      {/* Black/White Solid Pill Indicator for Active Item (Exact match to video 00:00 - 00:02) */}
                      {active && (
                        <motion.div
                          layoutId="mobile3-active-circle"
                          className="absolute inset-0 rounded-full bg-zinc-900 dark:bg-white shadow-sm -z-10"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          active
                            ? 'text-white dark:text-zinc-950 stroke-[2.2]'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 stroke-[1.8]'
                        }`}
                      />
                    </Link>
                  );
                })}

                {/* Subtle Vertical Divider (Exact match to video) */}
                <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0" />

                {/* Search Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition cursor-pointer"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
