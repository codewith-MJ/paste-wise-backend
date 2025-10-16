import { prisma } from "./prisma.js";

const listActiveTones = () => {
	return prisma.tone.findMany({
		where: { isActive: true },
		orderBy: { toneName: "asc" },
	});
};

const listUserOverrides = (userId: string) => {
	return prisma.userToneOverride.findMany({
		where: { userId },
	});
};

export { listActiveTones, listUserOverrides };
