import { env } from "./config/env.js";
import express from "express";


const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true , limit: "50mb" }));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy", timestamp: new Date().toISOString() , uptime: process.uptime() });
});

export default app;


