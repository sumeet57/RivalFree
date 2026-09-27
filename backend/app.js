import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { configureSession } from "./config/session.js";
import limiter from "./middlewares/limiter.middleware.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true , limit: "50mb" }));
app.use(cookieParser());
app.use(configureSession());
app.use(limiter);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy", timestamp: new Date().toISOString() , uptime: process.uptime() });
});

// routes
app.use("/api/auth", authRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found, please check the URL." });
});

export default app;


