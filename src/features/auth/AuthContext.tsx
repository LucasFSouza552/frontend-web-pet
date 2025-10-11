import { createContext, useEffect, useState, type ReactNode } from "react";
import type { IAccount } from "../../shared/models/account";
import { getStorage } from "../../shared/utils/storageUtils";
import { authenticateUser, fetchLogout, tokenValidate, AccountStatus } from "./authService";
import { ThrowError } from "../../shared/Error/ThrowError";
import type { IAccountStatus } from "../../shared/models/accountStatus";

interface AuthContextType {
    account: IAccount | null;
    token: string | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    setAccount: (account: IAccount | null) => void;
    loading: boolean;
    status: () => void;
    accountStatus: IAccountStatus | null;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [accountStatus, setAccountStatus] = useState<IAccountStatus | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAccount() {
            try {
                const storedToken = getStorage("auth_token");
                if (!storedToken) {
                    return;
                }
                const account = await tokenValidate();
                setAccount(account);
            } catch (error: any) {
                if (error instanceof ThrowError) {
                    if (error.statusCode === 401) {
                        logout();
                        return;
                    }
                }
                throw Error(error?.message || "Erro ao validar token");
            } finally {
                setLoading(false);
            }
        }
        fetchAccount();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const fetchToken = await authenticateUser(email, password);
            if (!fetchToken) {
                throw Error("Falha ao realizar login");
            }
            setToken(fetchToken);

            const fetchAccount = await tokenValidate();
            if (!fetchAccount) {
                throw Error("Falha ao validar token");
            }
            setAccount(fetchAccount);
        } catch (error) {
            throw error;
        }
    };

    const status = async () => {
        try {
            const fetchAccountStatus = await AccountStatus();
            if (!fetchAccountStatus) {
                throw Error("Falha ao validar token");
            }
            setAccountStatus(fetchAccountStatus);
        } catch (error) {
            throw error;
        }
    }


    const logout = () => {
        setAccount(null);
        setToken(null);

        fetchLogout();
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ account: account, token, login, logout, loading, setAccount, status, accountStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
