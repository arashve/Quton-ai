'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp, Mic, Plus, X, Video, Upload, 
  Link as LinkIcon, Folder, Pause, Play, Check, 
  ChevronRight, Sparkles, Languages, Pointer,
  MoreHorizontal, Square, AudioLines, Monitor,
  ChevronsUpDown
} from 'lucide-react';

export type InputCapsuleState = 'prompt' | 'followup' | 'dropzone' | 'recording';

interface TaggedDoc {
  id: string;
  title: string;
  type: 'video' | 'doc' | 'file' | 'link';
  date: string;
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
  
  // File & Recording
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);

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

  return (
    <div className={`flex flex-col w-full max-w-2xl mx-auto font-sans relative ${className}`}>
      
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
          {/* STATE 4: RECORDING */}
          {/* ========================================================= */}
          {capsuleState === 'recording' && (
            <motion.div
              key="state-recording"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 sm:p-5 flex flex-col min-h-[130px] justify-between"
            >
              <div className="text-center pt-2">
                <span className="text-[13px] text-[#8E8E8E] font-medium">Go ahead, record a quick note</span>
              </div>

              <div className="flex items-center justify-between pt-6 px-1">
                <button onClick={() => { setCapsuleState('prompt'); setRecordingSeconds(0); }} className="px-5 py-2 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white/90 text-[13px] font-medium transition">
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {!isRecordingPaused && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>}
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-[15px] font-mono font-medium text-white">{formatTimer(recordingSeconds)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setIsRecordingPaused(!isRecordingPaused)} className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#4A4A4A] text-white flex items-center justify-center transition">
                    {isRecordingPaused ? <Play className="w-4 h-4 fill-white ml-0.5" /> : <Pause className="w-4 h-4 fill-white" />}
                  </button>
                  <button onClick={() => {
                    setPromptText(p => `${p} [Voice: ${formatTimer(recordingSeconds)}]`.trim());
                    setCapsuleState('prompt');
                    setRecordingSeconds(0);
                  }} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition hover:scale-105 active:scale-95">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ========================================================= */}
      {/* Animated Drawer Sub-Toolbar (Attached to Bottom)          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {capsuleState === 'prompt' && !isSending && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              y: 0,
              transition: { delay: 0.2, duration: 0.35, ease: [0.23, 1, 0.32, 1] } 
            }}
            exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.2 } }}
            className="z-0 w-[95%] mx-auto bg-[#171717] rounded-b-[18px] flex flex-col overflow-hidden shadow-lg -mt-4 pt-6" 
            /* 
              استفاده از mt-4- (مارجین منفی) و pt-6 (پدینگ بالا) باعث می‌شود
              این نوار دقیقاً به زیر شعاع (Radius) کپسول بالایی برود و 
              حالت یک کشوی کاملاً متصل را به خود بگیرد.
            */
          >
            <div className="flex items-center justify-between px-4 pb-2.5 pt-1">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[12.5px] font-sans font-medium text-[#8E8E8E] hover:text-white transition-colors cursor-pointer">
                  <Folder className="w-[15px] h-[15px] stroke-[2]" /> Choose project
                </button>
                
                <button className="flex items-center gap-2 text-[12.5px] font-sans font-medium text-[#8E8E8E] hover:text-white transition-colors cursor-pointer">
                  <div className="flex -space-x-[3px] opacity-90">
                     <div className="w-[7px] h-[11px] bg-[#2563EB] rounded-[2px] transform rotate-[-8deg] z-10"></div>
                     <div className="w-[7px] h-[11px] bg-[#DC2626] rounded-[2px] z-20 shadow-sm"></div>
                     <div className="w-[7px] h-[11px] bg-[#16A34A] rounded-[2px] transform rotate-[8deg] z-30"></div>
                  </div>
                  Plugins
                </button>
              </div>

              <button className="flex items-center justify-center text-[#8E8E8E] hover:text-white transition-colors cursor-pointer">
                <Monitor className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}