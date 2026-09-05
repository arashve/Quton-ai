'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Camera,
  History,
  Terminal,
  FileCode,
  Search,
  Check,
  CornerDownLeft,
  Sliders,
  Maximize2,
  Minimize2,
  Trash2,
  HelpCircle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import type { ModelConfig } from '../Chat';

export interface PromptAttachment {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  textContent?: string;
}

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (helpers: {
    insertText: (text: string) => void;
    clearText: () => void;
    toggleTool: (tool: 'deepThink' | 'webSearch' | 'wireframes') => void;
    openModelModal: () => void;
  }) => void;
}

export interface PromptInputProps {
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  onSend: (
    finalPrompt: string,
    activeMode?: string,
    attachments?: PromptAttachment[]
  ) => void;
  onAbort: () => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  modelConfig: ModelConfig;
  onOpenModelModal: () => void;
  onSelectModel?: (modelName: string, provider?: ModelConfig['provider']) => void;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  className?: string;
  placeholder?: string;
  variant?: 'borderless-flat' | 'floating-pill' | 'compact';
  maxFiles?: number;
  maxFileSizeMb?: number;
  acceptedFileTypes?: string[];
  recentPrompts?: string[];
  onClearHistory?: () => void;
  suggestionChips?: Array<{
    label: string;
    prompt: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export interface PromptInputHandle {
  focus: () => void;
  clear: () => void;
  addAttachment: (file: File) => Promise<void>;
}

// Preset popular models for inline quick-switch
const QUICK_MODELS: Array<{
  id: string;
  name: string;
  provider: ModelConfig['provider'];
  badge: string;
  description: string;
}> = [
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B',
    provider: 'groq',
    badge: 'Groq',
    description: 'High-speed reasoning and code synthesis',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    badge: 'Google',
    description: 'Ultra-low latency multimodal engine',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    badge: 'Google',
    description: 'Extended context & deep technical research',
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'groq',
    badge: 'Groq',
    description: 'Open-weight state-of-the-art generalist',
  },
  {
    id: 'deepseek-r1:8b',
    name: 'DeepSeek R1 8B',
    provider: 'ollama',
    badge: 'Local',
    description: 'Chain-of-thought mathematical reasoning',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'custom',
    badge: 'OpenAI',
    description: 'Fast, lightweight OpenAI completions',
  },
];

export const PromptInput = forwardRef<PromptInputHandle, PromptInputProps>(
  (
    {
      inputPrompt,
      setInputPrompt,
      onSend,
      onAbort,
      isLoading,
      isListening,
      onToggleVoice,
      modelConfig,
      onOpenModelModal,
      onSelectModel,
      activeMode,
      setActiveMode,
      className = '',
      placeholder = 'Ask anything, type / for commands, or drop files...',
      variant = 'borderless-flat',
      maxFiles = 5,
      maxFileSizeMb = 10,
      recentPrompts = [],
      onClearHistory,
      suggestionChips = [
        {
          label: 'React Component',
          prompt: 'Generate a production-ready React component with Tailwind CSS for: ',
          icon: LayoutGrid,
        },
        {
          label: 'System Architecture',
          prompt: 'Architect a high-performance, fault-tolerant backend system with specs for: ',
          icon: Network,
        },
        {
          label: 'Debug Performance',
          prompt: 'Analyze latency bottlenecks and memory usage in this code: ',
          icon: Terminal,
        },
        {
          label: 'API Specification',
          prompt: 'Design an OpenAPI / SSE streaming REST endpoint contract for: ',
          icon: Rocket,
        },
      ],
    },
    ref
  ) => {
    // DOM References
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Component States
    const [isFocused, setIsFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
    const [attachmentError, setAttachmentError] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isCapturingScreen, setIsCapturingScreen] = useState(false);

    // Mode / Tool toggles
    const [deepThinkEnabled, setDeepThinkEnabled] = useState(false);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);

    // Popovers
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
    const [slashFilter, setSlashFilter] = useState('');
    const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [activeVariant, setActiveVariant] = useState(variant);
    const [showSuggestions, setShowSuggestions] = useState(true);

    // History navigation index (-1 means currently typed buffer)
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [historyDraft, setHistoryDraft] = useState<string>('');

    // Expose handle methods to parent
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      clear: () => {
        setInputPrompt('');
        setAttachments([]);
      },
      addAttachment: async (file: File) => {
        await handleProcessFile(file);
      },
    }));

    // Auto-resize textarea height
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const minHeight = activeVariant === 'compact' ? 38 : 44;
        const maxHeight = 220;
        const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${nextHeight}px`;
      }
    }, [inputPrompt, activeVariant]);

    // Handle slash command query detection
    useEffect(() => {
      if (inputPrompt.startsWith('/')) {
        const query = inputPrompt.slice(1).split(/\s+/)[0] || '';
        setSlashFilter(query);
        setIsSlashMenuOpen(true);
      } else if (isSlashMenuOpen) {
        setIsSlashMenuOpen(false);
      }
    }, [inputPrompt, isSlashMenuOpen]);

    // Dismiss popovers on outside click
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          setIsPlusMenuOpen(false);
          setIsSlashMenuOpen(false);
          setIsModelDropdownOpen(false);
          setIsHistoryOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // File processing helper
    const handleProcessFile = useCallback(
      async (file: File) => {
        setAttachmentError(null);

        if (attachments.length >= maxFiles) {
          setAttachmentError(`Maximum ${maxFiles} files allowed`);
          return;
        }

        const sizeInMb = file.size / (1024 * 1024);
        if (sizeInMb > maxFileSizeMb) {
          setAttachmentError(
            `"${file.name}" exceeds the ${maxFileSizeMb}MB file size limit.`
          );
          return;
        }

        const isImage = file.type.startsWith('image/');
        let previewUrl: string | undefined;
        let textContent: string | undefined;

        if (isImage) {
          previewUrl = URL.createObjectURL(file);
        } else if (
          file.type.startsWith('text/') ||
          file.type.includes('json') ||
          file.type.includes('javascript') ||
          file.type.includes('typescript') ||
          file.name.match(/\.(ts|tsx|js|jsx|py|go|rs|cpp|c|h|md|txt|json|yml|yaml|css|html|sql)$/i)
        ) {
          try {
            textContent = await file.text();
            // Truncate if gigantic
            if (textContent.length > 50000) {
              textContent = textContent.slice(0, 50000) + '\n... [truncated]';
            }
          } catch (err) {
            console.error('Failed reading text file:', err);
          }
        }

        const newAttachment: PromptAttachment = {
          id: `attach_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          previewUrl,
          textContent,
        };

        setAttachments((prev) => [...prev, newAttachment]);
      },
      [attachments.length, maxFiles, maxFileSizeMb]
    );

    const handleRemoveAttachment = (id: string) => {
      setAttachments((prev) => {
        const item = prev.find((a) => a.id === id);
        if (item?.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
        return prev.filter((a) => a.id !== id);
      });
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!containerRef.current?.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        for (const file of files) {
          await handleProcessFile(file);
        }
      }
    };

    // Screen capture / Screenshot attachment
    const handleCaptureScreen = async () => {
      if (typeof window === 'undefined') return;
      setIsCapturingScreen(true);
      setAttachmentError(null);

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: 'browser' as any },
          });
          const track = stream.getVideoTracks()[0];
          const imageCapture = new (window as any).ImageCapture(track);
          const bitmap = await imageCapture.grabFrame();
          track.stop();

          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(bitmap, 0, 0);

          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], `screenshot-${Date.now()}.png`, {
                type: 'image/png',
              });
              await handleProcessFile(file);
            }
          }, 'image/png');
        } else {
          setAttachmentError('Screen capture is not supported in this browser.');
        }
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
          console.error('Screen capture error:', err);
          setAttachmentError('Screen capture failed or was cancelled.');
        }
      } finally {
        setIsCapturingScreen(false);
      }
    };

    // Prompt Enhancer ("Magic Wand")
    const handleEnhancePrompt = () => {
      if (!inputPrompt.trim()) return;
      setIsEnhancing(true);
      setTimeout(() => {
        const original = inputPrompt.trim();
        const enhanced = `Architectural Specification & Implementation Plan for: "${original}"\n\n• Target System Architecture & Tech Stack\n• Core Data Models, Protocols & State Flow\n• Step-by-step Production Code with Robust Error Handling\n• Performance Optimization & Latency Considerations`;
        setInputPrompt(enhanced);
        setIsEnhancing(false);
        textareaRef.current?.focus();
      }, 400);
    };

    // Trigger submission
    const handleTriggerSend = () => {
      let finalPrompt = inputPrompt.trim();
      if (!finalPrompt && attachments.length === 0 && !isListening) return;

      // Handle attachments context injection
      if (attachments.length > 0) {
        const attachDescriptions = attachments
          .map((a, idx) => {
            if (a.textContent) {
              return `\n[Attached File ${idx + 1}: ${a.name} (${(a.size / 1024).toFixed(1)} KB)]\n\`\`\`\n${a.textContent}\n\`\`\``;
            }
            return `\n[Attached ${a.type.startsWith('image/') ? 'Image' : 'File'} ${idx + 1}: ${a.name} (${(a.size / 1024).toFixed(1)} KB)]`;
          })
          .join('\n');

        finalPrompt = finalPrompt ? `${finalPrompt}\n\n${attachDescriptions}` : attachDescriptions;
      }

      if (deepThinkEnabled && !finalPrompt.startsWith('[Reasoning Focus]')) {
        finalPrompt = `[Reasoning Focus: Provide thorough architectural step-by-step thinking]\n${finalPrompt}`;
      }
      if (webSearchEnabled && !finalPrompt.includes('[Grounding requested]')) {
        finalPrompt = `[Grounding requested: prioritize latest verified sources & tech specs]\n${finalPrompt}`;
      }

      onSend(finalPrompt, activeMode, attachments);
      setInputPrompt('');
      setAttachments([]);
      setHistoryIndex(-1);
      setHistoryDraft('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    };

    // Slash Commands Definition
    const SLASH_COMMANDS: SlashCommand[] = useMemo(
      () => [
        {
          id: 'search',
          label: '/search',
          description: 'Enable real-time web search and live documentation grounding',
          icon: Globe,
          action: ({ toggleTool, clearText }) => {
            setWebSearchEnabled(true);
            clearText();
          },
        },
        {
          id: 'think',
          label: '/think',
          description: 'Enable deep architectural chain-of-thought reasoning',
          icon: Brain,
          action: ({ clearText }) => {
            setDeepThinkEnabled(true);
            clearText();
          },
        },
        {
          id: 'code',
          label: '/code',
          description: 'Set UI Wireframes and reactive component generation mode',
          icon: Code2,
          action: ({ clearText }) => {
            setActiveMode('wireframes');
            clearText();
          },
        },
        {
          id: 'summarize',
          label: '/summarize',
          description: 'Insert an executive synthesis and summary prompt template',
          icon: FileText,
          action: ({ insertText }) => {
            insertText('Provide an executive architectural summary of: ');
          },
        },
        {
          id: 'explain',
          label: '/explain',
          description: 'Insert an in-depth pedagogical breakdown prompt template',
          icon: HelpCircle,
          action: ({ insertText }) => {
            insertText('Explain the internal mechanics, trade-offs, and lifecycles of: ');
          },
        },
        {
          id: 'refactor',
          label: '/refactor',
          description: 'Insert a clean code refactoring and optimization template',
          icon: Sparkles,
          action: ({ insertText }) => {
            insertText('Refactor and optimize the following TypeScript code for high throughput: ');
          },
        },
        {
          id: 'clear',
          label: '/clear',
          description: 'Clear the current prompt text and attached documents',
          icon: Trash2,
          action: ({ clearText }) => {
            clearText();
            setAttachments([]);
          },
        },
      ],
      [setActiveMode]
    );

    const filteredSlashCommands = useMemo(() => {
      if (!slashFilter) return SLASH_COMMANDS;
      const term = slashFilter.toLowerCase();
      return SLASH_COMMANDS.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(term) ||
          cmd.description.toLowerCase().includes(term)
      );
    }, [SLASH_COMMANDS, slashFilter]);

    const executeSlashCommand = (cmd: SlashCommand) => {
      cmd.action({
        insertText: (text) => {
          setInputPrompt(text);
          textareaRef.current?.focus();
        },
        clearText: () => {
          setInputPrompt('');
          textareaRef.current?.focus();
        },
        toggleTool: (tool) => {
          if (tool === 'deepThink') setDeepThinkEnabled((prev) => !prev);
          if (tool === 'webSearch') setWebSearchEnabled((prev) => !prev);
          if (tool === 'wireframes')
            setActiveMode(activeMode === 'wireframes' ? 'default' : 'wireframes');
        },
        openModelModal: onOpenModelModal,
      });
      setIsSlashMenuOpen(false);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle Slash command list navigation
      if (isSlashMenuOpen && filteredSlashCommands.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (prev + 1) % filteredSlashCommands.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSlashSelectedIndex(
            (prev) =>
              (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length
          );
          return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          executeSlashCommand(filteredSlashCommands[slashSelectedIndex]);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsSlashMenuOpen(false);
          return;
        }
      }

      // History navigation with ArrowUp/ArrowDown when empty or navigating
      if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
        recentPrompts.length > 0
      ) {
        const textarea = textareaRef.current;
        const isCursorAtStart =
          textarea &&
          textarea.selectionStart === 0 &&
          textarea.selectionEnd === 0;

        if (inputPrompt === '' || isCursorAtStart) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex === -1) {
              setHistoryDraft(inputPrompt);
              const nextIdx = 0;
              setHistoryIndex(nextIdx);
              setInputPrompt(recentPrompts[nextIdx]);
            } else if (historyIndex < recentPrompts.length - 1) {
              const nextIdx = historyIndex + 1;
              setHistoryIndex(nextIdx);
              setInputPrompt(recentPrompts[nextIdx]);
            }
          } else if (e.key === 'ArrowDown' && historyIndex !== -1) {
            e.preventDefault();
            if (historyIndex > 0) {
              const nextIdx = historyIndex - 1;
              setHistoryIndex(nextIdx);
              setInputPrompt(recentPrompts[nextIdx]);
            } else {
              setHistoryIndex(-1);
              setInputPrompt(historyDraft);
            }
          }
          return;
        }
      }

      // Enter to Send
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!isLoading) {
          handleTriggerSend();
        }
      }
    };

    // Calculate metrics
    const wordCount = inputPrompt.trim() ? inputPrompt.trim().split(/\s+/).length : 0;
    const approxTokens = Math.round(inputPrompt.length / 3.8);
    const charCount = inputPrompt.length;

    // Helper format file size
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // File type icon helper
    const renderFileIcon = (attachment: PromptAttachment) => {
      if (attachment.type.startsWith('image/')) {
        return <ImageIcon className="w-3.5 h-3.5 text-blue-500" />;
      }
      if (
        attachment.name.endsWith('.ts') ||
        attachment.name.endsWith('.tsx') ||
        attachment.name.endsWith('.js') ||
        attachment.name.endsWith('.jsx') ||
        attachment.name.endsWith('.py')
      ) {
        return <FileCode className="w-3.5 h-3.5 text-emerald-500" />;
      }
      if (attachment.name.endsWith('.csv') || attachment.name.endsWith('.xlsx')) {
        return <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />;
      }
      return <FileText className="w-3.5 h-3.5 text-zinc-500" />;
    };

    return (
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full max-w-3xl mx-auto transition-all duration-200 group ${className}`}
      >
        {/* Hidden File Input for Paperclip click */}
        <input
          ref={fileInputRef}
          id="prompt-input-file-picker"
          type="file"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            for (const file of files) {
              await handleProcessFile(file);
            }
            e.target.value = '';
          }}
        />

        {/* Suggestion Chips Tray (shown if enabled & prompt is empty) */}
        <AnimatePresence>
          {showSuggestions &&
            inputPrompt.length === 0 &&
            attachments.length === 0 &&
            suggestionChips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar py-0.5"
              >
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium px-1 flex-shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">Try:</span>
                </div>
                {suggestionChips.map((chip, idx) => {
                  const Icon = chip.icon || Sparkles;
                  return (
                    <button
                      key={idx}
                      id={`suggestion-chip-${idx}`}
                      type="button"
                      onClick={() => {
                        setInputPrompt(chip.prompt);
                        textareaRef.current?.focus();
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white text-xs whitespace-nowrap transition cursor-pointer flex-shrink-0"
                    >
                      <Icon className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
        </AnimatePresence>

        {/* Main Flat & Borderless Container */}
        <div
          className={`relative z-10 rounded-2xl sm:rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-xl transition-all duration-200 overflow-hidden flex flex-col ${
            isFocused
              ? 'bg-zinc-100 dark:bg-zinc-900 shadow-lg'
              : 'shadow-sm'
          } border-0 outline-none`}
        >
          {/* Drag & Drop Visual Overlay State */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0 z-50 rounded-2xl sm:rounded-3xl bg-zinc-900/90 dark:bg-zinc-100/95 backdrop-blur-md flex flex-col items-center justify-center gap-2 p-6 text-center text-white dark:text-zinc-950 pointer-events-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center">
                  <Paperclip className="w-6 h-6 animate-bounce" />
                </div>
                <div className="text-base font-semibold">Drop files here to attach</div>
                <div className="text-xs opacity-75 max-w-xs">
                  Supports images, code files, JSON, Markdown, and text specs (up to {maxFileSizeMb}MB)
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Capability Toolbar: Model Pill & Tool States */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 text-xs bg-zinc-200/50 dark:bg-zinc-800/40">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Model Pill with Inline Dropdown */}
              <div className="relative">
                <button
                  id="prompt-input-model-selector"
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition text-[11px] font-mono cursor-pointer"
                  title="Switch inference model & provider"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span className="max-w-[120px] sm:max-w-[160px] truncate font-medium">
                    {modelConfig.model}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold uppercase">
                    {modelConfig.provider}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Inline Model Picker Popover */}
                <AnimatePresence>
                  {isModelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      className="absolute top-8 left-0 w-72 p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col gap-1 text-xs border border-zinc-200/60 dark:border-zinc-800/60"
                    >
                      <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider">
                        Quick Select Engine
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-1">
                        {QUICK_MODELS.map((m) => {
                          const isSelected = modelConfig.model === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                if (onSelectModel) {
                                  onSelectModel(m.id, m.provider);
                                }
                                setIsModelDropdownOpen(false);
                              }}
                              className={`w-full p-2 rounded-xl text-left flex items-start justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium'
                                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                              }`}
                            >
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold">{m.name}</span>
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-mono uppercase">
                                    {m.badge}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-1">
                                  {m.description}
                                </span>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 flex-shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="pt-1.5 mt-1 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModelDropdownOpen(false);
                            onOpenModelModal();
                          }}
                          className="w-full py-1.5 px-2 rounded-lg text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Custom Provider & Key Settings...</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Deep Think Mode Pill */}
              <button
                id="prompt-input-deep-think-toggle"
                type="button"
                onClick={() => setDeepThinkEnabled(!deepThinkEnabled)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                  deepThinkEnabled
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Toggle Deep Architectural Reasoning & Chain-of-Thought"
              >
                <Brain className="w-3 h-3" />
                <span className="hidden sm:inline">Deep Think</span>
                <span className="sm:hidden">Think</span>
              </button>

              {/* Web Search Mode Pill */}
              <button
                id="prompt-input-web-search-toggle"
                type="button"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                  webSearchEnabled
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Ground response with live web sources & verified documentation"
              >
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">Web Search</span>
                <span className="sm:hidden">Web</span>
              </button>

              {/* Wireframes / React UI Mode Pill */}
              <button
                id="prompt-input-wireframes-toggle"
                type="button"
                onClick={() =>
                  setActiveMode(activeMode === 'wireframes' ? 'default' : 'wireframes')
                }
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                  activeMode === 'wireframes'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Toggle Wireframe Component & Spec Generation Mode"
              >
                <Code2 className="w-3 h-3" />
                <span className="hidden sm:inline">Wireframes</span>
                <span className="sm:hidden">UI</span>
              </button>
            </div>

            {/* Live Token & Word Counters */}
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono">
              {inputPrompt.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {wordCount} words · ~{approxTokens} tokens
                </span>
              )}
            </div>
          </div>

          {/* Attachment Tray (When files are attached) */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 pt-2.5 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar"
              >
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300/40 dark:border-zinc-700/40 flex-shrink-0 group/item text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    {item.previewUrl ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-zinc-300/60 dark:bg-zinc-700/60 flex items-center justify-center flex-shrink-0">
                        {renderFileIcon(item)}
                      </div>
                    )}
                    <div className="flex flex-col max-w-[120px] sm:max-w-[160px]">
                      <span className="truncate text-xs font-medium">{item.name}</span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {formatSize(item.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(item.id)}
                      className="p-1 rounded-full text-zinc-400 hover:text-red-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
                      title="Remove attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex-shrink-0 px-1">
                  {attachments.length}/{maxFiles}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attachment error banner */}
          <AnimatePresence>
            {attachmentError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center justify-between"
              >
                <span>{attachmentError}</span>
                <button
                  type="button"
                  onClick={() => setAttachmentError(null)}
                  className="p-0.5 hover:opacity-80"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Slash Commands Popover */}
          <AnimatePresence>
            {isSlashMenuOpen && filteredSlashCommands.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="mx-3 my-1.5 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 z-40"
              >
                <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center justify-between">
                  <span>Slash Commands</span>
                  <span className="font-mono text-[9px]">Use ↑↓ to navigate, Enter to select</span>
                </div>
                <div className="space-y-0.5 max-h-52 overflow-y-auto">
                  {filteredSlashCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === slashSelectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        onClick={() => executeSlashCommand(cmd)}
                        className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-mono font-semibold text-xs text-zinc-900 dark:text-zinc-100 mr-2">
                              {cmd.label}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {cmd.description}
                            </span>
                          </div>
                        </div>
                        <CornerDownLeft className="w-3 h-3 text-zinc-400 opacity-50" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea Input Core - Auto-resizing, Flat, Borderless */}
          <div className="relative px-3 sm:px-4 pt-2 pb-1.5 sm:pt-2.5 sm:pb-2">
            <textarea
              ref={textareaRef}
              id="reactbits-prompt-input-core"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none outline-none border-0 focus:outline-none focus:ring-0 leading-relaxed max-h-[220px] transition-[height] duration-100 ease-out"
            />
          </div>

          {/* Bottom Actions Row: Attachments, Slash, Voice, Enhance, Send/Stop */}
          <div className="flex items-center justify-between px-2.5 sm:px-3.5 pb-2.5 pt-1 gap-2">
            {/* Left Toolbar */}
            <div className="flex items-center gap-1 sm:gap-1.5 relative">
              {/* Paperclip File Upload */}
              <button
                id="prompt-input-attach-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Attach files or code specs (or drag & drop)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Screenshot / Screen Capture Button */}
              <button
                id="prompt-input-screenshot-btn"
                type="button"
                onClick={handleCaptureScreen}
                disabled={isCapturingScreen}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Capture screenshot of active tab or screen"
              >
                <Camera className={`w-4 h-4 ${isCapturingScreen ? 'animate-pulse' : ''}`} />
              </button>

              {/* Slash Command Trigger Button */}
              <button
                id="prompt-input-slash-btn"
                type="button"
                onClick={() => {
                  if (inputPrompt.startsWith('/')) {
                    setIsSlashMenuOpen(!isSlashMenuOpen);
                  } else {
                    setInputPrompt('/');
                    setIsSlashMenuOpen(true);
                    textareaRef.current?.focus();
                  }
                }}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer font-mono text-xs font-bold"
                title="Slash commands (/)"
              >
                /
              </button>

              {/* Architecture & Prompt Templates Popover */}
              <div className="relative">
                <button
                  id="prompt-input-templates-btn"
                  type="button"
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className="p-1.5 sm:p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                  title="Architecture specs & prompt templates"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isPlusMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-12 left-0 w-64 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col gap-1 text-xs text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60"
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
                        className="px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition"
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
                        className="px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition"
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
                        className="px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition"
                      >
                        <Rocket className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                        <span>Full MVP Tech Spec</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Prompt Enhancer Button ("Magic Wand") */}
              {inputPrompt.trim().length > 3 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="button"
                  id="prompt-input-enhance-btn"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs transition cursor-pointer active:scale-95"
                  title="Automatically structure and enrich this prompt into an engineering specification"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline text-[11px] font-medium">Enhance</span>
                  <span className="sm:hidden text-[10px] font-medium">AI</span>
                </motion.button>
              )}

              {/* Voice Recognition Dictation Button */}
              <button
                id="prompt-input-voice-btn"
                type="button"
                onClick={onToggleVoice}
                className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice input (Web Speech)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Live Waveform Indicator while listening */}
              {isListening && (
                <span className="flex items-center gap-1 text-[11px] text-red-500 font-mono pl-1">
                  <span className="inline-block w-1 h-3 bg-red-500 animate-bounce" />
                  <span className="inline-block w-1 h-4 bg-red-500 animate-bounce delay-75" />
                  <span className="inline-block w-1 h-2 bg-red-500 animate-bounce delay-150" />
                  <span className="hidden sm:inline ml-1 font-sans">Listening...</span>
                </span>
              )}

              {/* Prompt History Quick Recall Popover */}
              {recentPrompts.length > 0 && (
                <div className="relative">
                  <button
                    id="prompt-input-history-btn"
                    type="button"
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="p-1.5 sm:p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                    title="Recent prompt history (or press ↑ when input is empty)"
                  >
                    <History className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isHistoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-12 left-0 w-72 p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col gap-1 text-xs border border-zinc-200/60 dark:border-zinc-800/60"
                      >
                        <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center justify-between">
                          <span>Recent Prompts</span>
                          {onClearHistory && (
                            <button
                              type="button"
                              onClick={() => {
                                onClearHistory();
                                setIsHistoryOpen(false);
                              }}
                              className="text-[10px] text-zinc-400 hover:text-red-500 lowercase transition"
                            >
                              clear
                            </button>
                          )}
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-1">
                          {recentPrompts.map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setInputPrompt(p);
                                setIsHistoryOpen(false);
                                textareaRef.current?.focus();
                              }}
                              className="w-full p-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition cursor-pointer flex items-center gap-2"
                            >
                              <History className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                              <span className="line-clamp-2 text-xs">{p}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Right Action: Clear Button, Enter Hint, Send/Stop Button */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Clear Input Button */}
              {inputPrompt.length > 0 && !isLoading && (
                <button
                  id="prompt-input-clear-text-btn"
                  type="button"
                  onClick={() => {
                    setInputPrompt('');
                    textareaRef.current?.focus();
                  }}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition rounded-lg"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <span className="hidden sm:inline-block text-[11px] text-zinc-400 dark:text-zinc-500 font-mono select-none">
                Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">Enter ↵</kbd>
              </span>

              {/* Send or Stop Action Button (Changes automatically based on status) */}
              {isLoading ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  id="prompt-input-stop-btn"
                  onClick={onAbort}
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  id="prompt-input-send-btn"
                  onClick={handleTriggerSend}
                  disabled={
                    !inputPrompt.trim() &&
                    attachments.length === 0 &&
                    !isListening
                  }
                  className={`w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    inputPrompt.trim() || attachments.length > 0 || isListening
                      ? 'bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-sm'
                      : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                  }`}
                  title="Send message (Enter)"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PromptInput.displayName = 'PromptInput';

// Re-export alias for seamless drop-in
export const ReactBitsAIInput = PromptInput;
