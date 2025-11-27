import React from "react";
import styled, { keyframes } from "styled-components";
import { FaExclamationTriangle, FaRedo, FaHome, FaBug } from "react-icons/fa";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
    error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Erro capturado pelo ErrorBoundary:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorDisplay />;
        }

        return this.props.children;
    }
}

function ErrorDisplay() {
    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <ErrorContainer>
            <ErrorContent>
                <ErrorIconContainer>
                    <ErrorIcon>
                        <FaExclamationTriangle />
                    </ErrorIcon>
                    <ErrorIconGlow />
                </ErrorIconContainer>
                
                <ErrorHeader>
                    <ErrorTitle>Oops! Algo deu errado</ErrorTitle>
                    <ErrorSubtitle>Erro inesperado detectado</ErrorSubtitle>
                </ErrorHeader>

                <ErrorMessage>
                    <p>
                        Encontramos um problema inesperado. Não se preocupe, isso pode ser temporário.
                    </p>
                    <p>
                        Tente atualizar a página ou voltar para a página inicial.
                    </p>
                </ErrorMessage>

                <ErrorActions>
                    <PrimaryErrorButton onClick={handleReload}>
                        <FaRedo size={18} />
                        <span>Atualizar Página</span>
                    </PrimaryErrorButton>
                    <SecondaryErrorButton onClick={handleGoHome}>
                        <FaHome size={18} />
                        <span>Ir para Início</span>
                    </SecondaryErrorButton>
                </ErrorActions>

                <ErrorFooter>
                    <ErrorHelpText>
                        <FaBug size={14} />
                        <span>Se o problema persistir, entre em contato com o suporte</span>
                    </ErrorHelpText>
                </ErrorFooter>
            </ErrorContent>
            
            <ErrorBackgroundPattern />
        </ErrorContainer>
    );
}

const pulse = keyframes`
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
`;

const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
`;

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const glow = keyframes`
    0%, 100% {
        box-shadow: 0 0 20px rgba(182, 72, 160, 0.3);
    }
    50% {
        box-shadow: 0 0 40px rgba(182, 72, 160, 0.6);
    }
`;

const ErrorContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    background: linear-gradient(135deg, 
        ${({ theme }) => theme?.colors?.quarternary || "rgba(44, 39, 43, 0.98)"} 0%, 
        ${({ theme }) => theme?.colors?.quinary || "rgba(54, 49, 53, 0.95)"} 50%,
        ${({ theme }) => theme?.colors?.quarternary || "rgba(44, 39, 43, 0.98)"} 100%
    );
    padding: 2rem;
    overflow: hidden;
`;

const ErrorBackgroundPattern = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100%;
    background-image: 
        radial-gradient(circle at 20% 50%, rgba(182, 72, 160, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(182, 72, 160, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(182, 72, 160, 0.05) 0%, transparent 50%);
    pointer-events: none;
`;

const ErrorContent = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 600px;
    width: 100%;
    gap: 2rem;
    background: linear-gradient(135deg, 
        rgba(97, 71, 92, 0.3) 0%, 
        rgba(54, 49, 53, 0.4) 100%
    );
    border: 2px solid rgba(182, 72, 160, 0.3);
    border-radius: 24px;
    padding: 3.5rem 2.5rem;
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    backdrop-filter: blur(20px);
    animation: ${slideIn} 0.6s ease-out;

    @media (max-width: 768px) {
        padding: 2.5rem 1.5rem;
        gap: 1.5rem;
        border-radius: 20px;
    }
`;

const ErrorIconContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
`;

const ErrorIcon = styled.div`
    position: relative;
    z-index: 2;
    color: ${({ theme }) => theme?.colors?.primary || "#B648A0"};
    font-size: 5rem;
    animation: ${float} 3s ease-in-out infinite;
    filter: drop-shadow(0 4px 12px rgba(182, 72, 160, 0.4));

    @media (max-width: 768px) {
        font-size: 4rem;
    }
`;

const ErrorIconGlow = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(182, 72, 160, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
    z-index: 1;

    @media (max-width: 768px) {
        width: 100px;
        height: 100px;
    }
`;

const ErrorHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ErrorTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin: 0;
    background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const ErrorSubtitle = styled.p`
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

const ErrorMessage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    p {
        font-size: 1.05rem;
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
        line-height: 1.7;
        
        &:first-child {
            font-weight: 500;
        }
    }

    @media (max-width: 768px) {
        p {
            font-size: 0.95rem;
        }
    }
`;

const ErrorActions = styled.div`
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    margin-top: 0.5rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.75rem;
    }
`;

const baseErrorButton = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    flex: 1;
    white-space: nowrap;
    position: relative;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }

    &:hover::before {
        left: 100%;
    }

    svg {
        flex-shrink: 0;
    }

    @media (max-width: 480px) {
        padding: 0.875rem 1.5rem;
        font-size: 0.95rem;
    }
`;

const PrimaryErrorButton = styled.button`
    ${baseErrorButton}
    background: linear-gradient(135deg, 
        ${({ theme }) => theme?.colors?.primary || "#B648A0"} 0%, 
        rgba(182, 72, 160, 0.85) 100%
    );
    color: white;
    box-shadow: 0 4px 16px rgba(182, 72, 160, 0.4);
    animation: ${glow} 2s ease-in-out infinite;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(182, 72, 160, 0.6);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

const SecondaryErrorButton = styled.button`
    ${baseErrorButton}
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

const ErrorFooter = styled.div`
    margin-top: 0.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
`;

const ErrorHelpText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    
    svg {
        opacity: 0.6;
    }
`;
