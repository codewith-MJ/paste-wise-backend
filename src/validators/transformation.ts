import { ValidationError } from "@/errors/ValidationError.js";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ERROR_MESSAGES } from "@/constants/error.js";

const {
	TONE_PROMPT_REQUIRED,
	TONE_STRENGTH_MAX,
	TONE_STRENGTH_MIN,
	ORIGINAL_TEXT_REQUIRED,
} = ERROR_MESSAGES.VALIDATION;

const booleanLike = z.union([z.boolean(), z.number()]).transform((v) => !!v);

const transformationSchema = z.strictObject({
	toneInfo: z.strictObject({
		tonePrompt: z.string().min(1, TONE_PROMPT_REQUIRED),
		toneStrength: z
			.number()
			.min(0, TONE_STRENGTH_MIN)
			.max(100, TONE_STRENGTH_MAX),
		emojiAllowed: booleanLike,
	}),
	isTranslated: booleanLike,
	originalText: z.string().min(1, ORIGINAL_TEXT_REQUIRED),
});

const validateTransformationRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const data = transformationSchema.parse(req.body);
		req.body = data;
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new ValidationError(error);
		}
	}
};

export { validateTransformationRequest };
