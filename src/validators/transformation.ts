import { ValidationError } from "@/errors/ValidationError.js";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const booleanLike = z.union([z.boolean(), z.number()]).transform((v) => !!v);

const transformationSchema = z.strictObject({
	toneInfo: z.strictObject({
		tonePrompt: z.string().min(1, "tonePrompt is required"),
		toneStrength: z
			.number()
			.min(0, "toneStrength must be at least 0")
			.max(100, "toneStrength must not exceed 100"),
		emojiAllowed: booleanLike,
	}),
	isTranslated: booleanLike,
	originalText: z.string().min(1, "originalText is required"),
});

const validateTransformationRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		transformationSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new ValidationError(error);
		}
	}
};

export { validateTransformationRequest };
