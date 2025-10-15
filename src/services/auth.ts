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

const exchangeCodeForTokens = async (opts: {
	code: string;
	codeVerifier: string;
	redirectUri: string;
	clientId: string;
	clientSecret?: string;
}): Promise<TokenResponse> => {
	const params = new URLSearchParams({
		grant_type: "authorization_code",
		code: opts.code,
		client_id: opts.clientId,
		code_verifier: opts.codeVerifier,
		redirect_uri: opts.redirectUri,
	});
	if (opts.clientSecret) params.set("client_secret", opts.clientSecret);

	const resp = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString(),
	});

	const text = await resp.text();
	if (!resp.ok) {
		const err = new Error(`Token exchange failed: ${resp.status}`);
		(err as any).details = text;
		throw err;
	}

	return JSON.parse(text) as TokenResponse;
};

const verifyIdToken = async (
	idToken: string,
	clientId: string
): Promise<GoogleUser> => {
	const client = new OAuth2Client(clientId);
	const ticket = await client.verifyIdToken({ idToken, audience: clientId });
	const p = ticket.getPayload();

	if (!p?.sub || !p?.email) {
		throw new Error("Invalid Google ID token payload");
	}

	return {
		id: p.sub,
		name: p.name ?? p.given_name ?? "",
		email: p.email,
	};
};

export { exchangeCodeForTokens, verifyIdToken };
