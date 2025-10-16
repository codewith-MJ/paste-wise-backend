import { Router } from "express";
import authGuard from "@/middlewares/auth-guard.js";
import { getTones } from "@/controllers/tone.js";

const router = Router();

router.get("/", authGuard, getTones);

export default router;
