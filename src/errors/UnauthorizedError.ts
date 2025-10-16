import AppError from "./AppError.js";

export default class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized", details?: unknown) {
		super(message, 401, details);
	}
}
