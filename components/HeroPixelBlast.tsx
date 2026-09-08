"use client";

import React, { useRef } from 'react';
import { PixelBlast } from './PixelBlast';

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
      {/* Pixel background: full-viewport fixed layer starting at top */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <PixelBlast
          variant={variant}
          color={color}
          pixelSize={3}
          patternScale={2}
          patternDensity={1}
          liquid
          liquidStrength={0.12}
          liquidRadius={1}
          enableRipples
          showText
          headingRef={headingRef}
          autoPauseOffscreen={false}
        />
      </div>

      {/* Centered hero content — provide the headingRef to PixelBlast so it can detect text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-center">
          What can I build for you?
        </h1>
        {children}
      </div>
    </section>
  );
}

export { HeroPixelBlast };
