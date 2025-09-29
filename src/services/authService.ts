import * as authApi from "../api/authApi";
import type { IAccount } from "../models/account";
import { removeStorage, saveStorage } from "../utils/storageUtils";

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

export async function authenticateUser(email: string, password: string): Promise<string> {
    try {
        const { token } = await authApi.login(email, password);
        if (!token) {
            throw Error("Falha ao realizar login");
        }
        saveStorage("auth_token", token);
        return token;
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