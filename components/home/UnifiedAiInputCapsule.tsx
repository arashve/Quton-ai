'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  Mic,
  Plus,
  X,
  Sparkles,
  Paperclip,
  FileText,
  Video,
  Upload,
  Link as LinkIcon,
  Folder,
  Pause,
  Play,
  Check,
  ChevronRight,
  ChevronsUpDown,
  AudioLines,
  MoreHorizontal,
  Languages,
  Code,
  Square,
  FileIcon,
} from 'lucide-react';

export type InputCapsuleState = 'prompt' | 'followup' | 'dropzone' | 'recording';

interface TaggedDoc {
  id: string;
  title: string;
  type: 'video' | 'doc' | 'file';
  date: string;
}

interface UnifiedAiInputCapsuleProps {
  initialState?: InputCapsuleState;
  onSendMessage?: (text: string, options?: { taggedDocs?: TaggedDoc[]; model?: string; webSearch?: boolean }) => void;
  className?: string;
}

export function UnifiedAiInputCapsule({
  initialState = 'prompt',
  onSendMessage,
  className = '',
}: UnifiedAiInputCapsuleProps) {
  // Active State Management: 'prompt' | 'followup' | 'dropzone' | 'recording'
  const [capsuleState, setCapsuleState] = useState<InputCapsuleState>(initialState);

  // Prompt / Followup Text
  const [promptText, setPromptText] = useState('create a summary web page');
  const [followupText, setFollowupText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Tagged context pills (like the @ Onboarding call with... Today)
  const [taggedDocs, setTaggedDocs] = useState<TaggedDoc[]>([
    {
      id: 'doc-1',
      title: 'Onboarding call with...',
      type: 'video',
      date: 'Today',
    },
  ]);

  // Model Selector
  const [selectedModel, setSelectedModel] = useState('Cursor: GPT-5.2');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const models = [
    { id: 'gpt-5.2', label: 'Cursor: GPT-5.2' },
    { id: 'gemini-2.5-pro', label: 'Gemini: 2.5 Pro' },
    { id: 'gemini-2.5-flash', label: 'Gemini: 2.5 Flash' },
    { id: 'llama-3.3-70b', label: 'Groq: Llama 3.3' },
  ];

  // Tool active states
  const [isAudioWaveActive, setIsAudioWaveActive] = useState(false);
  const [isSparkleActive, setIsSparkleActive] = useState(true);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['customer_voice.pdf']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recording State (State 4)
  const [recordingSeconds, setRecordingSeconds] = useState(261); // Starts at 04:21 like the image
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);

  // Recording timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (capsuleState === 'recording' && !isRecordingPaused) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [capsuleState, isRecordingPaused]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${hours > 0 ? `${hours}:` : '0:'}${pad(mins)}:${pad(secs)}`;
  };

  const handleSend = () => {
    const textToSend = capsuleState === 'followup' ? followupText : promptText;
    if (onSendMessage) {
      onSendMessage(textToSend, { taggedDocs, model: selectedModel });
    }
    setPromptText('');
    setFollowupText('');
  };

  const removeTaggedDoc = (id: string) => {
    setTaggedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const addSampleTag = () => {
    setTaggedDocs((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}`,
        title: 'Project_Specs.pdf',
        type: 'doc',
        date: 'Just now',
      },
    ]);
  };

  // Drag events for State 3
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileName = e.dataTransfer.files[0].name;
      setUploadedFiles((prev) => [fileName, ...prev]);
      setCapsuleState('dropzone');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setUploadedFiles((prev) => [fileName, ...prev]);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* State Mode Switcher Pills (Allows testing and directly switching all 4 Figma states easily) */}
      <div className="flex items-center justify-center gap-1.5 mb-4 px-2">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#18181A]/80 border border-white/10 backdrop-blur-xl shadow-lg">
          {(
            [
              { id: 'prompt', label: '1. Tagged Prompt' },
              { id: 'followup', label: '2. Follow-up' },
              { id: 'dropzone', label: '3. Dropzone' },
              { id: 'recording', label: '4. Voice Note' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setCapsuleState(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                capsuleState === st.id
                  ? 'bg-white/15 text-white shadow-xs font-semibold'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Unified Input Capsule Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-[28px] sm:rounded-[32px] transition-all duration-300 backdrop-blur-2xl ${
          capsuleState === 'dropzone' || isDragging
            ? 'bg-[#212124] border-2 border-dashed border-blue-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_25px_rgba(59,130,246,0.15)]'
            : isFocused
            ? 'bg-[#29292B] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-2 ring-white/5'
            : 'bg-[#262629] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] hover:bg-[#28282B]'
        }`}
      >
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* STATE 1: ACTIVE PROMPT WITH TAGGED FILE / CONTEXT PILL    */}
          {/* ========================================================= */}
          {capsuleState === 'prompt' && (
            <motion.div
              key="state-prompt"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="p-4 sm:p-5 flex flex-col min-h-[140px] justify-between"
            >
              {/* Top Input Row with Tagged Pill + Text Field */}
              <div className="flex flex-wrap items-center gap-2.5 pb-3">
                {/* Tagged Context Pill (@ Onboarding call with... Today) */}
                {taggedDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#343438] text-white text-xs sm:text-sm font-medium border border-white/10 shadow-xs group"
                  >
                    <span className="text-white/50 text-xs">@</span>
                    {doc.type === 'video' ? (
                      <span className="w-4 h-4 rounded-full bg-blue-500/90 flex items-center justify-center text-[10px] text-white">
                        <Video className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span className="text-white/95 truncate max-w-[150px] sm:max-w-[200px]">
                      {doc.title}
                    </span>
                    <span className="text-white/40 text-[11px] font-normal pl-0.5">
                      {doc.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTaggedDoc(doc.id)}
                      className="text-white/35 hover:text-white transition cursor-pointer p-0.5"
                      title="Remove context tag"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Main Text Prompt Input */}
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="create a summary web page"
                  className="flex-1 min-w-[200px] bg-transparent text-white text-sm sm:text-base placeholder:text-white/35 focus:outline-hidden py-1 selection:bg-blue-600/40"
                  aria-label="Prompt text"
                />
              </div>

              {/* Bottom Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                {/* Left Controls: (+) Add context, Model Selector Pill, Waveform, Sparkles, More */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {/* + Button */}
                  <button
                    type="button"
                    onClick={() => setCapsuleState('dropzone')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Add file, doc or context"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Model Selector Pill (e.g. Cursor: GPT-5.2) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white text-xs font-medium border border-white/10 transition cursor-pointer select-none"
                    >
                      {/* Stylized Box / Cube Icon from image */}
                      <span className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center">
                        <span className="w-2 h-2 border border-white/80 rotate-45" />
                      </span>
                      <span>{selectedModel}</span>
                      <ChevronsUpDown className="w-3 h-3 text-white/45" />
                    </button>

                    {/* Model Dropdown Menu */}
                    {isModelDropdownOpen && (
                      <div className="absolute left-0 bottom-full mb-2 w-48 rounded-2xl bg-[#1E1E21] border border-white/15 p-1.5 shadow-2xl z-50">
                        {models.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedModel(m.label);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                              selectedModel === m.label
                                ? 'bg-white/15 text-white font-semibold'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span>{m.label}</span>
                            {selectedModel === m.label && <Check className="w-3.5 h-3.5 text-blue-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audio Waveform Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsAudioWaveActive(!isAudioWaveActive)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isAudioWaveActive
                        ? 'text-cyan-400 bg-cyan-400/15'
                        : 'text-white/45 hover:text-white hover:bg-white/10'
                    }`}
                    title="Audio streaming mode"
                  >
                    <AudioLines className="w-4 h-4" />
                  </button>

                  {/* Sparkles / Cursor pointer toggle */}
                  <button
                    type="button"
                    onClick={() => setIsSparkleActive(!isSparkleActive)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isSparkleActive
                        ? 'text-blue-400 bg-blue-400/15'
                        : 'text-white/45 hover:text-white hover:bg-white/10'
                    }`}
                    title="Auto-agentic execution"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* More options (...) */}
                  <button
                    type="button"
                    onClick={addSampleTag}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Tag more files (@)"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Controls: Mic button & Crisp White Circle Send button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCapsuleState('recording')}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Record voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleSend}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
                    aria-label="Submit prompt"
                  >
                    <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 2: FOLLOW-UP & ACTION SUGGESTION PILLS              */}
          {/* ========================================================= */}
          {capsuleState === 'followup' && (
            <motion.div
              key="state-followup"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="p-4 sm:p-5 flex flex-col min-h-[140px] justify-between"
            >
              {/* Follow-up Placeholder / Input */}
              <div className="pt-1 pb-3">
                <input
                  type="text"
                  value={followupText}
                  onChange={(e) => setFollowupText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a follow-up. Use @ to tag docs or files."
                  className="w-full bg-transparent text-white text-sm sm:text-base placeholder:text-white/40 focus:outline-hidden py-1 selection:bg-blue-600/40"
                  aria-label="Follow-up prompt"
                />
              </div>

              {/* Bottom Row: Clear (X) + Suggestion Pills + Arrow + Mic + Stop/Submit */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                {/* Left side: (X) + Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFollowupText('');
                      setCapsuleState('prompt');
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Suggestion Action Pill 1: Generate a document */}
                  <button
                    type="button"
                    onClick={() => setFollowupText('Generate a document')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white text-xs font-medium border border-white/10 transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                    <span>Generate a document</span>
                  </button>

                  {/* Suggestion Action Pill 2: Translate text */}
                  <button
                    type="button"
                    onClick={() => setFollowupText('Translate into Spanish and German')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white text-xs font-medium border border-white/10 transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Languages className="w-3.5 h-3.5 text-white/70" />
                    <span>Translate text</span>
                  </button>

                  {/* Right chevron circle button */}
                  <button
                    type="button"
                    onClick={() => setFollowupText('Analyze architecture & code logic')}
                    className="w-7 h-7 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white/60 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                    title="More actions"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right side: Mic + Stop / Record / Send icon */}
                <div className="flex items-center gap-2 shrink-0 pl-1">
                  <button
                    type="button"
                    onClick={() => setCapsuleState('recording')}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Record voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleSend}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
                    aria-label="Stop or send"
                  >
                    {followupText.trim() ? (
                      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 fill-black text-black" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 3: DRAG AND DROP / FILE UPLOAD SURFACE             */}
          {/* ========================================================= */}
          {capsuleState === 'dropzone' && (
            <motion.div
              key="state-dropzone"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="p-6 sm:p-8 flex flex-col items-center justify-center text-center relative"
            >
              {/* Close / Return to text button */}
              <button
                type="button"
                onClick={() => setCapsuleState('prompt')}
                className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Back to text mode"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 mb-5">
                <h3 className="text-base sm:text-lg font-medium text-white">
                  Drop anything here or browse
                </h3>
                <p className="text-xs sm:text-sm text-white/50">
                  Docs, images, videos, audio files, links & more
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                  title="Upload from computer"
                >
                  <Upload className="w-4 h-4" />
                </button>

                {/* Voice / Audio Upload */}
                <button
                  type="button"
                  onClick={() => setCapsuleState('recording')}
                  className="w-10 h-10 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                  title="Record audio"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Link / URL */}
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter document or webpage URL:');
                    if (url) {
                      setTaggedDocs((prev) => [
                        ...prev,
                        { id: `link-${Date.now()}`, title: url, type: 'doc', date: 'Web' },
                      ]);
                      setCapsuleState('prompt');
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                  title="Paste link or URL"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                {/* Folder / Browse Files */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                  title="Browse local files"
                >
                  <Folder className="w-4 h-4" />
                </button>
              </div>

              {/* Floating File Preview Badge (Matching Figma customer_voice.pdf) */}
              {uploadedFiles.length > 0 && (
                <div className="absolute -bottom-5 right-6 z-20 flex flex-col items-center">
                  <div className="p-2.5 rounded-xl bg-[#2D2D32] border border-white/20 shadow-2xl flex flex-col items-center gap-1">
                    <FileIcon className="w-6 h-6 text-red-400" />
                    <span className="text-[9px] font-bold text-white/60 uppercase">PDF</span>
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md bg-blue-600 text-[11px] font-mono text-white font-medium shadow-md">
                    {uploadedFiles[0]}
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STATE 4: AUDIO / VOICE NOTE RECORDING STATE              */}
          {/* ========================================================= */}
          {capsuleState === 'recording' && (
            <motion.div
              key="state-recording"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="p-4 sm:p-5 flex flex-col min-h-[140px] justify-between"
            >
              {/* Centered Subtitle */}
              <div className="text-center pt-1">
                <span className="text-xs sm:text-sm text-white/50 font-normal">
                  Go ahead, record a quick note
                </span>
              </div>

              {/* Controls Row: Cancel + Blinking Red Dot & Timer + Pause + Done */}
              <div className="flex items-center justify-between pt-4">
                {/* Left: Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCapsuleState('prompt');
                    setRecordingSeconds(0);
                  }}
                  className="px-4 py-2 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white/80 hover:text-white text-xs sm:text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>

                {/* Center: Blinking Red Recording Dot + Real-time Timer */}
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    {!isRecordingPaused && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-sm sm:text-base font-mono font-medium text-white tracking-wider">
                    {formatTimer(recordingSeconds)}
                  </span>
                </div>

                {/* Right: Pause Button + Confirm Checkmark Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecordingPaused(!isRecordingPaused)}
                    className="w-9 h-9 rounded-full bg-[#343438] hover:bg-[#3D3D42] text-white flex items-center justify-center transition cursor-pointer"
                    title={isRecordingPaused ? 'Resume' : 'Pause'}
                  >
                    {isRecordingPaused ? (
                      <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                    ) : (
                      <Pause className="w-3.5 h-3.5 fill-white text-white" />
                    )}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setPromptText(`Transcribed voice note (${formatTimer(recordingSeconds)}): summary and action items`);
                      setCapsuleState('prompt');
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
                    title="Finish and use recording"
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
