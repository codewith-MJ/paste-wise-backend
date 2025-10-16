import { randomBytes, createHash } from "crypto";
import { getRedis } from "@/infra/store/client.js";
import { logger } from "@/app.js";

const NAME_SPACE = "auth:rt";
const REFRESH_TTL_SEC = Number(
	process.env.REFRESH_TOKEN_TTL_SEC || 60 * 60 * 24 * 30
);

const hash = (token: string) => {
	return createHash("sha256").update(token).digest("hex");
};

const createRefreshToken = (): string => {
	return randomBytes(32).toString("hex");
};

const saveRefreshToken = async (userId: string, refreshToken: string) => {
	const key = `${NAME_SPACE}:${userId}:${hash(refreshToken)}`;
	await getRedis().set(key, "1", { EX: REFRESH_TTL_SEC });
	logger.info({ userId }, "[auth] RT saved");
};

const revokeRefreshToken = async (userId: string, refreshToken: string) => {
	const key = `${NAME_SPACE}:${userId}:${hash(refreshToken)}`;
	const n = await getRedis().del(key);
	logger.info({ userId, deleted: n }, "[auth] RT revoked");
};

const isRefreshTokenValid = async (userId: string, refreshToken: string) => {
	const key = `${NAME_SPACE}:${userId}:${hash(refreshToken)}`;
	const v = await getRedis().exists(key);
	const ok = v === 1;
	logger.info({ userId, ok }, "[auth] RT check");
	return ok;
};

export {
	createRefreshToken,
	saveRefreshToken,
	revokeRefreshToken,
	isRefreshTokenValid,
};
