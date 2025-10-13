import type { ToneInfo } from "./tone.js";

type TransformationResult =
	| { transformedText: string }
	| {
			transformedText: string;
			languageIn: string;
			languageOut: string;
	  };

type TransformationProps = {
	toneInfo: ToneInfo;
	isTranslated: boolean;
	originalText: string;
};

export type { TransformationProps, TransformationResult };
