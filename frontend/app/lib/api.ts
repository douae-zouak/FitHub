import axios from "axios";
import { Product } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productApi = {
  // Get all products with filters
  getAll: async (params?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    const response = await api.get("/products/featured", { params: { limit } });
    return response.data;
  },

  // Get single product
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get("/products/categories");
    return response.data;
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get("/products/brands");
    return response.data;
  },
  // Get recommendations
  getRecommendations: async (id: string, limit: number = 4) => {
    const response = await api.get(`/products/${id}/recommendations`, {
      params: { limit },
    });
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

// User API (Cart & Wishlist)
export const userApi = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Cart
  getCart: async () => {
    const response = await api.get("/users/cart");
    return response.data;
  },
  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await api.post("/users/cart", { productId, quantity });
    return response.data;
  },
  removeFromCart: async (productId: string) => {
    const response = await api.delete(`/users/cart/${productId}`);
    return response.data;
  },

  // Wishlist
  getWishlist: async () => {
    const response = await api.get("/users/wishlist");
    return response.data;
  },
  toggleWishlist: async (productId: string) => {
    const response = await api.post("/users/wishlist", { productId });
    return response.data;
  },

  getOrders: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  },
  // Avant : (ça provoque le 404 car Next.js n'a pas cette route)
  // const res = await fetch("/api/orders", { ... })

  // Après :
  createOrder: async (data: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/orders", {
      // <-- mettre l'URL complète de ton backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // si tu utilises JWT
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get("/admin/orders");
    return response.data;
  },
  getOrder: async (id: string) => {
    const response = await api.get(`/admin/order/${id}`);
    return response.data;
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/admin/updateOrder/${orderId}`, { status });
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`); // Using existing product route, assume admin has rights
    return response.data;
  },
  createProduct: async (productData: any) => {
    const response = await api.post("/products", productData);
    return response.data;
  },
  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  getCustomerSegments: async () => {
    const response = await api.get("/admin/segments");
    return response.data;
  },
  runSegmentation: async () => {
    const response = await api.post("/admin/segmentation/run");
    console.log(response);
    return response.data;
  },
};

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
