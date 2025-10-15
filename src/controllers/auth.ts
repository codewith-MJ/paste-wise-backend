import type { Request, Response } from "express";
import { exchangeCodeForTokens, verifyIdToken } from "@/services/auth.js";
import { ERROR_MESSAGES } from "@/constants/error.js";

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
			code,
			codeVerifier,
			redirectUri,
			clientId,
			clientSecret,
		});

		if (!tokens.id_token) {
			return res.status(400).json({ message: AUTH.NO_ID_TOKEN, tokens });
		}

		const user = await verifyIdToken(tokens.id_token, clientId);

		return res.json({ user });
	} catch (err: any) {
		req.log?.error?.({ err }, "[auth] native-callback failed");
		return res.status(500).json({
			message: err?.message ?? AUTH.TOKEN_EXCHANGE_FAILED,
			details: err?.details,
		});
	}
};

export { googleNativeCallback };
