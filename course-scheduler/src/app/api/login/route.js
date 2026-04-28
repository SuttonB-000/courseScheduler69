// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     console.log("📥 Incoming request:", body);

//     const client = await clientPromise;
//     const db = client.db("users"); // or db("yourDBName")

//     const users = await db.collection("users").find({}).toArray();

//     console.log("📦 ALL USERS IN DB:", users);

//     const user = await db.collection("users").findOne({
//       username: body.username,
//     });

//     console.log("🔎 MATCHED USER:", user);

//     return NextResponse.json({
//       received: body,
//       userFound: !!user,
//       user: user || null,
//     });

//   } catch (err) {
//     console.error("❌ ERROR:", err);

//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("users");

    const user = await db.collection("users").findOne({
      username: body.username,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      username: user.username,
      role: user.role,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}