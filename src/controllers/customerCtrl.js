import NoPhoneError from '../errors/NoPhoneError.js';
import { createProfile, generateAndSentOTP, isOTPValid, updateProfile as updateCustomerProfile, updateKYCStatus } from '../services/customerSvc.js';
import logger from '../util/logger.js';
import { created, internalServerError, noContent, notFound, success } from '../util/response.js';

export const create = async (req, res) => {
    try {
        const data = req.body;
        await createProfile(data);
        return created(res);
    } catch (err) {
        if (err.code === 11000) {
            logger.warn('Duplicate email error:', req.body, err);
            return res.status(409).json({ message: 'Email already exists', key: 'duplicateEmail' });
        }
        logger.error('Error creating profile:', req.body, err);
        return internalServerError(res);
    }
};

export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await getProfileById(id);
        if (!profile) return notFound(res);
        return success(profile);
    } catch (err) {
        logger.error('Error fetching profile:', req.params.id, err);
        return internalServerError(res);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const id = req.params.id;
        await updateCustomerProfile(id, req.body);
        return noContent(res);
    } catch (err) {
        logger.error('Error updating profile:', err, req.params.id, req.body);
        return internalServerError(res);
    }
}

export const updateKyc = async (req, res) => {
    try {
        const id = req.params.id;
        await updateKYCStatus(id, req.body);
        return noContent(res);
    } catch (err) {
        logger.error('Error updating kyc:', req.params.id, req.body, err);
        return internalServerError(res);
    }
}

export const sendOTP = async (req, res) => {
    try {
        generateAndSentOTP(req.body.phone);
        return success(res, { message: 'OTP sent successfully', key: 'otpSent' });
    } catch (err) {
        const logObj = {
            message: err.message,
            phone: req.body.phone,
            stack: err.stack
        }
        logger.error('Error sending OTP:', logObj);
        handleError(err, res);
    }
}

export const verifyOTP = async (req, res) => {
    try {
        if (isOTPValid(req.body.phone, req.body.otp)) {
            // Generate a JWT token
            return success(res, { message: 'OTP sent successfully', key: 'otpSent' });
        }
        return res.status(400).json({ message: 'Invalid OTP', key: 'invalidOTP' });
    } catch (err) {
        const logObj = {
            message: err.message,
            phone: req.body.phone,
            stack: err.stack
        }
        logger.error('Error sending OTP:', logObj);
        handleError(err, res);
    }
}

const handleError = (err, res) => {
    if (err instanceof NoPhoneError) {
        return res.status(err.status).json({ message: err.message, key: 'noPhone' });
    }
    if (err instanceof SendOTPError) {
        return res.status(500).json({ message: 'Failed to send OTP', key: 'otpSendFailed' });
    }
    return internalServerError(res);
}