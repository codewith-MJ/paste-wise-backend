import AppError from "./AppError.js";

export default class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(message, 404);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
