import api from "./http";
import { ThrowError } from "@/shared/Error/ThrowError";

export type NotificationType = 
    | "warning" 
    | "info" 
    | "like" 
    | "match" 
    | "comment" 
    | "adoption_request" 
    | "adoption_accepted" 
    | "adoption_rejected"
    | "post_like"
    | "reply";

export interface INotification {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email?: string;
        phone_number?: string;
        avatar?: string;
        role?: string;
    };
    recipient?: string;
    type: NotificationType;
    content: string;
    image?: string;
    latitude?: number;
    longitude?: number;
    relatedEntity?: {
        type: "pet" | "post" | "comment" | "account";
        id: string;
    };
    createdAt: string;
    viewedAt?: string;
    read: boolean;
}

export interface NotificationUnreadCount {
    count: number;
}

export const notificationService = {
    /**
     * Busca todas as notificações (admin)
     */
    async getAll(): Promise<INotification[]> {
        try {
            const response = await api.get("/notification");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao buscar notificações");
        }
    },

    /**
     * Busca notificações do usuário autenticado
     */
    async getMyNotifications(includeRead: boolean = true): Promise<INotification[]> {
        try {
            const response = await api.get(`/notification/me?includeRead=${includeRead}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao buscar suas notificações");
        }
    },

    /**
     * Conta notificações não lidas do usuário autenticado
     */
    async getUnreadCount(): Promise<number> {
        try {
            const response = await api.get<NotificationUnreadCount>("/notification/me/unread-count");
            return response.data.count;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao contar notificações não lidas");
        }
    },

    /**
     * Marca uma notificação como lida
     */
    async markAsRead(notificationId: string): Promise<void> {
        try {
            await api.patch(`/notification/${notificationId}/read`);
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao marcar notificação como lida");
        }
    },

    /**
     * Marca todas as notificações como lidas
     */
    async markAllAsRead(): Promise<void> {
        try {
            await api.patch("/notification/read-all");
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao marcar todas as notificações como lidas");
        }
    },

    /**
     * Deleta uma notificação
     */
    async delete(notificationId: string): Promise<void> {
        try {
            await api.delete(`/notification/${notificationId}`);
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao deletar notificação");
        }
    },

    /**
     * Cria uma notificação (requer autenticação)
     */
    async create(data: {
        recipient?: string;
        type: NotificationType;
        content: string;
        latitude?: number;
        longitude?: number;
        relatedEntity?: {
            type: "pet" | "post" | "comment" | "account";
            id: string;
        };
    }, image?: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append("type", data.type);
            formData.append("content", data.content);
            if (data.recipient) formData.append("recipient", data.recipient);
            if (data.latitude !== undefined) formData.append("latitude", data.latitude.toString());
            if (data.longitude !== undefined) formData.append("longitude", data.longitude.toString());
            if (data.relatedEntity) {
                formData.append("relatedEntity[type]", data.relatedEntity.type);
                formData.append("relatedEntity[id]", data.relatedEntity.id);
            }
            if (image) formData.append("image", image);

            await api.post("/notification", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao criar notificação");
        }
    }
};

