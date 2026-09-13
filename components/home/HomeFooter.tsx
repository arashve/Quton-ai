'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer className="relative z-10 py-12 px-2 sm:px-4 text-center sm:text-left">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="font-bold text-sm text-white">Studio</span>
          <span className="text-xs text-white/40">© 2026. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/chat" className="hover:text-white transition">Chat Studio</Link>
          <Link href="/arena" className="hover:text-white transition">Arena</Link>
          <Link href="/voice" className="hover:text-white transition">Voice</Link>
          <Link href="/models" className="hover:text-white transition">Models</Link>
          <Link href="/marketplace" className="hover:text-white transition">Marketplace</Link>
          <Link href="/settings" className="hover:text-white transition">Settings</Link>
          <span className="flex items-center gap-2 text-white/80 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
            All Systems Nominal
          </span>
        </div>
      </div>
    </footer>
  );
}
