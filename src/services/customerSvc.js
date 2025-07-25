import { create, getById, updateCustomer } from '../repositories/customerRepo.js';
import { UserType } from '../util/enums.js';

export async function createProfile(data) {
    data.createdAt = new Date();
    // TODO: change this when B2B comes online
    data.userType = UserType.CONSUMER;
    delete data.emailVerified;
    delete data.kyc;

    return create(data);
}

export const getProfileById = async (id) => getById(id);

export const updateProfile = async (id, data) => {
    delete data.createdAt;
    delete data.phone;
    delete data.kyc;
    return updateCustomer(id, data);
}

// Only allow authorised person to update KYC status
export const updateKYCStatus = async (id, kyc) => {
    const data = { kyc, updatedAt: new Date() };
    return updateCustomer(id, data);
}