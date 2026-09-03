'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className = '',
  showRadialGradient = true,
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#07080b] ${className}`}>
      {/* Background Aurora Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Primary Cyan & Teal Aurora Wave */}
        <motion.div
          animate={{
            x: ['-20%', '15%', '-15%', '-20%'],
            y: ['-10%', '20%', '-5%', '-10%'],
            scale: [1, 1.25, 0.95, 1],
            rotate: [0, 25, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[25%] -left-[20%] w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full opacity-35 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(59,130,246,0.2) 50%, transparent 75%)',
          }}
        />

        {/* Layer 2: Deep Purple & Violet Nebula Wave */}
        <motion.div
          animate={{
            x: ['20%', '-15%', '10%', '20%'],
            y: ['15%', '-20%', '10%', '15%'],
            scale: [1.1, 0.9, 1.2, 1.1],
            rotate: [0, -30, 20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[15%] -right-[20%] w-[75vw] max-w-[750px] h-[75vw] max-h-[750px] rounded-full opacity-40 blur-[130px]"
          style={{
            background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(99,102,241,0.25) 50%, transparent 75%)',
          }}
        />

        {/* Layer 3: Emerald & Mint Aurora Accent */}
        <motion.div
          animate={{
            x: ['-10%', '25%', '-20%', '-10%'],
            y: ['25%', '-15%', '20%', '25%'],
            scale: [0.9, 1.2, 1, 0.9],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-15%] left-[20%] w-[70vw] max-w-[700px] h-[70vw] max-h-[700px] rounded-full opacity-25 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(6,182,212,0.15) 55%, transparent 80%)',
          }}
        />

        {/* Layer 4: Center Glow Ribbon */}
        <motion.div
          animate={{
            opacity: [0.15, 0.35, 0.2, 0.15],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, rgba(14,165,233,0.15) 50%, transparent 80%)',
          }}
        />

        {/* Subtle grid pattern overlay for high-tech depth */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Radial vignette mask for focus */}
        {showRadialGradient && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(7,8,11,0.85)_80%,#07080b_100%)] pointer-events-none" />
        )}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
};
