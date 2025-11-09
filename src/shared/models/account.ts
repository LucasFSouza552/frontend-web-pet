import type IAddress from "../interfaces/IAddress";
import type { IAccountAchievement } from "./AccountAchievement";

export interface IAccount {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: "user" | "admin" | "institution";
    verified: boolean;
    address: IAddress;
    cpf?: string;
    cnpj?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
    achievements?: IAccountAchievement[]
    postCount?: number
}
