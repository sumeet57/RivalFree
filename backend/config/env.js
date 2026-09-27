import dotenv from "dotenv";

dotenv.config();

console.log("Environment Variables Loaded");

export const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/rivalfree",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    SESSION_SECRET: process.env.SESSION_SECRET || "your_default_session_secret",
};