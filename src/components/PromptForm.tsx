import React from 'react';
import { TASK_TYPES, TEMPLATE_STYLES } from '../data/taskTypes';
import { PromptFormState, TaskTypeId, TemplateStyleId, Tier } from '../types';
import { Lock, Sparkles, Sliders, Layers, ArrowRight, ChevronDown } from 'lucide-react';

interface PromptFormProps {
  formState: PromptFormState;
  onChangeForm: (updated: Partial<PromptFormState>) => void;
  tier: Tier;
  onOpenProModal: () => void;
  onGenerate: () => void;
  freeGensUsed: number;
  maxFreeGens: number;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  formState,
  onChangeForm,
  tier,
  onOpenProModal,
  onGenerate,
  freeGensUsed,
  maxFreeGens,
}) => {
  const currentTask = TASK_TYPES.find((t) => t.id === formState.taskTypeId) || TASK_TYPES[0];
  const selectedTemplate = TEMPLATE_STYLES.find((s) => s.id === formState.templateStyle) || TEMPLATE_STYLES[0];

  const handleExtraInputChange = (key: string, value: string) => {
    onChangeForm({
      extraInputs: {
        ...formState.extraInputs,
        [key]: value,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onGenerate();
    }
  };

  const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const styleId = e.target.value as TemplateStyleId;
    const styleObj = TEMPLATE_STYLES.find((s) => s.id === styleId);
    if (styleObj?.isPro && tier === 'free') {
      onOpenProModal();
    } else {
      onChangeForm({ templateStyle: styleId });
    }
  };

  const remainingFreeGens = Math.max(0, maxFreeGens - freeGensUsed);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Prompt Inputs</h2>
        </div>
      </div>

      {/* Main Topic Field */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main Topic / Subject <span className="text-indigo-400">*</span>
        </label>
        <textarea
          rows={2}
          value={formState.topic}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChangeForm({ topic: e.target.value })}
          placeholder={currentTask.topicPlaceholder}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
        />
      </div>

      {/* Tone & Length Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Tone Field */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tone
          </label>
          <div className="relative">
            <select
              value={formState.tone}
              onChange={(e) => onChangeForm({ tone: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-hidden"
            >
              {currentTask.toneOptions.map((tone) => (
                <option key={tone} value={tone} className="bg-slate-900 text-slate-200">
                  {tone}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Target Length Field */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Prompt Length
          </label>
          <div className="relative">
            <select
              value={formState.length}
              onChange={(e) => onChangeForm({ length: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-hidden"
            >
              {currentTask.lengthOptions.map((lengthOpt) => (
                <option key={lengthOpt} value={lengthOpt} className="bg-slate-900 text-slate-200">
                  {lengthOpt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Dynamic Extra Fields specific to Task Type */}
      {currentTask.extraFields && currentTask.extraFields.length > 0 && (
        <div className="space-y-2.5 rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Task Specific Context
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {currentTask.extraFields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formState.extraInputs[field.key] ?? field.defaultValue ?? ''}
                    onChange={(e) => handleExtraInputChange(field.key, e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    rows={2}
                    value={formState.extraInputs[field.key] ?? ''}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleExtraInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
                  />
                ) : (
                  <input
                    type="text"
                    value={formState.extraInputs[field.key] ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onGenerate();
                    }}
                    onChange={(e) => handleExtraInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Audience & Constraints Grid (compact side by side) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Target Audience
          </label>
          <input
            type="text"
            value={formState.audience}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onGenerate();
            }}
            onChange={(e) => onChangeForm({ audience: e.target.value })}
            placeholder="e.g., Executives, developers..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Special Constraints
          </label>
          <input
            type="text"
            value={formState.constraints}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onGenerate();
            }}
            onChange={(e) => onChangeForm({ constraints: e.target.value })}
            placeholder="e.g., Avoid buzzwords..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Template Style Drop-Down Menu (Requested) */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            Template Style Architecture
          </label>
          {tier === 'free' && (
            <button
              type="button"
              onClick={onOpenProModal}
              className="text-[11px] font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              <Lock className="h-3 w-3" /> Unlock Pro Architectures
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <select
            value={formState.templateStyle}
            onChange={handleTemplateSelectChange}
            className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 p-2.5 pr-10 text-xs font-semibold text-slate-100 shadow-xs transition-all duration-200 hover:border-indigo-500/50 focus:border-indigo-500 focus:scale-[1.008] focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden"
          >
            {TEMPLATE_STYLES.map((style) => (
              <option
                key={style.id}
                value={style.id}
                disabled={style.isPro && tier === 'free'}
                className="bg-slate-900 text-slate-100"
              >
                {style.isPro && tier === 'free'
                  ? `🔒 ${style.name} — ${style.description.slice(0, 45)}...`
                  : `${style.name} — ${style.description.slice(0, 50)}...`}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Selected Template Description Card */}
        <div className="rounded-lg bg-slate-950/60 p-2.5 text-xs border border-slate-800/80 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-[12px]">{selectedTemplate.name}</span>
              {selectedTemplate.isPro ? (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                  PRO
                </span>
              ) : (
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.2 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  FREE
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
              {selectedTemplate.description}
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Generate Button */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-98 transition-all px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25"
        >
          <Sparkles className="h-4 w-4 fill-white" />
          <span>Generate Prompt Output</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          {tier === 'free' ? (
            <span className="font-medium text-slate-300 flex items-center gap-1">
              <span className={`inline-block h-2 w-2 rounded-full ${remainingFreeGens > 0 ? 'bg-indigo-400 animate-pulse' : 'bg-rose-500'}`} />
              {remainingFreeGens} of {maxFreeGens} free prompt generations left
            </span>
          ) : (
            <span className="font-semibold text-indigo-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Pro Tier: Unlimited Active
            </span>
          )}
          <span className="text-slate-500 font-mono">Press Ctrl+Enter</span>
        </div>
      </div>
    </div>
  );
};


