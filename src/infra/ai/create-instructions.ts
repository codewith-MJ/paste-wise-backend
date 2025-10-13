import type { ToneInfo } from "@/types/tone.js";

const buildTransformInstructions = (
	toneInfo: ToneInfo,
	targetLanguage: string
) => {
	const { tonePrompt, toneStrength, emojiAllowed } = toneInfo;

	const baseInstructions = [
		"You are a bilingual text transformation assistant.",
		"Your job is to rewrite the input according to the user's tone instructions and translation preference.",
		`Tone details: ${tonePrompt} (strength: ${toneStrength}%).`,
		emojiAllowed
			? "Emojis are allowed and can be used appropriately."
			: "Do NOT include any emojis.",
	];

	const languageInstructions =
		targetLanguage === "SAME"
			? [
					"Do NOT translate under any circumstances.",
					"Preserve the original language of the input exactly.",
					"If the input contains multiple languages, keep each part in its original language.",
					"Only adjust tone and phrasing; do not change the language.",
					"Output MUST remain in the same language(s) as the input.",
			  ]
			: [
					`Translate the input into ${targetLanguage} and rewrite it naturally to match the tone.`,
					`Output MUST be in ${targetLanguage}.`,
			  ];

	return [
		...baseInstructions,
		...languageInstructions,
		"Respond with ONLY the transformed text. Do not include explanations, quotes, or markdown.",
	].join(" ");
};

export default buildTransformInstructions;
