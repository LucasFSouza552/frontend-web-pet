import api from "./http";

export async function getPetById(id: string) {
    try {
        const response = await api.get(`/pet/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function requestPetAdoption(petId: string) {
    const response = await api.post(`/pet/${petId}/adopt`);
    return response.data;
}

export async function rejectPetAdoption(petId: string) {
    const response = await api.post(`/pet/${petId}/reject`);
    return response.data;
}

export async function donation() {
    const response = await api.post(`/pet/donate`);
    return response.data;
}

export async function sponsor(petId: string) {
    const response = await api.post(`/pet/${petId}/sponsor`);
    return response.data;
}