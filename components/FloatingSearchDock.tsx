'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Inbox,
  Calendar,
  BarChart2,
  Search,
  X,
} from 'lucide-react';

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
}

const DEFAULT_RESULTS: SearchResultItem[] = [
  { id: '1', title: 'Renewal pipeline', category: 'Saved view' },
  { id: '2', title: 'Invoice 4192', category: 'Billing' },
  { id: '3', title: 'Ana Reyes', category: 'Teammate' },
];

export default function FloatingSearchDock() {
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when search mode opens
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Handle escape key to exit search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'inbox', icon: Inbox, label: 'Inbox' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'stats', icon: BarChart2, label: 'Analytics' },
  ];

  const filteredResults = searchQuery.trim()
    ? DEFAULT_RESULTS.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : DEFAULT_RESULTS;

  // Spring physics configuration for fluid, organic morphing
  const springTransition = {
    type: 'spring' as const,
    stiffness: 420,
    damping: 32,
    mass: 0.8,
  };

  return (
    <>
      {/* Optional Dimming Backdrop for focus when search is open */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock Container */}
      <div className="fixed inset-x-0 bottom-10 z-50 flex flex-col items-center justify-end px-4 pointer-events-none">
        <div className="w-full max-w-md flex flex-col items-center pointer-events-auto">
          
          {/* Search Results Panel (Fades and slides up above the search bar) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full mb-3 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-1.5 overflow-hidden"
              >
                <div className="divide-y divide-zinc-100">
                  {filteredResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        console.log('Selected:', item.title);
                        setIsSearchOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer group"
                    >
                      <span className="text-sm font-medium text-zinc-900 tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-400 group-hover:text-zinc-500 transition-colors">
                        {item.category}
                      </span>
                    </button>
                  ))}

                  {filteredResults.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs text-zinc-400">
                      No matching records found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Morphing Dock & Search Input */}
          <motion.div
            layout
            transition={springTransition}
            className={`overflow-hidden bg-white border border-zinc-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.12)] ${
              isSearchOpen
                ? 'w-full rounded-full px-4 py-2.5'
                : 'rounded-full p-2 max-w-fit'
            }`}
          >
            {isSearchOpen ? (
              /* Expanded State: Full-Width Search Input */
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search accounts, views, invoices"
                  className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-1"
                />

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </motion.div>
            ) : (
              /* Initial State: 5-Icon Dock (Home, Inbox, Calendar, BarChart2, Search) */
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
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className="relative w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer"
                      aria-label={item.label}
                    >
                      {/* Active State: Dark/black pill background with smooth spring motion */}
                      {isActive && (
                        <motion.div
                          layoutId="dock-active-pill"
                          className="absolute inset-0 rounded-full bg-zinc-950 shadow-sm"
                          transition={springTransition}
                        />
                      )}
                      
                      <Icon
                        className={`relative z-10 w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-white stroke-[2.2]'
                            : 'text-zinc-700 hover:text-zinc-950 stroke-[1.8]'
                        }`}
                      />
                    </button>
                  );
                })}

                {/* Search Icon Button (Triggers Morphing) */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
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
