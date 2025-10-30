import api from "./http";


export async function getAccountById(accountId: string) {
    try {
        const response = await api.get(`/account/${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getStatusProfile(accountId: string) {
    try {
        const response = await api.get(`/account/${accountId}/status`);
        return response.data;
    } catch (error) {
        throw error;
    }

}

export async function getFeed() {
    try {
        const response = await api.get(`/account/feed`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getInteractionsPet() {
    try {
        const response = await api.get("/interaction");
        return response.data;
    } catch (error) {
        throw error
    }
}