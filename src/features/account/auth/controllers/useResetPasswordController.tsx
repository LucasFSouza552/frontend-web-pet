import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "@api/authService";

export const useResetPasswordController = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPassword(value);
        setError(null);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setConfirmPassword(value);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Token inválido ou expirado");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return {
        password,
        confirmPassword,
        error,
        loading,
        success,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    };
};

