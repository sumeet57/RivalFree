import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createFeature,
  getFeatureById,
  getFeaturesOfProject,
} from "../controllers/feature.controller.js";

const featureRouter = Router();

featureRouter.use(isAuthenticated);

featureRouter.post("/", createFeature);
featureRouter.get("/:featureId", getFeatureById);
featureRouter.get("/project/:projectId", getFeaturesOfProject);

export default featureRouter;