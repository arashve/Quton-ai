'use client';

import React, { useState, useId } from 'react';
import { Check, Copy, Play, Code2, Eye } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const id = useId();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const isPreviewable =
    ['html', 'svg', 'xml'].includes(language.toLowerCase()) ||
    (language.toLowerCase() === 'tsx' && value.includes('return') && value.includes('<')) ||
    (language.toLowerCase() === 'jsx' && value.includes('return') && value.includes('<'));

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-800 bg-[#161616] shadow-2xl">
      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#121212] border-b border-zinc-800/80 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          {/* Mac/Terminal Dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/80"></div>
          </div>
          <div className="h-3 w-px bg-zinc-800 mx-1"></div>
          <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="uppercase font-medium tracking-wider text-zinc-400">{language}</span>
          </div>

          {isPreviewable && (
            <div className="ml-2 flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                id={`tab-code-${id}`}
                onClick={() => setActiveTab('code')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition ${
                  activeTab === 'code' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Code
              </button>
              <button
                id={`tab-preview-${id}`}
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                  activeTab === 'preview' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
            </div>
          )}
        </div>

        <button
          id={`copy-code-${id}`}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700/90 border border-zinc-700/50 text-zinc-300 hover:text-zinc-100 transition text-xs font-medium"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code view or Preview */}
      {activeTab === 'code' ? (
        <pre className="p-4 overflow-x-auto text-[13px] font-mono text-emerald-400 leading-relaxed bg-[#161616]">
          <code>{value}</code>
        </pre>
      ) : (
        <div className="p-4 bg-[#121212] min-h-[140px] flex items-center justify-center border-t border-zinc-800">
          {language.toLowerCase() === 'html' || language.toLowerCase() === 'svg' ? (
            <div
              className="w-full overflow-auto text-zinc-100"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="text-center text-xs text-zinc-500 py-4">
              <Play className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
              <span>Interactive sandbox preview</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
