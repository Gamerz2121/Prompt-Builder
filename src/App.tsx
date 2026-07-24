import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskSelector } from './components/TaskSelector';
import { PromptForm } from './components/PromptForm';
import { PromptPreview } from './components/PromptPreview';
import { ProModal } from './components/ProModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { GmailModal } from './components/GmailModal';
import { Toast, ToastState } from './components/Toast';

import { TASK_TYPES, assemblePrompt } from './data/taskTypes';
import {
  getStoredTier,
  saveTierStatus,
  activatePro,
  getSavedPrompts,
  savePromptToHistory,
  toggleFavoritePrompt,
  deleteSavedPrompt,
  getFreeGenerationsCount,
  incrementFreeGenerationsCount,
  MAX_FREE_GENERATIONS,
} from './data/storage';
import { PromptFormState, SavedPrompt, TaskTypeId, Tier } from './types';
import { Sparkles, Crown, ArrowRight, Sliders, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [tier, setTier] = useState<Tier>(getStoredTier());
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [gmailModalTitle, setGmailModalTitle] = useState('');
  const [gmailModalContent, setGmailModalContent] = useState('');

  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(getSavedPrompts());
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Navigation step state: 'inputs' | 'output'
  const [activeView, setActiveView] = useState<'inputs' | 'output'>('inputs');

  const handleOpenGmailModal = (title?: string, content?: string) => {
    const task = TASK_TYPES.find((t) => t.id === formState.taskTypeId);
    setGmailModalTitle(title || task?.title || 'Prompt Builder Output');
    setGmailModalContent(content || promptText);
    setIsGmailModalOpen(true);
  };

  // Free generation limit counter
  const [freeGensUsed, setFreeGensUsed] = useState<number>(getFreeGenerationsCount());

  // Form State
  const [formState, setFormState] = useState<PromptFormState>({
    taskTypeId: 'email',
    topic: '',
    tone: TASK_TYPES[0].defaultTone,
    length: TASK_TYPES[0].defaultLength,
    audience: '',
    constraints: '',
    templateStyle: 'basic',
    extraInputs: {},
  });

  // Assembled prompt text
  const [promptText, setPromptText] = useState<string>('');

  // Re-assemble prompt whenever formState changes
  useEffect(() => {
    const assembled = assemblePrompt(formState);
    setPromptText(assembled);
  }, [formState]);

  // Toast Notification Trigger
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Form update handler
  const handleFormChange = (updated: Partial<PromptFormState>) => {
    setFormState((prev) => {
      const next = { ...prev, ...updated };
      // If task type changed, set default tone/length if needed
      if (updated.taskTypeId && updated.taskTypeId !== prev.taskTypeId) {
        const newTask = TASK_TYPES.find((t) => t.id === updated.taskTypeId);
        if (newTask) {
          next.topic = '';
          next.tone = newTask.defaultTone;
          next.length = newTask.defaultLength;
          next.extraInputs = {};
        }
      }
      return next;
    });
  };

  // Select Task Type
  const handleSelectTask = (taskId: TaskTypeId) => {
    handleFormChange({ taskTypeId: taskId });
  };

  // Dev Toggle Tier
  const handleToggleTierDev = () => {
    const nextTier: Tier = tier === 'free' ? 'pro' : 'free';
    setTier(nextTier);
    saveTierStatus(nextTier);
    if (nextTier === 'free') {
      handleFormChange({ templateStyle: 'basic', taskTypeId: 'email' });
      showToast('Switched to FREE mode', 'info');
    } else {
      showToast('Switched to PRO mode! All task types & features unlocked.', 'success');
    }
  };

  // Generate Action (Transitions to Output Page or opens Pro modal if free limit reached)
  const handleGeneratePrompt = () => {
    if (tier === 'free' && freeGensUsed >= MAX_FREE_GENERATIONS) {
      showToast(`Free generation limit reached (${MAX_FREE_GENERATIONS}/${MAX_FREE_GENERATIONS}). Upgrade to Pro for unlimited access!`, 'error');
      setIsProModalOpen(true);
      return;
    }

    if (tier === 'free') {
      const newCount = incrementFreeGenerationsCount();
      setFreeGensUsed(newCount);
    }

    setActiveView('output');
    showToast('Assembling prompt real-time...', 'success');
  };

  // Activate Pro Tier on Payment
  const handleActivatePro = () => {
    const res = activatePro();
    if (res.success) {
      setTier('pro');
      showToast(res.message, 'success');
    }
    return res;
  };

  // Reset Tier
  const handleResetTier = () => {
    setTier('free');
    saveTierStatus('free');
    handleFormChange({ templateStyle: 'basic', taskTypeId: 'email' });
    showToast('Reset back to Free tier.', 'info');
  };

  // Save Prompt
  const handleSavePrompt = (title: string, customPromptText: string) => {
    const updated = savePromptToHistory(title, formState, customPromptText);
    setSavedPrompts(updated);
  };

  // Favorite Toggle
  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoritePrompt(id);
    setSavedPrompts(updated);
  };

  // Delete Prompt
  const handleDeletePrompt = (id: string) => {
    const updated = deleteSavedPrompt(id);
    setSavedPrompts(updated);
    showToast('Prompt removed from history.', 'info');
  };

  // Load Saved Prompt back into Builder
  const handleLoadSavedPrompt = (saved: SavedPrompt) => {
    if (saved.formState) {
      setFormState(saved.formState);
      setPromptText(saved.promptText);
      setActiveView('output');
      showToast(`Loaded "${saved.title}" into output!`, 'success');
    } else {
      setPromptText(saved.promptText);
      setActiveView('output');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        tier={tier}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGmailModal={() => handleOpenGmailModal()}
        savedCount={savedPrompts.length}
        onToggleTierDev={handleToggleTierDev}
      />

      {/* App Info & Stepped Navigation Banner */}
      <section className="border-b border-slate-800 bg-slate-900/80 py-3 shadow-md backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3 w-3" /> Prompt Studio
                </span>
                {tier === 'free' && (
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                    Free Limit: {Math.max(0, MAX_FREE_GENERATIONS - freeGensUsed)}/5 Left
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeView === 'inputs' ? '1. Configure Prompt Inputs' : '2. Real-Time Assembled Prompt Output'}
              </h2>
            </div>

            {/* View State Navigation / Action */}
            {activeView === 'output' && (
              <button
                onClick={() => setActiveView('inputs')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition-all shrink-0"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>← Back to Prompt Inputs</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Builder Views Area */}
      <main className="mx-auto max-w-5xl flex-1 px-4 sm:px-6 py-4 sm:py-6 w-full">
        {activeView === 'inputs' ? (
          /* PAGE 1: Prompt Inputs Page */
          <div className="space-y-4 animate-fade-in">
            {/* Task Type Selector */}
            <TaskSelector
              selectedTaskId={formState.taskTypeId}
              onSelectTask={handleSelectTask}
              tier={tier}
              onOpenProModal={() => setIsProModalOpen(true)}
            />

            {/* Prompt Form Configurator */}
            <PromptForm
              formState={formState}
              onChangeForm={handleFormChange}
              tier={tier}
              onOpenProModal={() => setIsProModalOpen(true)}
              onGenerate={handleGeneratePrompt}
              freeGensUsed={freeGensUsed}
              maxFreeGens={MAX_FREE_GENERATIONS}
            />
          </div>
        ) : (
          /* PAGE 2: Assembled Prompt Output Page */
          <div className="animate-fade-in min-h-[480px]">
            <PromptPreview
              promptText={promptText}
              formState={formState}
              onUpdatePromptText={(txt) => setPromptText(txt)}
              tier={tier}
              onSavePrompt={handleSavePrompt}
              onOpenProModal={() => setIsProModalOpen(true)}
              onOpenGmailModal={handleOpenGmailModal}
              onShowToast={showToast}
              onBackToInputs={() => setActiveView('inputs')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-4 mt-8 text-xs text-slate-400">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-400 font-mono tracking-wider">PROMPT BUILDER</span>
            <span className="text-slate-500">— Vibrant AI Prompt Studio</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => handleOpenGmailModal()}
              className="hover:text-red-400 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Gmail Integration</span>
            </button>
            <button
              onClick={() => setIsProModalOpen(true)}
              className="hover:text-indigo-400 font-semibold transition-colors"
            >
              Upgrade & Pro Access
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-indigo-400 font-semibold transition-colors"
            >
              Saved Prompts ({savedPrompts.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        tier={tier}
        onActivatePro={handleActivatePro}
        onResetTier={handleResetTier}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPrompts={savedPrompts}
        tier={tier}
        onLoadPrompt={handleLoadSavedPrompt}
        onToggleFavorite={handleToggleFavorite}
        onDeletePrompt={handleDeletePrompt}
        onOpenProModal={() => setIsProModalOpen(true)}
        onShowToast={showToast}
      />

      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        promptTitle={gmailModalTitle}
        promptContent={gmailModalContent}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

