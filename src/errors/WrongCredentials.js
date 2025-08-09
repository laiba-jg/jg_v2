export default class WrongCredentials extends Error {
    constructor(message = 'Wrong email or password') {
        super(message);
        this.name = 'WrongCredentials';
        this.status = 404;
    }
}
