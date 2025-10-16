import { exchangeCodeForTokens, verifyIdToken } from "./google-oauth.js";
import { upsertUser } from "@/infra/db/users.js";
import { issueAccessToken } from "@/services/auth/token.js";
import {
	createRefreshToken,
	saveRefreshToken,
} from "@/services/auth/refresh-store.js";
import { User } from "@/types/user.js";

type GoogleNativeLoginInput = {
	authorizationCode: string;
	codeVerifier: string;
	redirectUri: string;
	clientId: string;
	clientSecret: string;
};

type GoogleNativeLoginResult = {
	user: User;
	accessToken: string;
	refreshToken: string;
};

const loginWithGoogleNative = async (
	input: GoogleNativeLoginInput
): Promise<GoogleNativeLoginResult> => {
	const tokens = await exchangeCodeForTokens({
		authorizationCode: input.authorizationCode,
		codeVerifier: input.codeVerifier,
		redirectUri: input.redirectUri,
		clientId: input.clientId,
		clientSecret: input.clientSecret,
	});

	if (!tokens.id_token) {
		const err: any = new Error("No id_token in token response");
		err.details = tokens;
		throw err;
	}

	const googleUser = await verifyIdToken(tokens.id_token, input.clientId);

	const dbUser = await upsertUser({
		id: googleUser.id,
		email: googleUser.email,
		name: googleUser.name,
	});

	const accessToken = issueAccessToken({
		sub: dbUser.id,
		email: dbUser.email,
		name: dbUser.name,
	});
	const refreshToken = createRefreshToken();
	await saveRefreshToken(dbUser.id, refreshToken);

	return {
		user: { id: dbUser.id, email: dbUser.email, name: dbUser.name },
		accessToken,
		refreshToken,
	};
};

export { loginWithGoogleNative };
