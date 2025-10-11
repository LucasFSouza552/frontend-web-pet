import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";

export default function useLoginController() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (key: string, value: string) => {
        setCredentials(prev => ({ ...prev, [key]: value }));
    };

    const { login } = useContext(AuthContext);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            const account = await login(credentials.email, credentials.password);

            setError("");
            navigate(`/profile/${account}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erro inesperado ao tentar logar.");
            }
        }
    }

    return {
        credentials,
        error,
        handleChange,
        handleLogin
    }
}