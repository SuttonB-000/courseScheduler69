import "dotenv/config";
import bcrypt from "bcrypt";
import { connectDB } from "./mongo.js";

console.log("MONGO URI:", process.env.MONGODB_URI);

const run = async () => {
  const db = await connectDB();

  const users = await db.collection("users").find().toArray();

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { password: hashed } }
    );

    console.log("Updated:", user.username);
  }

  process.exit();
};

run();