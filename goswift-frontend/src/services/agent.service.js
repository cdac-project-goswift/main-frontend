import api from "./api";

const addBus = (userId, busData) => {
  return api.post(`/agent/${userId}/buses`, busData);
};

const getMyBuses = (userId) => {
  return api.get(`/agent/${userId}/buses`);
};

const deleteBus = (busId) => {
  return api.delete(`/agent/buses/${busId}`);
};

const updateBus = (busId, busData) => {
  return api.put(`/agent/buses/${busId}`, busData);
};

const addSchedule = (userId, scheduleData) => {
  return api.post(`/agent/${userId}/schedules`, scheduleData);
};

const getMySchedules = (userId) => {
  return api.get(`/agent/${userId}/schedules`);
};

const deleteSchedule = (scheduleId) => {
  return api.delete(`/agent/schedules/${scheduleId}`);
};

const getAgencyBookings = (userId) => {
  return api.get(`/agent/${userId}/bookings`);
};

const getAllCities = () => {
  return api.get(`/agent/cities`);
};

export default {
  addBus,
  getMyBuses,
  updateBus,
  deleteBus,
  addSchedule,
  getMySchedules,
  deleteSchedule,
  getAgencyBookings,
  getAllCities
};