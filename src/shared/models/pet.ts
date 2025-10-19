import type { ITypeAccounts } from "../types/ITypeAccounts";

export default interface IPet {
    id: string;
    name: string;
    type: "Cachorro" | "Gato" | "Pássaro" | "Outro";
    age?: number;
    gender: "M" | "F";
    weight: number;
    images: string[];
    description?: string;
    adopted: boolean;
    account: ITypeAccounts;
    adoptedAt?: Date;
    createdAt: string;
    updatedAt: string;
}