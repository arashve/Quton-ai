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
    ? 'bg-transparen text-zinc-950  '
    : 'bg-transparen text-white ';
  const wordmarkClass = isDarkTheme ? 'text-white' : 'text-zinc-950';

  return (
    <div className={`inline-flex items-center  ${className}`} aria-label="Quton brand mark">
      <div
        className={`relative ${iconSize} rounded-xl shadow-sm flex items-center justify-center font-black select-none ${iconClass}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isDarkTheme ?'/assets/quton-dark.png': '/assets/quton-light.png'}
          alt="Quton"
          className="h-full w-full object-contain pr-2"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
            const fallback = el.parentElement?.querySelector('.quton-fallback') as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="quton-fallback absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
          <span className="leading-none tracking-[-0.18em] text-[1.3rem] sm:text-[1.45rem]">Q</span>
          <span
            className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 ${
              isDarkTheme ? 'border-zinc-950 bg-white' : 'border-white bg-zinc-950'
            }`}
          />
        </div>
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
