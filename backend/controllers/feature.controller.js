import {
  createFeatureService,
  getFeatureByIdService,
  getFeaturesOfProjectService,
} from "../services/feature.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse, ApiError } from "../utils/api-response.js";

export const createFeature = asyncHandler(async (req, res) => {
  const { name, description, projectId } = req.body;
  const userId = req.user?._id || req.session?.userId;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!name || !projectId) {
    throw new ApiError(400, "Name and Project ID are required");
  }

  const feature = await createFeatureService({
    name,
    description,
    projectId,
    userId,
  });

  return new ApiResponse(201, "Feature created successfully", feature).send(res);
});

export const getFeatureById = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  if (!featureId) {
    throw new ApiError(400, "Feature ID is required");
  }

  const feature = await getFeatureByIdService(featureId);

  return new ApiResponse(200, "Feature retrieved successfully", feature).send(res);
});

export const getFeaturesOfProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const features = await getFeaturesOfProjectService(projectId);

  return new ApiResponse(200, "Features retrieved successfully", features).send(res);
});