import { create, getCustomerById, updateCustomer } from '../repositories/customerRepo.js';
import { UserType } from '../util/enums.js';
import { generateOTP, sendSMS } from '../util/otp.js';
import { deleteKey, getKey, setKey } from '../util/redis.js';

export async function createProfile(data) {
    data.createdAt = new Date();
    // TODO: change this when B2B comes online
    data.userType = UserType.CONSUMER;
    delete data.emailVerified;
    delete data.kyc;

    return create(data);
}

export const getProfileById = async (id) => getCustomerById(id);

export const updateProfile = async (id, data) => {
    delete data.createdAt;
    delete data.phone;
    delete data.kyc;
    return updateCustomer(id, data);
}

// Only allow authorised person to update KYC status
export const updateKYCStatus = async (id, kyc) => {
    return updateCustomer(id, kyc);
}

export const generateAndSendOTP = async (phone) => {
    if (!phone || !phone.countryCode || !phone.number)
        throw new NoPhoneError();
    const toPhone = phone.countryCode + phone.number;
    const otp = generateOTP();
    await setKey(`otp:${toPhone}`, otp, 300); // 5mns
    await sendSMS(phone, otp);
}

export const isOTPValid = async (phone, userOTP) => {
    if (!phone || !phone.countryCode || !phone.number)
        throw new NoPhoneError()
    const toPhone = phone.countryCode + phone.number;
    const redisKey = `otp:${toPhone}`;
    const storedOtp = await getKey(redisKey);
    console.log('stored otp', storedOtp, userOTP);
    if (storedOtp === userOTP) {
        await deleteKey(redisKey);
        return true;
    }
    return false;
}