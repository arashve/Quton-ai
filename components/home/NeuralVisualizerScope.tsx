'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, ArrowRight, Sparkles, Layers, Sliders, Play } from 'lucide-react';
import MetallicPaint from '@/components/MetallicPaint';

interface NeuralVisualizerScopeProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function NeuralVisualizerScope({ onLaunchChat }: NeuralVisualizerScopeProps) {
  const [speed, setSpeed] = useState(0.35);
  const [liquid, setLiquid] = useState(0.75);
  const [tintColor, setTintColor] = useState('#feb3ff');

  const presets = [
    { name: 'Aurora Lilac', color: '#feb3ff', speed: 0.35, liquid: 0.75 },
    { name: 'Cyan Flux', color: '#38bdf8', speed: 0.45, liquid: 0.85 },
    { name: 'Emerald Quantum', color: '#34d399', speed: 0.3, liquid: 0.65 },
    { name: 'Solar Amber', color: '#fbbf24', speed: 0.4, liquid: 0.7 },
  ];

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
      {/* Header Tag & Title */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-center max-w-3xl mx-auto mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium mb-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>REAL-TIME NEURAL SHADER // WEBGL ACCELERATED</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
          Liquid Intelligence in Real-Time
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Sub-200ms token streaming meets GPU-powered fluid dynamics. Experience visual neural feedback synchronized with every inference cycle.
        </p>
      </motion.div>

      {/* Main Glassmorphic Showcase Frame */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } },
        }}
        className="w-full relative rounded-[32px] border border-white/15 bg-zinc-950/60 backdrop-blur-2xl shadow-2xl overflow-hidden p-4 sm:p-6"
      >
        {/* Glow backdrop behind canvas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]"
        />

        {/* Top HUD bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ENGINE LIVE
            </span>
            <span className="text-zinc-400 hidden sm:inline">GLSL 3.0 ES • Shader Matrix</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>TTFT: &lt;140ms</span>
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>450+ tok/s</span>
            </span>
          </div>
        </div>

        {/* The Shader Canvas Box */}
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-inner flex items-center justify-center">
          <MetallicPaint
            imageSrc="/assets/quton-dark.png"
            seed={42}
            scale={4}
            patternSharpness={1}
            noiseScale={0.5}
            speed={speed}
            liquid={liquid}
            mouseAnimation={true}
            brightness={2}
            contrast={0.5}
            refraction={0.01}
            blur={0.015}
            chromaticSpread={2}
            fresnel={1}
            angle={0}
            waveAmplitude={1}
            distortion={1}
            contour={0.2}
            lightColor="#ffffff"
            darkColor="#000000"
            tintColor={tintColor}
          />

          {/* Interactive floating pill controls */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/15">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setTintColor(preset.color);
                    setSpeed(preset.speed);
                    setLiquid(preset.liquid);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    tintColor === preset.color
                      ? 'bg-white text-black shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/arena"
                className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>Launch Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
