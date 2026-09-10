'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shell';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Square,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function VoiceTestPage() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Click "Start Listening" or pick a preset to speak with Voice 8.');
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechText, setSpeechText] = useState(
    'Hello! I am AUTOFLOW Voice 8. My speech synthesis engine is powered by ultra-low latency audio processing and real-time waveforms.'
  );
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  // Simulated live waveform bars
  const [waveHeights, setWaveHeights] = useState<number[]>([30, 45, 70, 85, 60, 95, 40, 65, 80, 50, 90, 35, 75, 55, 85]);

  useEffect(() => {
    if (!isListening && !isPlayingSpeech) {
      return;
    }
    const interval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 20)
      );
    }, 120);

    return () => {
      clearInterval(interval);
      setWaveHeights([25, 30, 45, 35, 50, 40, 30, 45, 50, 35, 40, 30, 25, 35, 30]);
    };
  }, [isListening, isPlayingSpeech]);

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript('Listening to your microphone (simulated STT)...');
      setTimeout(() => {
        setTranscript('“How do transformer self-attention mechanisms scale with sequence length?”');
        setIsListening(false);
      }, 3000);
    }
  };

  const handlePlayTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingSpeech) {
        setIsPlayingSpeech(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.onstart = () => setIsPlayingSpeech(true);
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingSpeech(!isPlayingSpeech);
    }
  };

  const samplePhrases = [
    'Introduce AUTOFLOW features and capabilities.',
    'Explain the difference between Flash and Pro reasoning models.',
    'Count from 1 to 5 with voice rhythm and cadence.',
  ];

  return (
    <PageContainer variant="studio" maxWidth="lg">
      {/* Background Subtle Monochrome Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="relative z-10 w-full">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs mb-3">
            <Mic className="w-3.5 h-3.5 text-white" />
            <span>Interactive Test Page • AI Voice 8</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Voice Native Audio Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real-time speech synthesis, audio wave telemetry, speech-to-text recognition, and acoustic parameter tuning.
          </p>
        </div>

        {/* Audio Wave Visualizer Card */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl mb-8 relative overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Live Waveform Bars */}
            <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-24 sm:h-32 w-full max-w-md px-4">
              {waveHeights.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-2 sm:w-2.5 rounded-full transition-all duration-100 ${
                    isListening || isPlayingSpeech
                      ? 'bg-white shadow-xs'
                      : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>

            {/* Mic Pulse Button */}
            <div className="relative">
              {isListening && (
                <div className="absolute -inset-2 rounded-full bg-white/20 animate-ping" />
              )}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition shadow-2xl cursor-pointer hover:scale-105 active:scale-95 ${
                  isListening
                    ? 'bg-zinc-200 text-zinc-950 shadow-white/20'
                    : 'bg-white text-zinc-950 shadow-md'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7 text-zinc-950" />
                ) : (
                  <Mic className="w-7 h-7 text-zinc-950" />
                )}
              </button>
            </div>

            {/* Live Status */}
            <div>
              <div className="text-sm font-semibold text-white">
                {isListening ? 'Listening to voice...' : isPlayingSpeech ? 'Vocalizing reply...' : 'Ready for Audio Input'}
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto italic">
                {transcript}
              </p>
            </div>
          </div>
        </div>

        {/* Voice Parameters & Speech Synthesis Sandbox */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* TTS Controls (Col-span 7) */}
          <div className="md:col-span-7 p-6 rounded-[32px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-white" />
                <span>Text-to-Speech Vocalizer</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                Web Speech API
              </span>
            </div>

            <textarea
              rows={3}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-hidden focus:border-zinc-500 resize-none"
            />

            {/* Slider Controls */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Speed / Rate</span>
                  <span className="font-mono text-white">{speechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Pitch</span>
                  <span className="font-mono text-white">{speechPitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* Play Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlayTTS}
                className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition shadow-md cursor-pointer"
              >
                {isPlayingSpeech ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>Stop Speech</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>Synthesize Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Prompts (Col-span 5) */}
          <div className="md:col-span-5 p-6 rounded-[32px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                <span className="text-xs font-semibold text-white">Preset Vocal Scripts</span>
              </div>
              <div className="space-y-2">
                {samplePhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSpeechText(phrase);
                      if (isPlayingSpeech) {
                        handlePlayTTS();
                      }
                    }}
                    className="w-full p-2.5 text-left rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800/80 text-xs text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <Link
                href="/arena"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Arena Duel</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/chat"
                className="text-xs text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Full Chat Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
