import React from 'react';

export type BrandMarkProps = {
  className?: string;
  theme?: 'dark' | 'light';
  compact?: boolean;
  showWordmark?: boolean;
};

export function BrandMark({
  className = '',
  theme = 'dark',
  compact = false,
  showWordmark = true,
}: BrandMarkProps) {
  const isDarkTheme = theme === 'dark';
  const iconSize = compact ? 'h-8 w-8' : 'h-10 w-10';
  const iconClass = isDarkTheme
    ? 'bg-white text-zinc-950 border border-zinc-200/80'
    : 'bg-zinc-950 text-white border border-zinc-700/70';
  const wordmarkClass = isDarkTheme ? 'text-white' : 'text-zinc-950';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Quton brand mark">
      <div
        className={`relative ${iconSize} rounded-xl shadow-sm flex items-center justify-center font-black select-none ${iconClass}`}
      >
        <span className="leading-none tracking-[-0.18em] text-[1.3rem] sm:text-[1.45rem]">Q</span>
        <span
          className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 ${
            isDarkTheme ? 'border-zinc-950 bg-white' : 'border-white bg-zinc-950'
          }`}
        />
      </div>

      {showWordmark && (
        <span className={`text-sm sm:text-base font-black tracking-[-0.08em] ${wordmarkClass}`}>
          Quton
        </span>
      )}
    </div>
  );
}

export default BrandMark;
