import { createContext, useState } from "react";
import type { IAccount } from "../../shared/models/Account";

import { fetchAccountById, fetchStatusProfile } from "./profileService";
import type { IAccountStatus } from "../../shared/models/accountStatus";

interface ProfileContextType {
    account: IAccount | null;
    accountStatus: IAccountStatus | null;
    loading: boolean;
    loadProfile: (accountId: string) => Promise<void>;
}

export const ProfileContext = createContext({} as ProfileContextType);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {

    const [account, setAccount] = useState<IAccount | null>(null);
    const [accountStatus, setAccountStatus] = useState<IAccountStatus | null>(null);
    const [loading, setLoading] = useState(false);


    const loadProfile = async (accountId: string) => {
        try {
            const fetchAccount = await fetchAccountById(accountId);
            if (!fetchAccount) {
                throw Error("Falha ao buscar perfil");
            }
            setAccount(fetchAccount);
            const fetchStatus = await fetchStatusProfile(accountId);
            if (!fetchStatus) {
                throw Error("Falha ao buscar perfil");
            }
            setAccountStatus(fetchStatus);
        } catch (error) {
            throw error;
        }
    }

    return (
        <ProfileContext.Provider value={{ account, loadProfile, loading, accountStatus }}>
            {children}
        </ProfileContext.Provider>
    )
}