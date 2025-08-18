import Inventory from '../models/InventoryModel.js';
import { GoldType } from '../util/enums.js';

export default async function seedGoldInventory() {
    const exists = await Inventory.findOne({ type: GoldType.TWENTY_FOUR_KARAT });
    if (!exists) {
        await Inventory.create({
            type: GoldType.TWENTY_FOUR_KARAT,
            quantity: 0,
        });

        console.log('✅ Seeded Inventory');
    } else {
        console.log('ℹ️ Item already exists in Inventory');
    }
}

