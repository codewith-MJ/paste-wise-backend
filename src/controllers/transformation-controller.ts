import type { Request, Response } from "express";
import { executeTransform } from "../services/transformation.js";

const handleTransform = async (req: Request, res: Response) => {
	const toneInfo = req.body.toneInfo;
	const isTranslated = req.body.isTranslated;
	const originalText = req.body.originalText;

	const emojiAllowed = Boolean(toneInfo.emojiAllowed);
	const translatedFlag = Boolean(isTranslated);

	const result = await executeTransform({
		toneInfo: {
			...toneInfo,
			emojiAllowed,
		},
		isTranslated: translatedFlag,
		originalText,
	});

	res.status(200).json({ transformedText: result });
};

export { handleTransform };
