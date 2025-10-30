import { rejectPetAdoption, requestPetAdoption, sponsor as sponsorPet } from "../../shared/api/petApi";

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

    async sponsor(petId: string) {
        try {
            const result = await sponsorPet(petId);
            return result;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Erro ao apadrinhar o pet");
        }
    },
};


