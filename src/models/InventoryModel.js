import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["24K", "22K", "18K"],
        default: "24K",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    updatedBy: {
        type: String,
    }
}, {
    timestamps: true,
    collection: 'inventoryV2'
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;