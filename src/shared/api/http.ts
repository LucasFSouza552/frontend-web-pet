import axios from "axios";
import { getStorage } from "../utils/StorageUtils";
const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
});

api.interceptors.request.use(config => {
    const token = getStorage("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export default api;