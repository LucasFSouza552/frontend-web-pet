import type { Post } from "../models/post";
import buildQuery from "../utils/BuilderQuery";
import api from "./http";

interface PostQuery {
    accountId?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    order?: "asc" | "desc";
}
export async function getPosts(query: PostQuery = {}): Promise<Post[]> {
    try {
        const queryString = buildQuery(query);
        const response = await api.get(`/post/posts/full${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}