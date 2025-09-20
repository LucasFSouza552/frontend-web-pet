import axios from "axios";
import { getStorage } from "../services/authService";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(config => {
    const token = getStorage("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;