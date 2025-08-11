export default class UserInactiveError extends Error {
    constructor(message = 'Inactive User') {
        super(message);
        this.name = 'UserInactiveError';
        this.status = 401;
    }
}
