'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  ArrowUp,
  Square,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Globe,
  Code2,
  ChevronDown,
  ChevronRight,
  Sliders,
  ExternalLink,
  Plus,
  Mic,
  MicOff,
  Paperclip,
  Share2,
  Zap,
} from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import type { ChatMessage, ModelConfig } from '../Chat';

interface AIChatFlatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (prompt: string, mode?: string) => void;
  onAbort: () => void;
  onRegenerate: (index: number) => void;
  modelConfig: ModelConfig;
  onOpenModelModal: () => void;
  lastMetrics: { ttftMs: number; tps: number } | null;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  isListening: boolean;
  onToggleVoice: () => void;
  headingRef?: React.RefObject<HTMLHeadingElement | null>;
  starterPrompts: Array<{
    icon: any;
    title: string;
    prompt: string;
    mode: string;
  }>;
}

export const AIChatFlat: React.FC<AIChatFlatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onAbort,
  onRegenerate,
  modelConfig,
  onOpenModelModal,
  lastMetrics,
  activeMode,
  setActiveMode,
  isListening,
  onToggleVoice,
  headingRef,
  starterPrompts,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isDeepThinkActive, setIsDeepThinkActive] = useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({});

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when new chunks arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-adjust textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const nextHeight = Math.min(Math.max(el.scrollHeight, 44), 220);
      el.style.height = `${nextHeight}px`;
    }
  }, [inputPrompt]);

  const handleTriggerSend = () => {
    let final = inputPrompt.trim();
    if (!final && !isListening) return;

    if (isDeepThinkActive && !final.startsWith('[Reasoning Focus]')) {
      final = `[Reasoning Focus: Provide thorough step-by-step thinking]\n${final}`;
    }
    if (isWebSearchActive && !final.includes('[Grounding requested]')) {
      final = `[Grounding requested: prioritize verified live sources]\n${final}`;
    }

    onSendMessage(final, activeMode);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleTriggerSend();
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSpeech = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[`#*_\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoningIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const wordCount = inputPrompt.trim() ? inputPrompt.trim().split(/\s+/).length : 0;
  const approxTokens = Math.round(inputPrompt.length / 3.8);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[var(--page-bg)]">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">
        {messages.length === 0 ? (
          /* Empty State - Flat Clean Bento Prompts */
          <div className="max-w-3xl mx-auto min-h-[70vh] flex flex-col justify-center items-center text-center px-4 relative z-10 pointer-events-none">
            {/* Main Interactive Heading */}
            <div className="mb-8 space-y-2 pointer-events-auto">
              <h1
                ref={headingRef}
                className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-pixel"
              >
                AUTOTRACK
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Ultra-low latency AI engineering engine with streaming SSE, local inference, and code generation.
              </p>
            </div>

            {/* Flat Starter Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pointer-events-auto">
              {starterPrompts.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    id={`flat-starter-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onSendMessage(item.prompt, item.mode)}
                    className="p-3.5 rounded-2xl bg-zinc-100/90 hover:bg-zinc-200/90 dark:bg-zinc-900/90 dark:hover:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-800/80 transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Filter Topic Chips */}
            <div className="hidden sm:flex flex-wrap justify-center items-center gap-2 mt-4 pointer-events-auto">
              {starterPrompts.slice(4).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => onSendMessage(item.prompt, item.mode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition cursor-pointer"
                  >
                    <Icon className="w-3 h-3 text-zinc-500" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Thread - React Bits Pro Flat Style */
          <div className="max-w-3xl mx-auto space-y-6 pb-40">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const isAssistant = message.role === 'assistant';
              const isLatest = index === messages.length - 1;
              const isStreamingThis = isLoading && isLatest && isAssistant;

              // Check if reasoning / thinking block is contained
              const hasReasoning =
                isAssistant &&
                (message.content.includes('<think>') ||
                  message.content.includes('```thinking') ||
                  message.content.includes('[Reasoning Focus') ||
                  isDeepThinkActive);

              return (
                <div
                  key={message.id}
                  id={`flat-message-${message.id}`}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  {/* Message Meta Header */}
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-zinc-500 dark:text-zinc-400 px-1">
                    {isAssistant ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                          <Bot className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          AutoFlow Assistant
                        </span>
                        {message.modelUsed && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {message.modelUsed}
                          </span>
                        )}
                        {message.ttftMs && (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                            • TTFT {message.ttftMs}ms
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">You</span>
                        <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-[10px] font-bold">
                          U
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Bubble Body */}
                  {isUser ? (
                    <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-sm leading-relaxed whitespace-pre-wrap shadow-xs">
                      {message.content}
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl p-4 sm:p-5 bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100 space-y-3 shadow-xs">
                      {/* Optional Reasoning / Thinking Disclosure Block */}
                      {hasReasoning && (
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => toggleReasoning(message.id)}
                            className="w-full px-3 py-2 flex items-center justify-between text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5 font-medium">
                              <Brain className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Reasoning Process & Step Analysis</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                              <span>{expandedReasoningIds[message.id] ? 'Hide' : 'Show steps'}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  expandedReasoningIds[message.id] ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          {expandedReasoningIds[message.id] && (
                            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[11px] leading-relaxed space-y-1 bg-zinc-100/50 dark:bg-zinc-900/40">
                              <p>✓ Context and requirement verification completed</p>
                              <p>✓ Model selected: {message.modelUsed || modelConfig.model}</p>
                              <p>✓ Synthesized architecture breakdown and code execution plan</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Markdown Content */}
                      {message.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p({ children }) {
                              return (
                                <p className="mb-3 last:mb-0 leading-relaxed text-zinc-800 dark:text-zinc-200">
                                  {children}
                                </p>
                              );
                            },
                            h1({ children }) {
                              return (
                                <h1 className="text-lg font-bold mt-4 mb-2 text-zinc-950 dark:text-white tracking-tight">
                                  {children}
                                </h1>
                              );
                            },
                            h2({ children }) {
                              return (
                                <h2 className="text-base font-semibold mt-3 mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">
                                  {children}
                                </h2>
                              );
                            },
                            h3({ children }) {
                              return (
                                <h3 className="text-sm font-semibold mt-2 mb-1 text-zinc-900 dark:text-zinc-200">
                                  {children}
                                </h3>
                              );
                            },
                            li({ children }) {
                              return (
                                <li className="my-1 text-zinc-800 dark:text-zinc-300">
                                  {children}
                                </li>
                              );
                            },
                            code({ className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              const isInline = !match && !String(children).includes('\n');
                              if (isInline) {
                                return (
                                  <code
                                    className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 font-mono text-xs"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <CodeBlock
                                  language={match ? match[1] : 'text'}
                                  value={String(children).replace(/\n$/, '')}
                                />
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : isStreamingThis ? (
                        <div className="flex items-center gap-2 py-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                          <span>Streaming tokens...</span>
                        </div>
                      ) : null}

                      {/* Blinking Cursor for active stream */}
                      {isStreamingThis && message.content && (
                        <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                      )}

                      {/* Action Toolbar */}
                      {message.content && !isStreamingThis && (
                        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1">
                            <button
                              id={`flat-copy-${message.id}`}
                              type="button"
                              onClick={() => handleCopy(message.id, message.content)}
                              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              id={`flat-tts-${message.id}`}
                              type="button"
                              onClick={() => toggleSpeech(message.id, message.content)}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                speakingMessageId === message.id
                                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                              }`}
                              title={speakingMessageId === message.id ? 'Stop audio' : 'Read aloud'}
                            >
                              {speakingMessageId === message.id ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              id={`flat-regen-${message.id}`}
                              type="button"
                              onClick={() => onRegenerate(index)}
                              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                              title="Regenerate this response"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setFeedback((prev) => ({ ...prev, [message.id]: 'up' }))
                              }
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                feedback[message.id] === 'up'
                                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setFeedback((prev) => ({ ...prev, [message.id]: 'down' }))
                              }
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                feedback[message.id] === 'down'
                                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Composer Bar - React Bits Pro Flat */}
      <footer className="p-3 sm:p-6 pt-0 mt-auto flex-shrink-0 relative z-20 bg-transparent">
        <div className="max-w-3xl mx-auto relative">
          {/* Main Flat Input Container */}
          <div className="rounded-2xl bg-zinc-100/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden transition-all duration-150">
            {/* Top Toolbar: Model Selector & Quick Capabilities */}
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1 text-xs border-b border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Model Pill */}
                <button
                  id="flat-input-model-selector"
                  type="button"
                  onClick={onOpenModelModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200/80 hover:bg-zinc-300/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition text-[11px] font-mono cursor-pointer"
                  title="Switch Model / Provider"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span className="max-w-[140px] truncate font-medium">{modelConfig.model}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold uppercase">
                    {modelConfig.provider}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Deep Think Pill */}
                <button
                  id="flat-input-deep-think-toggle"
                  type="button"
                  onClick={() => setIsDeepThinkActive(!isDeepThinkActive)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                    isDeepThinkActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title="Toggle Step-by-Step Reasoning"
                >
                  <Brain className="w-3 h-3" />
                  <span>Deep Think</span>
                </button>

                {/* Web Search Pill */}
                <button
                  id="flat-input-web-search-toggle"
                  type="button"
                  onClick={() => setIsWebSearchActive(!isWebSearchActive)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                    isWebSearchActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title="Toggle Web Grounding"
                >
                  <Globe className="w-3 h-3" />
                  <span>Web</span>
                </button>

                {/* Wireframes Pill */}
                <button
                  id="flat-input-wireframes-toggle"
                  type="button"
                  onClick={() => setActiveMode(activeMode === 'wireframes' ? 'default' : 'wireframes')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                    activeMode === 'wireframes'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title="Generate React Specs & Wireframe Code"
                >
                  <Code2 className="w-3 h-3" />
                  <span>Wireframes</span>
                </button>
              </div>

              {/* Counter */}
              {inputPrompt.length > 0 && (
                <div className="hidden sm:block text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  {wordCount} words · ~{approxTokens} tokens
                </div>
              )}
            </div>

            {/* Input Textarea */}
            <div className="px-3.5 py-2">
              <textarea
                ref={textareaRef}
                id="flat-chat-prompt-input"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask anything, generate code, or explore specs..."
                className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none outline-none focus:outline-none focus:ring-0 leading-relaxed"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
              <div className="flex items-center gap-1">
                {/* Voice Input Button */}
                <button
                  id="flat-input-voice-btn"
                  type="button"
                  onClick={onToggleVoice}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                  title={isListening ? 'Stop listening' : 'Voice Dictation'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isLoading ? (
                  <button
                    id="flat-abort-stream-btn"
                    type="button"
                    onClick={onAbort}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black text-xs font-medium hover:opacity-90 transition cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    id="flat-send-prompt-btn"
                    type="button"
                    onClick={handleTriggerSend}
                    disabled={!inputPrompt.trim() && !isListening}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      inputPrompt.trim() || isListening
                        ? 'bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-xs'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                    }`}
                    title="Send Prompt (Enter)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Engine Status Bar */}
          <div className="flex justify-center items-center mt-2.5 gap-4 sm:gap-6 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Stream: SSE Active
            </span>
            <span>•</span>
            <span>Provider: {modelConfig.provider.toUpperCase()}</span>
            <span>•</span>
            <span className="hidden sm:inline">React Bits Pro (Flat Edition)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
