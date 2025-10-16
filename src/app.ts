import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import pino from "pino";
import { pinoHttp } from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import passport from "@/infra/auth/passport.js";
import transformationRoutes from "./routes/transformations.js";
import authRoutes from "@/routes/auth.js";
import toneRoutes from "@/routes/tone.js";
import { NotFoundError } from "@/errors/index.js";
import verifyAppSecret from "./middlewares/verify-app-secret.js";
import { ERROR_MESSAGES } from "./constants/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INTERNAL_SERVER_ERROR = ERROR_MESSAGES.VALIDATION;

const app = express();

const logger = pino(
	process.env.NODE_ENV === "production"
		? {}
		: {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:HH:MM:ss.l",
						ignore: "pid,hostname",
					},
				},
		  }
);

app.use(
	pinoHttp({
		logger,
		redact: {
			paths: ["req.headers.authorization", "req.headers.x-app-secret"],
			remove: true,
		},
	})
);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			callback(new Error("CORS not allowed for this origin"));
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "X-App-Secret"],
	})
);

app.use(verifyAppSecret);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

app.use("/transformations", transformationRoutes);
app.use("/auth", authRoutes);
app.use("/tones", toneRoutes);

app.use((req: Request, _res: Response, next: NextFunction) => {
	req.log.warn({ url: req.url }, "Not Found");
	next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
	req.log.error({ err }, "Unhandled error");

	const status = typeof err.status === "number" ? err.status : 500;
	const message = err?.message ?? INTERNAL_SERVER_ERROR;

	const body: Record<string, unknown> = { message, status };

	if (err?.details) body.details = err.details;
	if (err?.code) body.code = err.code;

	return res.status(status).json({ error: body });
});

export { logger };
export default app;
