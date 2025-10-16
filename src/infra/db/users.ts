import { User } from "@/types/user.js";
import { prisma } from "./prisma.js";

const upsertUser = async (user: User) => {
	return prisma.user.upsert({
		where: { id: user.id },
		update: { email: user.email, name: user.name },
		create: { id: user.id, email: user.email, name: user.name },
	});
};

export { upsertUser };
