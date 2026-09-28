import {
  createProjectService,
  geTProjectsByUserService,
  getProjectByIdService,
} from "../services/project.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse, ApiError } from "../utils/api-response.js";

export const createProject = asyncHandler(async (req, res) => {
  const projectData = req.body;

  if (!projectData || Object.keys(projectData).length === 0) {
    throw new ApiError(400, "Project data is required");
  }

  const project = await createProjectService(projectData);

  return new ApiResponse(201, "Project created successfully", project).send(res);
});

export const getProjectsByUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.session?.userId;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const projects = await geTProjectsByUserService(userId);

  return new ApiResponse(200, "Projects retrieved successfully", projects).send(res);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await getProjectByIdService(projectId);

  return new ApiResponse(200, "Project retrieved successfully", project).send(res);
});