import axios from "axios";
import { getStorage } from "@utils/storageUtils";
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



export default api;