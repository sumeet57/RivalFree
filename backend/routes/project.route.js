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
projectRouter.get("/", getProjectsByUser);
projectRouter.get("/:projectId", getProjectById);

export default projectRouter;