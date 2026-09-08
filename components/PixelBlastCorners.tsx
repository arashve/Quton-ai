"use client";

import React from 'react';
import { PixelBlast } from './PixelBlast';

type Props = {
  className?: string;
  cornerSize?: string; // tailwind width/height for corners, e.g. 'w-1/4 h-1/4'
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  color?: string;
};

export default function PixelBlastCorners({
  className = '',
  cornerSize = 'w-1/4 h-1/4 md:w-1/3 md:h-1/3',
  variant = 'square',
  color = '#ffffff'
}: Props) {
  const verticalMask = 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)';
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
      <div className={`absolute top-0 left-0 overflow-hidden ${cornerSize}`} style={{WebkitMaskImage: verticalMask as any, maskImage: verticalMask}}>
        <PixelBlast
          variant={variant}
          pixelSize={4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
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
          pixelSize={4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
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
          pixelSize={4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
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
          pixelSize={4}
          color={color}
          bgColor="#0b0b0b"
          textColor="#ffffff"
          showText={false}
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
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
