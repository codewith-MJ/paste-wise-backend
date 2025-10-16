import {
	googleNativeCallback,
	logout,
	refreshAccessToken,
} from "@/controllers/auth.js";
import {
	validateGoogleNativeCallbackRequest,
	validateRefreshOrLogoutRequest,
} from "@/validators/auth.js";
import { Router } from "express";

const router = Router();

router.post(
	"/google/native-callback",
	validateGoogleNativeCallbackRequest,
	googleNativeCallback
);
router.post("/refresh", validateRefreshOrLogoutRequest, refreshAccessToken);
router.post("/logout", validateRefreshOrLogoutRequest, logout);

export default router;
