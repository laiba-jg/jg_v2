import Inventory from "../models/InventoryModel.js";

function getAll() {
    return Inventory.find();
}

function updateQuantity(id, data) {
    return Inventory.findByIdAndUpdate(id, {
        $inc: { quantity: data.quantity },
        $set: { updatedBy: data.userId }
    });
}

export default {
    getAll,
    updateQuantity,
}
