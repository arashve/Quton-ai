'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  Code2,
  Workflow,
  Sliders,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

const MetallicPaint = dynamic(() => import('@/components/MetallicPaint'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-zinc-500 font-mono text-xs gap-2">
      <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <span>در حال آماده‌سازی شیدر WebGL...</span>
    </div>
  ),
});

interface NeuralVisualizerScopeProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function NeuralVisualizerScope({ onLaunchChat }: NeuralVisualizerScopeProps) {
  // Metallic Paint Shader Parameters
  const [speed, setSpeed] = useState(0.35);
  const [liquid, setLiquid] = useState(0.75);
  const [tintColor, setTintColor] = useState('#a855f7');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'pipeline'>('overview');

  const presets = [
    { name: 'Aurora Lilac', color: '#a855f7', speed: 0.35, liquid: 0.75 },
    { name: 'Quantum Cyan', color: '#06b6d4', speed: 0.45, liquid: 0.85 },
    { name: 'Emerald Flux', color: '#10b981', speed: 0.3, liquid: 0.65 },
    { name: 'Amber Solar', color: '#f59e0b', speed: 0.4, liquid: 0.7 },
  ];

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex flex-col justify-center">
      {/* Top Header Tag */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-center max-w-3xl mx-auto mb-3 sm:mb-5"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-mono font-medium mb-2">
          <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>REAL-TIME NEURAL SHADER // WEBGL ACCELERATED</span>
        </div>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          لوگوی هوشمند با مایع فلزی تعاملی
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-1">
          با حرکت ماوس یا لمس صفحه، شیدر مایع متالیک واکنش نشان می‌دهد. در کنار آن مشخصات فنی و پایپ‌لاین مدل را بررسی کنید.
        </p>
      </motion.div>

      {/* Main Grid: Responsive 2-Column on Desktop (Side-by-Side), Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch w-full">
        {/* Left / Primary Column: Metallic Paint Canvas Container (7 cols on lg) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.96, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55 } },
          }}
          className="lg:col-span-7 flex flex-col rounded-[28px] sm:rounded-[32px] border border-white/15 bg-zinc-950/60 backdrop-blur-2xl shadow-2xl overflow-hidden p-3 sm:p-5 relative"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.18)_0%,transparent_70%)]"
          />

          {/* Top Bar inside Canvas Card */}
          <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                WEBGL LIVE
              </span>
              <span className="text-zinc-400 hidden sm:inline text-[11px]">GLSL 3.0 ES Shader</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-zinc-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>&lt;140ms</span>
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>450+ tok/s</span>
              </span>
            </div>
          </div>

          {/* Metallic Paint Shader Canvas Container */}
          <div className="relative w-full h-[250px] sm:h-[320px] md:h-[360px] lg:h-[390px] rounded-2xl overflow-hidden bg-black/85 border border-white/10 shadow-inner flex items-center justify-center select-none touch-none">
            <MetallicPaint
              imageSrc="/assets/quton-dark.png"
              seed={42}
              scale={3.8}
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

            {/* Hint overlay at top corner */}
            <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>ماوس یا انگشت خود را روی لوگو حرکت دهید</span>
            </div>

            {/* Shader Color Palette & Quick Controls bar */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
              {/* Presets pill group */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-900/85 backdrop-blur-md border border-white/15">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setTintColor(preset.color);
                      setSpeed(preset.speed);
                      setLiquid(preset.liquid);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                      tintColor === preset.color
                        ? 'bg-white text-black shadow-md font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Reset / Live State Button */}
              <button
                type="button"
                onClick={() => {
                  setTintColor('#a855f7');
                  setSpeed(0.35);
                  setLiquid(0.75);
                }}
                className="p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer"
                title="ریست مقادیر شیدر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right / Secondary Column: Interactive Description & Tech Spec Panel (5 cols on lg) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.96, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, delay: 0.1 } },
          }}
          className="lg:col-span-5 flex flex-col justify-between rounded-[28px] sm:rounded-[32px] border border-white/15 bg-zinc-950/60 backdrop-blur-2xl shadow-2xl p-4 sm:p-6"
        >
          {/* Panel Header & Navigation Tabs */}
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">پنل تحلیلی Quton Core</h3>
                  <p className="text-[11px] font-mono text-zinc-400">v3.5 Neural Fluid Engine</p>
                </div>
              </div>

              {/* Pill Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-900/80 border border-white/10 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  معرفی
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === 'specs'
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  مشخصات
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === 'pipeline'
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  پایپ‌لاین
                </button>
              </div>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  معماری هوش مصنوعی <strong className="text-white">Quton</strong> امکان ترکیب پردازش موازی و تعامل بصری را فراهم کرده است. افکت رنگ فلزی روبه‌رو به صورت زنده بر اساس فرگمنت شیدرهای WebGL محاسبه و رندر می‌شود.
                </p>

                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">رندر مستقیم شیدر روی GPU</h4>
                      <p className="text-[11px] text-zinc-400">بدون فشار به پردازنده، با ۶۰ فریم بر ثانیه حتی در مرورگرهای موبایل.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">واکنش هماهنگ با ژست‌ها</h4>
                      <p className="text-[11px] text-zinc-400">محاسبه بردار امواج نور و رنگ بر مبنای موقعیت ماوس و تاچ اسکرین کاربر.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Specs */}
            {activeTab === 'specs' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2 text-xs"
              >
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400 mb-1">Shader Technology</div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    GLSL 3.0 ES
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Multi-pass Normal Map</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400 mb-1">Inference Latency</div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    ~120 ms TTFT
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Ultra-low stream delay</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400 mb-1">Active Memory</div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    12.4 MB VRAM
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Zero leak cleanup loop</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400 mb-1">Platform Security</div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Sandboxed WebGL
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Isolated context buffer</div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Pipeline */}
            {activeTab === 'pipeline' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 text-xs"
              >
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                  <span className="text-zinc-300">دریافت ورودی کاربر و بارگذاری تصویر لوگو</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                  <span className="text-zinc-300">محاسبه نقشه نرمال (Normal Map) و بردار گرادیان</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                  <span className="text-zinc-300">اعمال شیدر فرسنل (Fresnel) و شکست کروماتیک نور</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Action Section */}
          <div className="pt-4 border-t border-white/10 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onLaunchChat('تحلیل عملکرد شیدرهای وب‌جی‌ال و مدل‌های هوش مصنوعی', 'pro')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>آزمایش در چت استودیو</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/arena"
              className="w-full sm:w-auto text-center px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 transition cursor-pointer"
            >
              ورود به آرنا مدل‌ها
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
