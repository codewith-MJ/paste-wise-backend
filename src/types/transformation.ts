import type { ToneInfo } from "./tone.js";

type LanguageCode = "Kor" | "Eng";

type TransformationResult =
	| { transformedText: string }
	| {
			transformedText: string;
			languageIn: LanguageCode;
			languageOut: LanguageCode;
	  };

type TransformationProps = {
	toneInfo: ToneInfo;
	isTranslated: boolean;
	originalText: string;
};

export type { TransformationProps, TransformationResult, LanguageCode };
