import React from 'react';
import { TASK_TYPES } from '../data/taskTypes';
import { TaskTypeId, Tier } from '../types';
import { Lock, Mail, FileText, Lightbulb, Code, Share2, PenTool, UserCheck, BarChart3, ChevronDown } from 'lucide-react';

interface TaskSelectorProps {
  selectedTaskId: TaskTypeId;
  onSelectTask: (taskId: TaskTypeId) => void;
  tier: Tier;
  onOpenProModal: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Mail: <Mail className="h-3.5 w-3.5" />,
  FileText: <FileText className="h-3.5 w-3.5" />,
  Lightbulb: <Lightbulb className="h-3.5 w-3.5" />,
  Code: <Code className="h-3.5 w-3.5" />,
  Share2: <Share2 className="h-3.5 w-3.5" />,
  PenTool: <PenTool className="h-3.5 w-3.5" />,
  UserCheck: <UserCheck className="h-3.5 w-3.5" />,
  BarChart3: <BarChart3 className="h-3.5 w-3.5" />,
};

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  selectedTaskId,
  onSelectTask,
  tier,
  onOpenProModal,
}) => {
  const selectedTask = TASK_TYPES.find((t) => t.id === selectedTaskId) || TASK_TYPES[0];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = e.target.value as TaskTypeId;
    const taskObj = TASK_TYPES.find((t) => t.id === taskId);
    if (taskObj?.isPro && tier === 'free') {
      onOpenProModal();
    } else {
      onSelectTask(taskId);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <span>Task Category / Type</span>
          <span className="font-normal text-slate-500">
            ({tier === 'free' ? '3 Free / 5 Pro' : 'All 8 Unlocked'})
          </span>
        </label>
        {tier === 'free' && (
          <button
            type="button"
            onClick={onOpenProModal}
            className="text-[11px] font-semibold text-amber-400 hover:underline flex items-center gap-1"
          >
            <Lock className="h-3 w-3" /> Unlock All Categories
          </button>
        )}
      </div>

      {/* Dropdown Selector */}
      <div className="relative">
        <select
          value={selectedTaskId}
          onChange={handleSelectChange}
          className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 p-2.5 pr-10 text-xs font-semibold text-slate-100 shadow-xs transition-all duration-200 hover:border-indigo-500/50 focus:border-indigo-500 focus:scale-[1.008] focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden"
        >
          {TASK_TYPES.map((task) => (
            <option
              key={task.id}
              value={task.id}
              disabled={task.isPro && tier === 'free'}
              className="bg-slate-900 text-slate-100"
            >
              {task.isPro && tier === 'free'
                ? `🔒 ${task.title} — ${task.description}`
                : `${task.title} — ${task.description}`}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
      </div>

      {/* Selected Task Details Card */}
      <div className="rounded-lg bg-slate-950/60 p-2.5 text-xs border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            {ICON_MAP[selectedTask.iconName] || <Mail className="h-3.5 w-3.5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-[12px]">{selectedTask.title}</span>
              {selectedTask.isPro ? (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                  PRO
                </span>
              ) : (
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.2 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  FREE
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400 truncate">
              {selectedTask.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

