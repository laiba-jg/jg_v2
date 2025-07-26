export default class KYCRejectedError extends Error {
    constructor(message = 'KYC Rejected') {
        super(message);
        this.name = 'KYCRejectedError';
        this.status = 404;
    }
}
