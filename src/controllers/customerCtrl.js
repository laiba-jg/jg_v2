import Roles from '../auth/roles.js';
import AccountLockedError from '../errors/AccountLockedError.js';
import CustomerNotFoundError from '../errors/CustomerNotFound.js';
import InvalidMpinError from '../errors/InvalidMpinError.js';
import MpinNotSetError from '../errors/MpinNotSetError.js';
import NoPhoneError from '../errors/NoPhoneError.js';
import SendOTPError from '../errors/SendOTPError.js';
import WrongMpinError from '../errors/WrongMpinError.js';
import ProfileSchema from '../schema/ProfileSchema.js';
import customerSvc, { createProfile, generateAndSendOTP, getAllCustomersByPagination, isOTPValid, setMpin, totalCustomers, updateProfile as updateCustomerProfile, validateMpin , resetMpin} from '../services/customerSvc.js';
import { AuthTokenType } from '../util/enums.js';
import { generateTempToken, generateToken } from '../util/jwt.js';
import logger from '../util/logger.js';
import { badRequest, created, internalServerError, noContent, notFound, success } from '../util/response.js';

export const create = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = ProfileSchema.validate(data);
        if (validationResult.error) return badRequest(res, { message: validationResult.error.details, key: '400' });

        const profile = await createProfile(data);
        const token = await generateToken({ tokenType: AuthTokenType.CUSTOMER, id: profile._id, role: Roles.CUSTOMER });
        return created(res, { token, key: '201' });
    } catch (err) {
        logger.error('Error creating profile:', err);
        if (err.code === 11000) {
            logger.warn('Duplicate email error:', req.body, err);
            return res.status(409).json({ message: 'Account already exists', key: 'duplicateAccount' });
        }
        return internalServerError(res);
    }
};

export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await getProfileById(id);
        if (!profile) return notFound(res);
        return success(res);
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

export const sendOTP = async (req, res) => {
    try {
        await generateAndSendOTP(req.body.phone);
        return success(res, { message: 'OTP sent successfully', key: 'otpSent' });
    } catch (err) {
        console.error(err);
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
        const { phone, otp, language } = req.body;

        const isValid = await isOTPValid(phone, otp);
        if (isValid) {
        const customer = await customerSvc.getCustomerByPhone(phone);

        const payload = customer
            ? {
                tokenType: AuthTokenType.CUSTOMER,
                customerExists: true,
                id: customer._id,
                role: Roles.CUSTOMER,
            }
            : {
                tokenType: AuthTokenType.TEMPORARY,
                phone,
                role: Roles.CUSTOMER,
            };

        if (language) {
            payload.language = language; 
        }

        const token = customer
            ? await generateToken(payload)
            : await generateTempToken(payload);
        return success(res, { token });
        }
        return res.status(400).json({ message: 'Invalid OTP', key: 'invalidOTP' });
    } catch (err) {
        const logObj = {
            message: err.message,
            phone: req.body.phone,
        }
        logger.error('Error verifying OTP:', logObj);
        return handleError(err, res);
    }
}

export const createMpin = async (req, res) => {
    try {
        const id = req.user.id;
        const { mpin } = req.body;
        await setMpin(id, mpin);
        return noContent(res);
    } catch (err) {
        logger.error('Error setting MPIN:', err, req.params.id, req.body);
        return handleError(err, res);
    }
}

export const verifyMpin = async (req, res) => {
    try {
        const id = req.user.id;
        const { mpin } = req.body;
        await validateMpin(id, mpin);
        const token = await generateToken({ tokenType: AuthTokenType.CUSTOMER, id: req.user.id, role: req.user.role });
        return success(res, { token });
    } catch (err) {
        logger.error('Error verifying MPIN:', err, req.params.id, req.body);
        return handleError(err, res);
    }
}

export const forgotMpin = async (req, res) => {
    try {
        const customerId = req.user.id; 
        const result = await resetMpin(customerId);
        return success(res, result);
    } catch (err) {
        logger.error('Error in forgotMpin:', { message: err.message, customerId: req.user.id });
        return handleError(err, res);
    }
}

export const getAll = async (req, res) => {
    try {
        const offset = req.query?.offset || 0;
        const limit = req.query?.limit || 10;
        const paginatedData = await getAllCustomersByPagination(offset, limit);
        return success(res, paginatedData);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
}

export const getTotalCustomers = async (req, res) => {
    try {
        const count = await totalCustomers();
        return success(res, { count });
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
}

const handleError = (err, res) => {
    if (err instanceof InvalidMpinError) {
        return res.status(err.status).json({ message: err.message, key: 'invalidMpin' });
    }
    if (err instanceof CustomerNotFoundError) {
        return res.status(err.status).json({ message: err.message, key: 'customerNotFound' });
    }
    if (err instanceof NoPhoneError) {
        return res.status(err.status).json({ message: err.message, key: 'noPhone' });
    }
    if (err instanceof SendOTPError) {
        return res.status(500).json({ message: 'Failed to send OTP', key: 'otpSendFailed' });
    }
    if (err instanceof AccountLockedError) {
        return res.status(401).json({ message: 'Too many wrong Mpin attempts', key: 'tooManyAttempts' });
    }
    if (err instanceof WrongMpinError) {
        return res.status(401).json({ message: 'Wrong MPIN', key: 'wrongMpin' });
    }
    if (err instanceof MpinNotSetError) {
        return res.status(401).json({ message: 'No MPIN', key: 'mPinNotSet' });
    }
    if (err instanceof ForgotMpinError) {
        return res.status(err.status).json({ message: err.message, key: 'forgotMpinFailed' });
    }

    return internalServerError(res);
}

export default {
    getTotalCustomers,
}