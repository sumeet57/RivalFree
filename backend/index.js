import { env } from "./config/env.js";
import app from "./app.js";
import connectDatabase from "./config/db.js";

await connectDatabase();

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});