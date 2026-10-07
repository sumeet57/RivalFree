import Project from "../models/project.model.js";
import { ApiError } from "../utils/api-response.js";


export const createProjectService = async (projectData) => {
    const project = await Project.create(projectData);

    if(!project) {
        throw ApiError(400, "Failed to create project");
    }
    return project;
};

export const geTProjectsByUserService = async (userId) => {
    const projects = await Project.find({ user: userId });

    if(!projects) {
        throw ApiError(404, "No projects found for the user");
    }
    return projects;
};

export const getProjectByIdService = async (projectId) => {
    const project = await Project.findById(projectId);

    if(!project) {
        throw ApiError(404, "Project not found");
    }
    return project;
}
