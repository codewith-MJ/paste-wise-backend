import { OAuth2Client } from "google-auth-library";

type TokenResponse = {
	id_token?: string;
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string;
	token_type?: string;
};

type GoogleUser = {
	id: string;
	name: string;
	email: string;
};

const exchangeCodeForTokens = async ({
	authorizationCode,
	codeVerifier,
	redirectUri,
	clientId,
	clientSecret,
}: {
	authorizationCode: string;
	codeVerifier: string;
	redirectUri: string;
	clientId: string;
	clientSecret?: string;
}): Promise<TokenResponse> => {
	const params = new URLSearchParams({
		grant_type: "authorization_code",
		code: authorizationCode,
		client_id: clientId,
		code_verifier: codeVerifier,
		redirect_uri: redirectUri,
	});
	if (clientSecret) params.set("client_secret", clientSecret);

	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString(),
	});

	const responseText = await response.text();
	if (!response.ok) {
		const error = new Error(`Token exchange failed: ${response.status}`);
		(error as any).details = responseText;
		throw error;
	}

	return JSON.parse(responseText) as TokenResponse;
};

const verifyIdToken = async (
	idToken: string,
	clientId: string
): Promise<GoogleUser> => {
	const googleClient = new OAuth2Client(clientId);
	const verificationTicket = await googleClient.verifyIdToken({
		idToken,
		audience: clientId,
	});

	const payload = verificationTicket.getPayload();
	if (!payload?.sub || !payload?.email) {
		throw new Error("Invalid Google ID token payload");
	}

	return {
		id: payload.sub,
		name: payload.name ?? payload.given_name ?? "",
		email: payload.email,
	};
};

export { exchangeCodeForTokens, verifyIdToken };
