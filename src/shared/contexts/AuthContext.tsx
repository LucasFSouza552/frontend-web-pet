import { authService } from "@/shared/api/authService";
import { accountService } from "@/shared/api/accountService";
import { createContext, useState, type ReactNode } from "react";

interface AuthContextType {
    login: (email: string, password: string) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     async function fetchAccount() {
    //         try {
    //             const storedToken = getStorage("@token");
    //             if (!storedToken) {
    //                 return;
    //             }
    //             const account = await accountService.fetchMyProfile();
    //             if (!account) {
    //                 throw Error("Falha ao buscar perfil");
    //             }
    //         } catch (error: any) {
    //             if (error instanceof ThrowError) {
    //                 if (error.statusCode === 401) {
    //                     logout();
    //                     return;
    //                 }
    //             }
    //             throw Error(error?.message || "Erro ao validar token");
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchAccount();
    // }, []);

    const login = async (email: string, password: string) => {
        try {
            await authService.login(email, password);

            const fetchAccount = await accountService.fetchMyProfile();
            if (!fetchAccount) {
                throw Error("Falha ao validar token");
            }

            return fetchAccount.id;
        } catch (error) {
            throw error;
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

