import { MongoClient } from "mongodb";
import init from "./init.js";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/organizasso";

// MongoDB Connection
async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db("organizasso");

    await init(db); // Create collections
    console.log(`Connected to MongoDB`);

    return db; // Return the database instance
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

export default connectToMongoDB;
