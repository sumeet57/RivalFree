import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createProject,
  getProjectsByUser,
  getProjectById,
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.use(isAuthenticated);

projectRouter.post("/", createProject);
projectRouter.get("/", isAuthenticated, getProjectsByUser);
projectRouter.get("/:projectId", isAuthenticated, getProjectById);

export default projectRouter;
