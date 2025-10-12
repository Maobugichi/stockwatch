import axios from "axios";


const API_BASE = import.meta.env.VITE_API_URL || "https://stocks-server-kcro.onrender.com";

export const api = axios.create({
    baseURL:API_BASE,
    withCredentials:true,
    headers: {
      "Content-Type": "application/json"  
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    } ,
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem("authToken");
      localStorage.removeItem("auth")
     
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "#/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;