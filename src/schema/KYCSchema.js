import Joi from 'joi';

const KYCSchema = Joi.object({
    id: Joi.string().optional(),
}).unknown();

export default KYCSchema;
