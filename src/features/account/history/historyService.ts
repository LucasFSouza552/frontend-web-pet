import api from "@api/http";

export const historyService = {
    async fetchAllHistories() {
        try {
            const response = await api.get("/history");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async fetchHistoryById(accountId: string) {
        try {
            const response = await api.get(`/history/:${accountId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async createHistory(data: any) {
        try {
            const response = await api.post("/history/", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateHistory(historyId: string, data: any) {
        try {
            const response = await api.patch(`/history/${historyId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteHistory(historyId: string) {
        try {
            const response = await api.delete(`/history/${historyId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async listHistoriesByAccount() {
        try {
            const response = await api.get(`/history/profile/me`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateHistoryStatus(historyId: string, status: string) {
        try {
            const response = await api.patch(`/history/status/${historyId}`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}