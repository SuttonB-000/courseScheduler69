import clientPromise from "../src/lib/mongodb.js";

const seed = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("users"); 
    // ⚠️ If you change DB name later, update it here

    console.log("🌱 Seeding database...");

    // -------------------------
    // RESET COLLECTIONS
    // -------------------------
    await db.collection("users").deleteMany({});
    await db.collection("courses").deleteMany({});

    // -------------------------
    // USERS COLLECTION
    // -------------------------
    await db.collection("users").insertMany([
      {
        username: "smith",
        password: "smithIsCool",
        role: "teacher",
      },
      {
        username: "clemens",
        password: "Clementine",
        role: "teacher",
      },
      {
        username: "Jonesy",
        password: "Ih8Citrus",
        role: "teacher",
      },
      {
        username: "FredDhurst",
        password: "breakstuff",
        role: "student",
      },
      {
        username: "JasonVorhees",
        password: "killingit",
        role: "student",
      },
      {
        username: "AntonLavey",
        password: "circusLife",
        role: "student",
      },
    ]);

    // -------------------------
    // COURSES COLLECTION
    // -------------------------
    await db.collection("courses").insertMany([
      {
        code: "CS11",
        instructorId: "smith",
        courseTitle: "Intro to Programming",
        subjectArea: ["Computers", "Technology", "Programming"],
        description:
          "An introductory overview to the Python programming language",
        credits: 3,
      },
      {
        code: "CS21",
        instructorId: "Jonesy",
        courseTitle: "Intro to Computer Logic",
        subjectArea: ["Computers", "Technology", "Programming"],
        description:
          "An investigation into the logical operations involved with programming",
        credits: 3,
      },
      {
        code: "M101",
        instructorId: "clemens",
        courseTitle: "Introductory Algebra",
        subjectArea: ["Math"],
        description: "An introduction to college level algebra",
        credits: 1,
      },
    ]);

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();