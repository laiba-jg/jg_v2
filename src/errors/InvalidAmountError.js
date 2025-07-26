export default class InvalidAmountError extends Error {
    constructor(message = 'Invalid Amount') {
        super(message);
        this.name = 'InvalidAmountError';
        this.status = 400;
    }
}
