import callOpenAITransformAPI from "@/infra/ai/open-ai.js";
import type {
	TransformationProps,
	TransformationResult,
} from "@/types/transformation.js";
import {
	KOREAN_REGEX,
	LANGUAGE,
	LANGUAGE_CODE,
} from "@/constants/transformation.js";

type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

const executeTransform = async ({
	toneInfo,
	isTranslated,
	originalText,
}: TransformationProps): Promise<TransformationResult> => {
	const isKoreanInput = KOREAN_REGEX.test(originalText);
	const targetLanguage: Language = isTranslated
		? isKoreanInput
			? LANGUAGE.ENGLISH
			: LANGUAGE.KOREAN
		: LANGUAGE.SAME;

	const { transformedText } = await callOpenAITransformAPI({
		toneInfo,
		isTranslated,
		originalText,
		targetLanguage,
	});

	if (!isTranslated || targetLanguage === LANGUAGE.SAME) {
		return { transformedText };
	}

	const languageIn = isKoreanInput ? LANGUAGE_CODE.KOR : LANGUAGE_CODE.ENG;
	const languageOut =
		targetLanguage === LANGUAGE.ENGLISH ? LANGUAGE_CODE.ENG : LANGUAGE_CODE.KOR;

	return { transformedText, languageIn, languageOut };
};

export { executeTransform };
