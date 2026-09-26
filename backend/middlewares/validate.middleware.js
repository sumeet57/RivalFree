import Joi from "joi";
import { registerSchema, loginSchema, updateUserSchema } from "../validations/user.validate.js";
import { projectSchema } from "../validations/project.validate.js";
import { featureSchema } from "../validations/feature.validate.js";

export const userRegisterValidate = (req, res, next) => {
    const schema = registerSchema;
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
}

export const userLoginValidate = (req, res, next) => {
    const schema = loginSchema;
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
}

export const userUpdateValidate = (req, res, next) => {
    const schema = updateUserSchema;
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
}


export const projectValidate = (req, res, next) => {
    const schema = projectSchema;
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
}

export const featureValidate = (req, res, next) => {
    const schema = featureSchema;
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
}
