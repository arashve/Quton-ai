'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  Square,
  Sparkles,
  Mic,
  MicOff,
  Globe,
  Brain,
  Code2,
  Plus,
  LayoutGrid,
  Network,
  Rocket,
  Wand2,
  ChevronDown,
  Sliders,
  Paperclip,
} from 'lucide-react';
import { ShinyText } from './ShinyText';
import { BorderBeam } from '../magicui/border-beam';
import type { ModelConfig } from '../Chat';

interface ReactBitsAIInputProps {
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  onSend: (overridePrompt?: string, overrideMode?: string) => void;
  onAbort: () => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  modelConfig: ModelConfig;
  onOpenModelModal: () => void;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  className?: string;
}

export const ReactBitsAIInput: React.FC<ReactBitsAIInputProps> = ({
  inputPrompt,
  setInputPrompt,
  onSend,
  onAbort,
  isLoading,
  isListening,
  onToggleVoice,
  modelConfig,
  onOpenModelModal,
  activeMode,
  setActiveMode,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [deepThinkEnabled, setDeepThinkEnabled] = useState(false);

  // Mouse position for interactive spotlight border effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Auto resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 220);
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (inputPrompt.trim() || isListening)) {
        handleTriggerSend();
      }
    }
  };

  const handleTriggerSend = () => {
    let finalPrompt = inputPrompt.trim();
    if (deepThinkEnabled && !finalPrompt.startsWith('[Reasoning Focus]')) {
      finalPrompt = `[Reasoning Focus: Provide thorough architectural step-by-step thinking]\n${finalPrompt}`;
    }
    if (webSearchEnabled && !finalPrompt.includes('[Grounding requested]')) {
      finalPrompt = `[Grounding requested: prioritize latest verified sources & tech specs]\n${finalPrompt}`;
    }
    onSend(finalPrompt, activeMode);
  };

  // Quick Prompt Enhancer ("Magic Polish")
  const handleEnhancePrompt = () => {
    if (!inputPrompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      const original = inputPrompt.trim();
      const enhanced = `Architectural Specification & Implementation Plan for: "${original}"\n\n• Target System Architecture & Tech Stack\n• Core Data Models, Protocols & State Flow\n• Step-by-step Production Code with Error Handling\n• Performance Optimization & Latency Considerations`;
      setInputPrompt(enhanced);
      setIsEnhancing(false);
      textareaRef.current?.focus();
    }, 450);
  };

  const wordCount = inputPrompt.trim() ? inputPrompt.trim().split(/\s+/).length : 0;
  const approxTokens = Math.round(inputPrompt.length / 3.8);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full max-w-3xl mx-auto group ${className}`}
    >
      {/* Main Container - Completely Flat */}
      <div
        className="relative z-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 transition-all duration-200 overflow-hidden flex flex-col"
      >
        {/* Top Control Bar: Active Model Badge & Mode Controls */}
        <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1 text-xs bg-zinc-200/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Model Pill Trigger */}
            <button
              id="reactbits-input-model-btn"
              type="button"
              onClick={onOpenModelModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition text-[11px] font-mono group cursor-pointer"
              title="Change active model & provider"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              <span className="max-w-[130px] sm:max-w-[170px] truncate font-medium">
                {modelConfig.model}
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold uppercase">
                {modelConfig.provider}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
            </button>

            {/* Deep Think Mode Pill */}
            <button
              id="reactbits-deep-think-toggle"
              type="button"
              onClick={() => setDeepThinkEnabled(!deepThinkEnabled)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                deepThinkEnabled
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                  : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Enable Deep Architectural Reasoning"
            >
              <Brain className={`w-3 h-3 ${deepThinkEnabled ? 'text-current' : 'text-zinc-400 dark:text-zinc-500'}`} />
              <span>Deep Think</span>
            </button>

            {/* Web Search Mode Pill */}
            <button
              id="reactbits-web-search-toggle"
              type="button"
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                webSearchEnabled
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                  : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Ground prompt with web sources & real-time docs"
            >
              <Globe className={`w-3 h-3 ${webSearchEnabled ? 'text-current' : 'text-zinc-400 dark:text-zinc-500'}`} />
              <span>Web Search</span>
            </button>

            {/* Wireframe / Code Spec Mode Pill */}
            <button
              id="reactbits-mode-wireframe-toggle"
              type="button"
              onClick={() => setActiveMode(activeMode === 'wireframes' ? 'default' : 'wireframes')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                activeMode === 'wireframes'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                  : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Toggle Wireframe & Component Generation Mode"
            >
              <Code2 className={`w-3 h-3 ${activeMode === 'wireframes' ? 'text-current' : 'text-zinc-400 dark:text-zinc-500'}`} />
              <span>Wireframes</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono">
            {inputPrompt.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {wordCount} words · ~{approxTokens} tokens
              </span>
            )}
          </div>
        </div>

        {/* Textarea Input Core */}
        <div className="relative px-4 pt-2.5 pb-2">
          <textarea
            ref={textareaRef}
            id="reactbits-prompt-input"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask anything, design a clean UI, or architect an AI pipeline..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none outline-none focus:outline-none focus:ring-0 leading-relaxed max-h-[220px] transition-[height] duration-100 ease-out"
          />
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1">
          <div className="flex items-center gap-1.5 relative">
            {/* Quick Templates Popover Trigger */}
            <div className="relative">
              <button
                id="reactbits-templates-btn"
                type="button"
                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Architecture & prompt templates"
              >
                <Plus className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isPlusMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-12 left-0 w-64 p-1.5 rounded-xl bg-white dark:bg-zinc-900 shadow-xl z-50 flex flex-col gap-1 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider">
                      Ready Specs & Templates
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setInputPrompt(
                          'Generate a production React component with Tailwind CSS and clean minimalist design for: '
                        );
                        setIsPlusMenuOpen(false);
                        textareaRef.current?.focus();
                      }}
                      className="px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition"
                    >
                      <LayoutGrid className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span>Component & Wireframe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInputPrompt(
                          'Architect an ultra-low latency SSE streaming API with Node.js Express and TypeScript for: '
                        );
                        setIsPlusMenuOpen(false);
                        textareaRef.current?.focus();
                      }}
                      className="px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition"
                    >
                      <Network className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span>SSE Streaming Pipeline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInputPrompt(
                          'Write a comprehensive MVP technical specification & architecture schema for: '
                        );
                        setIsPlusMenuOpen(false);
                        textareaRef.current?.focus();
                      }}
                      className="px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition"
                    >
                      <Rocket className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span>Full MVP Tech Spec</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Prompt Enhancer Button */}
            {inputPrompt.trim().length > 3 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                id="reactbits-enhance-btn"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs transition cursor-pointer active:scale-95"
                title="Automatically enrich and structure this prompt"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span className="text-[11px] font-medium">Enhance</span>
              </motion.button>
            )}

            {/* Voice Input Button */}
            <button
              id="reactbits-voice-btn"
              type="button"
              onClick={onToggleVoice}
              className={`p-2 rounded-lg transition cursor-pointer ${
                isListening
                  ? 'bg-red-500/20 text-red-500 animate-pulse'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {isListening && (
              <span className="flex items-center gap-1 text-[11px] text-red-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Listening...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">Enter ↵</kbd>
            </span>

            {/* Send or Stop Action Button */}
            {isLoading ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                id="reactbits-stop-btn"
                onClick={onAbort}
                className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                id="reactbits-send-btn"
                onClick={handleTriggerSend}
                disabled={!inputPrompt.trim() && !isListening}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  inputPrompt.trim() || isListening
                    ? 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
