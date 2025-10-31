import { IAccount } from "../models/Account";
import api from "./Http";


export async function getFeed() {
    try {
        const response = await api.get(`/account/feed`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function searchAccount() {
    try {
        const response = await api.get(`/account/search`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProfile(IAccount: IAccount) {
    try {
        const response = await api.patch("/", IAccount);
        return response.data;
    } catch (error) {
        throw error;
    }
}

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


export async function getInteractionsPet() {
    try {
        const response = await api.get("/interaction");
        return response.data;
    } catch (error) {
        throw error
    }
}