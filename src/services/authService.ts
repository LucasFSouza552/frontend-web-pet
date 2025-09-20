import * as authApi from "../api/authApi";
import type { IAccount } from "../models/account";

export function saveStorage(key: string, token: string) {
    localStorage.setItem(key, token);
}

export function getStorage(key: string): string | null {
    return localStorage.getItem(key);
}

export function removeStorage(key: string) {
    localStorage.removeItem(key);
}

export async function fetchLogin(email: string, password: string): Promise<{ user: IAccount, token: string }> {
    const { token, user } = await authApi.login(email, password);
    saveStorage("auth_token", token);
    saveStorage("account_data", JSON.stringify(user));
    return { user, token };
}

export async function fetchLogout() {
    removeStorage("auth_token");
    removeStorage("account_data");
}

export async function getLoggedUser(): Promise<IAccount | null> {
    try {
        return await authApi.getProfile();
    } catch (error) {
        return null;
    }
}