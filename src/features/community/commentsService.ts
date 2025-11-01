import api from "../../shared/api/Http";
import type IComment from "../../shared/models/Comments";

const commentService = {
    async fetchComments() {
        try {
            const response = await api.get("/comments");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
            throw error;
        }
    },

    async fetchCommentById(commentId: string) {
        try {
            const response = await api.get(`/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar comentário ${commentId}:`, error);
            throw error;
        }
    },

    async fetchCommentsByPost(postId: string) {
        try {
            const response = await api.get(`/comments/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar comentários do post ${postId}:`, error);
            throw error;
        }
    },

    async createComment(postId: string, data: Omit<IComment, "id" | "createdAt" | "updatedAt" | "isDeleted">) {
        try {
            const response = await api.post(`/comments/${postId}`, data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao criar comentário no post ${postId}:`, error);
            throw error;
        }
    },

    async replyToComment(commentId: string, data: Omit<IComment, "id" | "createdAt" | "updatedAt" | "isDeleted">) {
        try {
            const response = await api.post(`/comments/${commentId}/reply`, data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao responder comentário ${commentId}:`, error);
            throw error;
        }
    },

    async updateComment(commentId: string, data: Partial<IComment>) {
        try {
            const response = await api.patch(`/comments/${commentId}`, data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar comentário ${commentId}:`, error);
            throw error;
        }
    },

    async deleteComment(commentId: string) {
        try {
            const response = await api.delete(`/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao deletar comentário ${commentId}:`, error);
            throw error;
        }
    },

    async deleteOwnComment(commentId: string) {
        try {
            const response = await api.patch(`/comments/own/${commentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao ocultar comentário ${commentId}:`, error);
            throw error;
        }
    },

    async fetchReplies(commentId: string) {
        try {
            const response = await api.get(`/comments/${commentId}/replies`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar respostas do comentário ${commentId}:`, error);
            throw error;
        }
    },
};

export { commentService };
