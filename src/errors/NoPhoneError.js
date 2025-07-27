export default class NoPhoneError extends Error {
    constructor(message = 'No Phone number or country code provided') {
        super(message);
        this.name = 'NoPhoneError';
        this.status = 404;
    }
}
