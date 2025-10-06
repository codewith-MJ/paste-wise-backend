import callOpenAITransformAPI from "@/infra/ai/open-ai.js";
import type {
	LanguageCode,
	TransformationProps,
	TransformationResult,
} from "@/types/transformation.js";

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

	if (!isTranslated || targetLanguage === "SAME") {
		return { transformedText };
	}

	const languageIn: LanguageCode = isKoreanInput ? "Kor" : "Eng";
	const languageOut: LanguageCode =
		targetLanguage === "English" ? "Eng" : "Kor";

	return { transformedText, languageIn, languageOut };
};

export { executeTransform };
