import type { ToneInfo } from "@/types/tone.js";

const buildTransformInstructions = (
	toneInfo: ToneInfo,
	targetLanguage: string
) => {
	const { tonePrompt, toneStrength, emojiAllowed } = toneInfo;

	return [
		"You are a bilingual text transformation assistant.",
		"Your job is to rewrite the given text according to the user's tone instructions and translation preference.",
		`Tone details: ${tonePrompt} (strength: ${toneStrength}%).`,
		emojiAllowed
			? "Emojis are allowed and can be used appropriately."
			: "Do NOT include any emojis.",
		targetLanguage === "SAME"
			? "Do NOT translate. Keep the original language; only rewrite to match the tone."
			: `Translate the input into ${targetLanguage} and rewrite it naturally to match the tone.`,
		targetLanguage === "SAME"
			? "Output MUST be in the same language as the input."
			: `Output MUST be in ${targetLanguage}.`,
		"Respond with ONLY the transformed text. Do not include explanations, quotes, or markdown.",
	].join(" ");
};

export default buildTransformInstructions;
