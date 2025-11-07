import { authService } from "@/shared/api/authService";
import { accountService } from "@/shared/api/accountService";
import { createContext, useState, type ReactNode } from "react";

interface AuthContextType {
    login: (email: string, password: string) => Promise<string>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            await authService.login(email, password);

            const fetchAccount = await accountService.fetchMyProfile();
            if (!fetchAccount) {
                throw Error("Falha ao validar token");
            }

            return fetchAccount.id;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        authService.fetchLogout();
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

