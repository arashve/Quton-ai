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
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  href: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: '1', title: 'Renewal pipeline', category: 'Saved view', href: '/chat?q=Renewal%20pipeline' },
  { id: '2', title: 'Invoice 4192', category: 'Billing', href: '/chat?q=Invoice%204192' },
  { id: '3', title: 'Ana Reyes', category: 'Teammate', href: '/chat?q=Ana%20Reyes' },
  { id: '4', title: 'Split Arena', category: 'Benchmark', href: '/arena' },
  { id: '5', title: 'Chat Studio', category: 'Workspace', href: '/chat' },
  { id: '6', title: 'Voice 8 Studio', category: 'Audio', href: '/voice' },
  { id: '7', title: 'Model Matrix', category: 'Engines', href: '/models' },
  { id: '8', title: 'System Settings', category: 'Config', href: '/settings' },
];

export function Mobile3() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input immediately when morphing search bar expands
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearching]);

  // Exact navigation items matching the video:
  // 1: Home
  // 2: Inbox
  // 3: Calendar
  // 4: BarChart
  // [Vertical Divider]
  // 5: Search
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
      {/* Backdrop overlay when search is open */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsSearching(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock Container */}
      <div className="fixed bottom-5 inset-x-0 z-50 md:hidden flex flex-col items-center justify-end px-4 pointer-events-none">
        <div className="w-full max-w-[340px] pointer-events-auto">
          {/* SEARCH SUGGESTIONS & RESULTS (Direct replica of video 00:03 - 00:06) */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mb-2 p-1.5 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.14)] overflow-hidden"
              >
                <div className="divide-y divide-zinc-100">
                  {filteredResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 rounded-xl transition cursor-pointer group"
                    >
                      <span className="text-sm font-normal text-zinc-900 tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-xs font-normal text-zinc-400">
                        {item.category}
                      </span>
                    </button>
                  ))}
                  {filteredResults.length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-zinc-400">
                      No results found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MORPHING DOCK (Exact 1:1 geometry, shadow, borders and animation from video) */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className={`w-full overflow-hidden transition-all bg-white border border-zinc-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.12)] ${
              isSearching
                ? 'rounded-full px-4 py-2.5'
                : 'rounded-full px-2 py-1.5 max-w-fit mx-auto'
            }`}
          >
            {isSearching ? (
              /* Expanded Search Input Bar (Video frame 00:04 - 00:06) */
              <div className="flex items-center gap-3 w-full">
                <Search className="w-4 h-4 text-zinc-400 shrink-0 stroke-[1.8]" />
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
                  className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden py-0.5"
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
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            ) : (
              /* Collapsed Floating Dock: 4 items + Divider + Search (Video frame 00:00 - 00:02) */
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
                      {/* Black Solid Circle Active Pill with Spring Motion */}
                      {active && (
                        <motion.div
                          layoutId="mobile3-active-circle"
                          className="absolute inset-0 rounded-full bg-zinc-950 shadow-sm"
                          transition={{ type: 'spring', stiffness: 480, damping: 35 }}
                        />
                      )}

                      <Icon
                        className={`relative z-10 w-4 h-4 transition-colors ${
                          active
                            ? 'text-white stroke-[2]'
                            : 'text-zinc-600 hover:text-zinc-950 stroke-[1.8]'
                        }`}
                      />
                    </Link>
                  );
                })}

                {/* Vertical Divider (Exact match to video) */}
                <div className="w-[1px] h-4 bg-zinc-200 mx-1 shrink-0" />

                {/* Search Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-600 hover:text-zinc-950 transition cursor-pointer"
                  aria-label="Search"
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
