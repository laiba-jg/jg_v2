import { forbidden } from "../util/response.js";

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
    const otpCountryCode = req.user?.countryCode;
    const otpPhoneNumber = req.user?.number;
    const profilePhone = req.body.phone;
    if (!otpPhoneNumber
        || !profilePhone
        || otpPhone.countryCode !== otpCountryCode
        || otpPhone.number !== otpPhoneNumber)
        return forbidden(res);

    next();
}