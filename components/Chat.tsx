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
  Sliders,
  Cpu,
  ChevronDown,
  Key,
  Server,
  Settings,
  Radio,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { ShinyText, SpotlightCard, ReactBitsAIInput } from './reactbits';
import { BorderBeam, AnimatedGradientText, ShimmerButton, TextAnimate } from './magicui';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  ttftMs?: number;
  tokensPerSec?: number;
  modelUsed?: string;
}

export interface ModelConfig {
  provider: 'groq' | 'gemini' | 'ollama' | 'openai' | 'custom';
  model: string;
  apiKey: string;
  baseUrl: string;
  directBrowser: boolean;
}

const DEFAULT_MODEL_CONFIG: ModelConfig = {
  provider: 'groq',
  model: 'openai/gpt-oss-120b',
  apiKey: '',
  baseUrl: '',
  directBrowser: false,
};

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
  const [isModelModalOpen, setIsModelModalOpen] = useState<boolean>(false);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(DEFAULT_MODEL_CONFIG);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  // Theme state: default to 'dark' ("رنگ سیاه و مشکی میخوام رنگای اصلی باشه و با تم روشن و تاریک عوض بشه")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('chatbot_theme') as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      if (savedTheme && savedTheme !== 'dark') {
        queueMicrotask(() => {
          setTheme(savedTheme);
        });
      }
    } catch (e) {
      console.error('Failed to read theme from localStorage:', e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      try {
        localStorage.setItem('chatbot_theme', next);
      } catch (e) {}
      return next;
    });
  }, []);

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
        const savedModel = localStorage.getItem('chatbot_model_config');
        if (savedModel) {
          const parsedModel = JSON.parse(savedModel);
          if (parsedModel && parsedModel.model) {
            setModelConfig((prev) => ({ ...prev, ...parsedModel }));
          }
        }
      } catch (e) {
        console.error('Failed to parse saved model configuration:', e);
      }

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
      modelUsed: modelConfig.model,
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
      let response: Response;
      const isDirectLocal =
        modelConfig.directBrowser &&
        modelConfig.baseUrl &&
        (modelConfig.baseUrl.includes('localhost') || modelConfig.baseUrl.includes('127.0.0.1'));

      if (isDirectLocal) {
        let endpoint = modelConfig.baseUrl;
        if (!endpoint.endsWith('/chat/completions') && !endpoint.endsWith('/api/chat')) {
          endpoint = endpoint.replace(/\/+$/, '') + '/v1/chat/completions';
        }
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (modelConfig.apiKey) {
          headers['Authorization'] = `Bearer ${modelConfig.apiKey}`;
        }
        response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: modelConfig.model,
            messages: [
              { role: 'system', content: 'You are a helpful AI assistant. Provide concise, direct answers formatted in Markdown.' },
              ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            ],
            stream: true,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });
      } else {
        response = await fetch('/api/chat', {
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
            model: modelConfig.model,
            provider: modelConfig.provider,
            apiKey: modelConfig.apiKey || undefined,
            baseUrl: modelConfig.baseUrl || undefined,
          }),
          signal: controller.signal,
        });
      }

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
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.substring(6).trim();
            if (!dataStr || dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                throw new Error(data.error);
              }
              const chunkText = data.chunk || data.choices?.[0]?.delta?.content || '';
              const resolvedModel = data.model || modelConfig.model;

              if (chunkText) {
                if (firstTokenRecordedTime === null) {
                  firstTokenRecordedTime = Date.now();
                  const ttft = firstTokenRecordedTime - requestStartTime;
                  setLastMetrics({ ttftMs: ttft, tps: 0 });
                }
                fullStreamText = fullStreamText + chunkText;
                const nextContent = fullStreamText;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: nextContent, modelUsed: resolvedModel }
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
            ? { ...msg, ttftMs: finalTtft, tokensPerSec: calculatedTps, modelUsed: msg.modelUsed || modelConfig.model }
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
          }\n\nPlease check your model settings, API Key, or local server connection in the top model menu.`;
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
  }, [inputPrompt, isLoading, activeMode, messages, modelConfig]);

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
    <div className="flex h-screen w-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors duration-200">
      {/* Sidebar for Desktop / Tablet */}
      <aside className="hidden md:flex w-[270px] bg-zinc-50/80 dark:bg-black border-r border-zinc-200 dark:border-zinc-800/80 flex-col flex-shrink-0 z-10 transition-colors duration-200">
        {/* New Interaction Button */}
        <div className="p-3.5 sm:p-4">
          <button
            id="sidebar-new-chat-btn"
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800/90 text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>New Interaction</span>
          </button>
        </div>

        {/* Archives / Recent Sessions List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold">
              Recent Archives
            </span>
            <button
              id="sidebar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition"
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
                  className={`p-2.5 rounded-lg flex flex-col gap-0.5 transition-colors group cursor-pointer relative border ${
                    isSelected
                      ? 'bg-zinc-200/60 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-normal truncate flex-1">
                      {s.title || 'New Interaction'}
                    </span>
                    <button
                      id={`delete-archive-${s.id}`}
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition"
                      title="Delete interaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                    <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
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
        <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1 text-xs">
          <button
            id="sidebar-projects-btn"
            onClick={() => setIsProjectsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            <FolderKanban className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <span>Templates & Specs</span>
          </button>
          <button
            id="sidebar-library-btn"
            onClick={() => setIsLibraryOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            <FileText className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <span>All Archives ({sessions.length})</span>
          </button>
        </div>

        {/* User Profile / Tier Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 mt-auto bg-zinc-100/50 dark:bg-[#080808]">
          <div
            id="user-profile-badge"
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black flex items-center justify-center text-xs font-serif font-bold shadow-xs">
              E
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors truncate">
                Elite Developer
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                Pro Tier Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-white dark:bg-black transition-colors duration-200">
        {/* Top Header */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between px-4 sm:px-6 bg-white/90 dark:bg-black/90 backdrop-blur-xl z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Button */}
            <button
              id="mobile-drawer-toggle"
              onClick={() => setIsLibraryOpen(true)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Open Archives"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Interactive Model Selector Button */}
            <button
              id="header-model-selector-btn"
              onClick={() => setIsModelModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all text-left cursor-pointer group shadow-xs"
              title="Click to switch model, provider, or API key"
            >
              <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 transition font-mono max-w-[180px] sm:max-w-none truncate">
                  {modelConfig.model}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-medium uppercase">
                  {modelConfig.provider}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {lastMetrics ? (
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mr-1">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">TTFT: {lastMetrics.ttftMs}ms</span>
                {lastMetrics.tps > 0 && <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline">• {lastMetrics.tps} tok/s</span>}
              </div>
            ) : (
              <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mr-1">Ready</div>
            )}

            {/* Light / Dark Mode Toggle Button */}
            <button
              id="header-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-zinc-300 hover:text-white transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 hover:text-black transition-colors" />
              )}
            </button>

            <button
              id="header-model-settings-btn"
              onClick={() => setIsModelModalOpen(true)}
              className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Model & Provider Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              id="header-export-btn"
              onClick={() => handleExportChat('md')}
              className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Export Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Search Chats"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              id="header-new-chat-btn"
              onClick={handleNewChat}
              className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="New Interaction"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Center Body: Empty State OR Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {!hasMessages ? (
            /* Minimalist Monochrome Empty State */
            <div className="h-full min-h-[440px] flex flex-col items-center justify-center max-w-3xl mx-auto py-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span>Minimalist Intelligence • SSE Streaming</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white mb-3">
                  <TextAnimate by="word" animation="blurInUp" duration={0.3}>
                    What can I build for you?
                  </TextAnimate>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Real-time streaming agent with sub-50ms chunk latency. Select a template below or type a query.
                </p>
              </motion.div>

              {/* Starter Suggestions Grid */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3"
              >
                {STARTER_PROMPTS.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      onClick={() => handleSendMessage(item.prompt, item.mode)}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 hover:bg-zinc-100/80 dark:bg-zinc-950/60 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer active:scale-[0.99] group shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                        {item.prompt}
                      </p>
                    </div>
                  );
                })}
              </motion.div>

              {/* Quick tags row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="flex flex-wrap justify-center items-center gap-2 mt-2"
              >
                {STARTER_PROMPTS.slice(4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      id={`starter-pill-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleSendMessage(item.prompt, item.mode)}
                      className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer active:scale-95"
                    >
                      <Icon className="w-3 h-3 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors" />
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </motion.div>
            </div>
          ) : (

            /* Active Messages List */
            <div className="max-w-3xl mx-auto space-y-7 pb-36">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const isStreamingThis = isLoading && index === messages.length - 1 && !isUser;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 sm:gap-4"
                  >
                    {/* Role Avatar */}
                    {isUser ? (
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-300 dark:border-zinc-700 shadow-xs">
                        U
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex-shrink-0 flex items-center justify-center shadow-xs">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          {isUser ? 'You' : 'Assistant'}
                        </span>
                        {!isUser && message.modelUsed && (
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            {message.modelUsed}
                          </span>
                        )}
                        {!isUser && message.ttftMs && (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
                            • TTFT {message.ttftMs}ms
                          </span>
                        )}
                      </div>

                      {isUser ? (
                        <div className="text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap bg-zinc-100/90 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl px-4 py-3 shadow-xs">
                          {message.content}
                        </div>
                      ) : (
                        <div className="relative rounded-2xl bg-white dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 p-4 sm:p-5 text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100 font-sans space-y-4 shadow-xs overflow-hidden">
                          {message.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p({ children }) {
                                  return (
                                    <div className="mb-3 last:mb-0 leading-relaxed text-zinc-800 dark:text-zinc-200">
                                      <TextAnimate
                                        by="word"
                                        animation="blurInUp"
                                        duration={0.25}
                                      >
                                        {children as any}
                                      </TextAnimate>
                                    </div>
                                  );
                                },
                                h1({ children }) {
                                  return (
                                    <h1 className="text-xl font-bold mt-4 mb-2 text-zinc-950 dark:text-white tracking-tight">
                                      <TextAnimate by="word" animation="blurInUp" duration={0.3}>
                                        {children as any}
                                      </TextAnimate>
                                    </h1>
                                  );
                                },
                                h2({ children }) {
                                  return (
                                    <h2 className="text-lg font-semibold mt-3 mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">
                                      <TextAnimate by="word" animation="blurInUp" duration={0.25}>
                                        {children as any}
                                      </TextAnimate>
                                    </h2>
                                  );
                                },
                                h3({ children }) {
                                  return (
                                    <h3 className="text-base font-semibold mt-2.5 mb-1 text-zinc-900 dark:text-zinc-200">
                                      <TextAnimate by="word" animation="blurInUp" duration={0.2}>
                                        {children as any}
                                      </TextAnimate>
                                    </h3>
                                  );
                                },
                                li({ children }) {
                                  return (
                                    <li className="my-1 text-zinc-800 dark:text-zinc-300">
                                      <TextAnimate by="word" animation="fadeIn" duration={0.2}>
                                        {children as any}
                                      </TextAnimate>
                                    </li>
                                  );
                                },
                                code({ className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isInline = !match && !String(children).includes('\n');
                                  if (isInline) {
                                    return (
                                      <code
                                        className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 font-mono text-xs border border-zinc-200 dark:border-zinc-800"
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
                            <div className="flex items-center gap-2 py-1 text-zinc-600 dark:text-zinc-400 font-mono text-xs">
                              <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                              <span>Generating streaming response...</span>
                            </div>
                          ) : null}

                          {/* Blinking cursor while active streaming */}
                          {isStreamingThis && message.content && (
                            <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                          )}

                          {/* Assistant Action Toolbar */}
                          {message.content && !isStreamingThis && (
                            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60">
                              <div className="flex items-center gap-1">
                                <button
                                  id={`copy-btn-${message.id}`}
                                  onClick={() => handleCopyMessage(message.id, message.content)}
                                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                                  title="Copy content"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  id={`tts-btn-${message.id}`}
                                  onClick={() => toggleSpeak(message.id, message.content)}
                                  className={`p-1.5 rounded transition cursor-pointer ${
                                    speakingMessageId === message.id
                                      ? 'text-zinc-950 dark:text-white bg-zinc-200 dark:bg-zinc-800'
                                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
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
                                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
                                  title="Regenerate"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  id={`thumb-up-btn-${message.id}`}
                                  onClick={() => handleFeedback(message.id, 'up')}
                                  className={`p-1.5 rounded transition cursor-pointer ${
                                    feedback[message.id] === 'up'
                                      ? 'text-zinc-950 dark:text-white bg-zinc-200 dark:bg-zinc-800'
                                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                                  }`}
                                  title="Helpful"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`thumb-down-btn-${message.id}`}
                                  onClick={() => handleFeedback(message.id, 'down')}
                                  className={`p-1.5 rounded transition cursor-pointer ${
                                    feedback[message.id] === 'down'
                                      ? 'text-zinc-950 dark:text-white bg-zinc-200 dark:bg-zinc-800'
                                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
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
        <footer className="p-4 sm:p-6 pt-0 mt-auto flex-shrink-0 relative bg-white dark:bg-black transition-colors duration-200">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />

            <ReactBitsAIInput
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              onSend={(customPrompt, modeOverride) => handleSendMessage(customPrompt, modeOverride)}
              onAbort={abortStream}
              isLoading={isLoading}
              isListening={isListening}
              onToggleVoice={toggleSpeechRecognition}
              modelConfig={modelConfig}
              onOpenModelModal={() => setIsModelModalOpen(true)}
              activeMode={activeMode}
              setActiveMode={(mode) => setActiveMode(mode as any)}
            />

            {/* Bottom Status Information */}
            <div className="flex justify-center items-center mt-2.5 gap-4 sm:gap-6 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                Stream: SSE Active
              </span>
              <span>•</span>
              <span>Engine: {modelConfig.provider.toUpperCase()}</span>
              <span>•</span>
              <span className="hidden sm:inline">Model: {modelConfig.model}</span>
            </div>
          </div>
        </footer>
      </main>


      {/* Library Drawer Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-zinc-900 dark:text-zinc-100"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Conversation Archives</span>
                </div>
                <button
                  id="close-archives-btn"
                  onClick={() => setIsLibraryOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      currentSessionId === session.id
                        ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white'
                        : 'bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="font-medium text-sm truncate">{session.title}</span>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
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
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0c] flex justify-between items-center">
                <button
                  id="modal-new-chat-btn"
                  onClick={handleNewChat}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-xs font-medium text-white dark:text-black flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> New Interaction
                </button>
                <button
                  id="modal-close-archives-btn"
                  onClick={() => setIsLibraryOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
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
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 dark:text-zinc-100"
            >
              <div className="flex items-center gap-2 p-3.5 border-b border-zinc-200 dark:border-zinc-800">
                <Search className="w-4 h-4 text-zinc-400 ml-1" />
                <input
                  id="sophisticated-search-input"
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search interactions and prompt archives..."
                  className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
                />
                <button
                  id="sophisticated-close-search-btn"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition"
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
                        className="p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition"
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-200 mb-1">{item.sessionTitle}</div>
                        <div className="text-zinc-500 dark:text-zinc-400 line-clamp-2">{item.message.content}</div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 text-center text-zinc-400 dark:text-zinc-500 font-mono text-xs">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 dark:text-zinc-100"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <FolderKanban className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Architecture Templates & Specs</span>
                </div>
                <button
                  id="close-specs-modal-btn"
                  onClick={() => setIsProjectsOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition"
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
                      className="p-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition flex flex-col gap-1.5 group"
                    >
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-medium text-sm">
                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{item.prompt}</p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0c] flex justify-end">
                <button
                  id="specs-close-btn"
                  onClick={() => setIsProjectsOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 relative text-zinc-900 dark:text-zinc-100"
            >
              <button
                id="close-tier-modal-btn"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mx-auto flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {authMode === 'login' ? 'Developer Access' : 'Create Developer Account'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Ultra-low latency SSE token streaming powered by Gemini
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Authenticated as Developer!`);
                  setIsAuthModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Developer Email</label>
                  <input
                    id="tier-email-input"
                    type="email"
                    required
                    placeholder="dev@autoflow.ai"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Passkey / Access Token</label>
                  <input
                    id="tier-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                  />
                </div>
                <button
                  id="tier-submit-btn"
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black font-medium text-sm dark:hover:bg-white transition mt-2 cursor-pointer shadow-xs"
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
                      className="text-zinc-900 dark:text-zinc-300 underline"
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
                      className="text-zinc-900 dark:text-zinc-300 underline"
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

      {/* Model & Provider Configuration Modal */}
      <AnimatePresence>
        {isModelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden text-zinc-900 dark:text-zinc-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Model & Inference Provider
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Select your custom system model, Groq, local Ollama, or Gemini
                    </p>
                  </div>
                </div>
                <button
                  id="close-model-modal-btn"
                  onClick={() => setIsModelModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Provider Selection Tabs */}
              <div className="mt-5 relative z-10">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Active Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'groq', label: 'Groq Cloud', icon: Zap, desc: 'High-speed' },
                    { id: 'ollama', label: 'Local System', icon: Server, desc: 'Ollama/LM Studio' },
                    { id: 'gemini', label: 'Google Gemini', icon: Sparkles, desc: '2.5 Flash' },
                    { id: 'custom', label: 'OpenAI API', icon: Cpu, desc: 'Custom endpoint' },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = modelConfig.provider === p.id;
                    return (
                      <button
                        key={p.id}
                        id={`provider-btn-${p.id}`}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...modelConfig,
                            provider: p.id as any,
                            model:
                              p.id === 'groq'
                                ? 'openai/gpt-oss-120b'
                                : p.id === 'ollama'
                                ? 'llama3.2'
                                : p.id === 'gemini'
                                ? 'gemini-2.5-flash'
                                : 'gpt-4o-mini',
                            baseUrl:
                              p.id === 'ollama'
                                ? 'http://localhost:11434'
                                : p.id === 'custom'
                                ? 'https://api.openai.com/v1'
                                : '',
                            directBrowser: p.id === 'ollama',
                          };
                          setModelConfig(updated);
                          localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer text-left ${
                          isSelected
                            ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white shadow-xs'
                            : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-medium text-xs">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{p.label}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model Presets & Name Input */}
              <div className="mt-5 space-y-4 relative z-10">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Model Identifier
                    </label>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Current: {modelConfig.model}
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {modelConfig.provider === 'groq' &&
                      [
                        'openai/gpt-oss-120b',
                        'llama-3.3-70b-versatile',
                        'llama-3.1-8b-instant',
                        'deepseek-r1-distill-llama-70b',
                        'mixtral-8x7b-32768',
                      ].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            const updated = { ...modelConfig, model: m };
                            setModelConfig(updated);
                            localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition font-mono ${
                            modelConfig.model === m
                              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-zinc-900 dark:border-zinc-100'
                              : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}

                    {modelConfig.provider === 'ollama' &&
                      ['llama3.2', 'deepseek-r1:8b', 'mistral', 'qwen2.5', 'phi3'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            const updated = { ...modelConfig, model: m };
                            setModelConfig(updated);
                            localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition font-mono ${
                            modelConfig.model === m
                              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-zinc-900 dark:border-zinc-100'
                              : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}

                    {modelConfig.provider === 'gemini' &&
                      ['gemini-2.5-flash', 'gemini-2.5-pro'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            const updated = { ...modelConfig, model: m };
                            setModelConfig(updated);
                            localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition font-mono ${
                            modelConfig.model === m
                              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-zinc-900 dark:border-zinc-100'
                              : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                  </div>

                  <input
                    id="custom-model-input"
                    type="text"
                    value={modelConfig.model}
                    onChange={(e) => {
                      const updated = { ...modelConfig, model: e.target.value };
                      setModelConfig(updated);
                      localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                    }}
                    placeholder="e.g. openai/gpt-oss-120b or custom model name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/80 text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition"
                  />
                </div>

                {/* API Key Input (for Groq / OpenAI / Custom) */}
                {(modelConfig.provider === 'groq' || modelConfig.provider === 'custom' || modelConfig.provider === 'openai') && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      {modelConfig.provider === 'groq' ? 'Groq API Key (starts with gsk_)' : 'API Key'}
                    </label>
                    <div className="relative">
                      <input
                        id="provider-api-key-input"
                        type="password"
                        value={modelConfig.apiKey}
                        onChange={(e) => {
                          const updated = { ...modelConfig, apiKey: e.target.value };
                          setModelConfig(updated);
                          localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                        }}
                        placeholder={
                          modelConfig.provider === 'groq'
                            ? 'gsk_... (or leave blank to use server environment key)'
                            : 'sk-... (or leave blank for local server)'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/80 text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition"
                      />
                      <Key className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute right-3 top-3 pointer-events-none" />
                    </div>
                    {modelConfig.provider === 'groq' && !modelConfig.apiKey && (
                      <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                        <span>💡 Tip:</span>
                        <span>
                          If no key is set on the server, get a free key from{' '}
                          <a
                            href="https://console.groq.com/keys"
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-zinc-700 dark:text-zinc-300"
                          >
                            console.groq.com
                          </a>{' '}
                          and paste it here.
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Base URL (for Local / Ollama / Custom) */}
                {(modelConfig.provider === 'ollama' || modelConfig.provider === 'custom') && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Endpoint Base URL
                    </label>
                    <input
                      id="provider-base-url-input"
                      type="text"
                      value={modelConfig.baseUrl}
                      onChange={(e) => {
                        const updated = { ...modelConfig, baseUrl: e.target.value };
                        setModelConfig(updated);
                        localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                      }}
                      placeholder={modelConfig.provider === 'ollama' ? 'http://localhost:11434' : 'http://localhost:1234/v1'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/80 text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition"
                    />

                    {/* Direct browser connection toggle for local models */}
                    <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 flex items-start gap-3">
                      <input
                        id="direct-browser-toggle"
                        type="checkbox"
                        checked={modelConfig.directBrowser}
                        onChange={(e) => {
                          const updated = { ...modelConfig, directBrowser: e.target.checked };
                          setModelConfig(updated);
                          localStorage.setItem('chatbot_model_config', JSON.stringify(updated));
                        }}
                        className="mt-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-500 cursor-pointer"
                      />
                      <label htmlFor="direct-browser-toggle" className="text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer select-none">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Direct Browser Connection</span>
                        <span>
                          Enables your browser to send requests directly to your local computer (e.g. <code>localhost:11434</code>), bypassing cloud network isolation.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between relative z-10">
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Settings are automatically saved to your browser.
                </div>
                <button
                  id="save-model-config-btn"
                  onClick={() => setIsModelModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-white font-medium text-xs transition cursor-pointer shadow-xs"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Chat;
