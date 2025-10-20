import * as accountApi from "../../shared/api/accountApi";

export async function fetchAccountById(accountId: string) {
    try {
        const response = await accountApi.getAccountById(accountId);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchStatusProfile(accountId: string) {
    try {
        const response = await accountApi.getStatusProfile(accountId);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchFeed() {
    try {
        const response = await accountApi.getFeed();
        return response;
    } catch (error) {
        throw error;
    }
}