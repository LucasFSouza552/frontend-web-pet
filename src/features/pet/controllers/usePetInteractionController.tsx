import { useContext, useState } from "react";
import { petService } from "../PetService";
import { ProfileContext } from "../../profile/ProfileContext";

export function usePetInteractionController() {
    const { loadFeed } = useContext(ProfileContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleRequestAdoption(petId: string) {
        try {
            setLoading(true);
            await petService.requestAdoption(petId);
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
            await petService.rejectAdoption(petId);
            setError(null);
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSponsor(petId: string) {
        try {
            setLoading(true);
            await petService.sponsor(petId);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { handleRequestAdoption, handleRejectAdoption, handleSponsor, loading, error };
}