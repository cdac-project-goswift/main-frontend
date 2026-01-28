import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached:", token.substring(0, 20) + "...");
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      console.error("403 Forbidden - Token:", localStorage.getItem("token")?.substring(0, 30));
      console.error("403 Forbidden - User:", localStorage.getItem("user"));
    }
    
    if (error.response) {
      console.error("API Error:", error.response.data?.message || error.response.statusText || "Unknown error");
    } else {
      console.error("API Error:", error.message || "Network error");
    }
    return Promise.reject(error);
  }
);

export default api;