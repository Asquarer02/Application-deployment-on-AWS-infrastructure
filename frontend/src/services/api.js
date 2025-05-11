// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const register = (userData) => api.post("/auth/register", userData);
export const login = (credentials) => api.post("/auth/login", credentials);

// Post services
export const fetchPosts = () => api.get("/posts");
export const fetchPostById = (id) => api.get(`/posts/${id}`);

// For creating posts with FormData (image upload)
export const createPost = (formData) => {
  return api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Important for file uploads
    },
  });
};
export const updatePost = (id, postData) => api.put(`/posts/${id}`, postData);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export default api;
