
interface ITypeAccounts {
  id: string;
  name: string;
  avatar?: string;
  role: "user" | "admin" | "institution";
}
export interface Post {
    id: string;
    title: string;
    comments?: number;
    content: string;
    images?: string[];
    date: string;
    likes: string[];
    accountId: ITypeAccounts;
    createdAt: string;
    updatedAt: string;
}
