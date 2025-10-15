import AppError from "./AppError.js";

export default class BadRequestError extends AppError {
	constructor(message = "Bad Request", details?: unknown) {
		super(message, 400, details);
	}
}
