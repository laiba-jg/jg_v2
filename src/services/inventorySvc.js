import inventoryRepo from "../repositories/inventoryRepo.js";

function getAll() {
    return inventoryRepo.getAll();
}

function updateQuantity(id, data) {
    return inventoryRepo.updateQuantity(id, data);
}

export default {
    getAll,
    updateQuantity,
}
