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

export const generateServiceToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
};

export const decodeToken = (token) => jwt.decode(token);

// verifies + decodes
export const getTokenInfo = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET); 
};
