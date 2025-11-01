import type { IAccount } from "./Account";
import type IPet from "./Pet";

export interface AccountPetInteraction {
    account: string | IAccount;
    pet: IPet | string;
    status: "liked" | "disliked" | "viewed";
    createdAt: Date;
    updatedAt: Date;
}