import { AuthContext } from "@/shared/contexts/AuthContext";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import { getStorage } from "@/shared/utils/storageUtils";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useLoginController() {
    const { login } = useContext(AuthContext);
    const { loadProfile } = useContext(ProfileContext);

    const navigate = useNavigate();
    
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
            const accountId = await login(credentials.email, credentials.password);
            console.log(getStorage("@token"))
            setError("");
            
            await loadProfile();
            navigate(`/profile/${accountId}`);
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