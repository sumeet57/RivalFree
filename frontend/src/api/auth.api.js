import api from "./axios";

export const googleLogin = (accessToken) =>
  api.post("/auth/google", { accessToken });
export const guestLogin = () =>
  api.post("/auth/guest", { email: "guest@sumeet.app" });
export const getMe = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");
