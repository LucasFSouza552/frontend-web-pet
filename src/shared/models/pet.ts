import type { IAccount } from "./Account";

export default interface IPet {
    id: string;
    name: string;
    type: "Cachorro" | "Gato" | "Pássaro" | "Outro";
    age?: number;
    gender: "male" | "female";
    weight: number;
    images: string[];
    description?: string;
    adopted: boolean;
    account: IAccount;
    adoptedAt?: Date;
    createdAt: string;
    updatedAt: string;
}