'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  ArrowRight,
  Check,
  Upload,
  Clock,
  Bell,
  Globe,
  Sliders,
  Palette,
  Layers,
  Zap,
  Shield,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Eye,
  Settings2,
  Cpu,
  LayoutGrid,
} from 'lucide-react';
import {
  WorkspacePlan,
  AuroraPreset,
  GlassStyle,
  UiDensity,
  AccentColor,
  AgentEngine,
  WorkspaceLaunchConfig,
  TIMEZONE_OPTIONS,
  AVATAR_PRESETS,
  AURORA_PRESETS_META,
  DEFAULT_WORKSPACE_CONFIG,
  getWorkspaceLaunchConfig,
  saveWorkspaceLaunchConfig,
  resetWorkspaceLaunchConfig,
} from '@/lib/workspaceLaunchStorage';

interface WorkspaceLaunchSetupProps {
  onComplete?: (config: WorkspaceLaunchConfig) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function WorkspaceLaunchSetup({
  onComplete,
  onCancel,
  isModal = false,
}: WorkspaceLaunchSetupProps) {
  // Load initial config
  const [config, setConfig] = useState<WorkspaceLaunchConfig>(() => getWorkspaceLaunchConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [simulatedPing, setSimulatedPing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live time calculation based on selected timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: config.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setCurrentTimeStr(timeFormatter.format(new Date()));
      } catch {
        const now = new Date();
        setCurrentTimeStr(
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [config.timezone]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setConfig((prev) => ({
          ...prev,
          avatarUrl: base64,
          avatarPreset: 'custom',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setConfig((prev) => ({
      ...prev,
      avatarPreset: presetId,
      avatarUrl: '',
    }));
  };

  const handleSaveAndLaunch = () => {
    setIsSaving(true);
    saveWorkspaceLaunchConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      if (onComplete) {
        onComplete(config);
      }
    }, 600);
  };

  const handleReset = () => {
    const fresh = resetWorkspaceLaunchConfig();
    setConfig(fresh);
  };

  // Selected avatar helper
  const selectedPresetObj = AVATAR_PRESETS.find((p) => p.id === config.avatarPreset);
  const selectedTimezoneObj = TIMEZONE_OPTIONS.find((t) => t.id === config.timezone);
  const selectedAuroraMeta = AURORA_PRESETS_META[config.auroraPreset];

  // Derive initials
  const initials =
    config.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'SR';

  return (
    <div className="relative w-full max-w-6xl mx-auto select-none">
      {/* Background Aurora Mesh Glows */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-cyan-600/15 blur-[140px] pointer-events-none -z-10"
      />

      {/* Main Glassmorphic Setup Shell - Borderless Apple Aesthetic */}
      <div className="w-full rounded-[32px] sm:rounded-[40px] bg-[#141416]/85 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Top Floating App Bar */}
        <div className="px-6 sm:px-10 pt-7 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                  QUTON STUDIO
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-xs font-semibold text-zinc-300">Workspace Launch</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Setup & Environment Launch
              </h1>
            </div>
          </div>

          {/* Plan Selector Toggle (Free vs Pro) */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#202024] shadow-inner">
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, plan: 'Free' }))}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                config.plan === 'Free'
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Free Plan
            </button>
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, plan: 'Pro' }))}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                config.plan === 'Pro'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Pro Plan</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Form on Left, Live Directory Preview on Right */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Setup Form */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Header Section matching Image */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Set up your profile
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-normal leading-relaxed">
                Add the details teammates and autonomous agents will see across the workspace.
              </p>
            </div>

            {/* Avatar Upload & Memoji Picker */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {/* Circular Avatar Display */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 bg-[#222226] flex items-center justify-center shadow-lg">
                  {config.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={config.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : selectedPresetObj ? (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${selectedPresetObj.gradient} flex items-center justify-center text-2xl sm:text-3xl`}
                    >
                      <span>{selectedPresetObj.iconText}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold font-mono text-zinc-300">{initials}</span>
                  )}
                </div>

                {/* Upload Button + Specs Note */}
                <div className="space-y-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#26262b] hover:bg-[#323238] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Upload photo</span>
                  </button>
                  <p className="text-[11px] text-zinc-400">
                    PNG or JPG, at least 400 × 400 px, up to 10 MB.
                  </p>
                </div>
              </div>

              {/* Fast Presets Selector */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                  Or pick a 3D Monogram Persona
                </span>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected =
                      config.avatarPreset === preset.id && !config.avatarUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'bg-[#222226] text-zinc-400 hover:text-white hover:bg-[#2c2c32]'
                        }`}
                      >
                        <span>{preset.iconText}</span>
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inputs: Full Name & Job Title */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={config.fullName}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="e.g. Sam Rivera"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1c1c20] text-white text-sm placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Job title
                </label>
                <input
                  type="text"
                  value={config.jobTitle}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, jobTitle: e.target.value }))
                  }
                  placeholder="e.g. Lead Product Engineer"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1c1c20] text-white text-sm placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white/30 transition"
                />
              </div>

              {/* Workspace Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Workspace name
                </label>
                <input
                  type="text"
                  value={config.workspaceName}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, workspaceName: e.target.value }))
                  }
                  placeholder="e.g. Autonomous Cloud Engineering Lab"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1c1c20] text-white text-sm placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white/30 transition"
                />
              </div>

              {/* Timezone Selector with Live Clock Badge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Timezone
                  </label>
                  {currentTimeStr && (
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      Local time: <strong className="text-zinc-200">{currentTimeStr}</strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={config.timezone}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, timezone: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#1c1c20] text-white text-sm appearance-none focus:outline-hidden focus:ring-1 focus:ring-white/30 transition cursor-pointer"
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz.id} value={tz.id} className="bg-[#1c1c20] text-white">
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Checkbox: Updates matching photo */}
            <div className="flex items-center gap-3 pt-1">
              <label className="relative flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.receiveUpdates}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, receiveUpdates: e.target.checked }))
                  }
                  className="w-4 h-4 rounded-md bg-[#222226] border-0 text-white focus:ring-0 cursor-pointer accent-white"
                />
                <span className="text-xs sm:text-sm text-zinc-300">
                  Send me product updates and workspace tips.
                </span>
              </label>
            </div>

            {/* ========================================================================= */}
            {/* PRO PLAN SPECIAL: DEFAULT vs CUSTOM WORKSPACE UI MODE (The Core Request!) */}
            {/* ========================================================================= */}
            {config.plan === 'Pro' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-white/[0.06] space-y-4"
              >
                {/* Mode Selector Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Pro Workspace Interface Configuration
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-mono font-bold">
                    PRO FEATURE
                  </span>
                </div>

                {/* Segmented Button: Default Studio vs Custom Workspace UI */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#1a1a1e] gap-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, uiCustomizationMode: 'default' }))
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      config.uiCustomizationMode === 'default'
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Default Studio Setup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, uiCustomizationMode: 'custom' }))
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      config.uiCustomizationMode === 'custom'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Customize Workspace UI</span>
                  </button>
                </div>

                {/* If Custom Workspace UI is chosen, reveal interactive theme controls */}
                <AnimatePresence>
                  {config.uiCustomizationMode === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2 overflow-hidden"
                    >
                      {/* 1. Aurora Ambience Presets */}
                      <div className="p-4 rounded-2xl bg-[#1c1c20] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-zinc-300">
                            Aurora Ambience Presets
                          </span>
                          <span className="text-[11px] font-mono text-purple-300">
                            {selectedAuroraMeta.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {(
                            Object.keys(AURORA_PRESETS_META) as AuroraPreset[]
                          ).map((key) => {
                            const meta = AURORA_PRESETS_META[key];
                            const isSelected = config.auroraPreset === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() =>
                                  setConfig((prev) => ({ ...prev, auroraPreset: key }))
                                }
                                className={`p-2.5 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#2a2a32] ring-1 ring-white/20'
                                    : 'bg-[#18181b] hover:bg-[#222226]'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full bg-gradient-to-br ${meta.previewGlow} shrink-0 shadow-xs`}
                                />
                                <div className="truncate">
                                  <div className="text-xs font-semibold text-white truncate">
                                    {meta.name}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Glass Style & UI Density */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-[#1c1c20] space-y-2">
                          <span className="text-xs font-medium text-zinc-300 block">
                            Glassmorphism Surface
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(['frosted', 'acrylic', 'minimal'] as GlassStyle[]).map((style) => (
                              <button
                                key={style}
                                type="button"
                                onClick={() =>
                                  setConfig((prev) => ({ ...prev, glassStyle: style }))
                                }
                                className={`py-1.5 px-2 rounded-xl text-[11px] font-medium capitalize transition cursor-pointer ${
                                  config.glassStyle === style
                                    ? 'bg-white text-black font-bold'
                                    : 'bg-[#18181b] text-zinc-400 hover:text-white'
                                }`}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#1c1c20] space-y-2">
                          <span className="text-xs font-medium text-zinc-300 block">
                            Layout Density
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(['spacious', 'compact'] as UiDensity[]).map((density) => (
                              <button
                                key={density}
                                type="button"
                                onClick={() =>
                                  setConfig((prev) => ({ ...prev, uiDensity: density }))
                                }
                                className={`py-1.5 px-2 rounded-xl text-[11px] font-medium capitalize transition cursor-pointer ${
                                  config.uiDensity === density
                                    ? 'bg-white text-black font-bold'
                                    : 'bg-[#18181b] text-zinc-400 hover:text-white'
                                }`}
                              >
                                {density === 'spacious' ? 'Apple Bento' : 'Pro Fleet'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Primary Autonomous AI Engine */}
                      <div className="p-4 rounded-2xl bg-[#1c1c20] space-y-2">
                        <span className="text-xs font-medium text-zinc-300 block">
                          Autonomous AI Engine for Workspace
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(
                            [
                              'gemini-2.5-pro',
                              'gemini-2.5-flash',
                              'claude-3.7-sonnet',
                              'gpt-4o',
                            ] as AgentEngine[]
                          ).map((eng) => (
                            <button
                              key={eng}
                              type="button"
                              onClick={() =>
                                setConfig((prev) => ({ ...prev, agentEngine: eng }))
                              }
                              className={`py-2 px-2.5 rounded-xl text-center text-xs font-mono transition cursor-pointer ${
                                config.agentEngine === eng
                                  ? 'bg-white text-black font-bold shadow-xs'
                                  : 'bg-[#18181b] text-zinc-400 hover:text-white'
                              }`}
                            >
                              {eng.replace('gemini-', 'G-')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Launch CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSaveAndLaunch}
                disabled={isSaving}
                className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Configuring Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Workspace</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
              >
                Reset to default
              </button>

              {isModal && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: DIRECTORY PREVIEW & LIVE HUD (Exactly Matching Screenshot!) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. DIRECTORY PREVIEW LABEL */}
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block mb-3">
                DIRECTORY PREVIEW
              </span>

              {/* The Directory Card matching user screenshot layout */}
              <motion.div
                layout
                className="rounded-[28px] bg-[#1a1a1c] p-6 shadow-2xl space-y-4 relative overflow-hidden"
              >
                {/* Top User Row */}
                <div className="flex items-center gap-4">
                  {/* Round Avatar Container */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#26262b] flex items-center justify-center shadow-md">
                    {config.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={config.avatarUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : selectedPresetObj ? (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${selectedPresetObj.gradient} flex items-center justify-center text-xl`}
                      >
                        <span>{selectedPresetObj.iconText}</span>
                      </div>
                    ) : (
                      <span className="text-base font-bold font-mono text-white">
                        {initials}
                      </span>
                    )}
                  </div>

                  {/* Name and Job Title */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                      {config.fullName || 'Sam Rivera'}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {config.jobTitle || 'Product Engineer'}
                    </p>
                  </div>

                  {/* Plan Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                      config.plan === 'Pro'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {config.plan}
                  </span>
                </div>

                {/* Sub-Boxes: Timezone & Updates (Matching Picture exactly) */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-2xl bg-[#141416] flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      Timezone
                    </span>
                    <div className="text-xs font-semibold text-zinc-200 mt-1 truncate">
                      {selectedTimezoneObj?.label.split(' ')[0] || 'Berlin'}
                    </div>
                    {currentTimeStr && (
                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                        {currentTimeStr}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-[#141416] flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      Updates
                    </span>
                    <div className="text-xs font-semibold text-zinc-200 mt-1 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          config.receiveUpdates ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}
                      />
                      <span>{config.receiveUpdates ? 'Subscribed' : 'Muted'}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      Workspace Feed
                    </div>
                  </div>
                </div>

                {/* Subtext matching user screenshot */}
                <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                  This is how teammates will see you. You can change any of it later from your account settings.
                </p>
              </motion.div>
            </div>

            {/* 2. LIVE WORKSPACE HUD PREVIEW (Dynamically reacts to custom UI!) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                  LIVE WORKSPACE HUD PREVIEW
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Synced
                </span>
              </div>

              {/* Dynamic Mini Cockpit Card adopting chosen theme */}
              <div
                className={`rounded-[28px] p-5 shadow-2xl relative overflow-hidden transition-all duration-500 ${
                  config.uiCustomizationMode === 'custom'
                    ? config.glassStyle === 'frosted'
                      ? 'bg-[#18181b]/80 backdrop-blur-2xl'
                      : config.glassStyle === 'acrylic'
                      ? 'bg-[#101014]/90'
                      : 'bg-transparent'
                    : 'bg-[#18181b]'
                }`}
                style={{
                  boxShadow:
                    config.uiCustomizationMode === 'custom'
                      ? `0 10px 40px -10px ${selectedAuroraMeta.borderGlow}`
                      : undefined,
                }}
              >
                {/* Simulated Aurora Blob inside preview */}
                {config.uiCustomizationMode === 'custom' && (
                  <div
                    className={`absolute -top-10 -right-10 w-36 h-36 rounded-full ${selectedAuroraMeta.blob1} blur-2xl pointer-events-none`}
                  />
                )}

                {/* Mini Workspace Top */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white text-[10px]">
                      ⌘
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[140px]">
                      {config.workspaceName || 'Autonomous Lab'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                    {config.uiDensity === 'spacious' ? 'Bento' : 'Fleet'}
                  </span>
                </div>

                {/* Mini Autonomous Agent Box */}
                <div className="mt-3 p-3 rounded-xl bg-black/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px] font-bold text-white">
                        {config.fullName?.split(' ')[0] || 'Sam'}-Autonomous Agent
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300">
                      {config.agentEngine}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                    <span>Telemetry:</span>
                    <span className="text-emerald-400 font-semibold">
                      {simulatedPing ? '98ms ping received' : '142ms latency'}
                    </span>
                  </div>
                </div>

                {/* Interactive Simulation Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedPing(true);
                    setTimeout(() => setSimulatedPing(false), 1500);
                  }}
                  className="w-full mt-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Zap className={`w-3 h-3 text-amber-400 ${simulatedPing ? 'animate-bounce' : ''}`} />
                  <span>{simulatedPing ? 'Inference Verified!' : 'Test HUD Pulse'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
