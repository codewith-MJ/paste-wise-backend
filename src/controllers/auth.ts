import type { Request, Response } from "express";
import { ERROR_MESSAGES } from "@/constants/error.js";
import { issueAccessToken } from "@/services/auth/token.js";
import {
	isRefreshTokenValid,
	revokeRefreshToken,
} from "@/services/auth/refresh-store.js";
import { UnauthorizedError } from "@/errors/index.js";
import { loginWithGoogleNative } from "@/services/auth/auth.js";

const { AUTH } = ERROR_MESSAGES;

const googleNativeCallback = async (req: Request, res: Response) => {
	const { code, codeVerifier, redirectUri } = req.body || {};

	const clientId = process.env.GOOGLE_CLIENT_ID!;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
	if (!clientId) {
		return res.status(500).json({ message: AUTH.MISSING_CLIENT_ID });
	}

	try {
		const result = await loginWithGoogleNative({
			authorizationCode: code,
			codeVerifier,
			redirectUri,
			clientId,
			clientSecret,
		});

		return res.json(result);
	} catch (err: any) {
		req.log?.error?.({ err }, "[auth] native-callback failed");
		return res.status(500).json({
			message: err?.message ?? AUTH.TOKEN_EXCHANGE_FAILED,
			details: err?.details,
		});
	}
};

const refreshAccessToken = async (req: Request, res: Response) => {
	const { userId, refreshToken } = req.body || {};

	const ok = await isRefreshTokenValid(userId, refreshToken);
	if (!ok) {
		throw new UnauthorizedError("invalid refresh token");
	}

	const accessToken = issueAccessToken({ sub: String(userId), email: "" });

	return res.json({ accessToken });
};

const logout = async (req: Request, res: Response) => {
	const { userId, refreshToken } = req.body || {};
	await revokeRefreshToken(userId, refreshToken);

	return res.json({ ok: true });
};

export { googleNativeCallback, refreshAccessToken, logout };
