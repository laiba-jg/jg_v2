import { createProfile } from '../services/customerSvc.js';
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
        await updateProfile(id, req.body);
        return noContent();
    } catch (err) {
        logger.error('Error updating profile:', req.params.id, req.body, err);
        return internalServerError(res);
    }
}

export const updateKyc = async (req, res) => {
    try {
        const id = req.params.id;
        await updateKyc(id, req.body);
        return noContent();
    } catch (err) {
        logger.error('Error updating kyc:', req.params.id, req.body, err);
        return internalServerError(res);
    }
}