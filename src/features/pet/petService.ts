import api from "../../shared/api/Http";
import { rejectPetAdoption, requestPetAdoption, sponsor } from "../../shared/api/PetActions";
import type IPet from "../../shared/models/Pet";

const petService = {
    async fetchPets() {
        const response = await api.get("/pets");
        return response.data;
    },
    async fetchPetById(petId: string) {
        const response = await api.get(`/pets/${petId}`);
        return response.data;
    },
    async createPet(data: IPet) {
        const response = await api.post("/pets", data);
        return response.data;
    },
    async updatePet(petId: string, data: Partial<IPet>) {
        const response = await api.put(`/pets/${petId}`, data);
        return response.data;
    },
    async deletePet(petId: string) {
        const response = await api.delete(`/pets/${petId}`);
        return response.data;
    },
    async availablePets() {
        const response = await api.get("/pets/available");
        return response.data;
    },
    async requestPetAdoption(petId: string) {
        const response = await requestPetAdoption(petId);
        return response.data;
    },
    async rejectPetAdoption(petId: string) {
        const response = await rejectPetAdoption(petId);
        return response.data;
    },
    async sponsorPet(petId: string, amount: number) {
        const response = await sponsor(petId, amount);
        return response.data;
    },
    async donate (amount: number) {
        const response = await api.post("/pets/donate", { amount });
        return response.data;
    },
    async updateImages(petId: string, images: string[]) {
        const response = await api.patch(`/pets/${petId}/images`, { images });
        return response.data;
    },
    async deleteImage(petId: string, imageUrl: string) {
        const response = await api.delete(`/pets/${petId}/images`, { data: { imageUrl } });
        return response.data;
    },
    async returnDonate(donationId: string) {
        const response = await api.post(`/pets/donate/${donationId}/return`);
        return response.data;
    }
};
export { petService };