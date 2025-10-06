import type { ToneInfo } from "./tone.js";

type TransformationProps = {
	toneInfo: ToneInfo;
	isTranslated: boolean;
	originalText: string;
};

type TransformationResult = {
	transformedText: string;
	languageIn?: string;
	languageOut?: string;
};

export type { TransformationProps, TransformationResult };
