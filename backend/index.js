import { env } from "./config/env.js";
import http from "http";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import initializeSocket from "./websocket/index.js";

await connectDatabase();

const server = http.createServer(app);
initializeSocket(server);

server.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});