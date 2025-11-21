import { ProfileContext } from "@contexts/ProfileContext";
import { useContext, useState } from "react";
import { petService } from "../petService";
import { useToast } from "@contexts/ToastContext";

export function usePetInteractionController() {
    const { loadFeed } = useContext(ProfileContext);
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLikePet(petId: string) {
        try {
            setLoading(true);
            await petService.likePet(petId);
            setError(null);
            showSuccess("Você curtiu este pet!");
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
            showError(err.message || "Erro ao curtir pet");
        } finally {
            setLoading(false);
        }
    }

    async function handleDislikePet(petId: string) {
        try {
            setLoading(true);
            await petService.dislikePet(petId);
            setError(null);
            showSuccess("Você não curtiu este pet!");
            await loadFeed();
        } catch (err: any) {
            setError(err.message);
            showError(err.message || "Erro ao descurtir pet");
        } finally {
            setLoading(false);
        }
    }

    return { handleLikePet, handleDislikePet, loading, error };
}