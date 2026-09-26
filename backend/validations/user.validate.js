import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be at most 50 characters long",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    googleId: Joi.string().required().messages({
        "string.empty": "Google ID is required",
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    googleId: Joi.string().required().messages({
        "string.empty": "Google ID is required",
    }),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional().messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be at most 50 characters long",
    }), 
    avatar: Joi.string().uri().optional().messages({
        "string.uri": "Avatar must be a valid URL",
    }),
});