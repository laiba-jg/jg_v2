export default class NoKYCError extends Error {
    constructor(message = 'KYC not found') {
        super(message);
        this.name = 'KYCNotFoundError';
        this.status = 404;
    }
}
