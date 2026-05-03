import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("school");

    const foundUser = await db.collection("users").findOne({
      username,
    });

   if (!foundUser) {
  console.log("❌ USER NOT FOUND FOR:", username);

  return NextResponse.json(
    {
      error: "User not found",
      debug: { username }
    },
    { status: 401 }
  );
}
    


    const isValidPassword = await bcrypt.compare(
      password,
      foundUser.password
    );

    // if (!isValidPassword) {
    //   return NextResponse.json(
    //     { error: "Invalid password" },
    //     { status: 401 }
    //   );
    // }

    if (!isValidPassword) {
  console.log("❌ PASSWORD FAILED FOR USER:", foundUser.username);

  return NextResponse.json(
    {
      error: "Invalid password",
      debug: { username: foundUser.username }
    },
    { status: 401 }
  );
}

    // 🔐 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: foundUser._id.toString(),
        role: foundUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 RESPONSE
    const response = NextResponse.json({
      username: foundUser.username,
      role: foundUser.role,
    });

    // 🍪 COOKIE
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}