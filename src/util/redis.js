import Redis from 'ioredis';

let redis;
export const connectToRedis = () => {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    });

    redis.on('connect', () => {
        console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
        console.error('❌ Redis connection error:', err);
    });
};


export const setKey = (key, value, expiry) => {
    if (!redis) {
        throw new Error('Redis client is not connected');
    }
    return redis.set(key, value, 'EX', expiry);
}

export const deleteKey = (key) => {
    if (!redis) {
        throw new Error('Redis client is not connected');
    }
    return redis.del(key);
}

export const getKey = async (key) => {
    if (!redis) {
        throw new Error('Redis client is not connected');
    }
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
}