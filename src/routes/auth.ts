import { startGoogleAuth } from "@/controllers/auth.js";
import { Router } from "express";

const router = Router();

router.get("/google", startGoogleAuth);

export default router;
