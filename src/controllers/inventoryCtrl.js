import logger from '../util/logger.js';
import { internalServerError, noContent, success } from '../util/response.js';
import inventorySvc from '../services/inventorySvc.js';

const getAll = async (req, res) => {
    try {
        const inventory = await inventorySvc.getAll();
        return success(res, inventory);
    } catch (err) {
        logger.error(err);
        internalServerError(res);
    }
};

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const data = {
            userId,
            quantity: req.body.quantity
        };
        await inventorySvc.updateQuantity(id, data);
        return noContent(res);
    } catch (err) {
        logger.error(err);
        internalServerError(res);
    }
};

export default {
    getAll,
    update,
}