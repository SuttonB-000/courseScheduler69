import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

/* -----------------------------
   POST - enroll in courses
------------------------------*/
export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);

    const body = await req.json();
    const { courseIds } = body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json(
        { error: "No courses selected" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("school");

    const coursesCol = db.collection("courses");
    const regCol = db.collection("registrations");

    const objectCourseIds = courseIds.map(id => new ObjectId(id));

    // validate courses exist
    const existingCourses = await coursesCol
      .find({ _id: { $in: objectCourseIds } })
      .toArray();

    if (existingCourses.length !== courseIds.length) {
      return NextResponse.json(
        { error: "One or more courses do not exist" },
        { status: 404 }
      );
    }

    // check duplicates
    const existingRegs = await regCol.find({
      userId,
      courseId: { $in: objectCourseIds }
    }).toArray();

    const already = new Set(
      existingRegs.map(r => r.courseId.toString())
    );

    const newRegs = objectCourseIds
      .filter(id => !already.has(id.toString()))
      .map(courseId => ({
        userId,
        courseId,
        createdAt: new Date()
      }));

    if (newRegs.length === 0) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 409 }
      );
    }

    await regCol.insertMany(newRegs);

    return NextResponse.json({
      success: true,
      inserted: newRegs.length
    });

  } catch (err) {
    console.error("POST ERROR:", err);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}

/* -----------------------------
   GET - fetch enrolled courses
------------------------------*/
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);

    const client = await clientPromise;
    const db = client.db("school");

    const data = await db.collection("registrations").aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          course: {
            _id: 1,
            title: 1,
            description: 1
          }
        }
      }
    ]).toArray();

    return NextResponse.json({ courses: data });

  } catch (err) {
    console.error("GET ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}