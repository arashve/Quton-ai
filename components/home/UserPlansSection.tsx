'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Folder, Sparkles, Puzzle, Check } from 'lucide-react';
import ParticleText from '../ParticleText';

interface PlanFeature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const PLAN_FEATURES: PlanFeature[] = [
  { icon: Folder, text: 'free workspace ( limited )' },
  { icon: Sparkles, text: 'Quton.ai' },
  { icon: Puzzle, text: 'free plugin' },
];

export function UserPlansSection() {
  const [activePlan, setActivePlan] = useState<'Free' | 'Pro'>('Free');
  const [upgraded, setUpgraded] = useState(false);

  const handleSelectPlan = (plan: 'Free' | 'Pro') => {
    setActivePlan(plan);
    if (plan === 'Pro') {
      setUpgraded(true);
      setTimeout(() => setUpgraded(false), 3000);
    }
  };

  return (
    <section
      id="user-plans"
      className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center select-none"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.06)_45%,transparent_70%)] blur-[90px] pointer-events-none -z-10"
      />

      {/* Section Typography: Header matching the Figma design */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white flex flex-row items-center justify-center gap-2 sm:gap-3">
          <span className="leading-none mt-1">your Plan</span>

          {/* Dynamic ParticleText for 'Free' / 'Pro' matching Workspace styling */}
          <div
            className="relative flex items-center justify-center h-[40px] sm:h-[48px] md:h-[60px] w-[110px] sm:w-[140px] md:w-[170px] mt-2 sm:mt-2.5 cursor-pointer"
            onClick={() => setActivePlan((prev) => (prev === 'Free' ? 'Pro' : 'Free'))}
            title="Click to toggle plan"
          >
            <ParticleText
              text={activePlan}
              particleSize={2.2}
              density={4}
              color="#f8fafc"
              highlightColor="#8b5cf6"
              scatter={190}
              gatherDuration={1500}
              stagger={100}
              pointerRepel={30}
              repelRadius={70}
              idleDrift={0.1}
              trigger="mount"
              fontSize="100%"
              fontWeight={800}
              fontFamily="inherit"
              glow={false}
            />
          </div>
        </h2>
      </div>

      {/* Outer Big Rounded Container matching Figma */}
      <div className="w-full max-w-[690px] p-3 sm:p-4 rounded-[36px] sm:rounded-[42px] bg-[#141414] border border-white/[0.08] shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          
          {/* CARD 1: Free Plan */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelectPlan('Free')}
            className={`rounded-[28px] p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
              activePlan === 'Free'
                ? 'bg-[#1e1e1e] ring-1 ring-white/20'
                : 'bg-[#1a1a1a] hover:bg-[#1e1e1e]'
            }`}
          >
            <div>
              {/* Header: Title + Current Badge */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">Free</h3>
                <span className="px-3.5 py-1 rounded-full bg-[#2a2a2a] text-zinc-400 text-[11px] sm:text-xs font-medium tracking-wide">
                  Current
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mt-4 sm:mt-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">$ 0</span>
                <span className="text-xs sm:text-sm text-zinc-500 font-normal">forever</span>
              </div>

              {/* Subtext */}
              <p className="text-xs text-zinc-500 mt-2.5 font-normal leading-relaxed">
                For a single project a short history window
              </p>
            </div>

            {/* Features List */}
            <div className="mt-8 sm:mt-10 space-y-3.5">
              {PLAN_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={`free-${idx}`} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#3b82f6] fill-[#3b82f6] shrink-0" />
                    <span className="text-xs sm:text-[13px] text-zinc-300 font-medium">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CARD 2: Pro Plan */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelectPlan('Pro')}
            className={`rounded-[28px] p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
              activePlan === 'Pro'
                ? 'bg-[#1e1e1e] ring-1 ring-white/30 shadow-[0_0_25px_rgba(255,255,255,0.06)]'
                : 'bg-[#1a1a1a] hover:bg-[#1e1e1e]'
            }`}
          >
            <div>
              {/* Header: Title + Recommended Badge */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">Pro</h3>
                <span className="px-3.5 py-1 rounded-full bg-white text-black text-[11px] sm:text-xs font-bold tracking-wide shadow-sm">
                  Recommended
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mt-4 sm:mt-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">$ 10</span>
                <span className="text-xs sm:text-sm text-zinc-500 font-normal">forever</span>
              </div>

              {/* Subtext */}
              <p className="text-xs text-zinc-500 mt-2.5 font-normal leading-relaxed">
                For a single project a short history window
              </p>
            </div>

            {/* Features List */}
            <div className="mt-8 sm:mt-10 space-y-3.5">
              {PLAN_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={`pro-${idx}`} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#3b82f6] fill-[#3b82f6] shrink-0" />
                    <span className="text-xs sm:text-[13px] text-zinc-300 font-medium">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle feedback notification when Pro is selected */}
      {upgraded && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 flex items-center gap-2"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Selected Pro Plan</span>
        </motion.div>
      )}
    </section>
  );
}
