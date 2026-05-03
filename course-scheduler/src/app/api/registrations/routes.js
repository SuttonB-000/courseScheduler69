import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // 🍪 Get token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);

    // 📦 Get selected courses
    const body = await req.json();
    const { courseIds } = body;

    if (!courseIds || courseIds.length === 0) {
      return NextResponse.json({ error: "No courses selected" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school");

    // 🧠 Build registration records
    const registrations = courseIds.map((courseId) => ({
      userId,
      courseId: new ObjectId(courseId),
      createdAt: new Date(),
    }));

    // 💾 Insert many
    await db.collection("registrations").insertMany(registrations);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}