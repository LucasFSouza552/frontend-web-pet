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

export class Account {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: "user" | "admin" | "institution";;
    verified: boolean;
    address: IAddress;
    cpf?: string;
    cnpj?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(data: IAccount) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone_number = data.phone_number;
        this.role = data.role;
        this.verified = data.verified;
        this.address = data.address;
        this.cpf = data.cpf;
        this.cnpj = data.cnpj;
        this.avatar = data.avatar;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    get displayName(): string {
        return this.name;
    }

    get isAdmin(): boolean {
        return this.role === "admin";
    }

    get isInstitution(): boolean {
        return this.role === 'institution';
    }
}
