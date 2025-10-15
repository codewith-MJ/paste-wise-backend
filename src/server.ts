import "dotenv/config";
import http from "http";
import app, { logger } from "./app.js";
import { connectRedis, disconnectRedis } from "./infra/store/client.js";

const HOST = "127.0.0.1";
const PORT: number = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

const start = async () => {
	try {
		await connectRedis();
		logger.info("✅ Redis connected");

		server.listen(PORT, HOST, () => {
			logger.info(`🚀 Server listening at http://${HOST}:${PORT}`);
		});

		const shutdown = async () => {
			logger.info("\n⏳ Shutting down...");
			server.close(async () => {
				await disconnectRedis();
				logger.info("👋 Server stopped");
				process.exit(0);
			});
			setTimeout(() => process.exit(1), 5000).unref();
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	} catch (error) {
		logger.error(`❌ Failed to start server: ${error}`);
		process.exit(1);
	}
};

void start();
