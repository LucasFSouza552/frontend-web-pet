import api from "@api/http";
import type IPet from "@models/Pet";

export const petService = {
    async adminFetchAllPets() {
        const response = await api.get("/pet");
        return response.data;
    },
    async institutionCreatePet(data: IPet) {
        const response = await api.post("/pet", data);
        return response.data;
    },
    async fetchPetById(petId: string) {
        const response = await api.get(`/pet/${petId}`);
        return response.data;
    },
    async updatePet(petId: string, data: Partial<IPet>) {
        const response = await api.patch(`/pet/${petId}`, data);
        return response.data;
    },
    async deletePet(petId: string) {
        const response = await api.delete(`/pet/${petId}`);
        return response.data;
    },
    async availablePets() {
        const response = await api.get("/pet/avaliable");
        return response.data;
    },
    async requestPetAdoption(petId: string) {
        const response = await api.post(`/pet/${petId}/request`);
        return response.data;
    },
    async acceptPetAdoption(petId: string, accountId: string) {
        const response = await api.post(`/pet/${petId}/accept`, {
            account: accountId
        });
        return response.data;
    },
    async rejectPetAdoption(petId: string) {
        const response = await api.post(`/pet/${petId}/reject`);
        return response.data;
    },
    async sponsorPet(petId: string, amount: number) {
        const response = await api.post(`/pet/${petId}/sponsor`, { amount });
        return response.data;
    },
    async donate (petId: string, amount: number) {
        const response = await api.post(`/pet/${petId}/donate`, { amount });
        return response.data;
    },
    async updateImages(petId: string, formData: FormData) {
        const response = await api.post(`/pet/${petId}/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },
    async deleteImage(petId: string, imageId: string) {
        const response = await api.delete(`/pet/${petId}/avatar/${imageId}`);
        return response.data;
    },
    async paymentReturn(paymentId: string, status: "completed" | "cancelled" | "refunded", externalReference: string) {
        const response = await api.post(`/pet/payment-return`, {
            id: paymentId,
            status,
            externalReference
        });
        return response.data;
    },
    async getAdoptedPetsByAccount(accountId: string) {
        const response = await api.get(`/pet/adopted/${accountId}`);
        return response.data;
    },
    async getAllByInstitution(institutionId: string) {
        const response = await api.get(`/pet/institutions/${institutionId}/pets`);
        return response.data;
    },
    async getRequestedAdoptions(institutionId: string) {
        const response = await api.get(`/pet/institutions/${institutionId}/pets/requested`);
        return response.data;
    }
};