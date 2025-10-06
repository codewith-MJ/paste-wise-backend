import callOpenAITransformAPI from "../infra/ai/open-ai.js";
import type {
	TransformationProps,
	TransformationResult,
} from "../types/transformation.js";

const executeTransform = async ({
	toneInfo,
	isTranslated,
	originalText,
}: TransformationProps): Promise<TransformationResult> => {
	const isKoreanInput = /[ㄱ-ㅎ가-힣]/.test(originalText);

	const targetLanguage: "English" | "Korean" | "SAME" = isTranslated
		? isKoreanInput
			? "English"
			: "Korean"
		: "SAME";

	const { transformedText } = await callOpenAITransformAPI({
		toneInfo,
		isTranslated,
		originalText,
		targetLanguage,
	});

	return isTranslated
		? {
				transformedText,
				languageIn: isKoreanInput ? "Korean" : "English",
				languageOut: targetLanguage,
		  }
		: {
				transformedText,
		  };
};

export { executeTransform };
