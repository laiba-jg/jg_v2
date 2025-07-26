export default class InvalidTransactionError extends Error {
    constructor(message = 'Invalid Transaction') {
        super(message);
        this.name = 'InvalidTransactionError';
        this.status = 400;
    }
}
