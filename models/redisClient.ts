import * as redis from 'redis';
import dotenv from "dotenv"

dotenv.config()

const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || '0')
const REDIS_HOST = process.env.REDIS_HOST || ''

export const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

redisClient.on("connect", () => {
    console.log("Connected redis client...");
});

redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
});
