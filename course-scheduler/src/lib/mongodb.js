import { MongoClient } from "mongodb";

/**
 * Read the connection string from your environment variables.
 * This is stored in .env.local at the project root.
 */
const uri = process.env.MONGODB_URI;

/**
 * Optional settings object for MongoDB client.
 * You can leave this empty for now.
 */
const options = {};

/**
 * These variables help us reuse the same MongoDB connection
 * instead of opening a new one every time Next.js runs a request.
 */
let client;
let clientPromise;

/**
 * Safety check:
 * If you forgot to define MONGODB_URI, stop immediately.
 */
if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

/**
 * In development mode, Next.js hot-reloads files constantly.
 * Without caching the connection, you'd create tons of DB connections.
 *
 * So we store BOTH the client AND the promise globally to reuse them.
 */
if (process.env.NODE_ENV === "development") {
  // If no cached connection exists, create one
  if (!global._mongoClient) {
    client = new MongoClient(uri, options);
    global._mongoClient = client;  // ← Store the CLIENT, not just the promise
    global._mongoClientPromise = client.connect();
  }

  // Reuse cached connection
  client = global._mongoClient;
  clientPromise = global._mongoClientPromise;
} else {
  /**
   * In production, we just create a clean new connection once.
   */
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Export the promise so other parts of your app can:
 * await clientPromise
 * and get a ready-to-use database connection.
 */
export default clientPromise;