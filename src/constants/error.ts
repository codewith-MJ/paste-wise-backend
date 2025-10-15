const ERROR_MESSAGES = {
	INTERNAL_SERVER_ERROR: "Internal Server Error",

	VALIDATION: {
		TONE_PROMPT_REQUIRED: "tonePrompt is required",
		TONE_STRENGTH_MIN: "toneStrength must be at least 0",
		TONE_STRENGTH_MAX: "toneStrength must not exceed 100",
		ORIGINAL_TEXT_REQUIRED: "originalText is required",

		GOOGLE_CODE_REQUIRED: "Google authorization code is required",
		GOOGLE_CODE_VERIFIER_REQUIRED: "Google codeVerifier is required",
		GOOGLE_REDIRECT_URI_REQUIRED: "Google redirectUri is required",

		USER_ID_REQUIRED: "userId is required",
		REFRESH_TOKEN_REQUIRED: "refreshToken is required",
	},
	AUTH: {
		MISSING_CLIENT_ID: "Server misconfigured: GOOGLE_CLIENT_ID missing",
		NO_ID_TOKEN: "No id_token in token response",
		TOKEN_EXCHANGE_FAILED: "Google token exchange failed",
	},
} as const;

export { ERROR_MESSAGES };
