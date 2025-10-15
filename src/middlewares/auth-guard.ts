import passport from "passport";
import { UnauthorizedError } from "@/errors/index.js";
import type { Request, Response, NextFunction } from "express";

interface JwtUser {
	sub: string;
	email: string;
	name?: string;
	issuedAt?: number;
	expiresAt?: number;
}

const authGuard = (req: Request, res: Response, next: NextFunction) =>
	passport.authenticate(
		"jwt",
		{ session: false },
		(err: unknown, user: JwtUser | false | null) => {
			if (err) return next(err);
			if (!user) return next(new UnauthorizedError("Invalid or missing token"));
			req.user = user as JwtUser;
			next();
		}
	)(req, res, next);

export default authGuard;
