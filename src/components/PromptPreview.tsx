import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Bookmark, Sparkles, ArrowLeft, ExternalLink, Mail } from 'lucide-react';
import { TASK_TYPES } from '../data/taskTypes';
import { PromptFormState, Tier } from '../types';

interface PromptPreviewProps {
  promptText: string;
  formState: PromptFormState;
  onUpdatePromptText: (text: string) => void;
  tier: Tier;
  onSavePrompt: (title: string, promptText: string) => void;
  onOpenProModal: () => void;
  onOpenGmailModal: (title: string, content: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  onBackToInputs: () => void;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({
  promptText,
  formState,
  onUpdatePromptText,
  tier,
  onSavePrompt,
  onOpenProModal,
  onOpenGmailModal,
  onShowToast,
  onBackToInputs,
}) => {
  const [copied, setCopied] = useState(false);
  const [promptTitle, setPromptTitle] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTask = TASK_TYPES.find((t) => t.id === formState.taskTypeId) || TASK_TYPES[0];

  // Title generation
  useEffect(() => {
    const topicExcerpt = formState.topic.trim().slice(0, 30);
    setPromptTitle(`${currentTask.title}: ${topicExcerpt || 'Custom'}`);
  }, [formState.taskTypeId, formState.topic]);

  // Real-time typewriter effect on mount / promptText change
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');

    if (!promptText) {
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    const chunkSize = Math.max(1, Math.floor(promptText.length / 40));

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= promptText.length) {
        setDisplayedText(promptText);
        setIsTyping(false);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      } else {
        setDisplayedText(promptText.slice(0, currentIndex));
      }
    }, 18);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [promptText]);

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayedText(promptText);
    setIsTyping(false);
  };

  const handleCopy = async () => {
    const textToCopy = isTyping ? promptText : displayedText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onShowToast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onShowToast('Copied to clipboard!', 'success');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenModel = (url: string, modelName: string) => {
    handleCopy();
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast(`Prompt copied! Opening ${modelName}...`, 'info');
  };

  const handleSave = () => {
    if (tier === 'free') {
      onShowToast('Saved prompt history is a Pro feature! Unlock Pro to save prompts.', 'info');
      onOpenProModal();
      return;
    }

    onSavePrompt(promptTitle, displayedText || promptText);
    onShowToast('Prompt saved to history!', 'success');
  };

  // Stats calculations
  const textForStats = displayedText || promptText;
  const charCount = textForStats.length;
  const wordCount = textForStats.trim() ? textForStats.trim().split(/\s+/).length : 0;
  const estTokens = Math.ceil(wordCount * 1.3);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToInputs}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Edit Inputs</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${isTyping ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {isTyping ? 'Assembling Prompt Live...' : 'Assembled Prompt Output'}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isTyping && (
            <button
              onClick={handleSkipTyping}
              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={() => onOpenGmailModal(promptTitle, displayedText || promptText)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20 hover:text-white transition-all shadow-xs"
          >
            <Mail className="h-3.5 w-3.5 text-red-400" />
            <span>Send via Gmail</span>
          </button>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-md ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 active:scale-98 shadow-indigo-500/20'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Prompt!' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Main Real-Time Generated Text Output */}
      <div className="relative flex-1 p-3.5 bg-slate-950/80">
        <textarea
          value={isTyping ? displayedText : promptText}
          onChange={(e) => {
            if (!isTyping) {
              setDisplayedText(e.target.value);
              onUpdatePromptText(e.target.value);
            }
          }}
          spellCheck={false}
          placeholder="Assembling your prompt..."
          className="h-full min-h-[280px] w-full resize-none rounded-lg border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
        />
        {isTyping && (
          <div className="absolute bottom-5 right-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs shadow-md animate-bounce">
            <Sparkles className="h-3 w-3" /> Real-time stream...
          </div>
        )}
      </div>

      {/* Direct AI Platform Launchers */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-400 text-[11px]">Copy & Launch directly in:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onOpenGmailModal(promptTitle, displayedText || promptText)}
            className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-950/40 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-900/60 transition-colors"
          >
            <Mail className="h-3 w-3 text-red-400" />
            <span>Gmail Draft</span>
          </button>
          <button
            onClick={() => handleOpenModel('https://chatgpt.com', 'ChatGPT')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>ChatGPT</span>
            <ExternalLink className="h-3 w-3 text-indigo-400" />
          </button>
          <button
            onClick={() => handleOpenModel('https://claude.ai', 'Claude')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Claude</span>
            <ExternalLink className="h-3 w-3 text-indigo-400" />
          </button>
          <button
            onClick={() => handleOpenModel('https://gemini.google.com', 'Gemini')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Gemini</span>
            <ExternalLink className="h-3 w-3 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Prompt Stats & Save Footer */}
      <div className="border-t border-slate-800 bg-slate-950/90 p-3.5 space-y-2.5">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-3 text-[11px]">
            <span>
              <strong className="text-white font-semibold">{wordCount}</strong> Words
            </span>
            <span>
              <strong className="text-white font-semibold">{charCount}</strong> Chars
            </span>
            <span>
              <strong className="text-white font-semibold">~{estTokens}</strong> Tokens
            </span>
          </div>

          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Editable Output</span>
        </div>

        {/* Save Prompt Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={promptTitle}
            onChange={(e) => setPromptTitle(e.target.value)}
            placeholder="Prompt Title..."
            className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
          <button
            onClick={handleSave}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              tier === 'pro'
                ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
            <span>{tier === 'pro' ? 'Save to History' : 'Save (Pro)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


