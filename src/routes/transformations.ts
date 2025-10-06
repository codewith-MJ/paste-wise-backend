import express from "express";
import { handleTransform } from "../controllers/transformation-controller.js";

const router = express.Router();

router.post("/", handleTransform);

export default router;
