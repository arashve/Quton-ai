'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  Bot,
  Store,
  Code2,
  Search,
  CheckCircle2,
  ExternalLink,
  Power,
  ChevronLeft,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  StudioAgent,
  getStudioAgents,
  toggleStudioAgent,
  subscribeStoreUpdates,
  setActiveWorkspace,
  getActiveWorkspace,
} from '@/lib/storeAgentService';

interface AgentStudioHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkspace: (workspaceId: string) => void;
}

export function AgentStudioHubModal({
  isOpen,
  onClose,
  onSelectWorkspace,
}: AgentStudioHubModalProps) {
  const [agents, setAgents] = useState<StudioAgent[]>([]);
  const [currentWs, setCurrentWs] = useState<string>('default');

  const reload = () => {
    setAgents(getStudioAgents());
    setCurrentWs(getActiveWorkspace());
  };

  useEffect(() => {
    if (isOpen) {
      reload();
    }
    return subscribeStoreUpdates(reload);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStudioAgent(agentId);
    setAgents(getStudioAgents());
  };

  const handleEnterAgent = (agentId: string) => {
    setActiveWorkspace(agentId);
    onSelectWorkspace(agentId);
    onClose();
  };

  const handleSelectStandardChat = () => {
    setActiveWorkspace('default');
    onSelectWorkspace('default');
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Backdrop with Aurora Glass Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-opacity"
      />

      {/* Aurora Ambient Glow Meshes */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Container: Apple Squircle & Glassmorphism */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-zinc-950/80 backdrop-blur-2xl border border-white/15 dark:border-white/10 shadow-2xl p-5 sm:p-7 text-zinc-100 flex flex-col font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  استودیو و هاب ایجنت‌های هوشمند
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Agent Hub
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                مدیریت فعال/غیرفعال‌سازی ایجنت‌ها و ورود مستقیم به فضای اختصاصی هر ابزار
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option: Return to Standard General Chat */}
        <div
          onClick={handleSelectStandardChat}
          className={`p-4 rounded-[24px] mb-4 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            currentWs === 'default'
              ? 'bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent border-purple-500/40 shadow-lg'
              : 'bg-white/5 hover:bg-white/10 border-white/10'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">چت عمومی هوش مصنوعی (حالت استاندارد)</h3>
                {currentWs === 'default' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    فضای فعال فعلی
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                گفتگوی آزاد با مدل‌های زبانی (Gemini، Claude، DeepSeek)، ورودی صوتی و دستیار متنی بدون ابزارهای اختصاصی
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 shrink-0"
          >
            <span>ورود</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 my-2 text-xs text-zinc-400 font-mono">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>ایجنت‌های تخصصی استودیو ({agents.length} ایجنت ثبت‌شده)</span>
        </div>

        {/* Agents Bento Grid List */}
        <div className="space-y-3.5 mt-2">
          {agents.map((agent) => {
            const isCurrent = currentWs === agent.id;
            return (
              <div
                key={agent.id}
                className={`group relative overflow-hidden rounded-[28px] p-4 sm:p-5 border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border-purple-500/50 shadow-xl'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                {/* Top Row: Icon, Title, Switch Toggle */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/15"
                      style={{
                        background: `linear-gradient(135deg, ${agent.accentColor}33, ${agent.accentColor}11)`,
                      }}
                    >
                      {agent.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                          {agent.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                          {agent.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                        {agent.titleFa}
                      </p>
                    </div>
                  </div>

                  {/* HeroUI Apple-Style Switch Toggle */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                      {agent.isEnabled ? 'فعال' : 'غیرفعال'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={agent.isEnabled}
                      onClick={(e) => handleToggle(agent.id, e)}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        agent.isEnabled
                          ? 'bg-purple-600 shadow-md shadow-purple-600/40'
                          : 'bg-zinc-800'
                      }`}
                      title={agent.isEnabled ? 'غیرفعال کردن ایجنت' : 'فعال کردن ایجنت'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          agent.isEnabled ? '-translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 leading-relaxed mb-3 pr-1">
                  {agent.descriptionFa}
                </p>

                {/* Capability Chips & Enter Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {agent.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-zinc-400 border border-white/10"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {agent.isEnabled ? (
                      <button
                        type="button"
                        onClick={() => handleEnterAgent(agent.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <span>ورود به فضای اختصاصی</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleToggle(agent.id, e)}
                        className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-zinc-300 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Power className="w-3.5 h-3.5 text-purple-400" />
                        <span>فعال‌سازی ایجنت</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link to Marketplace */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-zinc-400">نیاز به قابلیت‌های تجاری یا ایجنت جدید دارید؟</span>
          <Link
            href="/marketplace"
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition"
          >
            <span>مارکت‌پلیس ایجنت‌ها</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
