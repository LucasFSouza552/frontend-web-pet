import api from "@api/http";
import type { IAccount } from "@/shared/models/Account";
import { removeStorage, saveStorage } from "@utils/storageUtils";

export const authService = {
    async login(email: string, password: string) {
        try {
            const response = await api.post("/auth/login", { email, password });
            const token = response.data?.token;
            if (!token) {
                throw Error("Falha ao realizar login");
            }
            await saveStorage("@token", token);
        } catch (error) {
            throw error;
        }
    },

    async register(data: IAccount) {
        try {
            const response = await api.post("/auth/register", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async forgotPassword(email: string) {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(token: string) {
        try {
            const response = await api.post("/auth/reset-password", { token });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async changePassword(currentPassword: string, newPassword: string) {
        try {
            const response = await api.put("/auth/change-password", { newPassword, currentPassword });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async verifyEmail(token: string) {
        try {
            const response = await api.post(`/auth/verify-email?token=${token}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async resendVerification() {
        try {
            const response = await api.post("/auth/resend-verify-email");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async fetchLogout() {
        removeStorage("@token");
    }
}