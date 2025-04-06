"use client";

import React, { createContext, useState, useCallback } from "react";
import { ToastContainer } from "@/components/ui/toast";
import { Toast, ToastType } from "@/hooks/useToast";

export interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration !== Infinity) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, "error", duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, "warning", duration);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, "info", duration);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
