// src/contexts/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { IAccount } from "../models/account";
import { fetchLogin, fetchLogout, getStorage, tokenValidate } from "../services/authService";
import { ThrowError } from "../Error/ThrowError";

interface AuthContextType {
    account: IAccount | null;
    token: string | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAccount() {
            try {
                const storedToken = getStorage("auth_token");
                if (storedToken) {
                    const account = await tokenValidate();
                    setAccount(account);
                }
            } catch (error: any) {
                if (error instanceof ThrowError) {
                    if (error.statusCode === 401) {
                        logout();
                        return;
                    }
                }
                throw Error(error?.message || "Erro ao validar token");
            }
        }
        fetchAccount();
    }, []);

    const login = async (email: string, password: string) => {
        const credentials = await fetchLogin(email, password);
        if (credentials.token && credentials.account) {
            setToken(credentials.token);
            setAccount(credentials.account);
        }
    };

    const logout = () => {
        setAccount(null);
        setToken(null);
        fetchLogout();
    };

    return (
        <AuthContext.Provider value={{ account: account, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
