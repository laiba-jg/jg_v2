export default class CustomerNotFoundError extends Error {
    constructor(message = 'Customer not found') {
        super(message);
        this.name = 'CustomerNotFoundError';
        this.status = 404;
    }
}
