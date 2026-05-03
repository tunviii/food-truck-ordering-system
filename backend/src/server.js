import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 4000;

async function start() {
  if (process.env.MONGO_URI) {
    await connectDB(process.env.MONGO_URI);
  } else {
    console.log("Running in demo mode with in-memory data. Set MONGO_URI to use MongoDB.");
  }

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});