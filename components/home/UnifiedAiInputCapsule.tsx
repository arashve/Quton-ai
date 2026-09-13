'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp, Mic, Plus, X, Video, Upload, 
  Link as LinkIcon, Folder, Pause, Play, Check, 
  ChevronRight, ChevronLeft, Sparkles, Languages, Pointer,
  MoreHorizontal, Square, AudioLines, Monitor,
  ChevronsUpDown, Globe, Terminal, Eye, Palette
} from 'lucide-react';

export type InputCapsuleState = 
  | 'prompt' 
  | 'projects' 
  | 'plugins' 
  | 'monitor' 
  | 'dropzone' 
  | 'recording' 
  | 'followup';

interface TaggedDoc {
  id: string;
  title: string;
  type: 'video' | 'doc' | 'file' | 'link';
  date: string;
}

interface PluginItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface UnifiedAiInputCapsuleProps {
  initialState?: InputCapsuleState;
  onSendMessage?: (text: string, options?: { taggedDocs?: TaggedDoc[]; model?: string }) => void;
  className?: string;
}

export function UnifiedAiInputCapsule({
  initialState = 'prompt',
  onSendMessage,
  className = '',
}: UnifiedAiInputCapsuleProps) {
  const [capsuleState, setCapsuleState] = useState<InputCapsuleState>(initialState);
  const [promptText, setPromptText] = useState('');
  const [followupText, setFollowupText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [taggedDocs, setTaggedDocs] = useState<TaggedDoc[]>([]);

  // Model Selector
  const [selectedModel, setSelectedModel] = useState('Custom');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const models = [
    { id: 'custom', label: 'Custom' },
    { id: 'gpt-6', label: 'GPT-6 Astra' },
    { id: 'gemini-2.5', label: 'Gemini 2.5 Pro' },
  ];

  // Option 6: Project Selector State
  const [projects, setProjects] = useState<string[]>([
    'Global Workspace',
    'Quton AI Studio',
    'Frontend Pipeline',
    'Autonomous Agents',
  ]);
  const [selectedProject, setSelectedProject] = useState('Global Workspace');
  const [newProjectName, setNewProjectName] = useState('');

  // Option 6: Plugins Selector State
  const [plugins, setPlugins] = useState<PluginItem[]>([
    { id: 'web', name: 'Web Search Grounding', description: 'Live Google search results', enabled: true },
    { id: 'python', name: 'Python Sandbox', description: 'Run code & data analysis scripts', enabled: true },
    { id: 'vision', name: 'Vision Multimodal', description: 'Deep image & UI analyzer', enabled: false },
    { id: 'canvas', name: 'Artifact Canvas', description: 'Live interactive code & preview stage', enabled: false },
  ]);

  // Option 6: Monitor & Context State
  const [screenContextEnabled, setScreenContextEnabled] = useState(true);
  const [targetEnv, setTargetEnv] = useState<'Dev' | 'Staging' | 'Prod'>('Dev');

  // Container Ref for Click Outside
  const containerRef = useRef<HTMLDivElement>(null);
  
  // File & Recording
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);

  const activePluginsCount = plugins.filter(p => p.enabled).length;

  // Close model dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlugin = (id: string) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const name = newProjectName.trim();
      setProjects(prev => [...prev, name]);
      setSelectedProject(name);
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (capsuleState === 'recording' && !isRecordingPaused) {
      interval = setInterval(() => setRecordingSeconds(p => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [capsuleState, isRecordingPaused]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleSend = () => {
    const textToSend = capsuleState === 'followup' ? followupText : promptText;
    if (textToSend.trim() || taggedDocs.length > 0) {
      setIsSending(true);
      setTimeout(() => {
        if (onSendMessage) onSendMessage(textToSend, { taggedDocs, model: selectedModel });
        setPromptText('');
        setFollowupText('');
        setTaggedDocs([]);
        setIsSending(false);
        setCapsuleState('prompt');
      }, 400); 
    }
  };

  const processFile = (file: File) => {
    setTaggedDocs((prev) => [
      ...prev,
      { id: `file-${Date.now()}`, title: file.name, type: 'file', date: 'Just now' },
    ]);
    setCapsuleState('prompt');
  };

  const removeTaggedDoc = (id: string) => setTaggedDocs((prev) => prev.filter((d) => d.id !== id));
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(processFile);
      e.target.value = '';
    }
  };

  // Pre-calculated rhythmic heights for audio frequency waveform
  const waveformBars = [10, 18, 30, 22, 14, 38, 44, 26, 16, 36, 46, 28, 18, 42, 34, 24, 40, 26, 16, 32, 42, 22, 14, 8];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-full max-w-2xl mx-auto font-sans relative min-h-[230px] sm:min-h-[240px] justify-start ${className}`}
    >
      
      {/* Main Input Capsule with Apple-grade morphing spring physics */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          damping: 26,
          stiffness: 270,
          mass: 0.7,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative z-10 w-full rounded-[24px] sm:rounded-[28px] transition-colors duration-300 overflow-hidden ${
          capsuleState === 'dropzone' || isDragging
            ? 'bg-[#303030] shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
            : isFocused
            ? 'bg-[#2F2F2F] shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            : 'bg-[#2A2A2A] shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:bg-[#2C2C2C]'
        }`}
      >
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* STATE 1: PROMPT */}
          {/* ========================================================= */}
          {capsuleState === 'prompt' && (
            <motion.div
              key="state-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 sm:p-5 flex flex-col min-h-[130px] justify-between"
            >
              <div className="flex flex-col gap-2 pb-2 px-1">
                {/* Horizontal Scrollable Tags */}
                <AnimatePresence>
                  {taggedDocs.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 overflow-x-auto w-full py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {taggedDocs.map((doc) => (
                        <motion.span
                          key={doc.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#404040] text-white text-[13px] font-medium shadow-sm shrink-0"
                        >
                          {doc.type === 'link' ? <LinkIcon className="w-3.5 h-3.5 text-white/80" /> : <Video className="w-3.5 h-3.5 text-white/80" />}
                          <span className="text-white/95 truncate max-w-[120px]">{doc.title}</span>
                          <button onClick={() => removeTaggedDoc(doc.id)} className="text-white/40 hover:text-white transition p-0.5 ml-1 rounded-full hover:bg-white/10">
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <textarea
                  rows={2}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={taggedDocs.length > 0 ? "Ask about these files..." : "Work with Quton"}
                  className="w-full bg-transparent text-white/90 text-[15px] placeholder:text-[#8E8E8E] focus:outline-none resize-none selection:bg-white/20 mt-1"
                />
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between mt-1 px-1">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCapsuleState('dropzone')} className="p-1 rounded-full text-[#8E8E8E] hover:text-white transition cursor-pointer">
                    <Plus className="w-[18px] h-[18px] stroke-[2.5]" />
                  </button>

                  <div className="relative">
                    <button onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)} className="flex items-center gap-1.5 text-[#8E8E8E] hover:text-white text-[13px] font-medium transition cursor-pointer select-none ml-1">
                      <span className="flex items-center justify-center w-[14px] h-[14px] rounded-full bg-white/15">
                         <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                      <span>{selectedModel}</span>
                    </button>

                    <AnimatePresence>
                      {isModelDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 bottom-full mb-2 w-40 rounded-xl bg-[#262626] p-1 shadow-2xl z-50 overflow-hidden"
                        >
                          {models.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => { setSelectedModel(m.label); setIsModelDropdownOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between text-white/70 hover:text-white hover:bg-[#333333]"
                            >
                              <span>{m.label}</span>
                              {selectedModel === m.label && <Check className="w-3.5 h-3.5 text-white" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-[11px] font-sans text-[#8E8E8E] select-none tracking-wide">
                     5.6 Sol <span className="ml-1 opacity-70 flex items-center">Light <ChevronsUpDown className="w-3 h-3 ml-0.5 stroke-[2]"/></span>
                  </div>

                  <button onClick={() => setCapsuleState('recording')} className="text-[#8E8E8E] hover:text-white transition cursor-pointer">
                    <Mic className="w-[18px] h-[18px] stroke-[2.5]" />
                  </button>

                  <button
                    disabled={isSending}
                    onClick={handleSend}
                    className="w-8 h-8 rounded-full bg-[#254EAF] hover:bg-[#204397] text-white flex items-center justify-center shadow-[0_0_16px_rgba(37,78,175,0.45)] transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                    title="Send prompt"
                  >
                    {promptText.trim().length > 0 || taggedDocs.length > 0 ? (
                      <ArrowUp className="w-[18px] h-[18px] stroke-[2.5]" />
                    ) : (
                      <AudioLines className="w-[18px] h-[18px] stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 2: FOLLOW-UP */}
          {/* ========================================================= */}
          {capsuleState === 'followup' && (
            <motion.div
              key="state-followup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 sm:p-5 flex flex-col min-h-[130px] justify-between"
            >
              <div className="pb-2">
                <input
                  value={followupText}
                  onChange={(e) => setFollowupText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Ask a follow-up. Use @ to tag docs or files."
                  className="w-full bg-transparent text-white/90 text-[15px] placeholder:text-[#8E8E8E] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between mt-2 pt-3">
                <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
                  <button onClick={() => setCapsuleState('prompt')} className="w-8 h-8 rounded-full bg-[#404040] text-[#8E8E8E] hover:text-white flex items-center justify-center shrink-0 transition"><X className="w-4 h-4" /></button>
                  <button onClick={() => setFollowupText('Generate a document')} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white text-[13px] font-medium shrink-0 transition">
                    <Sparkles className="w-3.5 h-3.5 text-white/70" /> Generate a document
                  </button>
                  <button onClick={() => setFollowupText('Translate page')} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white text-[13px] font-medium shrink-0 transition">
                    <Languages className="w-3.5 h-3.5 text-white/70" /> Translate page
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#404040] text-[#8E8E8E] hover:text-white flex items-center justify-center shrink-0 transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <button onClick={() => setCapsuleState('recording')} className="text-[#8E8E8E] hover:text-white transition"><Mic className="w-4 h-4" /></button>
                  <button onClick={handleSend} className="w-8 h-8 rounded-full bg-[#254EAF] hover:bg-[#204397] text-white shadow-[0_0_16px_rgba(37,78,175,0.45)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer">
                    {followupText.trim() ? <ArrowUp className="w-4 h-4 text-white stroke-[2.5]" /> : <Square className="w-3 h-3 text-white fill-white" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 3: DROPZONE */}
          {/* ========================================================= */}
          {capsuleState === 'dropzone' && (
            <motion.div
              key="state-dropzone"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 sm:p-8 flex flex-col items-center justify-center text-center relative min-h-[160px]"
            >
              <div className="absolute inset-3 rounded-[20px] bg-white/[0.04] pointer-events-none" />
              <button onClick={() => setCapsuleState('prompt')} className="absolute top-4 right-4 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition z-20">
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 mb-4 z-10">
                <h3 className="text-[17px] font-medium text-white">Drop anything here or browse</h3>
                <p className="text-[13px] text-[#8E8E8E]">Docs, images, videos, audio files, links & more</p>
              </div>

              <div className="flex items-center gap-3 z-10">
                <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white/80 hover:text-white flex items-center justify-center transition"><Upload className="w-4 h-4" /></button>
                <button onClick={() => setCapsuleState('recording')} className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white/80 hover:text-white flex items-center justify-center transition"><Mic className="w-4 h-4" /></button>
                <button onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) { setTaggedDocs(p => [...p, { id: Date.now().toString(), title: url, type: 'link', date: 'Web' }]); setCapsuleState('prompt'); }
                }} className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white/80 hover:text-white flex items-center justify-center transition"><LinkIcon className="w-4 h-4" /></button>
                <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white/80 hover:text-white flex items-center justify-center transition"><Folder className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 4: RECORDING (Option 5: Audio Waveform Visualizer)  */}
          {/* ========================================================= */}
          {capsuleState === 'recording' && (
            <motion.div
              key="state-recording"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 sm:p-5 flex flex-col min-h-[140px] justify-between select-none"
            >
              {/* Header Status & Elapsed Timer */}
              <div className="flex items-center justify-between px-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {!isRecordingPaused && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    )}
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-[13px] text-white/90 font-medium">
                    {isRecordingPaused ? 'Recording Paused' : 'Listening... speak your prompt'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[13px] font-semibold tracking-wider">
                  <span>{formatTimer(recordingSeconds)}</span>
                </div>
              </div>

              {/* Dynamic Audio Frequency Waveform Bars */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-12 w-full max-w-sm mx-auto my-2 px-1">
                {waveformBars.map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      height: isRecordingPaused
                        ? '4px'
                        : [`${Math.max(4, h * 0.25)}px`, `${h}px`, `${Math.max(4, h * 0.45)}px`],
                      opacity: isRecordingPaused ? 0.35 : [0.65, 1, 0.75],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 0.36 + (i % 6) * 0.08,
                      ease: 'easeInOut',
                    }}
                    className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-red-500/90 via-red-400 to-white shadow-[0_0_8px_rgba(239,68,68,0.35)]"
                  />
                ))}
              </div>

              {/* Controls Footer */}
              <div className="flex items-center justify-between pt-1 px-1">
                <button
                  onClick={() => {
                    setCapsuleState('prompt');
                    setRecordingSeconds(0);
                    setIsRecordingPaused(false);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#3D3D3D] hover:bg-[#484848] text-white/80 hover:text-white text-[13px] font-medium transition cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecordingPaused(!isRecordingPaused)}
                    className="w-9 h-9 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] text-white flex items-center justify-center transition cursor-pointer hover:scale-105 active:scale-95"
                    title={isRecordingPaused ? 'Resume Recording' : 'Pause Recording'}
                  >
                    {isRecordingPaused ? (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    ) : (
                      <Pause className="w-4 h-4 fill-white" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const note = `[Voice note: ${formatTimer(recordingSeconds)}]`;
                      setPromptText((p) => (p ? `${p} ${note}` : note));
                      setCapsuleState('prompt');
                      setRecordingSeconds(0);
                      setIsRecordingPaused(false);
                    }}
                    className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-[13px] flex items-center gap-1.5 transition cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Use Audio</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 5: PROJECTS (Integrated Morphing Workspace View)   */}
          {/* ========================================================= */}
          {capsuleState === 'projects' && (
            <motion.div
              key="state-projects"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 flex flex-col justify-between min-h-[220px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 select-none">
                <button
                  onClick={() => setCapsuleState('prompt')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition cursor-pointer group"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Prompt</span>
                </button>
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white tracking-wide">Workspace Project</span>
                </div>
                <button
                  onClick={() => setCapsuleState('prompt')}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 max-h-48 overflow-y-auto [scrollbar-width:none]">
                {projects.map((proj) => {
                  const isSelected = selectedProject === proj;
                  return (
                    <button
                      key={proj}
                      onClick={() => {
                        setSelectedProject(proj);
                        setCapsuleState('prompt');
                      }}
                      className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white/15 text-white shadow-md'
                          : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-xl shrink-0 ${isSelected ? 'bg-white text-black' : 'bg-white/10 text-white/60'}`}>
                          <Folder className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium truncate">{proj}</span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Add Project Form */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddProject();
                      setCapsuleState('prompt');
                    }
                  }}
                  placeholder="Type new project name & hit Enter..."
                  className="flex-1 bg-white/5 focus:bg-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none transition"
                />
                <button
                  onClick={() => {
                    if (newProjectName.trim()) {
                      handleAddProject();
                      setCapsuleState('prompt');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 6: PLUGINS (Integrated Morphing Extensions Matrix) */}
          {/* ========================================================= */}
          {capsuleState === 'plugins' && (
            <motion.div
              key="state-plugins"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 flex flex-col justify-between min-h-[220px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 select-none">
                <button
                  onClick={() => setCapsuleState('prompt')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition cursor-pointer group"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Prompt</span>
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-[3px]">
                    <div className="w-[7px] h-[11px] bg-white rounded-[2px] transform rotate-[-8deg] z-10"></div>
                    <div className="w-[7px] h-[11px] bg-white/70 rounded-[2px] z-20 shadow-sm"></div>
                    <div className="w-[7px] h-[11px] bg-white/40 rounded-[2px] transform rotate-[8deg] z-30"></div>
                  </div>
                  <span className="text-sm font-semibold text-white tracking-wide">AI Plugins & Extensions</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold">
                    {activePluginsCount} Active
                  </span>
                </div>
                <button
                  onClick={() => setCapsuleState('prompt')}
                  className="px-3.5 py-1 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center gap-1 transition cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Done</span>
                </button>
              </div>

              {/* Plugins Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                {plugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    onClick={() => togglePlugin(plugin.id)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between select-none ${
                      plugin.enabled
                        ? 'bg-white/[0.08] shadow-sm'
                        : 'bg-white/[0.03] opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`p-2 rounded-xl shrink-0 ${plugin.enabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                        {plugin.id === 'web' && <Globe className="w-4 h-4" />}
                        {plugin.id === 'python' && <Terminal className="w-4 h-4" />}
                        {plugin.id === 'vision' && <Eye className="w-4 h-4" />}
                        {plugin.id === 'canvas' && <Palette className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">{plugin.name}</div>
                        <div className="text-[10.5px] text-white/50 truncate">{plugin.description}</div>
                      </div>
                    </div>

                    {/* Toggle switch pill */}
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                        plugin.enabled ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className={`w-4 h-4 rounded-full shadow-sm transform ${
                          plugin.enabled ? 'bg-black translate-x-4' : 'bg-white translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-white/40 px-1">
                <span>Click any extension card to toggle state</span>
                <span className="font-mono">{activePluginsCount} of {plugins.length} active</span>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 7: MONITOR (Integrated Context & Runtime Matrix)    */}
          {/* ========================================================= */}
          {capsuleState === 'monitor' && (
            <motion.div
              key="state-monitor"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 flex flex-col justify-between min-h-[220px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 select-none">
                <button
                  onClick={() => setCapsuleState('prompt')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition cursor-pointer group"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Prompt</span>
                </button>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white tracking-wide">Screen & Runtime Context</span>
                </div>
                <button
                  onClick={() => setCapsuleState('prompt')}
                  className="px-3.5 py-1 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center gap-1 transition cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Apply</span>
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                {/* Screen Context Card */}
                <div
                  onClick={() => setScreenContextEnabled(!screenContextEnabled)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between select-none ${
                    screenContextEnabled
                      ? 'bg-white/[0.08] shadow-sm'
                      : 'bg-white/[0.03] opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${screenContextEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/40'}`}>
                        <Monitor className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-white">Live Screen Context</span>
                    </div>
                    <div
                      className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                        screenContextEnabled ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className={`w-3.5 h-3.5 rounded-full shadow-sm transform ${
                          screenContextEnabled ? 'bg-black translate-x-3.5' : 'bg-white translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Automatically passes current browser tab context & DOM snapshots to model prompts.
                  </p>
                </div>

                {/* Runtime Environment Card */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-white mb-1">Target Runtime Target</div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Route queries to active cluster environment.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-white/5 p-1 rounded-xl mt-2">
                    {(['Dev', 'Staging', 'Prod'] as const).map((env) => (
                      <button
                        key={env}
                        onClick={() => setTargetEnv(env)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-center ${
                          targetEnv === env
                            ? 'bg-white text-black shadow-sm font-semibold'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-white/40 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${screenContextEnabled ? 'bg-white animate-pulse' : 'bg-white/30'}`} />
                  <span>{screenContextEnabled ? 'Screen streaming active' : 'Screen streaming inactive'}</span>
                </div>
                <span className="font-mono uppercase text-white/80">{targetEnv} Mode</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ========================================================= */}
      {/* Animated Drawer Sub-Toolbar with Spring Physics           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {capsuleState === 'prompt' && !isSending && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -22, scale: 0.96 }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              y: 0, 
              scale: 1,
              transition: { 
                type: 'spring',
                damping: 20,
                stiffness: 220,
                mass: 0.8,
                delay: 0.08
              } 
            }}
            exit={{ 
              opacity: 0, 
              height: 0, 
              y: -16, 
              scale: 0.96,
              transition: { 
                type: 'spring',
                damping: 26,
                stiffness: 320,
                duration: 0.2
              } 
            }}
            className="z-0 w-[95%] mx-auto bg-[#171717] rounded-b-[20px] flex flex-col shadow-xl -mt-4 pt-5 pb-2 overflow-hidden" 
          >
            <div className="flex items-center justify-between px-4 pb-1 pt-1 select-none">
              <div className="flex items-center gap-5 sm:gap-6">
                
                {/* 1. Choose project button -> morphs capsule */}
                <button
                  onClick={() => setCapsuleState('projects')}
                  className="flex items-center gap-1.5 sm:gap-2 text-[12.5px] font-sans font-medium text-[#8E8E8E] hover:text-white transition-colors cursor-pointer group rounded-lg py-1 select-none"
                  title="Switch workspace project"
                >
                  <Folder className="w-[15px] h-[15px] stroke-[2] text-[#8E8E8E] group-hover:text-white transition-colors" />
                  <span className="truncate max-w-[120px] sm:max-w-[150px]">{selectedProject}</span>
                  <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ml-0.5" />
                </button>
                
                {/* 2. Plugins button -> morphs capsule */}
                <button
                  onClick={() => setCapsuleState('plugins')}
                  className="flex items-center gap-2 text-[12.5px] font-sans font-medium text-[#8E8E8E] hover:text-white transition-colors cursor-pointer group rounded-lg py-1 select-none"
                  title="Configure active AI plugins"
                >
                  <div className="flex -space-x-[3px] opacity-90">
                    <div className="w-[7px] h-[11px] bg-white rounded-[2px] transform rotate-[-8deg] z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-[7px] h-[11px] bg-white/70 rounded-[2px] z-20 shadow-sm group-hover:scale-110 transition-transform"></div>
                    <div className="w-[7px] h-[11px] bg-white/40 rounded-[2px] transform rotate-[8deg] z-30 group-hover:scale-110 transition-transform"></div>
                  </div>
                  <span>Plugins</span>
                  <span className="px-1.5 py-0.2 text-[10.5px] rounded-full bg-white/15 text-white font-semibold group-hover:bg-white/25 transition-colors">
                    {activePluginsCount}
                  </span>
                </button>
              </div>

              {/* 3. Monitor button -> morphs capsule */}
              <button
                onClick={() => setCapsuleState('monitor')}
                className="flex items-center gap-1.5 p-1.5 rounded-lg text-[#8E8E8E] hover:text-white transition-colors cursor-pointer group select-none"
                title="Screen Context & Runtime Environment"
              >
                <div className="relative">
                  <Monitor className="w-4 h-4 stroke-[2] group-hover:text-white transition-colors" />
                  {screenContextEnabled && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white ring-2 ring-[#171717]" />
                  )}
                </div>
                <span className="text-[11px] font-mono text-white/40 group-hover:text-white/70 transition-colors uppercase">
                  {targetEnv}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}