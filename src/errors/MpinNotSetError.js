export default class MpinNotSetError extends Error {
    constructor(message = 'mPIN not set') {
        super(message);
        this.name = 'MpinNotSetError';
        this.status = 404;
    }
}
