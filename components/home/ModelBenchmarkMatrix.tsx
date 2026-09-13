'use client';

import React from 'react';
import Link from 'next/link';

interface ModelBenchmarkMatrixProps {
  onLaunchChat: (promptText?: string, modeOverride?: string) => void;
}

export function ModelBenchmarkMatrix({ onLaunchChat }: ModelBenchmarkMatrixProps) {
  const models = [
    {
      name: 'gemini-2.5-flash',
      provider: 'Gemini',
      latency: '~150ms',
      latencyColor: 'text-emerald-400 font-bold',
      throughput: '140 tok/s',
      reasoning: 'Adaptive High',
      actionText: 'Select',
      prompt: 'Test gemini-2.5-flash speed',
    },
    {
      name: 'gemini-2.5-pro',
      provider: 'Gemini',
      latency: '~280ms',
      latencyColor: 'text-white',
      throughput: '90 tok/s',
      reasoning: 'Maximum Depth',
      actionText: 'Select',
      prompt: 'Test gemini-2.5-pro reasoning',
    },
    {
      name: 'llama-3.3-70b',
      provider: 'Groq',
      latency: '~180ms',
      latencyColor: 'text-emerald-400 font-bold',
      throughput: '450+ tok/s',
      reasoning: 'Very High',
      actionText: 'Select',
      prompt: 'Test Groq Llama generation speed',
    },
    {
      name: 'deepseek-r1 / qwen',
      provider: 'Ollama Local',
      latency: 'Local Device',
      latencyColor: 'text-white/70',
      throughput: 'Hardware Dependent',
      reasoning: 'Fully Private',
      isLink: true,
      linkHref: '/settings',
      actionText: 'Setup',
    },
  ];

  return (
    <section
      id="models-matrix"
      className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-20"
    >
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Foundation engines at your fingertips
        </h2>
        <p className="text-base text-white/60">
          Choose the best balance of latency, reasoning capacity, and deployment model.
        </p>
      </div>

      <div className="rounded-3xl bg-[#1C1C1E] p-6 sm:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-mono uppercase text-white/50 tracking-wider">
                <th scope="col" className="pb-5 pl-4 font-semibold">Model</th>
                <th scope="col" className="pb-5 font-semibold">Provider</th>
                <th scope="col" className="pb-5 font-semibold">TTFT (Latency)</th>
                <th scope="col" className="pb-5 font-semibold">Throughput</th>
                <th scope="col" className="pb-5 font-semibold">Reasoning</th>
                <th scope="col" className="pb-5 pr-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {models.map((model) => (
                <tr key={model.name} className="hover:bg-[#2C2C2E] transition rounded-2xl">
                  <td className="py-4 pl-4 font-semibold text-white font-mono rounded-l-2xl">
                    {model.name}
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-[#2C2C2E] text-white font-mono text-xs">
                      {model.provider}
                    </span>
                  </td>
                  <td className={`py-4 font-mono ${model.latencyColor}`}>
                    {model.latency}
                  </td>
                  <td className="py-4 font-mono text-white/90">
                    {model.throughput}
                  </td>
                  <td className="py-4">
                    {model.reasoning}
                  </td>
                  <td className="py-4 pr-4 text-right rounded-r-2xl">
                    {model.isLink ? (
                      <Link
                        href={model.linkHref!}
                        className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs cursor-pointer font-semibold transition"
                      >
                        {model.actionText}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onLaunchChat(model.prompt)}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold cursor-pointer transition"
                      >
                        {model.actionText}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
