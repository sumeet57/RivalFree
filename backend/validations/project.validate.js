import Joi from "joi";

const createProjectSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.empty": "Project name is required",
        "string.min": "Project name must be at least 3 characters long",
        "string.max": "Project name must be at most 100 characters long",
    }),
    about: Joi.string().max(4000).optional().messages({
        "string.max": "Project about must be at most 4000 characters long",
    }),
    link: Joi.string().uri().max(500).optional().messages({
        "string.uri": "Project link must be a valid URL",
        "string.max": "Project link must be at most 500 characters long",
    }),
});

