import type IAddress from "../interfaces/IAddress";

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
}
