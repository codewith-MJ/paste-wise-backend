import type { Request, Response, NextFunction } from "express";

const APP_SECRET = process.env.APP_SECRET ?? "";

const verifyAppSecret = (req: Request, res: Response, next: NextFunction) => {
	if (!APP_SECRET) {
		return res.status(500).json({ message: "APP_SECRET missing" });
	}
	if (req.get("X-App-Secret") !== APP_SECRET) {
		return res.status(403).json({ message: "Forbidden: invalid app secret" });
	}
	next();
};

export default verifyAppSecret;
