import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const createApi = (path) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/${path}`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const messageApi = createApi("message");
export const projectCoreApi = createApi("project/core");
export const projectMemberApi = createApi("project/member");
export const projectFileApi = createApi("project/file");
