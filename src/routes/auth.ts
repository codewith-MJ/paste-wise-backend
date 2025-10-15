import {
	googleNativeCallback,
	logout,
	refreshAccessToken,
} from "@/controllers/auth.js";
import { validateGoogleNativeCallbackRequest } from "@/validators/auth.js";
import { Router } from "express";

const router = Router();

router.post(
	"/google/native-callback",
	validateGoogleNativeCallbackRequest,
	googleNativeCallback
);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

export default router;
