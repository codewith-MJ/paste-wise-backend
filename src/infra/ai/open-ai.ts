import OpenAI from "openai";
import type { ToneInfo } from "@/types/tone.js";
import { OpenAIError } from "@/errors/index.js";
import buildTransformInstructions from "./create-instructions.js";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const callOpenAITransformAPI = async ({
	originalText,
	toneInfo,
	isTranslated,
	targetLanguage,
}: {
	originalText: string;
	toneInfo: ToneInfo;
	isTranslated: boolean;
	targetLanguage: string;
}) => {
	const instructions = buildTransformInstructions(toneInfo, targetLanguage);

	try {
		const response = await client.responses.create({
			model: "gpt-4o-mini",
			instructions,
			input: originalText,
		});

		const transformedText = response.output_text.trim() ?? "";

		return { transformedText };
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			throw new OpenAIError(
				`OpenAI API error: ${error.status} - ${error.message}`
			);
		}

		const message =
			(error as any)?.message?.includes("Missing credentials") ||
			(error as any)?.message?.includes("apiKey")
				? "Missing or invalid OpenAI API key"
				: "Unexpected error while communicating with OpenAI API";

		throw new OpenAIError(message);
	}
};

export default callOpenAITransformAPI;
