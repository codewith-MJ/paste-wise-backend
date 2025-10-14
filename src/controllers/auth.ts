import type { Request, Response } from "express";
import { createGoogleConsentUrl } from "@/services/auth.js";

const startGoogleAuth = (req: Request, res: Response) => {
	const url = createGoogleConsentUrl();
	return res.redirect(302, url);
};

export { startGoogleAuth };
