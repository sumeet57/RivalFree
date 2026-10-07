import api from "./axios";

export const createProject = (data) => api.post("/projects", data);
export const getProjects = () => api.get("/projects");
export const getProjectById = (projectId) => api.get(`/projects/${projectId}`);
