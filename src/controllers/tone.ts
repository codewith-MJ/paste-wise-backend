import type { Request, Response, NextFunction } from "express";
import { listMergedTones } from "@/services/tone.js";
import { UnauthorizedError } from "@/errors/index.js";

const getTones = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as { sub: string } | undefined;
	if (!user?.sub) {
		throw new UnauthorizedError("Missing or invalid user token");
	}

	const merged = await listMergedTones(user.sub);

	const payload = merged.map((tone) => ({
		toneId:
			tone.presetKey !== null
				? String(tone.presetKey)
				: `user:${tone.toneName}`,
		toneName: tone.toneName,
		isDefault: false,
		tonePrompt: tone.tonePrompt,
		toneStrength: tone.toneStrength,
		emojiAllowed: tone.emojiAllowed,
		source: tone.source,
		deleted: tone.deleted,
	}));

	res.json(payload);
};

export { getTones };
