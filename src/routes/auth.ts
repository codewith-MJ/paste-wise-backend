import { googleNativeCallback } from "@/controllers/auth.js";
import { validateGoogleNativeCallbackRequest } from "@/validators/auth.js";
import { Router } from "express";

const router = Router();

router.post(
	"/google/native-callback",
	validateGoogleNativeCallbackRequest,
	googleNativeCallback
);

export default router;
