import api from "@api/http";
import type { IPost } from "@models/post";
import buildQuery from "@utils/BuilderQuery";
import { ThrowError } from "../Error/ThrowError";

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
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar remover post");
        }
    },
    async fetchAllPosts() {
        try {
            const response = await api.get("/post");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async fetchPostById(id: string) {
        try {
            const response = await api.get(`/post/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar post por id");
        }
    },
    async createPost(data: IPost | FormData) {
        try {
            let formData: FormData;

            if (data instanceof FormData) {
                formData = data;
            } else {
                formData = new FormData();
                formData.append("title", data.title);
                formData.append("content", data.content);
                if (data.image) {
                    data.image.forEach((img: any) => {
                        if (img instanceof File) {
                            formData.append("images", img);
                        }
                    });
                }
            }

            const response = await api.post("/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts");
        }
    },
    async searchPosts(query: string, page: number = 1, limit: number = 10) {
        try {
            const response = await api.get(`/post/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar remover post");
        }
    },
    async softDeletePostById(id: string) {
        try {
            const response = await api.post(`/post/${id}/delete`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar remover post");
        }
    },
    async updatePost(id: string, data: IPost) {
        try {
            const response = await api.patch(`/post/${id}`, data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar atualizar post");
        }
    },
    async fetchPostWithAuthor(postId: string): Promise<IPost> {
        try {
            const response = await api.get(`/post/${postId}/with-author`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar post com autor");
        }
    },
    async fetchPostsWithAuthor(query: PostQuery) {
        try {
            const queryString = buildQuery(query);
            const response = await api.get(`/post/with-author${queryString}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar posts com autor");
        }
    },
    async toggleLikePostById(id: string) {
        try {
            const response = await api.post(`/post/${id}/like`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar dar like no post");
        }
    },
    async fetchTopPosts() {
        try {
            const response = await api.get("/post/top-posts");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) {
                throw error;
            }
            throw ThrowError.internal("Erro inesperado ao tentar buscar top posts");
        }
    }
};