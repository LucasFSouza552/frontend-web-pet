import * as postApi from "../../shared/api/postApi";
import type IComment from "../../shared/models/Comments";
import type { IPost } from "../../shared/models/Post";

export async function fetchPosts({ account, page, limit }: { account?: string, page?: number, limit?: number }): Promise<IPost[]> {
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

export async function ToggleLike(postId: string): Promise<IPost> {
    try {
        const post = await postApi.toggleLike(postId);
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }
}

export async function addCommentService(postId: string, content: string, parent?: string): Promise<IComment> {
    try {
        const post = await postApi.addComment(postId, content, parent);
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }
}

export async function addReplyCommentService(commentId: string, content: string): Promise<IComment> {
    try {
        const post = await postApi.addReplyComment(commentId, content);
        return post;
    } catch (error: any) {
        throw Error(error?.message);
    }
}

export async function fetchComments({ postId, page, limit }: { postId: string, page?: number, limit?: number }): Promise<IComment[] | null> {
    try {
        const Comments = await postApi.getComments(postId, { limit, page, orderBy: "createdAt" });
        return Comments;
    } catch (error: any) {
        throw Error(error?.message);
    }
}

export async function deletePost(postId: string): Promise<void> {
    try {
        await postApi.softDeletePost(postId);
    } catch (error: any) {
        throw Error(error?.message);
    }
}