"use client";

import React, { useRef } from 'react';
import { PixelBlast } from './PixelBlast';
import PixelBlastCorners from './PixelBlastCorners';

type HeroPixelBlastProps = {
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  color?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function HeroPixelBlast({
  variant = 'diamond',
  color = '#B497CF',
  className = '',
  children,
}: HeroPixelBlastProps) {
  const headingRef = useRef<HTMLElement | null>(null);

  return (
    <section className={`relative w-full h-screen overflow-hidden ${className}`} aria-label="Hero PixelBlast">
      {/* Pixel background, fixed to start at top of page */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {/* Pixel background only in the four corners (deduplicated component) */}
          <PixelBlastCorners />
      </div>

      {/* Centered hero content — provide the headingRef to PixelBlast so it can detect text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-center">
          What can I build for you؟
        </h1>
        {children}
      </div>
    </section>
  );
}

export { HeroPixelBlast };
