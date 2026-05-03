import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI missing in .env.local");
}

const client = new MongoClient(uri);

export const connectDB = async () => {
  await client.connect();
  return client.db(process.env.MONGODB_DB || "school");
};