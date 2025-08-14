import mongoose from 'mongoose';
import { type } from 'os';

const KycInfoSchema = new mongoose.Schema({
    kycId: { type: String, required: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true },
    issuedDate: { type: Date },
    expiryDate: { type: Date },
    documentUrl: { type: String },
    verified: { type: Boolean, default: false },
    verificationDate: { type: Date },
    verificationComments: { type: String },
    kycStatus: { type: String, enum: ['NotStarted', 'Pending', 'Approved', 'Refer', 'Rejected'], default: 'NotStarted' },
    manualApproved: { type: Boolean, default: false },
    manualApprovalStatus: { type: String, enum: ['Pending', 'Approved', 'Refer', 'Rejected'] },
    manualApprovalComments: { type: String },
    manualapprovalDate: { type: Date },
    manualApprovalBy: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { _id: false });

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

const CustomerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Unspecified'], required: true },
    email: { type: String, required: false },
    emailVerified: { type: Boolean, required: false, default: false },
    country: { type: String, required: true },
    isMpinSet: { type: Boolean, required: false, default: false },
    mpin: { type: String },
    locked: { type: Boolean, default: false },
    lockedReason: { type: String, default: '' },
    wrongMpinCount: { type: Number, default: 0 },
    dob: { type: Date, required: false },
    phone: {
        countryCode: { type: String, required: true },
        number: { type: String, required: true }
    },
    userType: { type: String, enum: ['Consumer', 'Business'], required: true },
    kyc: KycInfoSchema,
    addresses: { type: [AddressSchema], default: [] },
    createdAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
});

// compound unique index
CustomerSchema.index({ 'phone.countryCode': 1, 'phone.number': 1 }, { unique: true });

export default mongoose.model('Customer', CustomerSchema);