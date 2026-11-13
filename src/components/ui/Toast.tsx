'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/** info = abu gelap (bawaan), ok = hijau, bad = merah (tampil lebih lama) */
type ToastKind = 'info' | 'ok' | 'bad';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: ReactNode;
}

interface ToastContextValue {
  /** Tampilkan toast. Hilang otomatis: 4,5 detik (7 detik untuk 'bad'). */
  showToast: (message: ReactNode, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Pakai di komponen client mana pun:
 *   const { showToast } = useToast();
 *   showToast(<>Welcome back, <b>Andi</b>.</>, 'ok');
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast harus dipakai di dalam <ToastProvider>.');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((now) => now.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: ReactNode, kind: ToastKind = 'info') => {
      const id = nextId.current++;
      setToasts((now) => [...now, { id, kind, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), kind === 'bad' ? 7000 : 4500),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const aktif = timers.current;
    return () => aktif.forEach((t) => clearTimeout(t));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast${t.kind === 'info' ? '' : ` ${t.kind}`}`}
            role={t.kind === 'bad' ? 'alert' : 'status'}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
