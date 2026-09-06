'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  MessageSquare,
  Store,
  Columns,
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
  { id: '1', title: 'چت استودیو • Chat Studio', category: 'Workspace', href: '/chat' },
  { id: '2', title: 'مارکت‌پلیس ایجنت‌ها • Agent Marketplace', category: 'Extensions', href: '/marketplace' },
  { id: '3', title: 'دوئل و بنچ‌مارک مدل‌ها • Split Arena', category: 'Benchmark', href: '/arena' },
  { id: '4', title: 'ماتریس موتورها • Model Matrix', category: 'Engines', href: '/models' },
  { id: '5', title: 'استودیو صوتی • Voice Studio', category: 'Audio', href: '/voice' },
  { id: '6', title: 'تنظیمات سیستم • System Settings', category: 'Config', href: '/settings' },
  { id: '7', title: 'ورود به حساب • Sign In', category: 'Auth', href: '/auth' },
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

  const navItems = [
    { id: 'home', icon: Home, href: '/', label: 'Home', isActive: pathname === '/' },
    { id: 'chat', icon: MessageSquare, href: '/chat', label: 'Chat', isActive: pathname.startsWith('/chat') },
    { id: 'marketplace', icon: Store, href: '/marketplace', label: 'Store', isActive: pathname.startsWith('/marketplace') },
    { id: 'arena', icon: Columns, href: '/arena', label: 'Arena', isActive: pathname.startsWith('/arena') },
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock Container - Fixed strictly to bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden flex flex-col items-center justify-end px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pointer-events-none">
        <div className="w-full max-w-[340px] pointer-events-auto">
          {/* SEARCH SUGGESTIONS & RESULTS */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mb-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
              >
                <div className="divide-y divide-zinc-800">
                  {filteredResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-zinc-800 rounded-xl transition cursor-pointer group"
                    >
                      <span className="text-sm font-normal text-zinc-200 group-hover:text-white tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {item.category}
                      </span>
                    </button>
                  ))}
                  {filteredResults.length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-zinc-400">
                      موردی یافت نشد • No results found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MORPHING DOCK */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className={`w-full overflow-hidden transition-all bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl ${
              isSearching
                ? 'rounded-full px-4 py-2.5'
                : 'rounded-full px-2 py-1.5 max-w-fit mx-auto'
            }`}
          >
            {isSearching ? (
              /* Expanded Search Input Bar */
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
                  placeholder="جستجو در بخش‌های AUTOFLOW..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-hidden py-0.5"
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
                  className="p-1 rounded-full text-zinc-400 hover:text-white transition cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            ) : (
              /* Collapsed Floating Dock: 4 items + Divider + Search */
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
                      {/* Active Circle Pill: White circle pill with dark icon */}
                      {active && (
                        <motion.div
                          layoutId="mobile3-active-circle"
                          className="absolute inset-0 rounded-full bg-white shadow-sm"
                          transition={{ type: 'spring', stiffness: 480, damping: 35 }}
                        />
                      )}

                      <Icon
                        className={`relative z-10 w-4 h-4 transition-colors ${
                          active
                            ? 'text-zinc-950 stroke-[2]'
                            : 'text-zinc-400 hover:text-white stroke-[1.8]'
                        }`}
                      />
                    </Link>
                  );
                })}

                {/* Vertical Divider */}
                <div className="w-[1px] h-4 bg-zinc-800 mx-1 shrink-0" />

                {/* Search Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-white transition cursor-pointer"
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
