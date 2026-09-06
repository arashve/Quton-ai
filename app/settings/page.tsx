'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mobile3 } from '@/components/reactbits';
import {
  ArrowLeft,
  Sliders,
  Cpu,
  Key,
  Mic,
  Palette,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Volume2,
  Server,
  Zap,
  Globe,
  Database,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'model' | 'api' | 'voice' | 'appearance' | 'data'>('model');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Helper to read initial saved config
  const getInitialConfig = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('chatbot_model_config');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  // Model & Inference Settings
  const [defaultProvider, setDefaultProvider] = useState<string>(() => {
    return getInitialConfig()?.provider || 'gemini';
  });
  const [defaultModel, setDefaultModel] = useState<string>(() => {
    return getInitialConfig()?.model || 'gemini-2.5-flash';
  });
  const [temperature, setTemperature] = useState<number>(() => {
    return getInitialConfig()?.temperature ?? 0.7;
  });
  const [maxTokens, setMaxTokens] = useState<number>(() => {
    return getInitialConfig()?.maxTokens ?? 4096;
  });
  const [enableThinking, setEnableThinking] = useState<boolean>(true);
  const [thinkingBudget, setThinkingBudget] = useState<number>(2048);

  // API Keys & Local Endpoints
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return getInitialConfig()?.apiKey || '';
  });
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState<string>(() => {
    return getInitialConfig()?.baseUrl || 'http://localhost:11434';
  });
  const [systemInstructions, setSystemInstructions] = useState<string>(
    'You are AUTOFLOW, an ultra-fast, intelligent, and precise AI assistant. Respond with clarity, elegance, and structured code when relevant.'
  );

  // Voice Settings
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('chatbot_auto_speak') === 'true';
    } catch {
      return false;
    }
  });
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);

  // Appearance
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      return (localStorage.getItem('chatbot_theme') as 'dark' | 'light' | 'system') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [enableAuroraGlow, setEnableAuroraGlow] = useState<boolean>(true);

  const handleSaveAll = () => {
    try {
      const configToSave = {
        provider: defaultProvider,
        model: defaultModel,
        temperature,
        maxTokens,
        baseUrl: ollamaBaseUrl,
        apiKey: groqApiKey,
      };
      localStorage.setItem('chatbot_model_config', JSON.stringify(configToSave));
      localStorage.setItem('chatbot_theme', themeMode);
      localStorage.setItem('chatbot_auto_speak', autoSpeak ? 'true' : 'false');

      // Apply theme to document
      if (themeMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (themeMode === 'light') {
        document.documentElement.classList.remove('dark');
      }

      setSaveStatus('Preferences saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e: any) {
      setSaveStatus('Failed to save settings: ' + e.message);
    }
  };

  const handleResetDefaults = () => {
    setDefaultProvider('gemini');
    setDefaultModel('gemini-2.5-flash');
    setTemperature(0.7);
    setMaxTokens(4096);
    setEnableThinking(true);
    setThinkingBudget(2048);
    setOllamaBaseUrl('http://localhost:11434');
    setAutoSpeak(false);
    setSpeechRate(1.0);
    setSaveStatus('Reset to factory defaults.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="min-h-[100dvh] relative w-full overflow-x-clip bg-zinc-950 text-zinc-100 selection:bg-purple-500/30 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      {/* Background Aurora Mesh */}
      {enableAuroraGlow && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-cyan-600/15 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition flex items-center justify-center cursor-pointer shadow-xs"
              title="Return to Main Portal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  System Settings
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v2.5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Configure inference engines, models, API overrides, voice parameters, and UI preferences.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm transition shadow-lg shadow-purple-600/25 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch Chat Studio</span>
            </Link>
          </div>
        </div>

        {/* Status Toast */}
        {saveStatus && (
          <div className="my-4 px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Settings Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {/* Navigation Sidebar */}
          <div className="md:col-span-3 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'model', label: 'Models & Inference', icon: Cpu },
              { id: 'api', label: 'API Keys & Endpoints', icon: Key },
              { id: 'voice', label: 'Voice & Speech', icon: Mic },
              { id: 'appearance', label: 'Theme & Aurora', icon: Palette },
              { id: 'data', label: 'Data & Privacy', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap text-left ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-md backdrop-blur-md'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="hidden md:block mt-6 pt-6 border-t border-white/10">
              <div className="p-4 rounded-[24px] bg-white/5 border border-white/10 text-xs text-zinc-400 space-y-2">
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ultra-Low Latency</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  All stream events are piped directly using Server-Sent Events (SSE) for near-instant TTFT.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Content Cards */}
          <div className="md:col-span-9 space-y-6">
            {/* 1. Model & Inference Tab */}
            {activeTab === 'model' && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Default Model & Provider</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select which model powers your primary conversations and side-by-side arena.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gemini', name: 'Google Gemini', desc: 'Gemini 2.5 Flash / Pro', tag: 'Fast & Grounded' },
                    { id: 'groq', name: 'Groq LPU', desc: 'Llama 3.3 70B (500+ tok/s)', tag: 'Ultra High Speed' },
                    { id: 'ollama', name: 'Local Ollama', desc: 'Private localhost models', tag: '100% Offline' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setDefaultProvider(p.id)}
                      className={`p-4 rounded-[24px] border text-left transition cursor-pointer ${
                        defaultProvider === p.id
                          ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-semibold">{p.name}</div>
                      <div className="text-[11px] text-zinc-400 mt-1">{p.desc}</div>
                      <span className="inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                        {p.tag}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Model Identifier</label>
                  <select
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/15 text-sm text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended: Low Latency & High Speed)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Reasoning & Multimodal Precision)</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Lightweight General Engine)</option>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq Accelerated)</option>
                    <option value="deepseek-r1:latest">deepseek-r1:latest (Local Ollama Reasoning)</option>
                  </select>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">Temperature: {temperature}</span>
                    <span className="text-zinc-400 text-[11px]">
                      {temperature < 0.3 ? 'Deterministic / Factual' : temperature > 0.9 ? 'Highly Creative' : 'Balanced'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>0.0 (Code / Strict)</span>
                    <span>0.7 (Default)</span>
                    <span>1.5 (Creative / Brainstorm)</span>
                  </div>
                </div>

                {/* Reasoning Mode Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Deep Thought & Reasoning Trace</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Show accordion with step-by-step thinking process for complex prompts.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableThinking}
                    onChange={(e) => setEnableThinking(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 2. API Keys & Endpoints Tab */}
            {activeTab === 'api' && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Custom API Keys & Endpoints</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Connect your own Groq API key or local Ollama endpoint.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">Groq API Key (Optional)</label>
                      <span className="text-[10px] text-zinc-500">Stored strictly in browser localStorage</span>
                    </div>
                    <input
                      type="password"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/15 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Local Ollama Base URL</label>
                    <input
                      type="text"
                      placeholder="http://localhost:11434"
                      value={ollamaBaseUrl}
                      onChange={(e) => setOllamaBaseUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/15 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Custom System Instructions</label>
                    <textarea
                      rows={4}
                      value={systemInstructions}
                      onChange={(e) => setSystemInstructions(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/15 text-xs text-zinc-200 focus:outline-hidden focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Voice & Speech Tab */}
            {activeTab === 'voice' && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Chat 8 Voice Assistant</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tune speech synthesis, auto-read responses, and speech-to-text behaviors.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Automatic Text-to-Speech (Auto-Read)</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Automatically vocalize incoming assistant replies as soon as streaming completes.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">Speech Rate: {speechRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 4. Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Theme & Aurora Visuals</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Adjust interface styling, dark/light modes, and background glows.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark Mode', icon: Moon },
                    { id: 'light', label: 'Light Mode', icon: Sun },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = themeMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setThemeMode(m.id as any)}
                        className={`p-4 rounded-2xl border text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500/50 text-white'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1.5" />
                        <span className="text-xs font-medium">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white">Aurora Glowing Mesh</div>
                    <div className="text-[11px] text-zinc-400">
                      Enable soft radial ambient blurs in the background canvas.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAuroraGlow}
                    onChange={(e) => setEnableAuroraGlow(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 5. Data & Privacy Tab */}
            {activeTab === 'data' && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Data Storage & Session Privacy</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Your conversations are saved directly to your browser localStorage with zero external tracking.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear all chat sessions and reset cache?')) {
                        localStorage.removeItem('chatbot_sessions');
                        localStorage.removeItem('chatbot_recent_prompts');
                        alert('All chat sessions cleared.');
                      }
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition cursor-pointer"
                  >
                    Clear Local History & Conversation Cache
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-zinc-200 transition cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-purple-600/25 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Dock (Mobile-3) */}
      <Mobile3 />
    </div>
  );
}
