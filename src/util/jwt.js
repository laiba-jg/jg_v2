import jwt from 'jsonwebtoken';
import settings from '../config/defaults.js';


export const generateTempToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: settings.tokenExpiry
    });
};