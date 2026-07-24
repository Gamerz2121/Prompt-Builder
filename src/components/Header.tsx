import React from 'react';
import { Sparkles, Crown, Bookmark, Zap, Mail } from 'lucide-react';
import { Tier } from '../types';

interface HeaderProps {
  tier: Tier;
  onOpenProModal: () => void;
  onOpenHistory: () => void;
  onOpenGmailModal: () => void;
  savedCount: number;
  onToggleTierDev: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tier,
  onOpenProModal,
  onOpenHistory,
  onOpenGmailModal,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 h-14">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
            <h1 className="text-base font-extrabold tracking-tight font-mono text-white">
              PROMPT<span className="text-indigo-400">STUDIO</span>
            </h1>
            {tier === 'pro' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20 shadow-xs">
                <Crown className="h-3 w-3 text-amber-400" /> PRO
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700">
                FREE
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Gmail Action Button */}
          <button
            onClick={onOpenGmailModal}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-white transition-all"
            title="Send or draft email via Gmail"
          >
            <Mail className="h-3.5 w-3.5 text-red-400" />
            <span>Gmail</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
            <span>Saved ({savedCount})</span>
          </button>

          {/* Go Pro CTA */}
          {tier === 'free' ? (
            <button
              onClick={onOpenProModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90 active:scale-98 transition-all shadow-md shadow-indigo-500/20"
            >
              <Crown className="h-3.5 w-3.5 text-amber-300" />
              <span>Upgrade to Pro</span>
            </button>
          ) : (
            <button
              onClick={onOpenProModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors"
            >
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Pro Active</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


