import Feature from "../models/feature.model.js";
import { ApiError } from "../utils/api-response.js";



export const createFeatureService = async (data) => {

    const { name, description, projectId, userId } = data;

    const feature = await Feature.create({
        name,
        description,
        project: projectId,
        user: data.userId, 
    });

    if(!feature) {
        throw new ApiError(500, "Failed to create feature");
    }

    return feature;
};

export const getFeatureByIdService = async (featureId) => {
    const feature = await Feature.findById(featureId).populate("project").populate("user");

    if (!feature) {
        throw new ApiError(404, "Feature not found");
    }

    return feature;
};

export const getFeaturesOfProjectService = async (projectId) => {
    const features = await Feature.find({ project: projectId }).populate("user");

    if(!features || features.length === 0) {
        throw new ApiError(404, "No features found for this project");
    }

    return features;
};