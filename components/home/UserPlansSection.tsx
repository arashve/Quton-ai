'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import ParticleText from '../ParticleText';

// SVGهای دقیق برای آیکون‌ها
const FolderIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
  </svg>
);

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
  </svg>
);

const PuzzleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z" />
  </svg>
);

const PLAN_FEATURES = [
  { icon: FolderIcon, text: 'free workspace ( limited )' },
  { icon: SparkleIcon, text: 'Quton.ai' },
  { icon: PuzzleIcon, text: 'free plugin' },
];

export function UserPlansSection() {
  const [activePlan, setActivePlan] = useState<'Free' | 'Pro'>('Free');

  return (
    <section className="w-full flex flex-col items-center justify-center py-16 px-4 select-none bg-black">
      {/* عنوان بالای بخش */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          your Plan
        </h2>

        {/* تکست پارتیکلی یا متن ساده */}
        <div
          className="relative flex items-center justify-center h-[44px] min-w-[90px] cursor-pointer"
          onClick={() => setActivePlan((p) => (p === 'Free' ? 'Pro' : 'Free'))}
        >
          <ParticleText
            text={activePlan}
            particleSize={2}
            density={4}
            color="#ffffff"
            scatter={160}
            gatherDuration={1200}
            fontSize="100%"
            fontWeight={600}
          />
        </div>
      </div>

      {/* کانتینر بیرونی با لبه‌های گرد بزرگ مطابق طرح فیگما */}
      <div className="w-full max-w-[620px] p-2.5 sm:p-3 rounded-[40px] bg-[#242424]/90 border border-white/[0.04]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          {/* کارت اول: Free */}
          <div
            onClick={() => setActivePlan('Free')}
            className={`rounded-[32px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
              activePlan === 'Free'
                ? 'bg-[#181818] ring-1 ring-white/10'
                : 'bg-[#181818]/60 hover:bg-[#181818]'
            }`}
          >
            <div>
              {/* هدر پلن */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                  Free
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#2a2a2a] text-[#8e8e93] text-[11px] font-normal">
                  Current
                </span>
              </div>

              {/* قیمت */}
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">$ 0</span>
                <span className="text-[11px] text-zinc-400 font-normal">forever</span>
              </div>

              {/* توضیحات */}
              <p className="text-[11px] text-zinc-400 mt-2 font-light tracking-wide">
                For a single project a short history window
              </p>
            </div>

            {/* لیست ویژگی‌ها */}
            <div className="mt-8 space-y-3">
              {PLAN_FEATURES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                    <span className="text-[12px] text-zinc-300 font-normal">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* کارت دوم: Pro */}
          <div
            onClick={() => setActivePlan('Pro')}
            className={`rounded-[32px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
              activePlan === 'Pro'
                ? 'bg-[#181818] ring-1 ring-white/10'
                : 'bg-[#181818]/60 hover:bg-[#181818]'
            }`}
          >
            <div>
              {/* هدر پلن */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                  Pro
                </span>
                <span className="px-3 py-0.5 rounded-full bg-white text-black text-[11px] font-semibold tracking-tight">
                  Recommended
                </span>
              </div>

              {/* قیمت */}
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">$ 10</span>
                <span className="text-[11px] text-zinc-400 font-normal">forever</span>
              </div>

              {/* توضیحات */}
              <p className="text-[11px] text-zinc-400 mt-2 font-light tracking-wide">
                For a single project a short history window
              </p>
            </div>

            {/* لیست ویژگی‌ها */}
            <div className="mt-8 space-y-3">
              {PLAN_FEATURES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                    <span className="text-[12px] text-zinc-300 font-normal">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}