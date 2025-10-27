import type { IAccount } from "../../shared/models/Account";
import * as authApi from "../../shared/api/authApi";
import { removeStorage, saveStorage } from "../../shared/utils/storageUtils";

export async function tokenValidate() {
    try {
        const account = await authApi.getProfile();
        if (!account) {
            throw Error("Falha ao validar token");
        }
        saveStorage("account_data", JSON.stringify(account));

        return account;
    } catch (error: any) {
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

export async function recoveryAccount(email: string): Promise<Object> {
    try {
        if(!email.trim()) {
            throw new Error("O e-mail deve ser preenchido.");
        }
        return await authApi.forgotPassword(email);
    } catch (error) {
        throw error;
    }
}

export async function AccountStatus() {
    try {
        return await authApi.getStatusProfile();
    } catch (error) {
        return null;
    }
}