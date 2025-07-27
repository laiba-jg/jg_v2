export default class SendOTPError extends Error {
    constructor(message = 'Failed to send OTP') {
        super(message);
        this.name = 'SendOTPError';
        this.status = 500;
    }
}
