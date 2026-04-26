import { Redis } from '@upstash/redis'

/**
 * BandhanNova Redis Client (Upstash)
 * Used for high-speed caching of blog metadata and session/view management.
 */

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Set a value in Redis with optional expiration
 */
export async function setCache(key: string, value: any, ex?: number) {
    try {
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        if (ex) {
            return await redis.set(key, data, { ex });
        }
        return await redis.set(key, data);
    } catch (error) {
        console.error('Redis Set Error:', error);
    }
}

/**
 * Get a value from Redis
 */
export async function getCache(key: string) {
    try {
        const data = await redis.get(key);
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        }
        return data;
    } catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
}

/**
 * Delete a value from Redis
 */
export async function deleteCache(key: string) {
    try {
        return await redis.del(key);
    } catch (error) {
        console.error('Redis Delete Error:', error);
    }
}

export default redis;
