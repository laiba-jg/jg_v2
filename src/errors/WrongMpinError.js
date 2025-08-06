export default class WrongMpinError extends Error {
    constructor(message = 'Wrong MPIN') {
        super(message);
        this.name = 'WrongMpinError';
        this.status = 401;
    }
}
