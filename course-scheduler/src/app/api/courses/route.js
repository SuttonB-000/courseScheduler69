import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("school");

    const courses = await db.collection("courses").find({}).toArray();

    return Response.json(courses);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("school");

    const body = await req.json();

    const result = await db.collection("courses").insertOne(body);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}