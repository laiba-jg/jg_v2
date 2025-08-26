import crypto from 'crypto';
import logger from './logger.js';
import SendOTPError from '../errors/SendOTPError.js';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

export function generateOTP() {
    const otp = crypto.randomInt(1000, 10000); // 1000 to 9999 inclusive
    return otp.toString();
}

export async function sendSMS(phone, otp) {
    try {
        const message = `Your OTP code is ${otp}, Do not share this with anyone.
     Just gold or its representatives will never ask you for OTP.`;
        await client.messages.create({
            body: message,
            from: twilioPhone,
            to: phone.countryCode + phone.number
        });
    } catch (err) {
        logger.error(err);
        throw new SendOTPError();
    }
}