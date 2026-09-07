'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TabItem } from './types';

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'segmented' | 'bordered';
  layoutIdPrefix?: string;
  className?: string;
}

export function TabBar({
  tabs,
  activeTab,
  onChange,
  size = 'md',
  variant = 'pill',
  layoutIdPrefix = 'tabbar-active',
  className = '',
}: TabBarProps) {
  const sizeClasses = {
    sm: 'text-xs py-1 px-2.5 gap-1.5 min-h-[30px]',
    md: 'text-xs sm:text-sm py-1.5 px-3.5 gap-2 min-h-[36px]',
    lg: 'text-sm py-2 px-4 gap-2.5 min-h-[42px]',
  };

  const containerBg = {
    pill: 'bg-zinc-950/80 dark:bg-zinc-900/80 border border-zinc-800/80 p-1 rounded-full backdrop-blur-xl',
    segmented: 'bg-zinc-900/90 border border-zinc-800 p-1 rounded-2xl backdrop-blur-xl',
    bordered: 'bg-transparent border-b border-zinc-800 gap-1 p-0',
  };

  return (
    <div
      role="tablist"
      className={`inline-flex items-center select-none overflow-x-auto no-scrollbar max-w-full ${containerBg[variant]} ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center justify-center whitespace-nowrap font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              sizeClasses[size]
            } ${
              variant === 'pill'
                ? 'rounded-full'
                : variant === 'segmented'
                ? 'rounded-xl'
                : 'rounded-t-lg'
            } ${
              isActive
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {/* Active background layout highlight */}
            {isActive && (
              <motion.div
                layoutId={`${layoutIdPrefix}-pill`}
                className={`absolute inset-0 -z-10 shadow-sm ${
                  variant === 'pill'
                    ? 'rounded-full bg-white/15 border border-white/20'
                    : variant === 'segmented'
                    ? 'rounded-xl bg-white text-zinc-950 font-bold shadow-md'
                    : 'border-b-2 border-white bg-white/5'
                }`}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}

            {Icon && (
              <Icon
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  isActive && variant === 'segmented' ? 'text-zinc-950' : isActive ? 'text-white' : 'text-zinc-400'
                }`}
              />
            )}

            <span
              className={`leading-none ${
                isActive && variant === 'segmented' ? 'text-zinc-950 font-bold' : ''
              }`}
            >
              {tab.label}
            </span>

            {tab.badge !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full leading-none font-bold ${
                  isActive && variant === 'segmented'
                    ? 'bg-zinc-900 text-white'
                    : isActive
                    ? 'bg-white text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
