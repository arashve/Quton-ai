'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shell';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import {
  HeroPromptSection,
  BentoFeaturesSection,
  ModelBenchmarkMatrix,
  HomeCtaSection,
  HomeFooter,
} from '@/components/home';
import ScrollExpand from '@/components/ScrollExpand';
import { Cpu, Zap, Activity, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPortalPage() {
  const router = useRouter();

  const handleLaunchChat = (promptText?: string, modeOverride?: string) => {
    const text = (promptText || '').trim();
    const mode = modeOverride || 'default';

    if (mode === 'compare') {
      router.push(`/arena${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }
    if (mode === 'voice') {
      router.push(`/voice${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }

    const reasoningParam = mode === 'reasoning' ? '&reasoning=true' : '';

    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}${reasoningParam}`);
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Subtle Figma Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* Aceternity Interactive Background Ripple Effect */}
      <BackgroundRippleEffect rows={10} cols={30} cellSize={54} />

      <PageContainer variant="public" maxWidth="xl">
        {/* Modular Home Sections */}
        <HeroPromptSection onLaunchChat={handleLaunchChat} />

        {/* AI Neural Circuit Matrix Scroll-Expand Section */}
        <section className="relative my-8 sm:my-16">
          <ScrollExpand
            mode="circuit"
            badge="AUTOFLOW // QUANTUM NPU CORE"
            title="Autonomous AI Circuit Matrix"
            subtitle="Explore high-throughput neural pathways executing multi-agent workflows in real-time."
            scrollHint="Scroll to unfold neural circuitry"
            startWidth={56}
            startHeight={64}
            startRadius={28}
            endRadius={0}
            mediaZoom={1.22}
            scrollDistance={0.9}
            holdDistance={0.3}
            smoothing={0.08}
            overlayScrim={0.5}
            useWindowScroll={true}
          >
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 px-4">
              {/* Glassmorphic Cyber Header */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase backdrop-blur-xl shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>HYPER-CONVERGED INFERENCE FABRIC</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]">
                  Every Synapse. Synchronized in Real-Time.
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-medium">
                  When the neural circuit matrix expands, multi-agent reasoning paths converge into low-latency autonomous action graphs.
                </p>
              </div>

              {/* Bento Grid of Real-Time Neural Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full mt-2 text-left">
                <div className="p-4 sm:p-5 rounded-[22px] bg-black/60 border border-cyan-500/20 backdrop-blur-2xl shadow-xl flex flex-col justify-between group hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-neutral-400">Synapse Core</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">1,048,576</div>
                    <div className="text-[11px] text-cyan-400/80 mt-0.5">Active parallel tensor pathways</div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-[22px] bg-black/60 border border-purple-500/20 backdrop-blur-2xl shadow-xl flex flex-col justify-between group hover:border-purple-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-neutral-400">Interconnect</span>
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">0.14 ms</div>
                    <div className="text-[11px] text-purple-400/80 mt-0.5">Quantum bus packet dispatch</div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-[22px] bg-black/60 border border-emerald-500/20 backdrop-blur-2xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-neutral-400">Consensus Rate</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">99.98%</div>
                    <div className="text-[11px] text-emerald-400/80 mt-0.5">Distributed multi-agent verification</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchChat('Run autonomous multi-agent reasoning benchmark')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-[0_0_28px_rgba(6,182,212,0.35)] cursor-pointer"
                >
                  <span>Launch Agent Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchChat('Inspect neural tensor routing topology', 'compare')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-sm font-medium backdrop-blur-xl transition-all cursor-pointer"
                >
                  <span>Explore Topology</span>
                </button>
              </div>
            </div>
          </ScrollExpand>
        </section>
        <BentoFeaturesSection onLaunchChat={handleLaunchChat} />
        <ModelBenchmarkMatrix onLaunchChat={handleLaunchChat} />
        <HomeCtaSection />
        <HomeFooter />
      </PageContainer>
    </div>
  );
}
