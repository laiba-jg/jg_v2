import jwt from 'jsonwebtoken';
import { unauthorised } from '../util/response.js';
import { validateSignature } from 'myfatoorah-toolkit';
import logger from '../util/logger.js';

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return unauthorised(res);

    const token = authHeader.split(' ')[1];
    if (!token) return unauthorised(res);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return unauthorised(res);
        req.user = decoded;
        next();
    });
};

export async function validateMyFatoorahSignature(req, res, next) {
    try {
        const signature = req.headers['myfatoorah-signature'];
        if (!signature) return unauthorised(res);
        const isValid = await validateSignature(req.body, signature, process.env.MY_FATOORAH_SECRET);
        if (!isValid) {
            logger.info('MyFatoorah webhook signature validation failed');
            return unauthorised(res);
        }
        logger.info('MyFatoorah webhook signature validated');
        next();
    } catch (err) {
        logger.error(err);
        return unauthorised(res);
    }
}

export default authenticate;