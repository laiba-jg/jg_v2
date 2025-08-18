import mongoose from "mongoose";
import seedGoldInventory from "./inventorySeed.js";


(async function () {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27018/justgold-db');
    await seedGoldInventory();
    await mongoose.disconnect();
})();