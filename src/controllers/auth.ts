import type { Request, Response } from "express";
import { exchangeCodeForTokens, verifyIdToken } from "@/services/auth.js";

const googleNativeCallback = async (req: Request, res: Response) => {
	const { code, codeVerifier, redirectUri } = req.body || {};
	if (!code || !codeVerifier || !redirectUri) {
		return res
			.status(400)
			.json({ message: "Missing code/codeVerifier/redirectUri" });
	}

	const clientId = process.env.GOOGLE_CLIENT_ID || "";
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
	if (!clientId) {
		return res
			.status(500)
			.json({ message: "Server misconfigured: GOOGLE_CLIENT_ID missing" });
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
			return res
				.status(400)
				.json({ message: "No id_token in token response", tokens });
		}

		const user = await verifyIdToken(tokens.id_token, clientId);

		return res.json({ user });
	} catch (err: any) {
		req.log?.error?.({ err }, "[auth] native-callback failed");
		return res.status(500).json({
			message: err?.message ?? "OAuth exchange/verify failed",
			details: err?.details,
		});
	}
};

export { googleNativeCallback };
