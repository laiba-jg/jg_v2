import mongoose from 'mongoose';

const GoldPriceSchema = new mongoose.Schema({
    price24K: { type: Number, required: true },
    price22K: { type: Number },
    price21K: { type: Number },
    price18K: { type: Number },
    timestamp: { type: Date, default: Date.now },
    timeOfDay: { type: String, enum: ["morning", "evening", "afternoon"], required: true },
    lowPrice: { type: Number, default: 0 },
    highPrice: { type: Number, default: 0 }
});

export default mongoose.model('GoldPrice', GoldPriceSchema);