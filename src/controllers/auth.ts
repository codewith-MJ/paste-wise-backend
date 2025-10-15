import type { Request, Response } from "express";
import { exchangeCodeForTokens, verifyIdToken } from "@/services/auth/auth.js";
import { ERROR_MESSAGES } from "@/constants/error.js";
import { issueAccessToken } from "@/services/auth/token.js";
import {
	createRefreshToken,
	isRefreshTokenValid,
	revokeRefreshToken,
	saveRefreshToken,
} from "@/services/auth/refresh-store.js";
import { UnauthorizedError, BadRequestError } from "@/errors/index.js";

const { AUTH } = ERROR_MESSAGES;

const googleNativeCallback = async (req: Request, res: Response) => {
	const { code, codeVerifier, redirectUri } = req.body || {};

	const clientId = process.env.GOOGLE_CLIENT_ID || "";
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
	if (!clientId) {
		return res.status(500).json({ message: AUTH.MISSING_CLIENT_ID });
	}

	try {
		const tokens = await exchangeCodeForTokens({
			authorizationCode: code,
			codeVerifier,
			redirectUri,
			clientId,
			clientSecret,
		});

		if (!tokens.id_token) {
			return res.status(400).json({ message: AUTH.NO_ID_TOKEN, tokens });
		}

		const user = await verifyIdToken(tokens.id_token, clientId);

		const accessToken = issueAccessToken({
			sub: user.id,
			email: user.email,
			name: user.name,
		});
		const refreshToken = createRefreshToken();
		await saveRefreshToken(user.id, refreshToken);

		return res.json({ user, accessToken, refreshToken });
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
