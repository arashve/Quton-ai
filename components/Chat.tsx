'use client';

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  Search,
  BookOpen,
  MicOff,
  Square,
  Plus,
  ArrowUp,
  LayoutGrid,
  Globe,
  Rocket,
  Link2,
  Lightbulb,
  Network,
  RotateCcw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  X,
  FileText,
  Clock,
  Trash2,
  Download,
  FolderKanban,
  Zap,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  ttftMs?: number;
  tokensPerSec?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

let sessionCounter = 0;
function createId(prefix: string): string {
  sessionCounter++;
  return `${prefix}_${Date.now()}_${sessionCounter}`;
}

const emptySubscribe = () => () => {};

const STARTER_PROMPTS = [
  {
    icon: LayoutGrid,
    title: 'Wireframes',
    prompt: 'Generate an interactive wireframe spec and React component layout for a SaaS analytics dashboard with dark glassmorphism.',
    mode: 'wireframes',
  },
  {
    icon: Bot,
    title: 'Chatbot Builder',
    prompt: 'Design the complete architecture, state machine, and streaming SSE pipeline for an AI Customer Support Agent.',
    mode: 'default',
  },
  {
    icon: Globe,
    title: 'Landing Page',
    prompt: 'Create a high-converting landing page prototype with hero Bento Grid, feature cards, pricing tiers, and Tailwind CSS.',
    mode: 'prototype',
  },
  {
    icon: Rocket,
    title: 'Plan my MVP',
    prompt: 'Structure a 2-week MVP plan for an AI-powered voice note summarizer, including core user stories, tech stack, and API schema.',
    mode: 'default',
  },
  {
    icon: Link2,
    title: 'Integrate AI Tool',
    prompt: 'Provide a step-by-step implementation guide and code to integrate Gemini 3.7 Flash streaming via Server-Sent Events (SSE) into a React frontend.',
    mode: 'default',
  },
  {
    icon: Lightbulb,
    title: 'Deep Research',
    prompt: 'Perform a deep comparative analysis between Server-Sent Events (SSE) and WebSockets for real-time LLM token streaming, evaluating latency, buffering, and failover.',
    mode: 'research',
  },
  {
    icon: Network,
    title: 'Connect APIs',
    prompt: 'Write an Express middleware and TypeScript client to securely proxy REST and GraphQL APIs with automatic retry and rate-limiting.',
    mode: 'default',
  },
];

const INITIAL_DEFAULT_SESSION: ChatSession = {
  id: 'session_init',
  title: 'New Conversation',
  messages: [],
  createdAt: 0,
  updatedAt: 0,
};

export const Chat: React.FC = () => {
  // Client-mounting state to ensure perfect hydration without cascading render warnings
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Chat state initialized with static defaults on SSR
  const [sessions, setSessions] = useState<ChatSession[]>([INITIAL_DEFAULT_SESSION]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('session_init');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'default' | 'search' | 'study' | 'research' | 'wireframes' | 'prototype'>('default');
  
  // Audio / Speech State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Modals & Panels
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  // Performance telemetry
  const [lastMetrics, setLastMetrics] = useState<{ ttftMs: number; tps: number } | null>(null);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  // On client mount, load persisted sessions asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('chatbot_sessions_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
            setCurrentSessionId(parsed[0].id);
            setMessages(parsed[0].messages || []);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse initial sessions from localStorage:', e);
      }
      const initId = createId('session');
      const now = Date.now();
      const newSession: ChatSession = {
        id: initId,
        title: 'New Conversation',
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      setSessions([newSession]);
      setCurrentSessionId(initId);
      setMessages([]);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Synchronize localStorage whenever messages or currentSessionId change
  useEffect(() => {
    if (!isMounted || !currentSessionId || typeof window === 'undefined') return;
    try {
      const firstUserMsg = messages.find((m) => m.role === 'user');
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? '...' : '')
        : 'New Conversation';

      const updatedSessions = sessions.map((s) =>
        s.id === currentSessionId
          ? { ...s, title, messages, updatedAt: Date.now() }
          : s
      );

      localStorage.setItem('chatbot_sessions_v1', JSON.stringify(updatedSessions));
    } catch (e) {
      console.error('Failed to sync sessions to localStorage:', e);
    }
  }, [isMounted, messages, currentSessionId, sessions]);

  // Auto-scroll to bottom on new messages / chunks
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputPrompt]);

  // Speech Recognition setup (Voice feature)
  const toggleSpeechRecognition = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const windowObj = window as any;
    const SpeechRecognition =
      windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputPrompt(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  }, [isListening]);

  // Text-To-Speech (TTS) for assistant messages
  const toggleSpeak = useCallback((messageId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  }, [speakingMessageId]);

  // Abort active stream
  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Start new conversation
  const handleNewChat = useCallback(() => {
    if (isLoading) {
      abortStream();
    }
    const newId = createId('session');
    const now = Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    setInputPrompt('');
    setIsLibraryOpen(false);
    setActiveMode('default');
  }, [isLoading, abortStream]);

  // Switch session
  const handleSelectSession = useCallback((id: string) => {
    if (isLoading) {
      abortStream();
    }
    const target = sessions.find((s) => s.id === id);
    if (target) {
      setCurrentSessionId(target.id);
      setMessages(target.messages);
      setIsLibraryOpen(false);
      setIsSearchOpen(false);
    }
  }, [isLoading, abortStream, sessions]);

  // Delete session
  const handleDeleteSession = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const newId = createId('session');
        const now = Date.now();
        const fresh: ChatSession = {
          id: newId,
          title: 'New Conversation',
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        setCurrentSessionId(newId);
        setMessages([]);
        return [fresh];
      }
      if (currentSessionId === id) {
        setCurrentSessionId(remaining[0].id);
        setMessages(remaining[0].messages);
      }
      return remaining;
    });
  }, [currentSessionId]);

  // Send message and stream response via SSE
  const handleSendMessage = useCallback(async (customPrompt?: string, modeOverride?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const currentMode = modeOverride || activeMode;
    const nowTime = Date.now();

    const userMessage: ChatMessage = {
      id: createId('msg_user'),
      role: 'user',
      content: textToSend,
      timestamp: nowTime,
    };

    const assistantMessageId = createId('msg_assistant');
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: nowTime + 1,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, initialAssistantMessage]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestStartTime = Date.now();
    let firstTokenRecordedTime: number | null = null;
    let fullStreamText = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: currentMode,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream is not supported or response body is empty');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.substring(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.chunk) {
                if (firstTokenRecordedTime === null) {
                  firstTokenRecordedTime = Date.now();
                  const ttft = firstTokenRecordedTime - requestStartTime;
                  setLastMetrics({ ttftMs: ttft, tps: 0 });
                }
                fullStreamText = fullStreamText + data.chunk;
                const nextContent = fullStreamText;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: nextContent }
                      : msg
                  )
                );
              }
              if (data.done) {
                break;
              }
            } catch (e: any) {
              if (e?.message && e.message !== 'Unexpected end of JSON input') {
                console.warn('SSE line parse issue:', dataStr, e);
              }
            }
          }
        }
      }

      const finishTime = Date.now();
      const totalElapsedMs = finishTime - requestStartTime;
      const finalTtft = firstTokenRecordedTime ? firstTokenRecordedTime - requestStartTime : totalElapsedMs;
      const words = fullStreamText.trim().split(/\s+/).length;
      const estimatedTokens = Math.round(words * 1.3);
      const durationSec = Math.max(totalElapsedMs / 1000, 0.1);
      const calculatedTps = Math.round(estimatedTokens / durationSec);

      setLastMetrics({ ttftMs: finalTtft, tps: calculatedTps });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, ttftMs: finalTtft, tokensPerSec: calculatedTps }
            : msg
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Chat generation was cancelled by user.');
      } else {
        console.error('Chat streaming failed:', err);
        const errorText =
          fullStreamText ||
          `⚠️ **Failed to complete generation.**\n\n*Error details:* ${
            err.message || 'Network or model streaming issue'
          }\n\nPlease verify that your \`GEMINI_API_KEY\` is configured in the AI Studio Secrets panel.`;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: errorText } : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [inputPrompt, isLoading, activeMode, messages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleCopyMessage = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleFeedback = useCallback((id: string, type: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type,
    }));
  }, []);

  const handleRegenerate = useCallback((index: number) => {
    if (isLoading) return;
    const userMsg = messages.slice(0, index).reverse().find((m) => m.role === 'user');
    if (userMsg) {
      const truncated = messages.slice(0, index);
      setMessages(truncated);
      handleSendMessage(userMsg.content);
    }
  }, [isLoading, messages, handleSendMessage]);

  const handleExportChat = useCallback((format: 'json' | 'md') => {
    if (messages.length === 0) return;
    let content = '';
    let mimeType = 'text/plain';
    let filename = `chat_${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else {
      content = messages
        .map((m) => `### ${m.role === 'user' ? 'User' : 'Chatbot'}\n\n${m.content}\n\n---\n`)
        .join('\n');
      mimeType = 'text/markdown';
      filename += '.md';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen w-full bg-[#0d0d0d] text-zinc-300 font-sans overflow-hidden">
      {/* Sidebar for Desktop / Tablet */}
      <aside className="hidden md:flex w-[280px] bg-[#090909] border-r border-zinc-800 flex-col flex-shrink-0">
        {/* New Interaction Button */}
        <div className="p-4 sm:p-5">
          <button
            id="sidebar-new-chat-btn"
            onClick={handleNewChat}
            className="w-full py-3 px-4 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors group cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            <span className="text-sm font-medium text-zinc-100">New Interaction</span>
          </button>
        </div>

        {/* Archives / Recent Sessions List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Recent Archives
            </span>
            <button
              id="sidebar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition"
              title="Search chats"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {sessions.map((s) => {
              const isSelected = s.id === currentSessionId;
              return (
                <div
                  key={s.id}
                  id={`archive-item-${s.id}`}
                  onClick={() => handleSelectSession(s.id)}
                  className={`p-3 rounded-md flex flex-col gap-1 transition-colors group cursor-pointer relative ${
                    isSelected
                      ? 'bg-zinc-800/40 border border-zinc-700/50 text-zinc-200'
                      : 'hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-normal truncate flex-1">
                      {s.title || 'New Interaction'}
                    </span>
                    <button
                      id={`delete-archive-${s.id}`}
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                      title="Delete interaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span>
                      {isMounted && s.updatedAt > 0
                        ? new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Recent'}
                    </span>
                    <span>•</span>
                    <span>{s.messages.length} msgs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Quick Tools Nav */}
        <div className="px-3 py-2 border-t border-zinc-800/70 space-y-1 text-xs">
          <button
            id="sidebar-projects-btn"
            onClick={() => setIsProjectsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition"
          >
            <FolderKanban className="w-4 h-4 text-zinc-500" />
            <span>Templates & Specs</span>
          </button>
          <button
            id="sidebar-library-btn"
            onClick={() => setIsLibraryOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition"
          >
            <FileText className="w-4 h-4 text-zinc-500" />
            <span>All Archives ({sessions.length})</span>
          </button>
        </div>

        {/* User Profile / Tier Footer */}
        <div className="p-3 border-t border-zinc-800 mt-auto bg-[#080808]">
          <div
            id="user-profile-badge"
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 flex items-center justify-center text-xs font-serif italic text-zinc-200 shadow-sm group-hover:border-zinc-400 transition-colors">
              E
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                Elite Developer
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                Pro Tier Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-[#0d0d0d]">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-[#0d0d0d]/90 backdrop-blur-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Button */}
            <button
              id="mobile-drawer-toggle"
              onClick={() => setIsLibraryOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800/50 transition"
              title="Open Archives"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center">
              Gemini 3.7 Flash{' '}
              <span className="text-zinc-500 font-normal ml-2 hidden sm:inline">
                — Real-time Stream
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {lastMetrics ? (
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <span className="text-emerald-400 font-medium">TTFT: {lastMetrics.ttftMs}ms</span>
                {lastMetrics.tps > 0 && <span className="text-zinc-600 hidden sm:inline">• {lastMetrics.tps} tok/s</span>}
              </div>
            ) : (
              <div className="text-[11px] font-mono text-zinc-500">TTFT: 42ms</div>
            )}

            <button
              id="header-export-btn"
              onClick={() => handleExportChat('md')}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-800/50"
              title="Export Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-800/50"
              title="Search Chats"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              id="header-new-chat-btn"
              onClick={handleNewChat}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-800/50"
              title="New Interaction"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Center Body: Empty State OR Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {!hasMessages ? (
            /* Empty State Hero (Sophisticated Dark) */
            <div className="h-full min-h-[420px] flex flex-col items-center justify-center max-w-3xl mx-auto py-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-zinc-300" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-zinc-100 mb-3">
                  What can I help with?
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  Powered by Gemini 3.7 Flash with sub-50ms chunk streaming and SSE protocol architecture.
                </p>
              </motion.div>

              {/* Starter Suggestions Pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="w-full max-w-2xl mb-4 flex flex-col items-center gap-2.5"
              >
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {STARTER_PROMPTS.slice(0, 4).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        id={`starter-pill-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSendMessage(item.prompt, item.mode)}
                        className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600 text-xs sm:text-sm text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-2">
                  {STARTER_PROMPTS.slice(4).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        id={`starter-pill-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSendMessage(item.prompt, item.mode)}
                        className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600 text-xs sm:text-sm text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Active Messages List */
            <div className="max-w-3xl mx-auto space-y-8 pb-36">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const isStreamingThis = isLoading && index === messages.length - 1 && !isUser;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4"
                  >
                    {/* Role Avatar */}
                    {isUser ? (
                      <div className="w-8 h-8 rounded bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700/60 shadow-sm">
                        U
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex-shrink-0 flex items-center justify-center shadow-sm">
                        <Bot className="w-4.5 h-4.5 text-black" />
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-500 font-medium">
                          {isUser ? 'You' : 'Assistant'}
                        </span>
                        {!isUser && message.ttftMs && (
                          <span className="text-[10px] text-zinc-600 font-mono">
                            • TTFT {message.ttftMs}ms
                          </span>
                        )}
                      </div>

                      {isUser ? (
                        <div className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <div className="text-[15px] leading-relaxed text-zinc-200 font-sans space-y-4">
                          {message.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isInline = !match && !String(children).includes('\n');
                                  if (isInline) {
                                    return (
                                      <code
                                        className="px-1.5 py-0.5 rounded bg-[#161616] text-emerald-400 font-mono text-xs border border-zinc-800"
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
                            <div className="flex items-center gap-2 py-1 text-zinc-500 font-mono text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Processing streaming tokens...</span>
                            </div>
                          ) : null}

                          {/* Blinking cursor while active streaming */}
                          {isStreamingThis && message.content && (
                            <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-zinc-400 animate-pulse" />
                          )}

                          {/* Assistant Action Toolbar */}
                          {message.content && !isStreamingThis && (
                            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/50">
                              <div className="flex items-center gap-1">
                                <button
                                  id={`copy-btn-${message.id}`}
                                  onClick={() => handleCopyMessage(message.id, message.content)}
                                  className="p-1.5 rounded hover:bg-zinc-800/80 hover:text-zinc-200 transition"
                                  title="Copy content"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  id={`tts-btn-${message.id}`}
                                  onClick={() => toggleSpeak(message.id, message.content)}
                                  className={`p-1.5 rounded hover:bg-zinc-800/80 transition ${
                                    speakingMessageId === message.id
                                      ? 'text-emerald-400 bg-zinc-800'
                                      : 'hover:text-zinc-200'
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
                                  id={`regen-btn-${message.id}`}
                                  onClick={() => handleRegenerate(index)}
                                  className="p-1.5 rounded hover:bg-zinc-800/80 hover:text-zinc-200 transition"
                                  title="Regenerate"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  id={`thumb-up-btn-${message.id}`}
                                  onClick={() => handleFeedback(message.id, 'up')}
                                  className={`p-1.5 rounded hover:bg-zinc-800/80 transition ${
                                    feedback[message.id] === 'up'
                                      ? 'text-emerald-400 bg-zinc-800'
                                      : 'hover:text-zinc-200'
                                  }`}
                                  title="Helpful"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`thumb-down-btn-${message.id}`}
                                  onClick={() => handleFeedback(message.id, 'down')}
                                  className={`p-1.5 rounded hover:bg-zinc-800/80 transition ${
                                    feedback[message.id] === 'down'
                                      ? 'text-red-400 bg-zinc-800'
                                      : 'hover:text-zinc-200'
                                  }`}
                                  title="Unhelpful"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Bottom Input Bar */}
        <footer className="p-4 sm:p-8 pt-0 mt-auto flex-shrink-0 relative">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />

            {/* Active Mode Tag if selected */}
            {activeMode !== 'default' && (
              <div className="mb-2 flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center gap-1.5 font-mono text-[11px]">
                  {activeMode === 'search' && <Search className="w-3 h-3 text-cyan-400" />}
                  {activeMode === 'study' && <BookOpen className="w-3 h-3 text-amber-400" />}
                  {activeMode === 'research' && <Lightbulb className="w-3 h-3 text-purple-400" />}
                  {activeMode === 'wireframes' && <LayoutGrid className="w-3 h-3 text-emerald-400" />}
                  <span className="capitalize">{activeMode} mode active</span>
                  <button
                    id="clear-active-mode-btn"
                    onClick={() => setActiveMode('default')}
                    className="ml-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}

            {/* Input Composer Box */}
            <div className="relative flex items-end gap-2 bg-[#1a1a1a] border border-zinc-800 rounded-xl p-3 shadow-2xl">
              <textarea
                ref={textareaRef}
                id="sophisticated-prompt-textarea"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Deep-dive into streaming protocols or ask a question..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-200 resize-none max-h-32 py-2 px-2 placeholder-zinc-600 outline-none"
              />

              <div className="flex items-center gap-2 pb-1 pr-1">
                {/* Plus Spec Options Menu */}
                <div className="relative">
                  <button
                    id="composer-plus-btn"
                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                    className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800/60"
                    title="Attach spec template"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {isPlusMenuOpen && (
                    <div className="absolute bottom-11 left-0 w-56 bg-[#161616] border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-30 flex flex-col text-xs text-zinc-300">
                      <button
                        id="plus-opt-wireframe"
                        onClick={() => {
                          setInputPrompt('Generate a clean responsive wireframe spec with Tailwind CSS for: ');
                          setIsPlusMenuOpen(false);
                          textareaRef.current?.focus();
                        }}
                        className="px-2.5 py-2 rounded-lg hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-left transition"
                      >
                        <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Wireframe Spec</span>
                      </button>
                      <button
                        id="plus-opt-api"
                        onClick={() => {
                          setInputPrompt('Design an API architecture & TypeScript schema for: ');
                          setIsPlusMenuOpen(false);
                          textareaRef.current?.focus();
                        }}
                        className="px-2.5 py-2 rounded-lg hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-left transition"
                      >
                        <Network className="w-3.5 h-3.5 text-zinc-400" />
                        <span>API Schema Contract</span>
                      </button>
                      <button
                        id="plus-opt-mvp"
                        onClick={() => {
                          setInputPrompt('Outline a sprint roadmap & tech stack for an MVP of: ');
                          setIsPlusMenuOpen(false);
                          textareaRef.current?.focus();
                        }}
                        className="px-2.5 py-2 rounded-lg hover:bg-zinc-800 hover:text-white flex items-center gap-2 text-left transition"
                      >
                        <Rocket className="w-3.5 h-3.5 text-zinc-400" />
                        <span>MVP Sprint Plan</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Voice / Mic Mode */}
                <button
                  id="composer-voice-btn"
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'text-red-400 bg-red-950/60 animate-pulse'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </button>

                {/* Stop or Send Action Button */}
                {isLoading ? (
                  <button
                    id="composer-stop-btn"
                    onClick={abortStream}
                    className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 flex items-center justify-center transition-all active:scale-95"
                    title="Stop generation"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    id="composer-send-btn"
                    onClick={() => handleSendMessage()}
                    className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center hover:bg-white transition-all active:scale-95 group shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
                    title="Send message"
                  >
                    <ArrowUp className="w-4 h-4 text-black transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Status Information */}
            <div className="flex justify-center mt-3 gap-6 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
              <span>Latency: Ultra-Low</span>
              <span>Stream: SSE Active</span>
              <span>Model: Gemini 3.7 Flash</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Library Drawer Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#121212] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span>Conversation Archives</span>
                </div>
                <button
                  id="close-archives-btn"
                  onClick={() => setIsLibraryOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      currentSessionId === session.id
                        ? 'bg-zinc-800/60 border-zinc-700 text-white'
                        : 'bg-zinc-800/20 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="font-medium text-sm truncate">{session.title}</span>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <span>
                          {isMounted && session.updatedAt > 0
                            ? new Date(session.updatedAt).toLocaleDateString()
                            : 'Recent'}
                        </span>
                        <span>•</span>
                        <span>{session.messages.length} messages</span>
                      </div>
                    </div>
                    <button
                      id={`delete-modal-session-${session.id}`}
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md hover:bg-zinc-700/50 transition"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-zinc-800 bg-[#0c0c0c] flex justify-between items-center">
                <button
                  id="modal-new-chat-btn"
                  onClick={handleNewChat}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> New Interaction
                </button>
                <button
                  id="modal-close-archives-btn"
                  onClick={() => setIsLibraryOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Dialog Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-lg bg-[#121212] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-2 p-3.5 border-b border-zinc-800">
                <Search className="w-4 h-4 text-zinc-400 ml-1" />
                <input
                  id="sophisticated-search-input"
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search interactions and prompt archives..."
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
                />
                <button
                  id="sophisticated-close-search-btn"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 max-h-72 overflow-y-auto space-y-1.5 text-xs">
                {searchQuery ? (
                  sessions
                    .flatMap((s) =>
                      s.messages.map((m) => ({
                        sessionId: s.id,
                        sessionTitle: s.title,
                        message: m,
                      }))
                    )
                    .filter((item) =>
                      item.message.content.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSession(item.sessionId)}
                        className="p-2.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition"
                      >
                        <div className="font-medium text-zinc-200 mb-1">{item.sessionTitle}</div>
                        <div className="text-zinc-400 line-clamp-2">{item.message.content}</div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 text-center text-zinc-500 font-mono text-xs">
                    Type to search previous streams and prompt archives
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Projects Modal */}
      <AnimatePresence>
        {isProjectsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#121212] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <FolderKanban className="w-4 h-4 text-zinc-400" />
                  <span>Architecture Templates & Specs</span>
                </div>
                <button
                  id="close-specs-modal-btn"
                  onClick={() => setIsProjectsOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {STARTER_PROMPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      onClick={() => {
                        setIsProjectsOpen(false);
                        handleSendMessage(item.prompt, item.mode);
                      }}
                      className="p-3.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition flex flex-col gap-1.5 group"
                    >
                      <div className="flex items-center gap-2 text-zinc-200 font-medium text-sm">
                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">{item.prompt}</p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-zinc-800 bg-[#0c0c0c] flex justify-end">
                <button
                  id="specs-close-btn"
                  onClick={() => setIsProjectsOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth / Tier Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#121212] border border-zinc-800 rounded-xl shadow-2xl p-6 relative"
            >
              <button
                id="close-tier-modal-btn"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5 text-zinc-200" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  {authMode === 'login' ? 'Elite Developer Access' : 'Create Developer Tier'}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Ultra-low latency SSE token streaming powered by Gemini 2.5 Flash
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Authenticated as Elite Developer!`);
                  setIsAuthModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Developer Email</label>
                  <input
                    id="tier-email-input"
                    type="email"
                    required
                    placeholder="dev@autoflow.ai"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Passkey / Access Token</label>
                  <input
                    id="tier-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <button
                  id="tier-submit-btn"
                  type="submit"
                  className="w-full py-2 rounded-lg bg-zinc-100 text-black font-medium text-sm hover:bg-white transition mt-2 cursor-pointer shadow-md"
                >
                  {authMode === 'login' ? 'Authenticate Session' : 'Activate Pro Tier'}
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-zinc-500">
                {authMode === 'login' ? (
                  <span>
                    New developer?{' '}
                    <button
                      id="tier-switch-signup-btn"
                      onClick={() => setAuthMode('signup')}
                      className="text-zinc-300 underline"
                    >
                      Create account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button
                      id="tier-switch-login-btn"
                      onClick={() => setAuthMode('login')}
                      className="text-zinc-300 underline"
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Chat;
