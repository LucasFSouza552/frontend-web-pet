import { useEffect } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";
import { useToast, type Toast as ToastType } from "@contexts/ToastContext";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <ToastWrapper>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </ToastWrapper>
    );
}

function ToastItem({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(onClose, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration, onClose]);

    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <FaCheckCircle />;
            case "error":
                return <FaExclamationTriangle />;
            case "warning":
                return <FaExclamationTriangle />;
            case "info":
                return <FaInfoCircle />;
            default:
                return <FaInfoCircle />;
        }
    };

    const handleAction = () => {
        if (toast.action) {
            toast.action.onClick();
            onClose();
        }
    };

    return (
        <Toast $type={toast.type}>
            <IconWrapper $type={toast.type}>{getIcon()}</IconWrapper>
            <Message>{toast.message}</Message>
            {toast.action && (
                <ActionButton onClick={handleAction} $type={toast.type}>
                    {toast.action.label}
                </ActionButton>
            )}
            <CloseButton onClick={onClose} aria-label="Fechar">
                <FaTimes />
            </CloseButton>
        </Toast>
    );
}

const ToastWrapper = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
    max-width: 400px;
    width: 100%;

    @media (max-width: 768px) {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
`;

const Toast = styled.div<{ $type: string }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    pointer-events: auto;
    animation: slideIn 0.3s ease-out;
    min-width: 300px;
    border: 2px solid
        ${({ $type, theme }) => {
            switch ($type) {
                case "success":
                    return theme?.colors?.primary || "#B648A0";
                case "error":
                    return "#ef665b";
                case "warning":
                    return "#ffa726";
                case "info":
                    return "#42a5f5";
                default:
                    return theme?.colors?.primary || "#B648A0";
            }
        }};
    background: ${({ $type, theme }) => {
        switch ($type) {
            case "success":
                return `${theme?.colors?.quarternary || "rgba(54, 49, 53, 0.95)"}`;
            case "error":
                return "rgba(239, 101, 91, 0.15)";
            case "warning":
                return "rgba(255, 167, 38, 0.15)";
            case "info":
                return "rgba(66, 165, 245, 0.15)";
            default:
                return `${theme?.colors?.quarternary || "rgba(54, 49, 53, 0.95)"}`;
        }
    }};

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        padding: 14px 16px;
        border-radius: 10px;
    }
`;

const IconWrapper = styled.div<{ $type: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: ${({ $type, theme }) => {
        switch ($type) {
            case "success":
                return theme?.colors?.primary || "#B648A0";
            case "error":
                return "#ef665b";
            case "warning":
                return "#ffa726";
            case "info":
                return "#42a5f5";
            default:
                return theme?.colors?.primary || "#B648A0";
        }
    }};
    font-size: 20px;
`;

const Message = styled.span`
    flex: 1;
    color: white;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    word-wrap: break-word;
`;

const ActionButton = styled.button<{ $type: string }>`
    flex-shrink: 0;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid
        ${({ $type, theme }) => {
            switch ($type) {
                case "success":
                    return theme?.colors?.primary || "#B648A0";
                case "error":
                    return "#ef665b";
                case "warning":
                    return "#ffa726";
                case "info":
                    return "#42a5f5";
                default:
                    return theme?.colors?.primary || "#B648A0";
            }
        }};
    color: ${({ $type, theme }) => {
        switch ($type) {
            case "success":
                return theme?.colors?.primary || "#B648A0";
            case "error":
                return "#ef665b";
            case "warning":
                return "#ffa726";
            case "info":
                return "#42a5f5";
            default:
                return theme?.colors?.primary || "#B648A0";
        }
    }};
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
        background: ${({ $type, theme }) => {
            switch ($type) {
                case "success":
                    return `${theme?.colors?.primary || "#B648A0"}20`;
                case "error":
                    return "rgba(239, 101, 91, 0.2)";
                case "warning":
                    return "rgba(255, 167, 38, 0.2)";
                case "info":
                    return "rgba(66, 165, 245, 0.2)";
                default:
                    return `${theme?.colors?.primary || "#B648A0"}20`;
            }
        }};
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
    border-radius: 4px;

    &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

