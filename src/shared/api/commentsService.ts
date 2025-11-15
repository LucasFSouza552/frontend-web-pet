import api from "@api/http";
import type IComment from "../models/Comments";
import buildQuery from "../utils/BuilderQuery";
import { ThrowError } from "../Error/ThrowError";

export const commentService = {
    async adminFetchComments() {
        try {
            const response = await api.get("/comment");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar comentários");
        }
    },
    async adminDeleteComment(commentId: string) {
        try {
            const response = await api.delete(`/comment/${commentId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar deletar comentário");
        }
    },
    async fetchCommentsByPost(postId: string, page = 1, limit = 10) {
        try {
            const query = buildQuery({ page, limit });
            const response = await api.get(`/comment/post/${postId}${query}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar comentários do post");
        }
    },
    async fetchCommentById(commentId: string) {
        try {
            const response = await api.get(`/comment/${commentId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar comentário por id");
        }
    },
    async createComment(postId: string, content: string): Promise<IComment> {
        try {
            const response = await api.post(`/comment/${postId}`, { content });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar criar comentário");
        }
    },

    async replyToComment(commentId: string, content: string) {
        try {
            const response = await api.post(`/comment/${commentId}/reply`, { content });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar responder comentário");
        }
    },

    async updateComment(commentId: string, comment: string) {
        try {
            const response = await api.patch(`/comment/${commentId}`, { comment, content: comment });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar atualizar comentário");
        }
    },



    async deleteOwnComment(commentId: string) {
        try {
            const response = await api.patch(`/comment/own/${commentId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar ocultar comentário");
        }
    },

    async fetchReplies(commentId: string) {
        try {
            const response = await api.get(`/comment/${commentId}/replies`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar respostas do comentário");
        }
    },
};
