import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import pino from "pino";
import { pinoHttp } from "pino-http";
import path from "path";
import { fileURLToPath } from "url";

import indexRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const logger = pino(
	process.env.NODE_ENV === "production"
		? {}
		: {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true, // 보기 좋게
						translateTime: "SYS:HH:MM:ss.l",
						ignore: "pid,hostname",
					},
				},
		  }
);

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use((req: Request, res: Response, _next: NextFunction) => {
	req.log.warn({ url: req.url }, "Not Found");
	return res.status(404).json({
		error: { message: "Not Found", status: 404 },
	});
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
	req.log.error({ err }, "Unhandled error");

	const status = typeof err.status === "number" ? err.status : 500;
	const message = err?.message ?? "Internal Server Error";

	return res.status(status).json({
		error: {
			message,
			status,
		},
	});
});

export default app;
