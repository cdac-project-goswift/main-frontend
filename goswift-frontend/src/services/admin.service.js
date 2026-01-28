import api from "./api";

const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

const updateUserStatus = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}/status`, null, {
    params: { status },
  });
  return response.data;
};

const getAllCities = async () => {
  const response = await api.get("/admin/cities");
  return response.data;
};

const addCity = async (cityData) => {
  const response = await api.post("/admin/cities", cityData);
  return response.data;
};

const getSystemConfig = async () => {
  const response = await api.get("/admin/config");
  return response.data;
};

const updateSystemConfig = async (configData) => {
  const response = await api.put("/admin/config", configData);
  return response.data;
};

const getSystemStats = async () => {
  const response = await api.get("/admin/reports");
  return response.data;
};

const getAllBookings = async () => {
  const response = await api.get("/admin/bookings");
  return response.data;
};

const getAllAgencies = async () => {
  const response = await api.get("/admin/agencies");
  return response.data;
};

const searchBookings = async (agencyId, busId) => {
  const params = {};
  if (agencyId) params.agencyId = agencyId;
  if (busId) params.busId = busId;
  
  const response = await api.get("/admin/bookings/search", { params });
  return response.data;
};

const getBusesByAgency = async (agencyId) => {
  const response = await api.get(`/admin/agencies/${agencyId}/buses`);
  return response.data;
};

export default {
  getAllUsers, updateUserStatus, getAllCities, addCity,
  getSystemConfig, updateSystemConfig, getSystemStats,
  getAllBookings, searchBookings, getAllAgencies, getBusesByAgency
};