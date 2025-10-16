import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const presets = [
		{
			toneName: "🙇 정중한",
			tonePrompt:
				"차분하고 예의 바른 존댓말로 답변합니다. 따뜻하지만 단정한 어조를 사용합니다.",
			toneStrength: 50,
			emojiAllowed: true,
			isDefault: true,
			isActive: true,
		},
		{
			toneName: "👔 격식있는",
			tonePrompt:
				"공식적이고 격식 있는 문체로 답변합니다. 높임말을 철저히 사용하고 감정 표현은 절제합니다.",
			toneStrength: 70,
			emojiAllowed: false,
			isDefault: false,
			isActive: true,
		},
		{
			toneName: "🤙 캐주얼",
			tonePrompt:
				"자연스럽고 편안한 말투로 답변합니다. 일상 대화처럼 부드럽고 친근하게 표현합니다.",
			toneStrength: 60,
			emojiAllowed: true,
			isDefault: false,
			isActive: true,
		},
		{
			toneName: "💖 다정한",
			tonePrompt:
				"애정을 담아 따뜻하게 이야기하듯 답변합니다. 사랑하는 사람에게 말하듯 부드럽고 다정한 어조를 사용합니다.",
			toneStrength: 80,
			emojiAllowed: true,
			isDefault: false,
			isActive: true,
		},
	];

	for (const p of presets) {
		await prisma.tone.upsert({
			where: { toneName: p.toneName },
			update: p,
			create: p,
		});
	}

	console.log("[seed] 기본 tone 프리셋이 주입되었습니다 ✅");
}

main()
	.catch((e) => {
		console.error("[seed] 실패:", e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
