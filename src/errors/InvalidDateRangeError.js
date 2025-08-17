export default class InvalidDateRangeError extends Error {
    constructor(message = 'Invalid Date Range') {
        super(message);
        this.name = 'InvalidDateRangeError';
        this.status = 400;
    }
}
