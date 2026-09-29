import dotenv from "dotenv";

dotenv.config();

console.log("Environment Variables Loaded");

export const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/rivalfree",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    SESSION_SECRET: process.env.SESSION_SECRET || "your_default_session_secret",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "your_default_gemini_api_key",
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY || "your_default_serpapi_api_key",
};