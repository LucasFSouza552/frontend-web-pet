import * as postApi from "../../shared/api/postApi";
import type { Post } from "../../shared/models/post";

export async function fetchPosts(accountId?: string, page?: number, limit?: number): Promise<Post[]> {
    try {
        const post = await postApi.getPosts({ accountId, limit, page, orderBy: "createdAt" });
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }

}