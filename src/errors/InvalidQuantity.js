export default class InvalidQantityError extends Error {
    constructor(message = 'Invalid Quantity') {
        super(message);
        this.name = 'InvalidQantityError';
        this.status = 400;
    }
}
