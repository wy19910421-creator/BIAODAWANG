import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from './Button';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

let toastId = 0;
const listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function emitChange() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  success: (message: string) => {
    const id = String(++toastId);
    toasts = [...toasts, { id, type: 'success', message }];
    emitChange();
    setTimeout(() => toast.dismiss(id), 3000);
  },
  error: (message: string) => {
    const id = String(++toastId);
    toasts = [...toasts, { id, type: 'error', message }];
    emitChange();
    setTimeout(() => toast.dismiss(id), 3000);
  },
  warning: (message: string) => {
    const id = String(++toastId);
    toasts = [...toasts, { id, type: 'warning', message }];
    emitChange();
    setTimeout(() => toast.dismiss(id), 3000);
  },
  info: (message: string) => {
    const id = String(++toastId);
    toasts = [...toasts, { id, type: 'info', message }];
    emitChange();
    setTimeout(() => toast.dismiss(id), 3000);
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();
  },
};

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      const index = listeners.indexOf(setCurrentToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    warning: <AlertTriangle className="w-5 h-5 text-warningYellow" />,
    info: <AlertTriangle className="w-5 h-5 text-accent" />,
  };

  const backgrounds = {
    success: 'bg-success/10 border-success',
    error: 'bg-error/10 border-error',
    warning: 'bg-warningYellow/10 border-warningYellow',
    info: 'bg-accent/10 border-accent',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-down bg-white min-w-[300px]',
            backgrounds[t.type]
          )}
        >
          {icons[t.type]}
          <span className="flex-1 text-sm font-medium text-gray-800">{t.message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
