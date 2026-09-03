'use client';

import React from 'react';
import { motion } from 'motion/react';

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = 'rgba(168, 85, 247, 0.8)',
  speed = 5,
  children,
  onClick,
  ...props
}) => {
  return (
    <Component
      onClick={onClick}
      className={`relative inline-block p-[1.5px] overflow-hidden rounded-2xl ${className}`}
      {...props}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: 'linear',
        }}
        className="absolute -inset-[150%] pointer-events-none z-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${color} 60deg, rgba(6, 182, 212, 0.8) 120deg, transparent 180deg)`,
        }}
      />
      <div className="relative z-10 text-white text-center rounded-[14px] bg-zinc-950/90 backdrop-blur-xl border border-white/10 px-4 py-2">
        {children}
      </div>
    </Component>
  );
};

