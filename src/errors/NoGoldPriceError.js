export default class NoGoldPriceError extends Error {
    constructor(message = 'Gold Price Not Available') {
        super(message);
        this.name = 'NoGoldPriceError';
        this.status = 404;
    }
}
