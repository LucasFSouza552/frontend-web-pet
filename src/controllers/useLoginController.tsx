import { useState } from "react";
import { fetchLogin } from "../services/authService";

export default function useLoginController() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (key: string, value: string) => {
        setCredentials(prev => ({ ...prev, [key]: value }));
    };

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            return await fetchLogin(credentials.email, credentials.password);
        } catch (error: any) {
            setError(error?.message);
        }
    }

    return {
        credentials,
        error,
        handleChange,
        handleLogin
    }
}