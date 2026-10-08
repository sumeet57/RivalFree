import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  handleGoogleAuth,
  handleGuestAuth,
  handleLogout,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/google", handleGoogleAuth);
authRouter.post("/guest", handleGuestAuth);
authRouter.get("/me", isAuthenticated, getCurrentUser);
authRouter.post("/logout", isAuthenticated, handleLogout);

export default authRouter;
