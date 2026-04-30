

// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const client = await clientPromise;
//     const db = client.db("users");

//     const user = await db.collection("users").findOne({
//       username: body.username,
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       username: user.username,
//       role: user.role,
//     });

//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("school"); //changed users to school

    const user = await db.collection("users").findOne({
      username: body.username,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // 🔐 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 SET COOKIE
    const response = NextResponse.json({
      username: user.username,
      role: user.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}