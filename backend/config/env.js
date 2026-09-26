import dotenv from "dotenv";

dotenv.config();

console.log("Environment Variables Loaded");

export const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/rivalfree",
};