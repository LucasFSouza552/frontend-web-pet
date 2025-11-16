import api from "./http";
import type { IAccount } from "../models/Account";
import { ThrowError } from "../Error/ThrowError";

export const accountService = {
    async fetchFeed() {
        try {
            const response = await api.get(`/account/feed`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar feed");
        }
    },
    async searchAccount() {
        try {
            const response = await api.get(`/account/search`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar conta");
        }
    },
    async updateAccount(IAccount: IAccount) {
        try {
            const response = await api.patch("/account", IAccount);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar atualizar conta");
        }
    },
    async fetchAccountById(id: string) {
        try {
            const response = await api.get(`/account/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar conta por id");
        }
    },
    async fetchMyProfile(): Promise<IAccount> {
        try {
            const response = await api.get("/account/profile/me");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar perfil");
        }
    },
    async uploadAvatar(file: string) {
        try {
            const response = await api.put("/account/avatar", file);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar atualizar avatar");
        }
    },

    async adminCreateAccount(data: IAccount) {
        try {
            const response = await api.post("/account", data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar criar conta");
        }
    },
    async adminUpdateAccount(id: string, data: IAccount) {
        try {
            const response = await api.patch(`/account/${id}`, data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async adminRemoveAccount(id: string) {
        try {
            const response = await api.delete(`/account/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async fetchAccountStatusById(id: string) {
        try {
            const response = await api.get(`/account/${id}/status`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async fetchMyPosts() {
        try {
            const response = await api.get("/post/my-posts");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async fetchAccountByName(name: string) {
        try {
            const response = await api.get(`/account/search?name=${name}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async donate(amount: number) {
        try {
            const response = await api.post(`/account/donate`, { amount });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar doar para o pet");
        }
    },
    async sponsorPet(petId: string, amount: number) {
        try {
            const response = await api.post(`/account/pets/${petId}/sponsor`, { amount });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar apadrinhar pet");
        }
    }
}

