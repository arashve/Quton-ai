'use client';

import React from 'react';
import { ButtonGroupItem } from './types';

export interface ButtonGroupProps {
  items: ButtonGroupItem[];
  value: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export function ButtonGroup({
  items,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
}: ButtonGroupProps) {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 gap-1.5 min-h-[32px]',
    md: 'text-xs sm:text-sm py-2 px-4 gap-2 min-h-[38px]',
  };

  return (
    <div
      role="group"
      className={`inline-flex items-center p-1 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner ${
        fullWidth ? 'w-full grid' : ''
      } ${className}`}
      style={fullWidth ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : undefined}
    >
      {items.map((item) => {
        const isSelected = value === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={`flex items-center justify-center rounded-xl font-medium transition cursor-pointer select-none whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
              sizeClasses[size]
            } ${
              isSelected
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
