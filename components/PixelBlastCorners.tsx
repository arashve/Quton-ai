"use client";

import React, { useEffect, useState } from 'react';
import { PixelBlast } from './PixelBlast';

type Props = {
  className?: string;
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  color?: string;
  sideWidth?: string;
};

export default function PixelBlastSides({
  className = '',
  variant = 'square',
  color = '#ffffff',
  sideWidth = 'w-[40%] md:w-[25%]'
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => { 
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // فقط ماسک عمودی رو نگه داشتیم که لبه‌های مانیتور (بالا و پایین) کمی نرم باشه
  const verticalMask = 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)';

  return (
    <div 
      className={`fixed inset-0 pointer-events-none -z-10 ${className}`} 
      aria-hidden
      style={{
        WebkitMaskImage: verticalMask, 
        maskImage: verticalMask
      }}
    >
      {/* --- پنل سمت چپ --- */}
     
      {/* --- پنل سمت راست --- */}

    </div>
  );
}