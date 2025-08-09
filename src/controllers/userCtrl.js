import mongoose from 'mongoose';
import UserSchema from '../schema/UserSchema.js';
import userService from '../services/userService.js';
import logger from '../util/logger.js';
import { badRequest, conflict, created, internalServerError, noContent, notFound, success } from '../util/response.js';
import WrongCredentials from '../errors/WrongCredentials.js';

const createUser = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = UserSchema.validate(data, { abortEarly: false });
        if (validationResult.error) {
            const messages = validationResult.error.details.map(err => err.message);
            return badRequest(res, messages);
        }
        await userService.createUser(data);
        created(res);
    } catch (err) {
        logger.error(err);
        if (err?.message?.indexOf('duplicate key error') > -1)
            return conflict(res);
        internalServerError(res);
    }
};

const updateUser = async (req, res) => {
    try {
        await userService.updateUser(req.params.id, req.body);
        noContent(res);
    } catch (err) {
        internalServerError(res);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        success(res, users);
    } catch (err) {
        logger.error(err);
        internalServerError(res);
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return badRequest(res, { message: 'Invalid User Id', key: 'invalidId' });
        const user = await userService.getUserById(id);
        if (!user) return notFound();
        success(res, user);
    } catch (err) {
        logger.error(err);
        internalServerError(err);
    }
};

const deactivateUser = async (req, res) => {
    try {
        await userService.deactivateUser(req.params.id);
        noContent(res);
    } catch (err) {
        logger.error(err);
        internalServerError(res);
    }
};

const loginUser = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return badRequest(res);
        const token = await userService.loginUser(req.body);
        return success(res, { token });
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};

const handleError = (err, res) => {
    if (err instanceof WrongCredentials) {
        return res.status(err.status).json({ message: err.message, key: 'wrongCredentials' });
    }
    return internalServerError(res);
}

export default {
    getAllUsers,
    getUserById,
    updateUser,
    createUser,
    deactivateUser,
    loginUser,
}