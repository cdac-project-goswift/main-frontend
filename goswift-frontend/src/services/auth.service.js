import api from "./api";

const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  const { token, user } = response.data.data;
  
  // Store token and user data
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  
  return { token, user };
};

const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getToken = () => {
  return localStorage.getItem("token");
};

export default { login, signup, logout, getCurrentUser, getToken };