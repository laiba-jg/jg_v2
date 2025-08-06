export default class InvalidMpinError extends Error {
    constructor(message = 'Invalid MPIN') {
        super(message);
        this.name = 'InvalidMpinError';
        this.status = 400;
    }
}
