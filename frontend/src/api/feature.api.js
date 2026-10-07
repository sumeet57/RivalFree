import api from "./axios";

export const createFeature = (data) => api.post("/features", data);
export const getFeaturesByProject = (projectId) => api.get(`/features/project/${projectId}`);
