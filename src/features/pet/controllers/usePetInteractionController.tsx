import { ProfileContext } from "@/shared/contexts/ProfileContext";
import { useContext, useState } from "react";
import { petService } from "../petService";

export function usePetInteractionController() {
    const { loadFeed } = useContext(ProfileContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleRequestAdoption(petId: string) {
        try {
            setLoading(true);
            await petService.requestPetAdoption(petId);
            setError(null);
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRejectAdoption(petId: string) {
        try {
            setLoading(true);
            await petService.rejectPetAdoption(petId);
            setError(null);
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSponsor(petId: string, amount: number) {
        try {
            setLoading(true);
            const response = await petService.sponsorPet(petId, amount);
            setError(null);
            const width = 1000;
            const height = 1100;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;

            window.open(
                response.url,
                "MercadoPago",
                `width=${width},height=${height},top=${top},left=${left}`
            );

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { handleRequestAdoption, handleRejectAdoption, handleSponsor, loading, error };
}