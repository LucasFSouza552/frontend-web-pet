

export default interface IComment {
    post: string;
    parent?: string;
    content: string;
    account: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
