import React from "react";
import styled from "styled-components";
import { FaExclamationTriangle } from "react-icons/fa";

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
    return (
        <ErrorContainer>
            <ErrorContent>
                <ErrorIcon>
                    <FaExclamationTriangle size={64} />
                </ErrorIcon>
                <ErrorTitle>Algo deu errado 😞</ErrorTitle>
                <ErrorMessage>
                    Ocorreu um erro inesperado. Por favor, tente atualizar a página ou volte mais tarde.
                </ErrorMessage>
                <ErrorButton onClick={() => window.location.reload()}>
                    Atualizar Página
                </ErrorButton>
            </ErrorContent>
        </ErrorContainer>
    );
}

const ErrorContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    background: rgba(54, 49, 53, 0.95);
    padding: 2rem;
`;

const ErrorContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 500px;
    gap: 1.5rem;
    background: rgba(97, 71, 92, 0.25);
    border: 2px solid #B648A0;
    border-radius: 20px;
    padding: 3rem 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
`;

const ErrorIcon = styled.div`
    color: #B648A0;
    margin-bottom: 0.5rem;
`;

const ErrorTitle = styled.h2`
    font-size: 2rem;
    font-weight: bold;
    color: white;
    margin: 0;
`;

const ErrorMessage = styled.p`
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.6;
`;

const ErrorButton = styled.button`
    background: #B648A0;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;
