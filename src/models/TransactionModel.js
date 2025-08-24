import mongoose from 'mongoose';


const AddressSchema = new mongoose.Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: true },
    addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    isPrimary: { type: Boolean, default: false }
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    details: { type: String, required: true },
    retailPrice: { type: Number, required: false },
    costPrice: { type: Number, required: false, default: 0 },
    deliveryCharges: { type: Number, required: false, default: 0 },
    minitingCharges: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },
    transferCharges: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: false },
    costAmount: { type: Number, required: false },
    sellPrice: { type: Number, required: false },
    paymentMode: {
        type: String,
        required: false
    },
    transactionType: {
        type: String,
        enum: ['Buy', 'Sell', 'Redeem', 'BuyForDelivery'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
        default: 'Pending'
    },
    deliveryAddress: AddressSchema,
    paymentGateway: { type: String, required: false },
    paymentTransactionId: { type: String, required: false },
    paymentReferenceId: { type: String, required: false },
    paymentId: { type: String, required: false },
    createdAt: { type: Date },
    updatedAt: { type: Date, default: Date.now }
});

TransactionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Transaction', TransactionSchema);