import api from "@api/http";
import type { IPost } from "@/shared/models/Post";
import buildQuery from "@utils/BuilderQuery";

interface PostQuery {
    account?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    order?: "asc" | "desc";
}

export const postService = {
    async adminRemovePostById(id: string) {
        try {
            const response = await api.delete(`/post/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async searchPosts() {
        try {
            const response = await api.get("/post/search");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchAllPosts() {
        try {
            const response = await api.get("/post");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchPostById(id: string) {
        try {
            const response = await api.get(`/post/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async createPost(data: IPost) {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            if (data.image) {
                data.image.forEach(img => formData.append("images", img));
            }
            const response = await api.post("/post");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async softDeletePostById(id: string) {
        try {
            const response = await api.post(`/post/${id}/delete`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async updatePost(id: string, data: IPost) {
        try {
            const response = await api.patch(`/post/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchPostWithAuthor(postId: string): Promise<IPost> {
        try {
            const response = await api.get(`/post/${postId}/with-author`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchPostsWithAuthor(query: PostQuery) {
        try {
            const queryString = buildQuery(query);
            const response = await api.get(`/post/with-author${queryString}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async toggleLikePostById(id: string) {
        try {
            const response = await api.post(`/post/${id}/like`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchTopPosts() {
        try {
            const response = await api.get("/post/top-posts");
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};