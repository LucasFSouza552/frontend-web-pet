import type IComment from "../models/Comments";
import type { Post } from "../models/post";
import buildQuery from "../utils/BuilderQuery";

import api from "./http";

interface PostQuery {
    account?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    order?: "asc" | "desc";
}
export async function getPosts(query: PostQuery = {}): Promise<Post[]> {
    try {
        const queryString = buildQuery(query);
        const response = await api.get(`/post/posts/with-author${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function toggleLike(postId: string): Promise<Post> {
    try {
        const response = await api.post(`/post/${postId}/like`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getPostById(id: string) {
    try {
        const response = await api.get(`/post/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addComment(postId: string, content: string) {
    try {
        const response = await api.post(`/comment/${postId}`, { content });
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

