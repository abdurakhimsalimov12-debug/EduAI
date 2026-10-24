import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = ++idCounter;
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  const toast = {
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
    info: (m) => show(m, 'info'),
  };

  const iconFor = { success: CheckCircle2, error: AlertTriangle, info: Info };
  const classFor = { success: 'alert-success', error: 'alert-error', info: 'alert-info' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((t) => {
          const I = iconFor[t.type];
          return (
            <div key={t.id} className={`alert ${classFor[t.type]} shadow-lg`}>
              <I size={18} />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast ToastProvider ichida ishlatilishi kerak');
  return ctx;
}
