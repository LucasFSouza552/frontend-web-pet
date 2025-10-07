
import { ThrowError } from "../Error/ThrowError";
import type { IAccount } from "../models/account";
import api from "./http";

export interface LoginResponse {
    token: string;
    account: IAccount;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const { data } = await api.post("/auth/login", { email, password });
        return data;
    } catch (error: any) {
        if (error?.response)
            throw new ThrowError(error?.response?.status, error?.response?.data?.error);

        throw error;
    }
}

export async function getProfile(): Promise<IAccount> {
    try {
        const response = await api.get("/account/profile/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}