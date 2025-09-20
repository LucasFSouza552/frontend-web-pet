// src/contexts/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { IAccount } from "../models/account";
import { fetchLogin, fetchLogout, getStorage } from "../services/authService";

interface AuthContextType {
    user: IAccount | null;
    token: string | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IAccount | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = getStorage("auth_token");
        const storedUser = getStorage("account_data");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, [])

    const login = async (email: string, password: string) => {
        const credentials = await fetchLogin(email, password);
        setToken(credentials.token);
        setUser(credentials.user);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        fetchLogout();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
