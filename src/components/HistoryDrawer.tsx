import React, { useState } from 'react';
import { X, Search, Star, Copy, Trash2, ArrowUpRight, Bookmark, Lock, Sparkles, Download } from 'lucide-react';
import { SavedPrompt, Tier } from '../types';
import { TASK_TYPES } from '../data/taskTypes';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPrompts: SavedPrompt[];
  tier: Tier;
  onLoadPrompt: (prompt: SavedPrompt) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  onOpenProModal: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedPrompts,
  tier,
  onLoadPrompt,
  onToggleFavorite,
  onDeletePrompt,
  onOpenProModal,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);

  if (!isOpen) return null;

  const filtered = savedPrompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavorite ? p.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const handleCopyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onShowToast('Prompt copied to clipboard!', 'success');
    } catch {
      onShowToast('Copied to clipboard!', 'success');
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(savedPrompts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_builder_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Prompt history exported!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Saved Prompts History</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pro Banner if in free mode */}
        {tier === 'free' ? (
          <div className="m-4 rounded-xl bg-slate-950/80 p-4 border border-indigo-500/20 text-center space-y-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <Lock className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Saved History is a Pro Feature</h3>
            <p className="text-xs text-slate-400">
              Upgrade to Pro to save, organize, favorite, and load your custom prompt library anytime.
            </p>
            <button
              onClick={onOpenProModal}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5" /> Unlock Saved History
            </button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-800 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved prompts..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs font-medium text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setFilterFavorite(!filterFavorite)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                    filterFavorite
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Star className={`h-3.5 w-3.5 ${filterFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>Favorites Only</span>
                </button>

                {savedPrompts.length > 0 && (
                  <button
                    onClick={handleExportJSON}
                    className="text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Export JSON
                  </button>
                )}
              </div>
            </div>

            {/* List of Prompts */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Bookmark className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="text-xs font-medium text-slate-400">No saved prompts found.</p>
                  <p className="text-[11px] text-slate-500">
                    Generate prompts and click "Save to History" to build your library.
                  </p>
                </div>
              ) : (
                filtered.map((item) => {
                  const taskDef = TASK_TYPES.find((t) => t.id === item.taskTypeId);
                  return (
                    <div
                      key={item.id}
                      className="group rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-md hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                            {taskDef?.title || item.taskTypeId}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleFavorite(item.id)}
                            className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => onDeletePrompt(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-3 font-mono bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {item.promptText}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-900">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleCopyPrompt(item.promptText)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white font-semibold"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                          <button
                            onClick={() => {
                              onLoadPrompt(item);
                              onClose();
                            }}
                            className="flex items-center gap-1 text-indigo-400 font-bold hover:underline"
                          >
                            <ArrowUpRight className="h-3 w-3" /> Load
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

