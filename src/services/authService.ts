import * as authApi from "../api/authApi";
import type { IAccount } from "../model/account";

const TOKEN_KEY = "auth_token";

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<IAccount> {
    const { token, user } = await authApi.login(email, password);
    saveToken(token);

    return user;
}

export async function logout() {
    removeToken();
}

export async function getLoggedUser(): Promise<IAccount | null> {
    try {
        return await authApi.getProfile();
    } catch (error) {
        return null;
    }
}