import type { IAccount } from "./Account";
import type IComment from "./Comments";


export interface IPost {
  id: string;
  title: string;
  comments?: IComment[];
  content: string;
  image?: string[];
  date: string;
  likes: string[];
  account: IAccount;
  createdAt: string;
  updatedAt: string;
}
