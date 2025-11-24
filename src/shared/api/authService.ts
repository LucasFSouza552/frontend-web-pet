import api from "@api/http";
import type { IAccount } from "@models/Account";
import { removeStorage, saveStorage } from "@utils/storageUtils";
import { ThrowError } from "../Error/ThrowError";

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
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar logar");
        }
    },

    async register(data: IAccount) {
        try {
            const response = await api.post("/auth/register", data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar registrar");
        }
    },

    async forgotPassword(email: string) {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar recuperar senha");
        }
    },

    async resetPassword(token: string, password: string) {
        try {
            const response = await api.post("/auth/reset-password", { token, password });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar resetar senha");
        }
    },

    async changePassword(currentPassword: string, newPassword: string) {
        try {
            const response = await api.put("/auth/change-password", { newPassword, currentPassword });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar alterar senha");
        }
    },

    async verifyEmail(token: string) {
        try {
            const response = await api.post(`/auth/verify-email?token=${token}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar verificar email");
        }
    },

    async resendVerification() {
        try {
            const response = await api.post("/auth/resend-verify-email");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar reenviar verificação");
        }
    },

    async fetchLogout() {
        removeStorage("@token");
    }
}