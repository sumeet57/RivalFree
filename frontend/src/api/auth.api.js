import api from "./axios";

export const googleLogin = (accessToken) => api.post("/auth/google", { accessToken });
export const getMe = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");
