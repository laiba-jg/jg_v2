import { forbidden } from "../util/response.js";
import Roles from "./roles.js";
import ac from './permissions.js';


export function authorize(action, resource, checkOwner = false) {
    return (req, res, next) => {
        const role = req.user?.role;
        const userId = req.user?.id;
        const resourceOwnerId = req.params?.id || req.params?.customerId || req.params?.userId;

        if (!role) return forbidden(res);

        let permission = checkOwner && userId === resourceOwnerId
            ? ac.can(role)[`${action}Own`](resource)
            : ac.can(role)[`${action}Any`](resource);

        if (!permission.granted) return forbidden(res);

        next();
    };
}

export function authorizeCreateProfile(req, res, next) {
    const otpCountryCode = req.user?.phone?.countryCode;
    const otpPhoneNumber = req.user?.phone?.number;
    const profileCountryCode = req.body.countryCode;
    const profilePhoneNumber = req.body.number;

    if (!otpPhoneNumber
        || !profilePhoneNumber
        || otpCountryCode !== profileCountryCode
        || otpPhoneNumber !== profilePhoneNumber)
        return forbidden(res);

    next();
}

export function authorizeCreateUpdateUser(req, res, next) {
    const userRole = req.user?.role;
    const userId = req.user?.id;
    const createRole = req.body.role;

    if (userRole === Roles.USER) return forbidden(res);
    if (userRole === Roles.ADMIN && createRole === Roles.SUPER_ADMIN) return forbidden(res);
    if (userRole === Roles.SUPER_ADMIN) return next();
    return next();
}