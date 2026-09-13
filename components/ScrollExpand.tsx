'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { AiCircuitMatrix } from './AiCircuitMatrix';
import { ChevronDown, Sparkles } from 'lucide-react';

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type ConfigKey =
  | 'startWidth'
  | 'startHeight'
  | 'startRadius'
  | 'endRadius'
  | 'mediaZoom'
  | 'scrollDistance'
  | 'holdDistance'
  | 'smoothing'
  | 'overlayScrim'
  | 'useWindowScroll'
  | 'enabled';

export interface ScrollExpandProps {
  mode?: 'circuit' | 'media';
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  mode = 'circuit',
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  badge = 'AUTOFLOW // NEURAL FABRIC',
  title = 'Autonomous AI Circuit Matrix',
  subtitle = 'Decentralized neural pathways executing multi-agent workflows in real-time',
  scrollHint = 'Scroll to expand neural pathways',
  startWidth = 52,
  startHeight = 64,
  startRadius = 28,
  endRadius = 0,
  mediaZoom = 1.25,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.08,
  overlayScrim = 0.35,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const isCircuitMode = mode === 'circuit' || !src;

  const propsRef = useRef<Required<Pick<ScrollExpandProps, ConfigKey>>>({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  });

  useEffect(() => {
    propsRef.current = {
      startWidth,
      startHeight,
      startRadius,
      endRadius,
      mediaZoom,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
      useWindowScroll,
      enabled,
    };
  }, [
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  ]);

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.32, 0.78, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-32 * out}px, 0) scale(${1 + 0.05 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.15, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${10 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.55, 0.95, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${24 * (1 - inn)}px, 0)`;
      overlayRef.current.style.pointerEvents = inn > 0.6 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.045, 24, 64)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full ${
        useWindowScroll
          ? ''
          : 'overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
      } ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="relative w-full">
        <div ref={stageRef} className="sticky top-0 w-full overflow-hidden [--se-title-size:3rem]">
          {/* Expanding Frame with smooth Apple-style squircle clipping */}
          <div
            ref={frameRef}
            className="absolute inset-0 [clip-path:inset(18%_24%_18%_24%_round_28px)] [will-change:clip-path] shadow-2xl"
          >
            {/* Ambient Outer Halo Border */}
            <div className="absolute inset-0 rounded-[inherit] border border-cyan-500/25 pointer-events-none z-20 shadow-[inset_0_0_30px_rgba(6,182,212,0.15)]" />

            {/* Inner Content Layer (Scale on Zoom) */}
            <div
              ref={mediaRef}
              className="absolute inset-0 w-full h-full origin-center select-none [will-change:transform]"
            >
              {isCircuitMode ? (
                <AiCircuitMatrix className="w-full h-full" interactive={true} />
              ) : mediaType === 'video' ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover origin-center select-none"
                  src={src}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    fill
                    className="object-cover origin-center select-none"
                    src={src}
                    alt={alt || 'Visual'}
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Scrim Overlay */}
            <div
              ref={scrimRef}
              className="absolute inset-0 opacity-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(3,7,18,0.25)_0%,rgba(3,7,18,0.85)_100%)] z-10"
            />

            {/* Expanded Children / Interactive Glass HUD */}
            {children ? (
              <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 opacity-0 z-30 [will-change:opacity,transform]"
              >
                {children}
              </div>
            ) : null}
          </div>

          {/* Initial State Centered Title & Badge */}
          {title ? (
            <div
              ref={titleRef}
              className="absolute inset-0 flex flex-col items-center justify-center m-0 px-6 text-center pointer-events-none z-20 [will-change:opacity,transform]"
            >
              {badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{badge}</span>
                </div>
              )}
              <h2 className="font-bold leading-tight tracking-tight text-white [font-size:var(--se-title-size)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 max-w-lg text-sm sm:text-base text-neutral-300/80 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          ) : null}

          {/* Scroll Hint */}
          {scrollHint ? (
            <div
              ref={hintRef}
              className="absolute inset-x-0 bottom-8 flex flex-col items-center justify-center gap-1.5 text-center text-xs tracking-wider uppercase text-cyan-400/75 pointer-events-none z-20 [will-change:opacity,transform]"
            >
              <span>{scrollHint}</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400/80" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
