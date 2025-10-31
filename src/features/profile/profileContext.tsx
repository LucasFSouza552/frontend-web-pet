import { createContext, useCallback, useState } from "react";
import type { IAccount } from "../../shared/models/Account";

import { fetchAccountById, fetchStatusProfile, fetchFeed } from "./ProfileService";
import type { IAccountStatus } from "../../shared/models/AccountStatus";
import type Pet from "../../shared/models/Pet";

interface ProfileContextType {
    account: IAccount | null;
    accountStatus: IAccountStatus | null;
    loading: boolean;
    loadProfile: (accountId: string) => Promise<void>;
    loadFeed: () => Promise<Pet[]>;
    petFeed: Pet[];
    loadingFeed: boolean;
    hasMorePets: boolean;
}

export const ProfileContext = createContext({} as ProfileContextType);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {

    const [account, setAccount] = useState<IAccount | null>(null);
    const [accountStatus, setAccountStatus] = useState<IAccountStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [petFeed, setPetFeed] = useState<Pet[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(false);
    const [hasMorePets, setHasMorePets] = useState(true);
    const [likedPets, setLikedPets] = useState([]);

    const loadInteractionsPet = async (accountId: string) => {
        try {
            const fetchInteractionsPet = await fetchInteractionByAccountId();
             
        } catch (error) {
            throw error;
        }
    }

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


    const loadFeed = useCallback(async () => {
        try {
            setLoadingFeed(true);
            const pets = await fetchFeed();
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
            console.log(pets);
            return pets;
        } catch (error) {

            setHasMorePets(false);
            throw error;
        } finally {
            setLoadingFeed(false);
        }
    }, []);


    return (
        <ProfileContext.Provider value={{
            account,
            loadProfile,
            loading,
            accountStatus,
            loadFeed,
            petFeed,
            loadingFeed,
            hasMorePets
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

function fetchInteractionByAccountId() {
    throw new Error("Function not implemented.");
}
