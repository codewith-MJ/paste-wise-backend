import { AppError } from "./AppError.js";

export class OpenAIError extends AppError {
	constructor(message = "Failed to process AI transformation request") {
		super(message, 502);
	}
}
