import React from "react";

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
            return (
                <div style={{
                    background: "#1e1e1e",
                    color: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    textAlign: "center"
                }}>
                    <h2>Algo deu errado 😞</h2>
                    <p>Tente atualizar a página ou voltar mais tarde.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
