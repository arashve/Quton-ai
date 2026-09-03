'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : 'linear-gradient(120deg, rgba(228,228,231,0.6) 0%, rgba(255,255,255,1) 40%, rgba(147,197,253,1) 50%, rgba(192,132,252,1) 60%, rgba(228,228,231,0.6) 100%)',
        backgroundSize: '200% 100%',
        color: disabled ? '#9ca3af' : 'transparent',
      }}
      animate={
        disabled
          ? {}
          : {
              backgroundPosition: ['100% 0%', '-100% 0%'],
            }
      }
      transition={
        disabled
          ? {}
          : {
              repeat: Infinity,
              duration: speed,
              ease: 'linear',
            }
      }
    >
      {text}
    </motion.span>
  );
};

