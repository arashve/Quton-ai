"use client";

import React from 'react';
import { PixelBlast } from './PixelBlast';
import { useEffect, useState } from 'react';

type Props = {
  className?: string;
  cornerSize?: string; // tailwind width/height for corners, e.g. 'w-1/4 h-1/4'
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  color?: string;
};

export default function PixelBlastCorners({
  className = '',
  cornerSize = 'w-20 h-20 sm:w-1/6 sm:h-1/6 md:w-1/4 md:h-1/4',
  variant = 'square',
  color = '#ffffff'
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const verticalMask = 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)';
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} aria-hidden>
      <div className={`absolute top-0 left-0 overflow-hidden ${cornerSize}`} style={{WebkitMaskImage: verticalMask as any, maskImage: verticalMask}}>
        <PixelBlast
          variant={variant}
          pixelSize={isMobile ? 2 : 4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={isMobile ? 1.2 : 2}
          patternDensity={isMobile ? 0.6 : 1}
          pixelSizeJitter={0}
          enableRipples={isMobile ? false : true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          transparent
          autoPauseOffscreen={false}
        />
      </div>

      <div className={`absolute top-0 right-0 overflow-hidden ${cornerSize}`} style={{WebkitMaskImage: verticalMask as any, maskImage: verticalMask}}>
        <PixelBlast
          variant={variant}
          pixelSize={isMobile ? 2 : 4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={isMobile ? 1.2 : 2}
          patternDensity={isMobile ? 0.6 : 1}
          pixelSizeJitter={0}
          enableRipples={isMobile ? false : true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          transparent
          autoPauseOffscreen={false}
        />
      </div>

      <div className={`absolute bottom-0 left-0 overflow-hidden ${cornerSize}`} style={{WebkitMaskImage: verticalMask as any, maskImage: verticalMask}}>
        <PixelBlast
          variant={variant}
          pixelSize={isMobile ? 2 : 4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={isMobile ? 1.2 : 2}
          patternDensity={isMobile ? 0.6 : 1}
          pixelSizeJitter={0}
          enableRipples={isMobile ? false : true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          transparent
          autoPauseOffscreen={false}
        />
      </div>

      <div className={`absolute bottom-0 right-0 overflow-hidden ${cornerSize}`} style={{WebkitMaskImage: verticalMask as any, maskImage: verticalMask}}>
        <PixelBlast
          variant={variant}
          pixelSize={isMobile ? 2 : 4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={isMobile ? 1.2 : 2}
          patternDensity={isMobile ? 0.6 : 1}
          pixelSizeJitter={0}
          enableRipples={isMobile ? false : true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          transparent
          autoPauseOffscreen={false}
        />
      </div>
    </div>
  );
}

export { PixelBlastCorners };
