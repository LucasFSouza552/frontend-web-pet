
interface ITypeAccounts {
  _id: string;
  name: string;
  avatar?: string;
  role: "user" | "admin" | "institution";
}
export interface Post {
    id: string;
    title: string;
    comments?: number;
    content: string;
    image?: string[];
    date: string;
    likes: string[];
    account: ITypeAccounts;
    createdAt: string;
    updatedAt: string;
}
