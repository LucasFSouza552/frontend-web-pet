import type { IAccount } from "./Account";


export default interface IComment {
    id: string;
    post: string;
    parent?: string;
    content: string;
    account: IAccount;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
