import Joi from 'joi';
import Roles from '../auth/roles.js';

const UserSchema = Joi.object({
    firstName: Joi
        .string()
        .required()
        .messages({
            "string.empty": "First name is required.",
            "any.required": "First name is required.",
        }),

    lastName: Joi
        .string()
        .required()
        .messages({
            "string.empty": "Last name is required.",
            "any.required": "Last name is required.",
        }),

    email: Joi
        .string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email",
        }),

    role: Joi.string()
        .valid(...Object.values(Roles)),

    password: Joi
        .string()
        .required()
        .pattern(
            new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;<>?,./]).{8,}$"
            )
        )
        .messages({
            "string.empty": "Password is required.",
            "string.pattern.base":
                "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
            "any.required": "Password is required.",
        }),

}).unknown();

export default UserSchema;
