import logger from "../util/logger.js"
import { success } from "../util/response.js";

function paymentGatewayWebhook(req, res) {
    try {
        // TODO: handle order update logic
        return success(res, req.body);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
}

function kycWebhook(req, res) {
    try {
        // TODO: handle kyc update logic
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