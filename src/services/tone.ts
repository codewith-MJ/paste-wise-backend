import { listActiveTones, listUserOverrides } from "@/infra/db/tone.js";

type MergedTone = {
	presetKey: number | null;
	toneName: string;
	tonePrompt: string;
	toneStrength: number;
	emojiAllowed: boolean;
	source: "global" | "user";
	deleted: boolean;
	updatedAt: Date;
};

const listMergedTones = async (userId: string): Promise<MergedTone[]> => {
	const [globals, overrides] = await Promise.all([
		listActiveTones(),
		listUserOverrides(userId),
	]);

	const map = new Map<number, MergedTone>();

	for (const g of globals) {
		map.set(g.toneId, {
			presetKey: g.toneId,
			toneName: g.toneName,
			tonePrompt: g.tonePrompt,
			toneStrength: g.toneStrength,
			emojiAllowed: g.emojiAllowed,
			source: "global",
			deleted: false,
			updatedAt: g.updatedAt,
		});
	}

	for (const u of overrides) {
		if (u.deleted) {
			if (u.presetKey && map.has(u.presetKey)) map.delete(u.presetKey);
			continue;
		}

		if (u.presetKey && map.has(u.presetKey)) {
			const base = map.get(u.presetKey)!;
			map.set(u.presetKey, {
				...base,
				toneName: u.toneName ?? base.toneName,
				tonePrompt: u.tonePrompt ?? base.tonePrompt,
				toneStrength: u.toneStrength ?? base.toneStrength,
				emojiAllowed: u.emojiAllowed ?? base.emojiAllowed,
				source: "user",
				updatedAt: u.updatedAt > base.updatedAt ? u.updatedAt : base.updatedAt,
				deleted: false,
			});
		} else {
			map.set(-u.overrideId, {
				presetKey: null,
				toneName: u.toneName ?? "(이름 없음)",
				tonePrompt: u.tonePrompt ?? "",
				toneStrength: u.toneStrength ?? 50,
				emojiAllowed: u.emojiAllowed ?? true,
				source: "user",
				deleted: false,
				updatedAt: u.updatedAt,
			});
		}
	}

	return [...map.values()].sort((a, b) => a.toneName.localeCompare(b.toneName));
};

export { listMergedTones };
