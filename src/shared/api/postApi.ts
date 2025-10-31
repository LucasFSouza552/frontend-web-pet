import type IComment from "../models/Comments";
import type { IPost } from "../models/Post";
import buildQuery from "../utils/BuilderQuery";

import api from "./Http";

interface PostQuery {
    account?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    order?: "asc" | "desc";
}
export async function getPosts(query: PostQuery = {}): Promise<IPost[]> {
    try {
        const queryString = buildQuery(query);
        const response = await api.get(`/post/posts/with-author${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function toggleLike(postId: string): Promise<IPost> {
    try {
        const response = await api.post(`/post/${postId}/like`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getPostById(id: string) {
    try {
        const response = await api.get(`/post/${id}/with-author`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addComment(postId: string, content: string, parent?: string) {
    try {
        const response = await api.post(`/comment/${postId}`, { content, parent });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getComments(postId: string, query: PostQuery = {}): Promise<IComment[] | null> {
    try {
        const queryString = buildQuery(query);
        const response = await api.get(`/comment/post/${postId}${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function addReplyComment(commentId: string, content: string): Promise<IComment> {
    try {
        const response = await api.post(`/comment/${commentId}/reply`, { content });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function softDeletePost(postId: string) {
    try {
        await api.post(`/post/${postId}/delete`);
    } catch (error) {
        throw error;
    }
}

