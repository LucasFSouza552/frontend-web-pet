import api from "@api/http";
import type IComment from "../models/Comments";
import buildQuery from "../utils/BuilderQuery";

export const commentService = {
    async adminFetchComments() {
        try {
            const response = await api.get("/comment");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
            throw error;
        }
    },
    async adminDeleteComment(commentId: string) {
        try {
            const response = await api.delete(`/comment/${commentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao deletar comentário ${commentId}:`, error);
            throw error;
        }
    },
    async fetchCommentsByPost(postId: string, page = 1, limit = 10) {
        try {
            const query = buildQuery({ page, limit });
            const response = await api.get(`/comment/post/${postId}${query}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar comentários do post ${postId}:`, error);
            throw error;
        }
    },
    async fetchCommentById(commentId: string) {
        try {
            const response = await api.get(`/comment/${commentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar comentário ${commentId}:`, error);
            throw error;
        }
    },
    async createComment(postId: string, content: string): Promise<IComment> {
        try {
            const response = await api.post(`/comment/${postId}`, { content });
            return response.data;
        } catch (error) {
            console.error(`Erro ao criar comentário no post ${postId}:`, error);
            throw error;
        }
    },

    async replyToComment(commentId: string, content: string) {
        try {
            console.log(content);
            const response = await api.post(`/comment/${commentId}/reply`, { content });
            return response.data;
        } catch (error) {
            console.error(`Erro ao responder comentário ${commentId}:`, error);
            throw error;
        }
    },

    async updateComment(commentId: string, comment: string) {
        try {
            const response = await api.patch(`/comment/${commentId}`, { comment, content: comment });
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar comentário ${commentId}:`, error);
            throw error;
        }
    },



    async deleteOwnComment(commentId: string) {
        try {
            const response = await api.patch(`/comment/own/${commentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao ocultar comentário ${commentId}:`, error);
            throw error;
        }
    },

    async fetchReplies(commentId: string) {
        try {
            const response = await api.get(`/comment/${commentId}/replies`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar respostas do comentário ${commentId}:`, error);
            throw error;
        }
    },
};
