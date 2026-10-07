import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // send the connect.sid session cookie
});

// Backend envelope: { success, statusCode, message, payload }.
// Success -> callers receive `payload` directly.
// Failure -> callers receive a plain { message, status } object.
api.interceptors.response.use(
  (response) => response.data.payload,
  (error) =>
    Promise.reject({
      message: error.response?.data?.message || error.message || "Something went wrong",
      status: error.response?.status,
    })
);

export default api;
