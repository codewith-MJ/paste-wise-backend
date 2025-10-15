import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "@/errors/index.js";
import { ERROR_MESSAGES } from "@/constants/error.js";

const { VALIDATION } = ERROR_MESSAGES;

const GoogleNativeCallbackBody = z.strictObject({
	code: z.string().min(1, VALIDATION.GOOGLE_CODE_REQUIRED),
	codeVerifier: z.string().min(43, VALIDATION.GOOGLE_CODE_VERIFIER_REQUIRED),
	redirectUri: z.url(VALIDATION.GOOGLE_REDIRECT_URI_REQUIRED),
	state: z.string().optional(),
});

type GoogleNativeCallbackBody = z.infer<typeof GoogleNativeCallbackBody>;

const validateGoogleNativeCallbackRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const parsed = GoogleNativeCallbackBody.parse(req.body);
		req.body = parsed;
		next();
	} catch (err) {
		if (err instanceof z.ZodError) {
			return next(new ValidationError(err));
		}
		return next(err);
	}
};

export { validateGoogleNativeCallbackRequest };
