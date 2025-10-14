import { google } from "googleapis";

const oauth2 = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	process.env.GOOGLE_REDIRECT_URI!
);

const createGoogleConsentUrl = (): string => {
	return oauth2.generateAuthUrl({
		access_type: "offline",
		include_granted_scopes: true,
		prompt: "consent",
		scope: process.env.GOOGLE_OAUTH_SCOPES!.split(" "),
	});
};

export { createGoogleConsentUrl };
