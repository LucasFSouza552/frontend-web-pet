import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "@api/authService";

export const useValidateEmailController = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const validateEmail = async () => {
            if (!token) {
                setError("Token inválido ou expirado");
                setLoading(false);
                return;
            }

            try {
                await authService.verifyEmail(token);
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (err: any) {
                setError(err.message || "Erro ao validar email. O token pode ter expirado.");
            } finally {
                setLoading(false);
            }
        };

        validateEmail();
    }, [token]);

    return {
        loading,
        error,
        success,
    };
};

