import * as postApi from "../../shared/api/postApi";
import type { Post } from "../../shared/models/post";

export async function fetchPosts({ account, page, limit }: { account?: string, page?: number, limit?: number }): Promise<Post[]> {
    try {
        const post = await postApi.getPosts({ account, limit, page, orderBy: "createdAt" });
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }
}

export async function fetchPostById(id: string) {
    try {
        const post = await postApi.getPostById(id);
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }
}

export async function ToggleLike(postId: string): Promise<Post> {
    try {
        const post = await postApi.toggleLike(postId);
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }
}