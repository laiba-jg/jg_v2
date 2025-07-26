import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    details: { type: String, required: true },
    retailPrice: { type: Number, required: true },
    costPrice: { type: Number, required: false, default: 0 },
    deliveryCharges: { type: Number, required: false, default: 0 },
    minitingCharges: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },
    transferCharges: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    costAmount: { type: Number, required: false },
    sellPrice: { type: Number, required: false },
    paymentMode: {
        type: String,
        enum: ['CreditCard', 'DebitCard', 'BankTransfer', 'GooglePay', 'ApplePay'],
        required: true
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
    paymentGateway: { type: String, required: false },
    paymentTransactionId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TransactionSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Transaction', TransactionSchema);