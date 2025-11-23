import api from "@api/http";
import type IPet from "@models/Pet";
import { ThrowError } from "@/shared/Error/ThrowError";

export const petService = {
    async adminFetchAllPets() {
        try {
            const response = await api.get("/pet");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar buscar pets");
        }
    },
    async institutionCreatePet(data: IPet) {
        try {
            const response = await api.post("/pet", data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar criar pet");
        }
    },
    async fetchPetById(petId: string) {
        try {
            const response = await api.get(`/pet/${petId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar buscar pet");
        }
    },
    async adminUpdatePet(petId: string, data: Partial<IPet>) {
        try {
            const response = await api.patch(`/pet/${petId}`, data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar atualizar pet");
        }
    },
    async updatePet(petId: string, data: Partial<IPet>) {
        try {
            const response = await api.patch(`/pet/${petId}/update`, data);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar atualizar pet da instituição");
        }
    },
    async deletePet(petId: string) {
        try {
            const response = await api.delete(`/pet/${petId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar remover pet");
        }
    },
    async availablePets() {
        try {
            const response = await api.get("/pet/avaliable");
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar buscar pets disponíveis");
        }
    },
    async likePet(petId: string) {
        try {
            const response = await api.post(`/pet/${petId}/like`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar curtir pet");
        }
    },
    async dislikePet(petId: string) {
        try {
            const response = await api.post(`/pet/${petId}/dislike`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar descurtir pet");
        }
    },
    async acceptPetAdoption(petId: string, accountId: string) {
        try {
            const response = await api.post(`/pet/${petId}/accept`, { account: accountId });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar aceitar adoção");
        }
    },
    async rejectPetAdoption(petId: string, accountId?: string) {
        try {
            const response = await api.post(`/pet/${petId}/reject`, accountId ? { account: accountId } : {});
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar negar adoção");
        }
    },
    async updateImages(petId: string, formData: FormData) {
        try {
            console.log(formData);
            const response = await api.post(`/pet/${petId}/avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar atualizar imagens do pet");
        }
    },
    async deleteImage(petId: string, imageId: string) {
        try {
            const response = await api.post(`/pet/${petId}/image/delete`, { imageId });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar excluir imagem do pet");
        }
    },
    async paymentReturn(paymentId: string, status: "completed" | "cancelled" | "refunded", externalReference: string) {
        try {
            const response = await api.post(`/pet/payment-return`, { id: paymentId, status, externalReference });
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao processar retorno de pagamento");
        }
    },
    async getAdoptedPetsByAccount(accountId: string) {
        try {
            const response = await api.get(`/pet/adopted/${accountId}`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar buscar pets adotados");
        }
    },
    async getAllByInstitution(institutionId: string) {
        try {
            const response = await api.get(`/pet/institutions/${institutionId}/pets`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar buscar pets da instituição");
        }
    },
    async getRequestedAdoptions(institutionId: string) {
        try {
            const response = await api.get(`/pet/institutions/${institutionId}/pets/requested`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar buscar solicitações de adoção");
        }
    },
    async softDeletePet(petId: string) {
        try {
            const response = await api.post(`/pet/${petId}/delete`);
            return response.data;
        } catch (error) {
            if (error instanceof ThrowError) throw error;
            throw ThrowError.internal("Erro inesperado ao tentar deletar pet");
        }
    }
};