import api from "./http";
import type { IAccount } from "../models/Account";

export const accountService = {
    async fetchFeed() {
        try {
            const response = await api.get(`/account/feed`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async searchAccount() {
        try {
            const response = await api.get(`/account/search`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async updateAccount(IAccount: IAccount) {
        try {
            const response = await api.patch("/account", IAccount);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchAccountById(id: string) {
        try {
            const response = await api.get(`/account/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchMyProfile(): Promise<IAccount> {
        try {
            const response = await api.get("/account/profile/me");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async uploadAvatar(file: string) {
        try {
            const response = await api.put("/account/avatar", file);
            return response.data;
        } catch (error) {
            throw error
        }
    },
    async adminFetchAllAccounts() {
        try {
            const response = await api.get("/account");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async adminCreateAccount(data: IAccount) {
        try {
            const response = await api.post("/account", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async adminUpdateAccount(id: string, data: IAccount) {
        try {
            const response = await api.patch(`/account/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async adminRemoveAccount(id: string) {
        try {
            const response = await api.delete(`/account/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchAccountStatusById(id: string) {
        try {
            const response = await api.get(`/account/${id}/status`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchMyPosts() {
        try {
            const response = await api.get("/post/my-posts");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchAccountByName(name: string) {
        try {
            const response = await api.get(`/account/search?name=${name}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async donateToInstitution(institutionId: string, amount: number) {
        try {
            const response = await api.post(`/account/${institutionId}/donate`, { amount });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

