import { createContext, useCallback, useEffect, useState } from "react";
import type { IAccount } from "../models/Account";

import type Pet from "@models/Pet";
import { accountService } from "../api/accountService";
import type { IAccountStatus } from "@models/accountStatus";
import { pictureService } from "../api/pictureService";
import { getStorage } from "../utils/storageUtils";

interface ProfileContextType {
    account: IAccount | null;
    viewedAccountStatus: IAccountStatus | null;
    loading: boolean;
    loadProfile: () => Promise<void>;
    loadFeed: () => Promise<Pet[]>;
    petFeed: Pet[];
    loadingFeed: boolean;
    hasMorePets: boolean;

    viewedAccount: IAccount | null;
    loadViewedProfile: (id: string) => Promise<void>;
    loadingViewedAccount: boolean;
}

export const ProfileContext = createContext({} as ProfileContextType);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {

    // Perfil
    const [account, setAccount] = useState<IAccount | null>(null);
    const [loading, setLoading] = useState(false);
    const [petFeed, setPetFeed] = useState<Pet[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(false);
    const [hasMorePets, setHasMorePets] = useState(true);

    // Conta visualizada
    const [viewedAccount, setViewedAccount] = useState<IAccount | null>(null);
    const [viewedAccountStatus, setViewedAccountStatus] = useState<IAccountStatus | null>(null);
    const [loadingViewedAccount, setLoadingViewedAccount] = useState(false);

    const loadProfile = useCallback(async () => {
        const token = getStorage("@token");
        if (!token) {
            return;
        }
        
        try {
            setLoading(true);
            const fetchAccount = await accountService.fetchMyProfile();
            if (!fetchAccount) {
                throw Error("Falha ao buscar perfil");
            }
            const avatarPicture = pictureService.fetchPicture(fetchAccount.avatar || "");
            fetchAccount.avatar = avatarPicture;
            setAccount(fetchAccount);
            const fetchStatus = await accountService.fetchAccountStatusById(fetchAccount.id);
            if (!fetchStatus) {
                throw Error("Falha ao buscar perfil");
            }
            setViewedAccountStatus(fetchStatus);
        } catch (error) {
            // Se falhar, limpa a conta (token pode estar inválido)
            setAccount(null);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = getStorage("@token");
        if (!account && !loading && token) {
            loadProfile();
        }
    }, [account, loading, loadProfile]);


    const loadFeed = useCallback(async () => {
        try {
            setLoadingFeed(true);
            const pets = await accountService.fetchFeed();
            if (pets === "") {
                setHasMorePets(false);
                setLoadingFeed(false);
                return null;
            }
            if (!pets) {
                throw Error("Falha ao buscar feed");
            }
            setHasMorePets(true);
            setPetFeed((prev) => [...prev, pets]);
            return pets;
        } catch (error) {

            setHasMorePets(false);
            throw error;
        } finally {
            setLoadingFeed(false);
        }
    }, []);

    const loadViewedProfile = useCallback(async (id: string) => {
        try {
            setLoadingViewedAccount(true);
            const fetchAccount = await accountService.fetchAccountById(id);
            if (!fetchAccount) {
                throw Error("Falha ao buscar perfil");
            }

            const avatarPicture = pictureService.fetchPicture(fetchAccount.avatar || "");
            fetchAccount.avatar = avatarPicture;

            setViewedAccount(fetchAccount);
            const fetchStatus = await accountService.fetchAccountStatusById(fetchAccount.id);
            if (!fetchStatus) {
                throw Error("Falha ao buscar perfil");
            }
            setViewedAccountStatus(fetchStatus);
        } catch (error) {
            throw error;
        } finally {
            setLoadingViewedAccount(false);
        }
    }, []);


    return (
        <ProfileContext.Provider value={{
            account,
            loadProfile,
            loading,
            loadFeed,
            petFeed,
            loadingFeed,
            hasMorePets,

            loadViewedProfile,
            viewedAccount,
            loadingViewedAccount,
            viewedAccountStatus,
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

function fetchInteractionByAccountId() {
    throw new Error("Function not implemented.");
}
