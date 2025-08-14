import AccountLockedError from '../errors/AccountLockedError.js';
import CustomerNotFoundError from '../errors/CustomerNotFound.js';
import InvalidMpinError from '../errors/InvalidMpinError.js';
import MpinNotSetError from '../errors/MpinNotSetError.js';
import WrongMpinError from '../errors/WrongMpinError.js';
import { countCustomers, create, getAllCustomers, getCustomerById, updateCustomer } from '../repositories/customerRepo.js';
import { comparePassword, hashPassword } from '../util/crypto.js';
import { KYCStatus, UserType } from '../util/enums.js';
import { generateOTP, sendSMS } from '../util/otp.js';
import { deleteKey, getKey, setKey } from '../util/redis.js';

export async function createProfile(data) {
    data.createdAt = new Date();
    // TODO: change this when B2B comes online
    data.userType = UserType.CONSUMER;
    delete data.emailVerified;
    delete data.kyc;

    data.kyc = {
        kycStatus: KYCStatus.NOT_STARTED
    };

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
    if (storedOtp === userOTP) {
        await deleteKey(redisKey);
        return true;
    }
    return false;
}

export const setMpin = async (id, mpin) => {
    if (!mpin || mpin.length !== 4) throw new InvalidMpinError();
    const customer = await getCustomerById(id);
    if (!customer) throw new CustomerNotFoundError();
    const hashedMpin = await hashPassword(mpin);
    customer.mpin = hashedMpin;
    customer.isMpinSet = true;
    customer.wrongMpinCount = 0;
    return updateCustomer(id, customer);
}

export const validateMpin = async (id, mpin) => {
    const customer = await getCustomerById(id);
    if (!customer) throw new CustomerNotFoundError();
    if (!customer.isMpinSet) throw new MpinNotSetError();
    if (customer.locked) throw new AccountLockedError();

    const isValid = await comparePassword(mpin, customer.mpin);
    if (!isValid) {
        customer.wrongMpinCount += 1;
        if (customer.wrongMpinCount >= 5) {
            customer.locked = true;
            customer.lockedReason = 'Too many wrong MPIN attempts';
        }
        await updateCustomer(id, customer);
        throw new WrongMpinError();
    }
    customer.wrongMpinCount = 0;
    await updateCustomer(id, customer);
    return true;
}

export const getAllCustomersByPagination = async (offset, limit) => {
    const count = await countCustomers();
    const data = await getAllCustomers({ offset, limit });
    return {
        items: data,
        count,
    };
};

export const totalCustomers = () => countCustomers();