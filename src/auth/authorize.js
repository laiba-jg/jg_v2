import { forbidden } from "../util/response.js";

export default function authorize(action, resource, checkOwner = false) {
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
