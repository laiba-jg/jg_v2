import Joi from 'joi';

const ProfileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.object({
        countryCode: Joi.string().required(),
        number: Joi.string().required(),
    }).required(),
}).unknown();

export default ProfileSchema;
