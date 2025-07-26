export default class KYCPendingError extends Error {
    constructor(message = 'KYC Pending') {
        super(message);
        this.name = 'KYCPendingError';
        this.status = 400;
    }
}
