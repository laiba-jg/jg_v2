import KYCSchema from "../schema/KYCSchema.js";
import messageSvc from "../services/messageSvc.js";
import { MessageType } from "../util/enums.js";
import logger from "../util/logger.js"
import { badRequest, internalServerError, success } from "../util/response.js";

function paymentGatewayWebhook(req, res) {
    try {
        return success(res, req.body);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
}

async function kycWebhook(req, res) {
    try {
        const payload = req.body;
        const validationResult = KYCSchema.validate(payload);
        if (validationResult.error) return badRequest(res, { message: validationResult.error.details, key: '400' });
        const message = {
            payload,
            type: MessageType.KYC,
        };
        const response = await messageSvc.sendMessage(message);
        return success(res, req.body);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
}

const handleError = (err, res) => {
    return internalServerError(res);
}

export default {
    paymentGatewayWebhook,
    kycWebhook,
}
