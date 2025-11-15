import { useState } from "react";
import { authService } from "@api/authService";

export const useForgotPasswordController = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [actualStep, setActualStep] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            await authService.forgotPassword(email);
            setActualStep(2);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        email,
        handleChange,
        handleSubmit,
        error,
        actualStep
    };
};