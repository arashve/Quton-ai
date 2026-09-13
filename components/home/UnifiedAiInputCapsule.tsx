'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp, Mic, Plus, X, Video, Upload, 
  Link as LinkIcon, Folder, Pause, Play, Check, 
  ChevronRight, Sparkles, Languages, Pointer,
  MoreHorizontal, Square, AudioLines, Monitor,
  ChevronsUpDown, Globe, Terminal, Eye, Palette
} from 'lucide-react';

export type InputCapsuleState = 'prompt' | 'followup' | 'dropzone' | 'recording';

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
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Option 6: Plugins Selector State
  const [plugins, setPlugins] = useState<PluginItem[]>([
    { id: 'web', name: 'Web Search Grounding', description: 'Live Google search results', enabled: true },
    { id: 'python', name: 'Python Sandbox', description: 'Run code & data analysis scripts', enabled: true },
    { id: 'vision', name: 'Vision Multimodal', description: 'Deep image & UI analyzer', enabled: false },
    { id: 'canvas', name: 'Artifact Canvas', description: 'Live interactive code & preview stage', enabled: false },
  ]);
  const [isPluginsMenuOpen, setIsPluginsMenuOpen] = useState(false);

  // Option 6: Monitor & Context State
  const [isMonitorMenuOpen, setIsMonitorMenuOpen] = useState(false);
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

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
        setIsProjectMenuOpen(false);
        setIsPluginsMenuOpen(false);
        setIsMonitorMenuOpen(false);
        setIsAddingProject(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProjectMenu = () => {
    setIsProjectMenuOpen(prev => !prev);
    setIsPluginsMenuOpen(false);
    setIsMonitorMenuOpen(false);
    setIsModelDropdownOpen(false);
  };

  const togglePluginsMenu = () => {
    setIsPluginsMenuOpen(prev => !prev);
    setIsProjectMenuOpen(false);
    setIsMonitorMenuOpen(false);
    setIsModelDropdownOpen(false);
  };

  const toggleMonitorMenu = () => {
    setIsMonitorMenuOpen(prev => !prev);
    setIsProjectMenuOpen(false);
    setIsPluginsMenuOpen(false);
    setIsModelDropdownOpen(false);
  };

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
      className={`flex flex-col w-full max-w-2xl mx-auto font-sans relative min-h-[195px] sm:min-h-[205px] justify-start ${className}`}
    >
      
      {/* Main Input Capsule (Z-index 10 to stay above the drawer) */}
      <motion.div
        layout
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative z-10 w-full rounded-[24px] sm:rounded-[28px] transition-colors duration-300 overflow-visible ${
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
                          {doc.type === 'link' ? <LinkIcon className="w-3.5 h-3.5 text-blue-400" /> : <Video className="w-3.5 h-3.5 text-blue-400" />}
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
                      <span className="flex items-center justify-center w-[14px] h-[14px] rounded-full border border-current">
                         <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      </span>
                      <span>{selectedModel}</span>
                    </button>

                    <AnimatePresence>
                      {isModelDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 bottom-full mb-2 w-40 rounded-xl bg-[#262626] p-1 shadow-2xl z-50 overflow-hidden border border-white/5"
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
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-transform cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
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

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
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
                  <button onClick={handleSend} className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                    {followupText.trim() ? <ArrowUp className="w-4 h-4 text-black stroke-[2.5]" /> : <Square className="w-3 h-3 text-black fill-black" />}
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
              <div className="absolute inset-3 rounded-[20px] border border-dashed border-blue-400/30 pointer-events-none" />
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

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-mono text-[13px] font-semibold tracking-wider">
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
        </AnimatePresence>
      </motion.div>

      {/* ========================================================= */}
      {/* Option 6: Animated Drawer Sub-Toolbar with Rich Popovers  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {capsuleState === 'prompt' && !isSending && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              y: 0,
              transition: { delay: 0.15, duration: 0.3, ease: [0.23, 1, 0.32, 1] } 
            }}
            exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.2 } }}
            className="z-0 w-[95%] mx-auto bg-[#171717] rounded-b-[18px] flex flex-col shadow-lg -mt-4 pt-6 overflow-visible" 
          >
            <div className="flex items-center justify-between px-4 pb-2.5 pt-1 relative">
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* 1. Choose project button & popover */}
                <div className="relative">
                  <button
                    onClick={toggleProjectMenu}
                    className={`flex items-center gap-1.5 sm:gap-2 text-[12.5px] font-sans font-medium transition-colors cursor-pointer rounded-lg px-2 py-1 -ml-2 select-none ${
                      isProjectMenuOpen ? 'text-white bg-white/10' : 'text-[#8E8E8E] hover:text-white'
                    }`}
                  >
                    <Folder className="w-[15px] h-[15px] stroke-[2]" />
                    <span className="truncate max-w-[110px] sm:max-w-[140px]">{selectedProject}</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-60 ml-0.5" />
                  </button>

                  <AnimatePresence>
                    {isProjectMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 bottom-full mb-3 w-64 rounded-2xl bg-[#222222]/98 backdrop-blur-xl border border-white/15 p-2 shadow-2xl z-50 text-left"
                      >
                        <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-2.5 py-1">
                          Workspace Project
                        </div>
                        <div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto [scrollbar-width:none]">
                          {projects.map((proj) => (
                            <button
                              key={proj}
                              onClick={() => {
                                setSelectedProject(proj);
                                setIsProjectMenuOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                                selectedProject === proj
                                  ? 'bg-white/15 text-white'
                                  : 'text-white/70 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate">{proj}</span>
                              {selectedProject === proj && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                            </button>
                          ))}
                        </div>

                        {/* Add Project */}
                        <div className="mt-2 pt-2 border-t border-white/10 px-1">
                          {isAddingProject ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddProject();
                                  if (e.key === 'Escape') setIsAddingProject(false);
                                }}
                                placeholder="New project..."
                                autoFocus
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-2 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400"
                              />
                              <button
                                onClick={handleAddProject}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition"
                              >
                                Add
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setIsAddingProject(true)}
                              className="w-full py-1 px-2 rounded-lg text-left text-xs text-blue-400 hover:text-blue-300 hover:bg-white/5 transition flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Create New Project
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* 2. Plugins button & popover */}
                <div className="relative">
                  <button
                    onClick={togglePluginsMenu}
                    className={`flex items-center gap-1.5 sm:gap-2 text-[12.5px] font-sans font-medium transition-colors cursor-pointer rounded-lg px-2 py-1 select-none ${
                      isPluginsMenuOpen ? 'text-white bg-white/10' : 'text-[#8E8E8E] hover:text-white'
                    }`}
                  >
                    <div className="flex -space-x-[3px] opacity-90">
                      <div className="w-[7px] h-[11px] bg-[#2563EB] rounded-[2px] transform rotate-[-8deg] z-10"></div>
                      <div className="w-[7px] h-[11px] bg-[#DC2626] rounded-[2px] z-20 shadow-sm"></div>
                      <div className="w-[7px] h-[11px] bg-[#16A34A] rounded-[2px] transform rotate-[8deg] z-30"></div>
                    </div>
                    <span>Plugins</span>
                    <span className="px-1.5 py-0.2 text-[10.5px] rounded-full bg-white/15 text-white font-semibold">
                      {activePluginsCount}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isPluginsMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 sm:-left-12 bottom-full mb-3 w-72 rounded-2xl bg-[#222222]/98 backdrop-blur-xl border border-white/15 p-3 shadow-2xl z-50 text-left"
                      >
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-1">
                          <span className="text-xs font-semibold text-white">Active Extensions</span>
                          <span className="text-[11px] text-blue-400 font-medium">{activePluginsCount} enabled</span>
                        </div>

                        <div className="space-y-1.5 max-h-60 overflow-y-auto [scrollbar-width:none]">
                          {plugins.map((plugin) => (
                            <div
                              key={plugin.id}
                              onClick={() => togglePlugin(plugin.id)}
                              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 pr-2">
                                <div className={`p-1.5 rounded-lg ${plugin.enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}>
                                  {plugin.id === 'web' && <Globe className="w-3.5 h-3.5" />}
                                  {plugin.id === 'python' && <Terminal className="w-3.5 h-3.5" />}
                                  {plugin.id === 'vision' && <Eye className="w-3.5 h-3.5" />}
                                  {plugin.id === 'canvas' && <Palette className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-white/90 group-hover:text-white">
                                    {plugin.name}
                                  </span>
                                  <span className="text-[10px] text-white/50 line-clamp-1">
                                    {plugin.description}
                                  </span>
                                </div>
                              </div>

                              {/* Interactive Toggle Switch */}
                              <div
                                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                                  plugin.enabled ? 'bg-blue-500' : 'bg-white/20'
                                }`}
                              >
                                <motion.div
                                  layout
                                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform ${
                                    plugin.enabled ? 'translate-x-3.5' : 'translate-x-0'
                                  }`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 3. Monitor / Screen Context button & popover */}
              <div className="relative">
                <button
                  onClick={toggleMonitorMenu}
                  className={`relative p-1.5 rounded-lg transition-colors cursor-pointer select-none ${
                    isMonitorMenuOpen ? 'text-white bg-white/10' : 'text-[#8E8E8E] hover:text-white'
                  }`}
                  title="Screen Context & Environment"
                >
                  <Monitor className="w-4 h-4 stroke-[2]" />
                  {screenContextEnabled && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-[#171717]" />
                  )}
                </button>

                <AnimatePresence>
                  {isMonitorMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-full mb-3 w-60 rounded-2xl bg-[#222222]/98 backdrop-blur-xl border border-white/15 p-3 shadow-2xl z-50 text-left"
                    >
                      <div className="text-xs font-semibold text-white mb-2 pb-1.5 border-b border-white/10">
                        Context & Environment
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {/* Screen Context Toggle */}
                        <div
                          onClick={() => setScreenContextEnabled(!screenContextEnabled)}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition"
                        >
                          <div className="flex flex-col">
                            <span className="text-white/90 font-medium">Screen Context</span>
                            <span className="text-[10px] text-white/50">Attach view to AI request</span>
                          </div>
                          <div
                            className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                              screenContextEnabled ? 'bg-emerald-500' : 'bg-white/20'
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                                screenContextEnabled ? 'translate-x-3' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Environment Picker */}
                        <div className="pt-1">
                          <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1.5">Runtime Mode</span>
                          <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl">
                            {(['Dev', 'Staging', 'Prod'] as const).map((env) => (
                              <button
                                key={env}
                                onClick={() => setTargetEnv(env)}
                                className={`py-1 rounded-lg text-[11px] font-medium transition cursor-pointer text-center ${
                                  targetEnv === env
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white/50 hover:text-white'
                                }`}
                              >
                                {env}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}