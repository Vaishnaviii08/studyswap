import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;