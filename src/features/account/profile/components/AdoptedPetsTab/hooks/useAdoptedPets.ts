import { useState, useEffect, useCallback } from "react";
import { petService } from "@/features/pet/petService";
import type IPet from "@models/Pet";

export function useAdoptedPets(accountId?: string, accountRole?: "user" | "admin" | "institution") {
    const [adoptedPets, setAdoptedPets] = useState<IPet[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);

    const loadAdoptedPets = useCallback(async () => {
        if (!accountId) return;
        setLoadingPets(true);
        try {
            if (accountRole === "institution") {
                const pets = await petService.getAllByInstitution(accountId);
                setAdoptedPets(pets);
            } else {
                const pets = await petService.getAdoptedPetsByAccount(accountId);
                setAdoptedPets(pets);
            }
        } catch (error) {
            setAdoptedPets([]);
        } finally {
            setLoadingPets(false);
        }
    }, [accountId, accountRole]);

    useEffect(() => {
        if (accountId) {
            loadAdoptedPets();
        }
    }, [accountId, loadAdoptedPets]);

    return {
        adoptedPets,
        loadingPets,
        loadAdoptedPets
    };
}

