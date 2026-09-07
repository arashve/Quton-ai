'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Keyboard,
  Key,
  MessageSquare,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { PageContainer, SectionCard } from '@/components/shell';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const shortcuts = [
    { key: '⌘ + K / Ctrl + K', desc: 'Open Command Palette & Global Search' },
    { key: '⌘ + B / Ctrl + B', desc: 'Toggle Studio Navigation Sidebar' },
    { key: 'Enter', desc: 'Send Message / Execute Action' },
    { key: 'Shift + Enter', desc: 'Insert New Line in Prompt Input' },
    { key: 'Esc', desc: 'Close Modal, Drawer, or Active Dialog' },
  ];

  const faqs = [
    {
      q: 'How do I add or switch my API keys?',
      a: 'Navigate to Settings > API Keys. You can configure Gemini, Groq, or Local Ollama keys securely. Keys stored in localStorage never leave your browser unless making direct proxied inference requests.',
    },
    {
      q: 'Why is Time to First Token (TTFT) so fast in AUTOFLOW?',
      a: 'AUTOFLOW establishes persistent Server-Sent Events (SSE) streaming connections directly to high-speed inference backends without heavy intermediate buffering.',
    },
    {
      q: 'How does the Arena split pane comparison work?',
      a: 'In the Arena (/arena) or within the Chat Studio, you can test two models simultaneously side-by-side on the identical prompt and compare latency, tokens/sec, and reasoning fidelity.',
    },
    {
      q: 'Can I install community agents or add custom tools?',
      a: 'Yes! Visit the Agent Marketplace (/marketplace) to browse pre-built agents like Store Support, Python Coder, or Creative Writer, or construct your own custom agent workflows.',
    },
    {
      q: 'How does the mobile navigation work?',
      a: 'The mobile navigation shell is fixed at the bottom of your screen with zero layout jumping. You can tap Chat, Arena, Voice, or Home at any time, or tap "More" for quick access to all platform tools.',
    },
  ];

  return (
    <PageContainer
      variant="public"
      maxWidth="lg"
      title="Help & Documentation"
      description="Quick answers, keyboard shortcuts, and system documentation for the AUTOFLOW platform."
    >
      <div className="space-y-6">
        {/* Keyboard Shortcuts Card */}
        <SectionCard
          title="Keyboard Shortcuts"
          description="Accelerate your workflow with platform keybindings."
          headerIcon={Keyboard}
          variant="glass"
          radius="lg"
          padding="md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800"
              >
                <span className="text-xs text-zinc-400">{s.desc}</span>
                <kbd className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Frequently Asked Questions */}
        <SectionCard
          title="Frequently Asked Questions"
          description="Common inquiries regarding model engines, latency, and setup."
          headerIcon={HelpCircle}
          variant="glass"
          radius="lg"
          padding="md"
        >
          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-zinc-950/60 border border-zinc-800 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:text-zinc-300 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Support & Community Box */}
        <div className="p-6 rounded-[28px] bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Need custom enterprise assistance?</div>
              <div className="text-xs text-zinc-400">
                Explore dedicated LPU deployments and custom fine-tuned models.
              </div>
            </div>
          </div>
          <Link
            href="/chat?q=How%20can%20I%20deploy%20a%20custom%20model%20on%20AUTOFLOW%3F"
            className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition shrink-0"
          >
            Ask Assistant
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
