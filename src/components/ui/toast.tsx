import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Toast as ToastType } from "@/hooks/useToast";

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration! - 500); // Start exit animation 500ms before removal

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // Match animation duration
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]";
      case "error":
        return "bg-[var(--error-bg)] text-[var(--error-text)] border-[var(--error-border)]";
      case "warning":
        return "bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]";
      case "info":
      default:
        return "bg-[var(--info-bg)] text-[var(--info-text)] border-[var(--info-border)]";
    }
  };

  return (
    <div
      className={cn(
        "max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border overflow-hidden",
        getToastStyles(),
        "transition-all duration-300 ease-in-out transform",
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed top-0 right-0 pt-16 px-4 pb-4 w-full md:max-w-sm z-50 flex flex-col items-end space-y-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
};
