import { ProfileContext } from "@contexts/ProfileContext";
import { useContext, useState } from "react";
import { petService } from "../petService";

export function usePetInteractionController() {
    const { loadFeed } = useContext(ProfileContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLikePet(petId: string) {
        try {
            setLoading(true);
            await petService.likePet(petId);
            setError(null);
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDislikePet(petId: string) {
        try {
            setLoading(true);
            await petService.dislikePet(petId);
            setError(null);
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // TODO: Implement sponsor pet
    // async function handleSponsor(petId: string, amount: number) {
    //     try {
    //         setLoading(true);
    //         const response = await petService.sponsorPet(petId, amount);
    //         setError(null);
    //         const width = 1000;
    //         const height = 1100;
    //         const left = (window.innerWidth - width) / 2;
    //         const top = (window.innerHeight - height) / 2;

    //         window.open(
    //             response.url,
    //             "MercadoPago",
    //             `width=${width},height=${height},top=${top},left=${left}`
    //         );

    //     } catch (err: any) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return { handleLikePet, handleDislikePet, loading, error };
}