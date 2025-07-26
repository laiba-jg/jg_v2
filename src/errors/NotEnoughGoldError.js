export default class NotEnoughGoldError extends Error {
    constructor(message = 'Not Enough Eligible Gold') {
        super(message);
        this.name = 'NotEnoughGoldError';
        this.status = 400;
    }
}
