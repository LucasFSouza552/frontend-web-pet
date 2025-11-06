import api from "@api/http";

export const petInteractionService = {
    async adminFetchPetInteraction(petId: string) {
        try {
            const response = await api.get(`/interaction/${petId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async fetchAccountPetsInteractions() {
        try {
            try {
                const response = await api.get(`/interaction`);
                return response.data;
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    },

    async createInteraction(petId: string, status: string) {
        try {
            const response = await api.post(`/interaction/${petId}`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateInteraction(status: string) {
        try {
            const response = await api.patch("/interaction", { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async undoInteraction(petId: string) {
        try {
            const response = await api.patch(`/interaction/${petId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async getInteractionByAccount(accountId: string) {
        try {
            const response = await api.get(`/interaction/profile/${accountId}`);
            return response.data;
        } catch (error) {
            throw error;

        }
    }

}