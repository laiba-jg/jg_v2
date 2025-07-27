export default class NoRedisConnectionError extends Error {
    constructor(message = 'Redis Unavailable') {
        super(message);
        this.name = 'NoRedisConnectionError';
        this.status = 400;
    }
}
