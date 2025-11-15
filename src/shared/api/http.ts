import axios from "axios";
import { getStorage } from "@utils/storageUtils";
import { ThrowError } from "../Error/ThrowError";
const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL
});

api.interceptors.request.use(config => {
    const token = getStorage("@token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getErrorMessage = (error: any) => {
    const data = error?.response?.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (Array.isArray(data?.errors)) return data.errors.join(", ");
    if (typeof data?.errors === "object") return Object.values(data.errors).flat().join(", ");
    return error?.message || "Erro desconhecido";
};

api.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status ?? 500;
        const message = getErrorMessage(error);
        return Promise.reject(new ThrowError(status, message));
    }
);

export default api;