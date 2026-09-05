'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  Cpu,
  Globe,
  ExternalLink,
  Brain,
  ChevronDown,
  Check,
  Copy,
  Volume2,
  VolumeX,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Trophy,
  Mic,
  MicOff,
  Radio,
  Share2,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import type { ChatCitation } from './Chat';

export const EMOJI_OPTIONS = ['👍', '❤️', '🔥', '🚀', '💡', '🎉'];

// Provider Brand Badges (AI Chat 7 Style)
export function ProviderBadge({
  provider,
  modelName,
  isStreaming,
}: {
  provider?: string;
  modelName?: string;
  isStreaming?: boolean;
}) {
  const isGroq = provider === 'groq' || modelName?.includes('gpt-oss') || modelName?.includes('llama');
  const isGemini = provider === 'gemini' || modelName?.includes('gemini');
  const isOpenAI = provider === 'openai' || modelName?.startsWith('gpt-4') || modelName?.startsWith('o3');

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 text-xs">
      {isGemini ? (
        <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Sparkles className="w-2.2 h-2.2 text-white" />
        </span>
      ) : isGroq ? (
        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Zap className="w-2.2 h-2.2 text-white" />
        </span>
      ) : isOpenAI ? (
        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Bot className="w-2.2 h-2.2 text-white" />
        </span>
      ) : (
        <Cpu className="w-3 h-3 text-zinc-400 flex-shrink-0" />
      )}
      <span className="font-mono text-[11px] font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">
        {modelName || 'Inference Model'}
      </span>
      {isStreaming && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
      )}
    </div>
  );
}

// Deep Thought / Reasoning Process Box (AI Chat 7 & 9 Style)
export function ReasoningBox({
  reasoning,
  isStreaming,
}: {
  reasoning: string;
  isStreaming?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const thoughtCount = reasoning.split(/\s+/).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-200/30 dark:bg-zinc-950/50 overflow-hidden transition-colors">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Brain
            className={`w-3.5 h-3.5 ${
              isStreaming ? 'text-amber-500 animate-pulse' : 'text-zinc-500'
            }`}
          />
          <span>{isStreaming ? 'Thinking & Synthesizing...' : 'Reasoning Process'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
            {isStreaming ? 'Active' : `${thoughtCount} thoughts`}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-3.5 pb-3 text-xs font-mono text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-2 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
          {reasoning}
          {isStreaming && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-500 animate-pulse align-middle" />
          )}
        </div>
      )}
    </div>
  );
}

// Citations and Web Grounding Cards (AI Chat 7 Style)
export function CitationsBar({ citations }: { citations: ChatCitation[] }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mr-1">
        <Globe className="w-3 h-3 text-cyan-500" />
        Sources:
      </span>
      {citations.map((cite, idx) => (
        <a
          key={idx}
          href={cite.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-200/60 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 transition"
          title={cite.url}
        >
          <span className="truncate max-w-[130px]">{cite.title || cite.domain}</span>
          <ExternalLink className="w-2.5 h-2.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
        </a>
      ))}
    </div>
  );
}

// Emoji Reactions Bar & Chips (AI Chat 8 Style)
export function EmojiReactions({
  messageId,
  reactions,
  userReactions = [],
  onToggleReaction,
}: {
  messageId: string;
  reactions?: Record<string, number>;
  userReactions?: string[];
  onToggleReaction?: (messageId: string, emoji: string) => void;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const hasReactions =
    reactions && Object.values(reactions).some((count) => (count || 0) > 0);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Existing active reactions chips */}
      {hasReactions &&
        Object.entries(reactions || {}).map(([emoji, count]) => {
          if (!count || count <= 0) return null;
          const isUserActive = userReactions.includes(emoji);
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onToggleReaction?.(messageId, emoji)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition cursor-pointer ${
                isUserActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium shadow-2xs'
                  : 'bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80'
              }`}
              title={`Toggle ${emoji}`}
            >
              <span>{emoji}</span>
              <span className="text-[10px] font-mono">{count}</span>
            </button>
          );
        })}

      {/* Emoji Picker Popover Button */}
      {onToggleReaction && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setIsPickerOpen((prev) => !prev)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            title="Add reaction"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          {isPickerOpen && (
            <div
              className="absolute left-0 bottom-full mb-1 z-30 flex items-center gap-1 p-1 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-md"
              onMouseLeave={() => setIsPickerOpen(false)}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onToggleReaction(messageId, emoji);
                    setIsPickerOpen(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Date Divider (AI Chat 8 Style)
export function DateDivider({ dateText, timestamp }: { dateText?: string; timestamp?: number }) {
  const display =
    dateText ||
    (timestamp
      ? new Date(timestamp).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      : 'Today');

  return (
    <div className="flex items-center justify-center my-5 select-none">
      <div className="h-px flex-1 bg-zinc-200/60 dark:bg-zinc-800/60" />
      <span className="mx-3 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 shadow-2xs">
        {display}
      </span>
      <div className="h-px flex-1 bg-zinc-200/60 dark:bg-zinc-800/60" />
    </div>
  );
}

// Docked Voice-First Assistant Panel (AI Chat 8 Style)
export function DockedVoicePanel({
  isListening,
  isSpeaking,
  onToggleMic,
  onToggleListening,
  autoSpeak,
  onToggleAutoSpeak,
  onSendVoicePrompt,
  onStopSpeaking,
  isMinimized,
  onToggleMinimize,
  onClose,
}: {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleMic?: () => void;
  onToggleListening?: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onSendVoicePrompt?: (prompt: string) => void;
  onStopSpeaking?: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose?: () => void;
}) {
  const toggleMic = onToggleMic || onToggleListening || (() => {});
  const waveformHeights = [0.35, 0.8, 0.5, 0.95, 0.65, 0.85, 0.4];

  return (
    <div className="mx-auto max-w-4xl w-full px-3 sm:px-6 pt-2 pb-1">
      <div className="rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 sm:p-3 shadow-xs backdrop-blur-md transition-all">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Status & Waveform Indicator */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated Audio Waveform */}
            <div className="flex items-center gap-0.5 h-6 px-2 py-1 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60 border border-zinc-300/40 dark:border-zinc-700/40">
              {waveformHeights.map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isListening
                      ? 'bg-rose-500 animate-pulse'
                      : isSpeaking
                      ? 'bg-cyan-500 animate-pulse'
                      : 'bg-zinc-400 dark:bg-zinc-500'
                  }`}
                  style={{
                    height: isListening || isSpeaking ? `${Math.max(25, h * 100)}%` : '30%',
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>

            {/* Voice Status Text */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Voice-First Copilot
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isListening
                      ? 'bg-rose-500 animate-ping'
                      : isSpeaking
                      ? 'bg-cyan-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                {isListening
                  ? 'Listening to microphone... Speak clearly'
                  : isSpeaking
                  ? 'Reading assistant response aloud...'
                  : 'Ready • Hands-free vocal interaction'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Auto-Speak Toggle */}
            <button
              type="button"
              onClick={onToggleAutoSpeak}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition cursor-pointer ${
                autoSpeak
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                  : 'bg-zinc-200/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title="Automatically read assistant responses aloud"
            >
              <Volume2 className="w-3 h-3" />
              <span>Auto-Read</span>
            </button>

            {/* Stop Speaking button if audio is playing */}
            {isSpeaking && onStopSpeaking && (
              <button
                type="button"
                onClick={onStopSpeaking}
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition cursor-pointer"
                title="Stop speech playback"
              >
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span className="hidden sm:inline">Mute</span>
              </button>
            )}

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop Mic</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Talk</span>
                </>
              )}
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              type="button"
              onClick={onToggleMinimize}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer"
              title={isMinimized ? 'Expand voice options' : 'Minimize voice panel'}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMinimized ? '' : 'rotate-180'
                }`}
              />
            </button>

            {/* Close button if provided */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer"
                title="Close voice panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Voice Prompt Suggestions */}
        {!isMinimized && onSendVoicePrompt && (
          <div className="mt-2.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mr-1">
              Quick Vocal Commands:
            </span>
            {[
              'Summarize in 3 bullet points',
              'Compare Groq vs Gemini models',
              'Explain Next.js 15 App Router architecture',
            ].map((vPrompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSendVoicePrompt(vPrompt)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-200/50 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
              >
                <Radio className="w-2.5 h-2.5 text-zinc-400" />
                <span>{vPrompt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// AI Chat 7 Split-Pane Model Comparison Component
export interface ComparisonSlotData {
  id: string;
  provider: 'groq' | 'gemini' | 'openai' | 'ollama' | 'custom';
  modelName: string;
  content: string;
  reasoning?: string;
  citations?: ChatCitation[];
  ttftMs?: number;
  tokensPerSec?: number;
  isStreaming?: boolean;
}

export function DualModelComparisonCard({
  messageId,
  modelA,
  modelB,
  winnerId,
  onVoteWinner,
  onCopy,
  copiedId,
  onSpeak,
  speakingMessageId,
  onFeedback,
  feedback,
}: {
  messageId: string;
  modelA: ComparisonSlotData;
  modelB: ComparisonSlotData;
  winnerId?: 'modelA' | 'modelB' | null;
  onVoteWinner?: (messageId: string, winner: 'modelA' | 'modelB' | null) => void;
  onCopy: (id: string, text: string) => void;
  copiedId: string | null;
  onSpeak: (id: string, text: string) => void;
  speakingMessageId: string | null;
  onFeedback: (id: string, type: 'up' | 'down') => void;
  feedback: Record<string, 'up' | 'down'>;
}) {
  const [collapsedModel, setCollapsedModel] = useState<'modelA' | 'modelB' | null>(
    winnerId === 'modelA' ? 'modelB' : winnerId === 'modelB' ? 'modelA' : null
  );

  const handleSelectWinner = (winner: 'modelA' | 'modelB') => {
    if (winnerId === winner) {
      // Clear vote
      onVoteWinner?.(messageId, null);
      setCollapsedModel(null);
    } else {
      onVoteWinner?.(messageId, winner);
      setCollapsedModel(winner === 'modelA' ? 'modelB' : 'modelA');
    }
  };

  const renderModelPane = (
    slot: ComparisonSlotData,
    slotKey: 'modelA' | 'modelB',
    isWinner: boolean,
    isLoser: boolean
  ) => {
    if (isLoser && collapsedModel === slotKey) {
      return (
        <div
          key={slotKey}
          className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/40 p-3 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <ProviderBadge provider={slot.provider} modelName={slot.modelName} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              (Collapsed loser response)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCollapsedModel(null)}
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:underline cursor-pointer"
          >
            Expand & Review
          </button>
        </div>
      );
    }

    return (
      <div
        key={slotKey}
        className={`flex-1 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
          isWinner
            ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30 shadow-md'
            : 'bg-zinc-100/70 dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/60 shadow-xs'
        }`}
      >
        <div className="space-y-3.5">
          {/* Top Provider Bar & Winner Vote Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <ProviderBadge
                provider={slot.provider}
                modelName={slot.modelName}
                isStreaming={slot.isStreaming}
              />
              {slot.ttftMs !== undefined && (
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  {slot.ttftMs}ms {slot.tokensPerSec ? `• ${slot.tokensPerSec} t/s` : ''}
                </span>
              )}
            </div>

            {/* AI Chat 7 Vote Winner Button */}
            <button
              type="button"
              onClick={() => handleSelectWinner(slotKey)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isWinner
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-zinc-200/80 hover:bg-amber-500 hover:text-white dark:bg-zinc-800 dark:hover:bg-amber-500 text-zinc-700 dark:text-zinc-200'
              }`}
              title="Vote this response as winner (collapses loser)"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{isWinner ? 'Winner 🏆' : 'Vote Winner'}</span>
            </button>
          </div>

          {/* Reasoning Process */}
          {slot.reasoning && (
            <ReasoningBox reasoning={slot.reasoning} isStreaming={slot.isStreaming} />
          )}

          {/* Citations */}
          {slot.citations && slot.citations.length > 0 && (
            <CitationsBar citations={slot.citations} />
          )}

          {/* Content */}
          <div className="text-[14px] leading-relaxed text-zinc-900 dark:text-zinc-100 font-sans">
            {slot.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
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
                {slot.content}
              </ReactMarkdown>
            ) : slot.isStreaming ? (
              <div className="flex items-center gap-2 py-2 text-zinc-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                <span>Streaming {slot.modelName}...</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Actions */}
        {slot.content && !slot.isStreaming && (
          <div className="pt-3 mt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onCopy(`${messageId}_${slotKey}`, slot.content)}
                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                title="Copy response"
              >
                {copiedId === `${messageId}_${slotKey}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onSpeak(`${messageId}_${slotKey}`, slot.content)}
                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                title="Read response aloud"
              >
                {speakingMessageId === `${messageId}_${slotKey}` ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onFeedback(`${messageId}_${slotKey}`, 'up')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  feedback[`${messageId}_${slotKey}`] === 'up'
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onFeedback(`${messageId}_${slotKey}`, 'down')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  feedback[`${messageId}_${slotKey}`] === 'down'
                    ? 'text-rose-500 bg-rose-500/10'
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3 w-full">
      {/* Split Comparison Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">AI Chat 7 Model Arena: Side-by-Side Comparison</span>
        </div>
        {winnerId ? (
          <span className="font-mono text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
            Winner Crowned 🏆
          </span>
        ) : (
          <span className="font-mono text-[10px] text-zinc-500">
            Vote to collapse loser
          </span>
        )}
      </div>

      {/* Side-by-side or winner expanded layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderModelPane(
          modelA,
          'modelA',
          winnerId === 'modelA',
          winnerId === 'modelB'
        )}
        {renderModelPane(
          modelB,
          'modelB',
          winnerId === 'modelB',
          winnerId === 'modelA'
        )}
      </div>
    </div>
  );
}
