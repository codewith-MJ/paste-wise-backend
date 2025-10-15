import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

let client: ReturnType<typeof createClient> | null = null;

const getRedis = () => {
	if (!client) {
		client = createClient({ url: REDIS_URL });
	}
	return client;
};

const connectRedis = async () => {
	const redis = getRedis();
	if (!redis.isOpen) await redis.connect();
};

const disconnectRedis = async () => {
	if (client && client.isOpen) await client.quit();
	client = null;
};

export { getRedis, connectRedis, disconnectRedis };
