import mongoose from "mongoose";

import logger from "../util/logger.js";
import { created, internalServerError, success } from "../util/response.js";
import { buyTransaction, getAllTransactionSummary, redeemTransaction, sellTransaction, transactionSummaryByCustomerId, getAllTransactionQuantitySummary } from "../services/transactionSvc.js";
import NoKYCError from "../errors/NoKYCError.js";
import KYCPendingError from "../errors/KYCPendingError.js";
import KYCRejectedError from "../errors/KYCRejectedError.js";
import NoGoldPriceError from "../errors/NoGoldPriceError.js";
import InvalidAmountError from "../errors/InvalidAmountError.js";
import InvalidQuantityError from "../errors/InvalidQuantity.js";
import InvalidTransactionError from "../errors/InvalidTransactionError.js";
import CustomerNotFoundError from "../errors/CustomerNotFound.js";
import NotEnoughGoldError from "../errors/NotEnoughGoldError.js";


export const buy = async (req, res) => {
    try {
        const customerId = req.userId;
        const data = req.body;
        await buyTransaction(customerId, data);
        return created(res);
    } catch (err) {
        const logObject = {
            error: err,
            body: req.body,
            userId: req.userId
        };
        logger.error('Error while creating buy transaction:', logObject);
        return handleError(err, res);
    }
}

export const sell = async (req, res) => {
    try {
        const customerId = req.userId;
        const data = req.body;
        await sellTransaction(customerId, data);
        return created(res);
    } catch (err) {
        console.error(err);
        const logObject = {
            error: err,
            body: req.body,
            userId: req.userId
        };
        logger.error('Error while creating sell transaction:', logObject);
        return handleError(err, res);
    }
}

export const summary = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        if (!mongoose.Types.ObjectId.isValid(customerId))
            return res.status(400).json({ message: 'Invalid customer ID', key: 'invalidCustomerId' });

        const [summary] = await transactionSummaryByCustomerId(customerId);
        if (summary) {
            summary.availableToSell = summary.availableToSell < 0 ? 0 : summary.availableToSell;
        }
        return success(res, summary);
    } catch (err) {
        console.error(err);
        const logObject = {
            error: err,
            params: req.params,
            userId: req.userId
        };
        logger.error('Error while fetching customer transaction summary:', logObject);
        return handleError(err, res);
    }
}

export const redeem = async (req, res) => {
    try {
        const customerId = req.userId;
        if (!mongoose.Types.ObjectId.isValid(customerId))
            return res.status(400).json({ message: 'Invalid customer ID', key: 'invalidCustomerId' });

        await redeemTransaction(customerId, req.body);
        return created(res);
    } catch (err) {
        console.error(err);
        const logObject = {
            error: err,
            body: req.body,
            userId: req.userId
        };
        logger.error('Error while fetching customer transaction summary:', logObject);
        return handleError(err, res);
    }
}

export const getAllSummary = async (req, res) => {
    try {
        const aggregatedData = await getAllTransactionSummary();
        return success(res, aggregatedData);
    } catch (err) {
        logger.error(err);
        return handleError(err, res);
    }
}

export const getAllQuantitySummary = async (req, res) => {
    try {
        const aggregatedData = await getAllTransactionQuantitySummary();
        return success(res, aggregatedData);
    } catch (err) {
        logger.error(err);
        return handleError(err, res);
    }
}



function handleError(err, res) {
    if (err instanceof CustomerNotFoundError)
        return res.status(err.status).json({ message: err.message, key: 'customerNotFound' });

    if (err instanceof InvalidTransactionError)
        return res.status(err.status).json({ message: err.message, key: 'invalidTransaction' });

    if (err instanceof NoKYCError)
        return res.status(err.status).json({ message: err.message, key: 'noKYC' });

    if (err instanceof KYCPendingError)
        return res.status(err.status).json({ message: err.message, key: 'kycPending' });

    if (err instanceof KYCRejectedError)
        return res.status(err.status).json({ message: err.message, key: 'kycRejected' });

    if (err instanceof InvalidQuantityError)
        return res.status(err.status).json({ message: err.message, key: 'invalidQuantity' });

    if (err instanceof InvalidAmountError)
        return res.status(err.status).json({ message: err.message, key: 'invalidAmount' });

    if (err instanceof NoGoldPriceError)
        return res.status(err.status).json({ message: err.message, key: 'noGoldPrice' });

    if (err instanceof NotEnoughGoldError)
        return res.status(err.status).json({ message: err.message, key: 'notEnoughGold' });

    return internalServerError(res);
}