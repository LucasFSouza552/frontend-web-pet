import type { Post } from "../models/post";
import * as postApi from "../api/postApi";

export async function fetchPosts(accountId?: string, page?: number, limit?: number): Promise<Post[]> {
    try {
        const post = await postApi.getPosts({ accountId, limit, page, orderBy: "createdAt" });
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }

}