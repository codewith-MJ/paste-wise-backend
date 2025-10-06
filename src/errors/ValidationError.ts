import { AppError } from "./AppError.js";
import type { ZodError } from "zod";

export class ValidationError extends AppError {
	constructor(error: ZodError) {
		const details = error.issues
			.map((issue) => {
				const path = issue.path.join(".");
				return {
					...(path ? { path } : {}),
					message: issue.message,
					code: issue.code,
					...((issue as any).keys ? { keys: (issue as any).keys } : {}),
				};
			})
			.filter((detail) => Object.keys(detail).length > 0);

		super("Invalid request payload", 400, details);
	}
}
