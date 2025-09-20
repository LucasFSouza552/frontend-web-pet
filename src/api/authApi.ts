import type { IAccount } from "../model/account";
import api from "./http";

export interface LoginResponse {
    token: string;
    user: IAccount;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
}

export async function getProfile(): Promise<IAccount> {
    const { data } = await api.get("/auth/profile");
    return data;
}
