'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HomeCtaSection() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 py-20 text-center">
      <div className="p-10 sm:p-16 rounded-3xl bg-[#1C1C1E] text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Step into the Chat Studio
        </h2>
        <p className="max-w-xl mx-auto text-base text-white/60 leading-relaxed">
          Instant SSE streaming, side-by-side arena benchmarking, voice synthesis, and multi-session workspace are ready for you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/chat"
            className="min-h-[48px] px-7 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-black font-semibold text-base transition flex items-center gap-2 cursor-pointer"
          >
            <span>Open Chat Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/settings"
            className="min-h-[48px] px-6 py-3.5 rounded-2xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-semibold text-base transition cursor-pointer flex items-center justify-center"
          >
            Adjust Engine Settings
          </Link>
        </div>
      </div>
    </section>
  );
}
