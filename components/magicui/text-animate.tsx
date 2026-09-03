'use client';

import React from 'react';
import { motion, Variants } from 'motion/react';
import { cn } from '@/lib/utils';

export type TextAnimateBy = 'word' | 'character' | 'line' | 'text';
export type TextAnimateAnimation =
  | 'fadeIn'
  | 'blurIn'
  | 'blurInUp'
  | 'blurInDown'
  | 'slideUp'
  | 'slideDown'
  | 'scaleUp'
  | 'scaleDown';

interface TextAnimateProps {
  children?: React.ReactNode;
  as?: any;
  by?: TextAnimateBy;
  animation?: TextAnimateAnimation;
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  segmentClassName?: string;
  once?: boolean;
  startOnView?: boolean;
}

const animationVariants: Record<TextAnimateAnimation, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  blurInUp: {
    hidden: { opacity: 0, filter: 'blur(6px)', y: 8 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  blurInDown: {
    hidden: { opacity: 0, filter: 'blur(6px)', y: -8 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  slideUp: {
    hidden: { opacity: 0, y: 14 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      y: 0,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  slideDown: {
    hidden: { opacity: 0, y: -14 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      y: 0,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.15 },
    show: (custom: { duration: number }) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: custom.duration, ease: [0.16, 1, 0.3, 1] },
    }),
  },
};

const motionComponents: Record<string, React.ComponentType<any>> = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  strong: motion.strong,
  em: motion.em,
};

export const TextAnimate: React.FC<TextAnimateProps> = ({
  children,
  as: Component = 'span',
  by = 'word',
  animation = 'blurInUp',
  duration = 0.28,
  delay = 0,
  stagger = 0.015,
  className,
  segmentClassName,
  once = true,
  startOnView = true,
}) => {
  // If children is not a plain string, render directly with animation on wrapper
  const textContent = typeof children === 'string' ? children : '';
  const MotionComponent =
    typeof Component === 'string' && motionComponents[Component]
      ? motionComponents[Component]
      : motion.span;

  if (!textContent) {
    return (
      <MotionComponent
        className={className}
        initial="hidden"
        whileInView={startOnView ? 'show' : undefined}
        animate={!startOnView ? 'show' : undefined}
        viewport={{ once }}
        variants={animationVariants[animation]}
        custom={{ duration }}
      >
        {children}
      </MotionComponent>
    );
  }

  let segments: string[] = [];
  if (by === 'word') {
    segments = textContent.split(/(\s+)/);
  } else if (by === 'character') {
    segments = Array.from(textContent);
  } else if (by === 'line') {
    segments = textContent.split('\n');
  } else {
    segments = [textContent];
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariant = animationVariants[animation] || animationVariants.blurInUp;

  return (
    <MotionComponent
      className={cn('inline-block', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView={startOnView ? 'show' : undefined}
      animate={!startOnView ? 'show' : undefined}
      viewport={{ once }}
    >
      {segments.map((segment, index) => {
        // If it's pure whitespace, preserve it without animating empty box
        if (/^\s+$/.test(segment)) {
          return <span key={index}>{segment}</span>;
        }

        return (
          <motion.span
            key={index}
            variants={itemVariant}
            custom={{ duration }}
            className={cn('inline-block', segmentClassName)}
          >
            {segment}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
};
