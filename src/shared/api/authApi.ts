
import { ThrowError } from "../Error/throwError";
import type { IAccount } from "../models/Account";
import api from "./Http";

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

export async function forgotPassword(email: string): Promise<Object> {
    try {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw error;
    }
}

