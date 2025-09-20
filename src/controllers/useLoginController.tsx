import { useState } from "react";
import { login } from "../services/authService";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../components/PrimaryButton";

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    type?: string;
    setValue: (key: string, value: string) => void;
}

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
            return await login(credentials.email, credentials.password);

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