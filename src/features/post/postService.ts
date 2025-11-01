import api from "../../shared/api/Http";
import type { IPost } from "../../shared/models/Post";


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
    async createPost() {
        try {
            const response = await api.post("/post");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async softDeletePostById(id: string) {
        try {
            const response = await api.post(`/post/${id}`);
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
    async fetchPostWithAuthor(postId: string) {
        try {
            const response = await api.get(`/post/${postId}/with-author`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchPostsWithAuthor() {
        try {
            const response = await api.get("/post/with-author");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async toggleLikePost() {
        try {
            const response = await api.post("/post/like");
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};