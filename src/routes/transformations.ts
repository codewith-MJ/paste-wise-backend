import express from "express";
import { handleTransform } from "@/controllers/transformation-controller.js";
import { validateTransformationRequest } from "@/validators/transformation.js";

const router = express.Router();

router.post("/", validateTransformationRequest, handleTransform);

export default router;
