import axios from "axios";
import { getStorage } from "../../shared/utils/storageUtils";
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${apiUrl}/api`,
});

api.interceptors.request.use(config => {
    const token = getStorage("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export default api;