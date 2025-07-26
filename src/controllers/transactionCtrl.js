import logger from "../util/logger.js";
import { created, internalServerError } from "../util/response.js";
import { buyTransaction } from "../services/transactionSvc.js";
import NoKYCError from "../errors/NoKYCError.js";
import KYCPendingError from "../errors/KYCPendingError.js";
import KYCRejectedError from "../errors/KYCRejectedError.js";
import NoGoldPriceError from "../errors/NoGoldPriceError.js";
import InvalidAmountError from "../errors/InvalidAmountError.js";
import InvalidQuantityError from "../errors/InvalidQuantity.js";
import InvalidTransactionError from "../errors/InvalidTransactionError.js";


export const buy = async (req, res) => {
    try {
        const customerId = req.userId;
        const data = req.body;
        console.log('data', data);
        await buyTransaction(customerId, data);
        return created(res);
    } catch (err) {
        console.log(err);
        const logObject = {
            error: err,
            body: req.body,
            userId: req.userId
        };
        logger.error('Error while creating transaction:', logObject);
        return handleError(err, res);
    }
}

function handleError(err, res) {
    if (err instanceof InvalidTransactionError) {
        logger.error('Invalid transaction error:', err);
        return res.status(err.status).json({ message: err.message, key: 'invalidTransaction' });
    }
    if (err instanceof NoKYCError) {
        logger.error('NoKYCError:', err);
        return res.status(err.status).json({ message: err.message, key: 'noKYC' });
    }
    if (err instanceof KYCPendingError) {
        logger.error('KYCPendingError:', err);
        return res.status(err.status).json({ message: err.message, key: 'kycPending' });
    }
    if (err instanceof KYCRejectedError) {
        logger.error('KYCRejectedError:', err);
        return res.status(err.status).json({ message: err.message, key: 'kycRejected' });
    }
    if (err instanceof InvalidQuantityError) {
        logger.error('InvalidQuantityError:', err);
        return res.status(err.status).json({ message: err.message, key: 'invalidQuantity' });
    }
    if (err instanceof InvalidAmountError) {
        logger.error('InvalidAmountError:', err);
        return res.status(err.status).json({ message: err.message, key: 'invalidAmount' });
    }
    if (err instanceof NoGoldPriceError) {
        logger.error('NoGoldPriceError:', err);
        return res.status(err.status).json({ message: err.message, key: 'noGoldPrice' });
    }
    return internalServerError(res);
}   