import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // 🍪 1. Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 🔐 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 3. Connect to DB
    const client = await clientPromise;
    const db = client.db("users");

    // 👤 4. Find user by ID
    const user = await db.collection("users").findOne({
      _id: new (await import("mongodb")).ObjectId(decoded.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 🚫 5. NEVER return password or sensitive fields
    return NextResponse.json({
      id: user._id,
      name: user.username,
      role: user.role,
    });

  } catch (err) {
    console.error("❌ /api/me error:", err);

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}