import api from "@api/http";
import { ThrowError } from "../Error/ThrowError";

export const historyService = {
    async fetchAllHistories() {
        try {
            const response = await api.get("/history");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar históricos");
        }
    },

    async fetchHistoryById(accountId: string) {
        try {
            const response = await api.get(`/history/:${accountId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar histórico por id");
        }
    },

    async createHistory(data: any) {
        try {
            const response = await api.post("/history", data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar criar histórico");
        }
    },

    async updateHistory(historyId: string, data: any) {
        try {
            const response = await api.patch(`/history/${historyId}`, data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar atualizar histórico");
        }
    },

    async deleteHistory(historyId: string) {
        try {
            const response = await api.delete(`/history/${historyId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar deletar histórico");
        }
    },

    async listHistoriesByAccount() {
        try {
            const response = await api.get(`/history/profile/me`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar históricos por conta");
        }
    },

    async updateHistoryStatus(historyId: string, status: string) {
        try {
            const response = await api.patch(`/history/status/${historyId}`, { status });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar atualizar status do histórico");
        }
    }
}