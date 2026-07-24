import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastState[];
  onDismiss: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between rounded-xl p-3.5 shadow-xl border text-xs font-semibold animate-slide-up transition-all ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-500/50'
              : 'bg-indigo-900 text-white border-indigo-500/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-indigo-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-3 text-slate-400 hover:text-white shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
