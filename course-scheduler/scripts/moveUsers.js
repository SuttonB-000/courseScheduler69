import "dotenv/config";
import clientPromise from "../src/lib/mongodb.js";

async function run() {
  const client = await clientPromise;

  const oldDb = client.db("users");
  const newDb = client.db("school");

  const users = await oldDb.collection("users").find({}).toArray();

  if (users.length > 0) {
    await newDb.collection("users").insertMany(users);
    console.log(`Moved ${users.length} users`);
  } else {
    console.log("No users found");
  }

  process.exit();
}

run();