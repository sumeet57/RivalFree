import Joi from "joi";

export const featureSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.empty": "Feature name is required",
        "string.min": "Feature name must be at least 3 characters long",
        "string.max": "Feature name must be at most 100 characters long",
    }),
    about: Joi.string().max(2000).optional().messages({
        "string.max": "Feature about must be at most 2000 characters long",
    }),
    project: Joi.string().required().messages({
        "string.empty": "Project ID is required",
    }),
});