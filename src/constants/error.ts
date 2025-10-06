const ERROR_MESSAGES = {
	INTERNAL_SERVER_ERROR: "Internal Server Error",

	VALIDATION: {
		TONE_PROMPT_REQUIRED: "tonePrompt is required",
		TONE_STRENGTH_MIN: "toneStrength must be at least 0",
		TONE_STRENGTH_MAX: "toneStrength must not exceed 100",
		ORIGINAL_TEXT_REQUIRED: "originalText is required",
	},
} as const;

export { ERROR_MESSAGES };
