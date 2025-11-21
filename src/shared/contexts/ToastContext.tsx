import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    action?: ToastAction;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, duration?: number, action?: ToastAction) => void;
    removeToast: (id: string) => void;
    showError: (message: string, action?: ToastAction) => void;
    showSuccess: (message: string, action?: ToastAction) => void;
    showWarning: (message: string, action?: ToastAction) => void;
    showInfo: (message: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "info", duration: number = 5000, action?: ToastAction) => {
            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newToast: Toast = { id, message, type, duration, action };

            setToasts((prev) => [...prev, newToast]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const showError = useCallback((message: string, action?: ToastAction) => {
        showToast(message, "error", 6000, action);
    }, [showToast]);

    const showSuccess = useCallback((message: string, action?: ToastAction) => {
        showToast(message, "success", 4000, action);
    }, [showToast]);

    const showWarning = useCallback((message: string, action?: ToastAction) => {
        showToast(message, "warning", 5000, action);
    }, [showToast]);

    const showInfo = useCallback((message: string, action?: ToastAction) => {
        showToast(message, "info", 4000, action);
    }, [showToast]);

    return (
        <ToastContext.Provider
            value={{
                toasts,
                showToast,
                removeToast,
                showError,
                showSuccess,
                showWarning,
                showInfo,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider");
    }
    return context;
}

