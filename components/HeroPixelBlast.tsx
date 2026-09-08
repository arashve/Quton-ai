"use client";

import React, { useRef, useEffect, useState } from 'react';
import { PixelBlast } from './PixelBlast';

type SlidingLayerProps = {
  side: 'left' | 'right';
  initialTransform: string;
  children: React.ReactNode;
};

function SlidingLayer({ side, initialTransform, children }: SlidingLayerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const posStyle: React.CSSProperties = side === 'left' ? { left: 0 } : { right: 0 };
  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: '50%',
    ...posStyle,
    transform: mounted ? 'translateX(0)' : `translateX(${initialTransform})`,
    transition: 'transform 800ms cubic-bezier(0.2,0.9,0.2,1)',
    pointerEvents: 'none',
    zIndex: -20,
  };

  return <div style={style}>{children}</div>;
}

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
    <section className={`relative w-full h-screen overflow-hidden ${className}`} aria-label="Hero PixelBlast Horizontal">
      {/* Entrance animation handled by SlidingLayer components */}

      {/* Left Pixel stream — slides in from left */}
      <SlidingLayer side="left" mountedClass="translate-x-0" initialTransform="-100%">
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
      </SlidingLayer>

      {/* Right Pixel stream — slides in from right (mirrored) */}
      <SlidingLayer side="right" mountedClass="translate-x-0" initialTransform="100%">
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
      </SlidingLayer>

      {/* Center/right-side hero content (unchanged) */}
      <div className="relative z-10 absolute inset-y-0 right-0 w-1/2 flex items-center justify-center px-6">
        <div className="max-w-xl text-left">
          <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
            What can I build for you?
          </h1>
          <div className="mt-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroPixelBlast };
