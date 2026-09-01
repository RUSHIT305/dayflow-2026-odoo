import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white shadow-lg shadow-emerald-500/5';
            case 'error':
              return 'border-rose-200 bg-white shadow-lg shadow-rose-500/5';
            case 'warning':
              return 'border-amber-200 bg-white shadow-lg shadow-amber-500/5';
            case 'info':
            default:
              return 'border-blue-200 bg-white shadow-lg shadow-blue-500/5';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${getBorderColor()} animate-in slide-in-from-bottom-3 duration-200`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-bold text-gray-900 leading-tight mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-gray-600 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
