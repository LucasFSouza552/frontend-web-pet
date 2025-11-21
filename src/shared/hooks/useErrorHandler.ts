import { useCallback } from "react";
import { useToast } from "@contexts/ToastContext";
import { ThrowError } from "@Error/ThrowError";

export function useErrorHandler() {
    const { showError, showSuccess, showWarning, showInfo } = useToast();

    const handleError = useCallback(
        (error: unknown) => {
            let message = "Ocorreu um erro inesperado";

            if (error instanceof ThrowError) {
                message = error.message;
            } else if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "string") {
                message = error;
            } else if (error && typeof error === "object" && "message" in error) {
                message = String(error.message);
            }

            showError(message);
        },
        [showError]
    );

    return {
        handleError,
        showError,
        showSuccess,
        showWarning,
        showInfo,
    };
}

