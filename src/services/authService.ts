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

export async function tokenValidate() {
    try {
        const account = await authApi.getProfile();
        saveStorage("account_data", JSON.stringify(account));
        return account;
    } catch (error: any) {
        console.log(error);
        throw Error(error?.message);
    }
}

export async function fetchLogin(email: string, password: string): Promise<{ account: IAccount, token: string }> {
    try {
        const { token, account } = await authApi.login(email, password);
        if (token && account) {
            saveStorage("auth_token", token);
            saveStorage("account_data", JSON.stringify(account));
        }
        return { account, token };
    } catch (error: any) {
        throw Error(error.message)
    }
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