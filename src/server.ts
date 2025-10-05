import http from "http";
import app from "./app.js";

const HOST = "localhost";
const PORT: number = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
	console.log(`🚀 Server listening at http://${HOST}:${PORT}`);
});
