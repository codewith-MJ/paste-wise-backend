import "dotenv/config";
import http from "http";
import app from "./app.js";

const HOST = "127.0.0.1";
const PORT: number = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
	console.log(`🚀 Server listening at http://${HOST}:${PORT}`);
});
