import api from "./api";

// This file was missing a standardization update in Phase 8 part 3
// We ensure it returns response.data

const searchBuses = async (source, dest, date, busType, sortBy) => {
  const params = { source, dest, date };
  if (busType) params.busType = busType;
  if (sortBy) params.sortBy = sortBy;
  
  const response = await api.get("/customer/search", { params });
  return response.data.data; // Unwrap ApiResponse
};

const getBookedSeats = async (scheduleId, date) => {
  const response = await api.get(`/customer/schedule/${scheduleId}/seats`, {
    params: { date }
  });
  return response.data.data;
};

const addFeedback = async (feedbackData) => {
  const response = await api.post("/customer/feedback", feedbackData);
  return response.data.data;
};

const bookTicket = async (bookingData) => {
  const response = await api.post("/customer/book", bookingData);
  return response.data.data; // Unwrap ApiResponse
};

const getMyBookings = async (userId) => {
  const response = await api.get(`/customer/${userId}/bookings`);
  return response.data.data; // Unwrap ApiResponse
};

const getAllCities = async () => {
  const response = await api.get("/customer/cities");
  return response.data.data; // Unwrap ApiResponse
};

const checkFeedbackExists = async (bookingId) => {
  const response = await api.get(`/customer/booking/${bookingId}/feedback-exists`);
  return response.data.data;
};

export default { searchBuses, bookTicket, getMyBookings, getAllCities, getBookedSeats, addFeedback, checkFeedbackExists };