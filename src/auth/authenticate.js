import jwt from 'jsonwebtoken';
import { unauthorised } from '../util/response.js';

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

export default authenticate;