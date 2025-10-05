import express from "express";
import type { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", function (req: Request, res: Response, next: NextFunction) {
	res.json({ ok: true, message: "Hello API" });
});

export default router;
