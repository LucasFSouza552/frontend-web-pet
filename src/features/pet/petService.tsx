import { rejectPetAdoption, requestPetAdoption } from "../../shared/api/petApi";

export const petService = {
    async requestAdoption(petId: string) {
        try {
            const result = await requestPetAdoption(petId);
            return result;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Erro ao solicitar adoção");
        }
    },

    async rejectAdoption(petId: string) {
        try {
            const result = await rejectPetAdoption(petId);
            return result;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Erro ao solicitar adoção");
        }
    },
};


