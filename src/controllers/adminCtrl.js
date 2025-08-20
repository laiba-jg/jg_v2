import logger from '../util/logger.js';
import { badRequest, internalServerError, success } from '../util/response.js';
import { AuthTokenType, ExternalServices } from '../util/enums.js';
import { generateServiceToken } from '../util/jwt.js';
import Roles from '../auth/roles.js';

const generateToken = async (req, res) => {
    try {
        const { type } = req.body;
        if (type === AuthTokenType.KYC_SERVICE) {
            const payload = {
                role: Roles.SYSTEM,
                service: ExternalServices.ID_WISE
            };
            const token = await generateServiceToken(payload);
            return success(res, { token });
        }
        if (type === AuthTokenType.PAYMENT_GATEWAY_SERVICE) {
            const payload = {
                role: Roles.SYSTEM,
                service: ExternalServices.LEAN_TECH
            };
            const token = await generateServiceToken(payload);
            return success(res, { token });
        }
        return badRequest(res);
    } catch (err) {
        logger.error(err);
        internalServerError(res);
    }
};


export default {
    generateToken,
};