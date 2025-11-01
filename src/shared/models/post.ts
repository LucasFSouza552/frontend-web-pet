import type IComment from "./comments";

export interface ITypeAccounts {
  id: string;
  name: string;
  avatar?: string;
  role: "user" | "admin" | "institution";
}
export interface IPost {
  id: string;
  title: string;
  comments?: IComment[];
  content: string;
  image?: string[];
  date: string;
  likes: string[];
  account: ITypeAccounts;
  createdAt: string;
  updatedAt: string;
}
