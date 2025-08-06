export default class AccountLockedError extends Error {
    constructor(message = 'Account Locked') {
        super(message);
        this.name = 'AccountLockedError';
        this.status = 401;
    }
}
