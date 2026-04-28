"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

//   const data = await res.json();
// console.log("COURSES FROM API:", data);
// setCourses(data);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="
        text-center text-4xl font-extrabold tracking-widest mt-6
      ">
        <span className="text-[var(--accent)] drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]">
          Course
        </span>
        {" "}
        <span className="text-[var(--accent-2)] drop-shadow-[0_0_10px_rgba(255,43,214,0.4)]">
          Scheduler
        </span>
      </h1>
      <h2 className="
        text-left text-2xl font-extrabold tracking-widest mt-6
      ">
        Available Courses
      </h2>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
       <div className="overflow-x-auto mt-6">
  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
<thead>
  <tr className="bg-black/20">
    <th className="
      px-4 py-3 text-left text-xs uppercase tracking-wider
      text-[var(--accent)]
      font-semibold
      drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]
      border-b border-[var(--accent)]
    ">
      Code
    </th>

    <th className="
      px-4 py-3 text-left text-xs uppercase tracking-wider
      text-[var(--accent)]
      font-semibold
      drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]
      border-b border-[var(--accent)]
    ">
      Title
    </th>

    <th className="
      px-4 py-3 text-left text-xs uppercase tracking-wider
      text-[var(--accent)]
      font-semibold
      drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]
      border-b border-[var(--accent)]
    ">
      Instructor
    </th>

    <th className="
      px-4 py-3 text-left text-xs uppercase tracking-wider
      text-[var(--accent)]
      font-semibold
      drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]
      border-b border-[var(--accent)]
    ">
      Subject
    </th>

    <th className="
      px-4 py-3 text-left text-xs uppercase tracking-wider
      text-[var(--accent)]
      font-semibold
      drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]
      border-b border-[var(--accent)]
    ">
      Description
    </th>

    <th className="
      px-4 py-3 text-left text-xs uppercase tracking-wider
      text-[var(--accent)]
      font-semibold
      drop-shadow-[0_0_6px_rgba(0,245,255,0.4)]
      border-b border-[var(--accent)]
    ">
      Credits
    </th>
  </tr>
</thead>

    <tbody className="divide-y divide-gray-200">
      {courses.map((course) => (
        <tr
          key={course._id}
          className="
            border-b border=[var(--border)]
            hover:bg-white/5
            hover:scale-[1.01]
            hover: shadow[0_0_12px_rgba(0,245,255,0,0.18)]
            hover: border-[var(--accent)]
            transiotion-all duration-200
          ">
        
        <td className="px-4 py-3 whitespace-nowrap text-[var(--foreground)]">
          {course.code}
          </td>

        <td className="px-4 py-3 font-medium text-[var(--foreground)]">
          {course.courseTitle}
        </td>

        <td className="px-4 py-3 text-gray-300">
          {course.instructorId}
        </td>

        <td className="px-4 py-3 text-gray-300">
          {course.subjectArea}
        </td>

        <td className="px-4 py-3 text-gray-400 max-w-md">
          <p className="line-clamp-2">
            {course.courseDescription}
          </p>
        </td>

      <td className="px-4 py-3 font-semibold text-[var(--accent)]">
        {course.credits}
      </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      )}
    </div>
  );
}