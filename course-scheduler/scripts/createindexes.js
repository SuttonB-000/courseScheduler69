import clientPromise from "../src/lib/mongodb.js";

async function run() {
  const client = await clientPromise;
  const db = client.db("school");

  await db.collection("registrations").createIndex(
    { userId: 1, courseId: 1 },
    { unique: true }
  );

  console.log("✅ Unique index created on registrations");

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});