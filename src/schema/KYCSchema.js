import Joi from 'joi';

const KYCSchema = Joi.object({
    id: Joi.string().required(),
}).unknown();

export default KYCSchema;
