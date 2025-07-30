import jwt from 'jsonwebtoken';
import settings from '../config/defaults.js';

export const generateToken = (userId, role) => {
    const payload = {
        id: userId,
        role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: settings.tokenExpiry
    });

    return token;
};