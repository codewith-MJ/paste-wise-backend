import { googleNativeCallback } from "@/controllers/auth.js";
import { Router } from "express";

const router = Router();

router.post("/google/native-callback", googleNativeCallback);

export default router;
